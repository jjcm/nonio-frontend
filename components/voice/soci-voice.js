export default class SociVoice {
  constructor(sb) {
    this.sb = sb
  }

  // --- Voice (LiveKit) ---
  _voiceRoom = null
  _voiceChannel = null
  _voiceCommunity = null
  _voiceParticipantEls = new Map()
  _voiceRemoteAudioEls = new Map()
  _voicePresenceByChannel = {}
  _voicePresenceSocket = null
  _voicePresenceSocketCommunity = null
  _voicePresenceReconnectTimer = null
  _voicePresenceReconnectAttempt = 0
  _voiceTalkingPollTimer = null
  _voiceTalkingPollMs = 3000
  _localVADSpeaking = false
  _vadInstance = null
  _vadLoadPromise = null

  _voiceAudioContext = null

  _loadVAD() {
    if (this._vadLoadPromise) return this._vadLoadPromise
    this._vadLoadPromise = new Promise((resolve, reject) => {
      if (window.vad?.MicVAD) {
        resolve(window.vad)
        return
      }
      const onnx = document.createElement('script')
      onnx.src = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/ort.wasm.min.js'
      onnx.crossOrigin = 'anonymous'
      onnx.onload = () => {
        const vadScript = document.createElement('script')
        vadScript.src = 'https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.30/dist/bundle.min.js'
        vadScript.crossOrigin = 'anonymous'
        vadScript.onload = () => resolve(window.vad)
        vadScript.onerror = () => reject(new Error('VAD script failed to load'))
        document.head.appendChild(vadScript)
      }
      onnx.onerror = () => reject(new Error('ONNX script failed to load'))
      document.head.appendChild(onnx)
    })
    return this._vadLoadPromise
  }

  async _startVAD() {
    try {
      const vad = await this._loadVAD()
      this._vadInstance = await vad.MicVAD.new({
        onSpeechStart: () => {
          this._localVADSpeaking = true
          this._updateVoiceTalkingIndicators()
        },
        onSpeechEnd: () => {
          this._localVADSpeaking = false
          this._updateVoiceTalkingIndicators()
        },
        onnxWASMBasePath: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/',
        baseAssetPath: 'https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.30/dist/'
      })
      this._vadInstance.start()
    } catch (err) {
      console.warn('[Voice] VAD failed to start, using server speaking state:', err)
    }
  }

  _stopVAD() {
    this._localVADSpeaking = false
    if (this._vadInstance) {
      try {
        this._vadInstance.pause()
        if (typeof this._vadInstance.destroy === 'function') this._vadInstance.destroy()
      } catch (_) {}
      this._vadInstance = null
    }
  }

  _playVoiceTone(frequency, durationMs = 80) {
    try {
      const ctx = this._voiceAudioContext || (this._voiceAudioContext = new (window.AudioContext || window.webkitAudioContext)())
      if (ctx.state === 'suspended') ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = frequency
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationMs / 1000)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + durationMs / 1000)
    } catch (_) {}
  }

  _playVoiceJoined() {
    console.log('[Voice] Joined channel – playing join sound (low → high)')
    this._playVoiceTone(220, 70)
    setTimeout(() => this._playVoiceTone(440, 70), 90)
  }

  _playVoiceLeft() {
    console.log('[Voice] Left channel – playing leave sound (high → low)')
    this._playVoiceTone(440, 70)
    setTimeout(() => this._playVoiceTone(220, 70), 90)
  }

  _startVoiceTalkingPolling(){
    this._stopVoiceTalkingPolling()
    this._voiceTalkingPollTimer = setInterval(() => {
      this._enforceVoiceTalkingIndicators()
    }, this._voiceTalkingPollMs)
  }

  _stopVoiceTalkingPolling(){
    if(this._voiceTalkingPollTimer) clearInterval(this._voiceTalkingPollTimer)
    this._voiceTalkingPollTimer = null
  }

  _enforceVoiceTalkingIndicators(){
    if(!this._voiceRoom || !this._voiceParticipantEls.size) return
    const activeSpeakers = this._voiceRoom.activeSpeakers || []
    const hasActiveSpeaker = activeSpeakers.length > 0 || this._localVADSpeaking
    if(!hasActiveSpeaker) {
      this._voiceParticipantEls.forEach(user => user.toggleAttribute('talking', false))
      return
    }

    this._voiceParticipants().forEach(p => {
      const key = this._voiceParticipantKey(p)
      const user = this._voiceParticipantEls.get(key)
      if(!user) return
      const isInActiveSpeakers = activeSpeakers.some(s => s.sid === p.sid)
      const speaking = p.isLocal
        ? this._localVADSpeaking
        : (p.isSpeaking || isInActiveSpeakers)
      user.toggleAttribute('talking', !!speaking)
    })
  }

  _stopVoicePresenceSocket(reason = 'unspecified'){
    if(this._voicePresenceReconnectTimer) clearTimeout(this._voicePresenceReconnectTimer)
    this._voicePresenceReconnectTimer = null
    this._voicePresenceReconnectAttempt = 0
    this._voicePresenceSocketCommunity = null
    const socket = this._voicePresenceSocket
    this._voicePresenceSocket = null
    if(socket) {
      console.info('[VoicePresenceWS] closing socket', {
        reason,
        community: socket._voicePresenceCommunity || this.sb.currentCommunity,
        readyState: socket.readyState
      })
    }
    if(socket) {
      try {
        socket.close()
      } catch (_) {}
    }
  }

  _startVoicePresenceSocket(trigger = 'unspecified'){
    this._stopVoicePresenceSocket(`restart:${trigger}`)
    if(!this.sb.authToken || !this.sb.currentCommunity) {
      console.info('[VoicePresenceWS] skipped start (missing auth/community)', {
        trigger,
        hasAuthToken: !!this.sb.authToken,
        community: this.sb.currentCommunity || null
      })
      this._voicePresenceByChannel = {}
      this._renderVoicePresenceParticipants()
      return
    }

    const community = this.sb.currentCommunity
    console.info('[VoicePresenceWS] opening socket', {
      trigger,
      community,
      reconnectAttempt: this._voicePresenceReconnectAttempt
    })
    const socket = new WebSocket(window.api.voice.presenceWsUrl(community, this.sb.authToken))
    socket._voicePresenceCommunity = community
    this._voicePresenceSocket = socket
    this._voicePresenceSocketCommunity = community

    socket.addEventListener('open', () => {
      if(this._voicePresenceSocket !== socket) return
      console.info('[VoicePresenceWS] socket open', {
        community,
        reconnectAttempt: this._voicePresenceReconnectAttempt
      })
      this._voicePresenceReconnectAttempt = 0
    })

    socket.addEventListener('message', (event) => {
      if(this._voicePresenceSocket !== socket) return
      this._handleVoicePresenceSocketMessage(event.data, community)
    })

    socket.addEventListener('close', (event) => {
      if(this._voicePresenceSocket !== socket) return
      console.warn('[VoicePresenceWS] socket closed', {
        community,
        code: event?.code,
        reason: event?.reason || '',
        wasClean: !!event?.wasClean,
        readyState: socket.readyState
      })
      this._voicePresenceSocket = null
      this._voicePresenceSocketCommunity = null
      this._scheduleVoicePresenceReconnect(community)
    })

    socket.addEventListener('error', (event) => {
      console.warn('[VoicePresenceWS] socket error', {
        community,
        readyState: socket.readyState,
        eventType: event?.type
      })
      try {
        socket.close()
      } catch (_) {}
    })
  }

  _scheduleVoicePresenceReconnect(community){
    if(this._voicePresenceReconnectTimer) clearTimeout(this._voicePresenceReconnectTimer)
    if(!this.sb.authToken || this.sb.currentCommunity !== community) {
      console.info('[VoicePresenceWS] reconnect skipped', {
        community,
        hasAuthToken: !!this.sb.authToken,
        currentCommunity: this.sb.currentCommunity || null
      })
      return
    }

    const attempt = Math.min(this._voicePresenceReconnectAttempt + 1, 6)
    this._voicePresenceReconnectAttempt = attempt
    const delay = Math.min(1000 * (2 ** (attempt - 1)), 30000)
    console.info('[VoicePresenceWS] scheduling reconnect', { community, attempt, delay })
    this._voicePresenceReconnectTimer = setTimeout(() => {
      this._voicePresenceReconnectTimer = null
      if(!this.sb.authToken || this.sb.currentCommunity !== community) return
      this._startVoicePresenceSocket('reconnect')
    }, delay)
  }

  _handleVoicePresenceSocketMessage(rawData, expectedCommunity){
    try {
      const msg = JSON.parse(rawData)
      if(msg?.community !== expectedCommunity || this.sb.currentCommunity !== expectedCommunity) return
      if(msg?.type !== 'voice.presence.snapshot' && msg?.type !== 'voice.presence.update') return
      this._voicePresenceByChannel = msg?.channels || {}
      this._renderVoicePresenceParticipants()
    } catch (err) {
      console.warn('Voice presence message parse failed:', err)
    }
  }

  async _refreshVoicePresence(){
    // On-demand refresh for immediate local UI updates; websocket handles steady-state updates.
    if(!this.sb.authToken || !this.sb.currentCommunity) return
    const community = this.sb.currentCommunity
    try {
      const res = await window.api.voice.presence(community)
      if(res?.error) {
        console.warn('Voice presence failed:', res.error)
        return
      }
      if(this.sb.currentCommunity !== community) return
      this._voicePresenceByChannel = res?.channels || {}
      this._renderVoicePresenceParticipants()
    } catch (err) {
      console.warn('Voice presence request failed:', err)
    }
  }

  _renderVoicePresenceParticipants(){
    const list = this.sb.select('#channel-list')
    if(!list) return

    const activeChannel = this._voiceRoom && this._voiceCommunity === this.sb.currentCommunity
      ? this._voiceChannel
      : null

    list.querySelectorAll('soci-voice-channel-li').forEach(li => {
      const channel = li.getAttribute('channel')
      li.querySelectorAll('soci-user[voice-preview]').forEach(el => el.remove())

      if(activeChannel && channel === activeChannel) {
        li.toggleAttribute('has-participants', false)
        return
      }

      const identities = this._voicePresenceByChannel?.[channel]
      const names = Array.isArray(identities) ? identities : []
      names.forEach(identity => {
        const user = document.createElement('soci-user')
        user.setAttribute('voice-preview', '')
        if(identity === window.soci?.username) user.toggleAttribute('self', true)
        else user.setAttribute('name', identity)
        li.appendChild(user)
      })
      li.toggleAttribute('has-participants', names.length > 0)
    })
  }

  async joinVoiceChannel(channel){
    const community = this.sb.currentCommunity
    if(!community || !this.sb.authToken) {
      if(!this.sb.authToken) window.soci?.requireLogin?.('join voice')
      return
    }
    if(this._voiceRoom && this._voiceChannel === channel && this._voiceCommunity === community) return

    await this._voiceDisconnect()
    const res = await window.api.voice.join(community, channel)
    if(res?.error) {
      console.error('Voice join failed:', res.error)
      return
    }
    const { token, wsUrl, roomName } = res
    if(!token || !wsUrl) return

    try {
      const { Room, RoomEvent } = await import('https://cdn.jsdelivr.net/npm/livekit-client@2/dist/livekit-client.esm.mjs')
      const room = new Room()
      this._voiceRoom = room
      this._voiceChannel = channel
      this._voiceCommunity = community

      room.on(RoomEvent.Connected, () => {
        room.localParticipant.setMicrophoneEnabled(true).catch(() => {})
        this._playVoiceJoined()
        this._updateVoiceUI()
        this._syncVoiceParticipantElements()
        this._updateVoiceTalkingIndicators()
        this._startVAD()
        this._syncVoiceRemoteAudioElements()
        this._refreshVoicePresence()
        this._startVoiceTalkingPolling()
      })
      room.on(RoomEvent.Disconnected, () => {
        this._stopVAD()
        this._stopVoiceTalkingPolling()
        this._playVoiceLeft()
        this._voiceRoom = null
        this._voiceChannel = null
        this._voiceCommunity = null
        this._updateVoiceUI()
        this._clearVoiceParticipantElements()
        this._clearVoiceRemoteAudioElements()
        this._refreshVoicePresence()
      })
      room.on(RoomEvent.ParticipantConnected, () => {
        this._syncVoiceParticipantElements()
        this._refreshVoicePresence()
      })
      room.on(RoomEvent.ParticipantDisconnected, (participant) => {
        this._syncVoiceParticipantElements()
        this._removeVoiceRemoteAudioForParticipant(participant)
        this._refreshVoicePresence()
      })
      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        this._attachVoiceRemoteAudio(track, publication, participant)
        this._syncVoiceParticipantElements()
      })
      room.on(RoomEvent.TrackUnsubscribed, (track, publication) => {
        this._detachVoiceRemoteAudio(track, publication)
        this._syncVoiceParticipantElements()
      })
      room.on(RoomEvent.IsSpeakingChanged, () => this._updateVoiceTalkingIndicators())
      room.on(RoomEvent.ActiveSpeakersChanged, () => this._updateVoiceTalkingIndicators())

      await room.connect(wsUrl, token)
    } catch (err) {
      console.error('Voice connect error:', err)
      this._voiceRoom = null
      this._voiceChannel = null
      this._voiceCommunity = null
      this._updateVoiceUI()
    }
  }

  async disconnectVoice(){
    await this._voiceDisconnect()
    this._updateVoiceUI()
    this._clearVoiceParticipantElements()
  }

  async _voiceDisconnect(){
    if(!this._voiceRoom) {
      this._clearVoiceParticipantElements()
      this._clearVoiceRemoteAudioElements()
      this._stopVoiceTalkingPolling()
      return
    }
    this._stopVAD()
    this._stopVoiceTalkingPolling()
    const room = this._voiceRoom
    this._voiceRoom = null
    this._voiceChannel = null
    this._voiceCommunity = null
    this._clearVoiceParticipantElements()
    this._clearVoiceRemoteAudioElements()
    try {
      room.disconnect()
    } catch (_) {}
  }

  _voiceRemoteTrackKey(track, publication){
    return publication?.trackSid || track?.sid || null
  }

  _attachVoiceRemoteAudio(track, publication, participant){
    if(!track || track.kind !== 'audio') return
    const key = this._voiceRemoteTrackKey(track, publication)
    if(!key) return

    const existing = this._voiceRemoteAudioEls.get(key)
    if(existing?.el?.isConnected) return

    const el = document.createElement('audio')
    el.autoplay = true
    el.playsInline = true
    el.volume = 1
    el.style.display = 'none'
    this.sb.appendChild(el)

    try {
      track.attach(el)
      const p = el.play?.()
      if(p?.catch) p.catch(() => {})
    } catch (err) {
      console.warn('[Voice] Failed to attach remote audio track:', err)
      el.remove()
      return
    }

    this._voiceRemoteAudioEls.set(key, { el, track, participantSid: participant?.sid || null })
  }

  _detachVoiceRemoteAudio(track, publication){
    const key = this._voiceRemoteTrackKey(track, publication)
    if(!key) return

    const entry = this._voiceRemoteAudioEls.get(key)
    if(!entry) return

    try {
      entry.track?.detach?.(entry.el)
    } catch (_) {}
    entry.el?.remove()
    this._voiceRemoteAudioEls.delete(key)
  }

  _removeVoiceRemoteAudioForParticipant(participant){
    const sid = participant?.sid
    if(!sid) return
    this._voiceRemoteAudioEls.forEach((entry, key) => {
      if(entry?.participantSid !== sid) return
      try {
        entry.track?.detach?.(entry.el)
      } catch (_) {}
      entry.el?.remove()
      this._voiceRemoteAudioEls.delete(key)
    })
  }

  _syncVoiceRemoteAudioElements(){
    if(!this._voiceRoom) return
    this._voiceRoom.remoteParticipants.forEach((participant) => {
      participant.trackPublications.forEach((publication) => {
        const track = publication?.track
        if(track) this._attachVoiceRemoteAudio(track, publication, participant)
      })
    })
  }

  _clearVoiceRemoteAudioElements(){
    this._voiceRemoteAudioEls.forEach((entry) => {
      try {
        entry.track?.detach?.(entry.el)
      } catch (_) {}
      entry.el?.remove()
    })
    this._voiceRemoteAudioEls.clear()
  }

  _updateVoiceUI(){
    const list = this.sb.select('#channel-list')
    const strip = this.sb.select('#voice-connection-strip')
    if(!list) return
    list.querySelectorAll('soci-voice-channel-li').forEach(li => {
      const ch = li.getAttribute('channel')
      const active = this._voiceRoom && this._voiceChannel === ch && this._voiceCommunity === this.sb.currentCommunity
      li.toggleAttribute('active', !!active)
      if(active) li.querySelectorAll('soci-user[voice-preview]').forEach(el => el.remove())
    })
    if(strip) strip.style.display = this._voiceRoom ? 'block' : 'none'
    this._renderVoicePresenceParticipants()
  }

  _activeVoiceChannelLi(){
    return this._voiceRoom && this._voiceChannel
      ? this.sb.select(`#channel-list soci-voice-channel-li[channel="${this._voiceChannel}"]`)
      : null
  }

  _voiceParticipants(){
    if(!this._voiceRoom) return []
    return [this._voiceRoom.localParticipant, ...this._voiceRoom.remoteParticipants.values()]
  }

  _voiceParticipantKey(p){
    if(p?.isLocal) return 'local'
    if(p?.sid) return `sid:${p.sid}`
    const identity = p?.identity || p?.name || 'Unknown'
    return `identity:${identity}`
  }

  _createVoiceParticipantEl(p){
    const identity = p.identity || p.name || 'Unknown'
    const user = document.createElement('soci-user')
    user.toggleAttribute('self', !!p.isLocal)
    if(!p.isLocal) user.setAttribute('name', identity)
    return user
  }

  _clearVoiceParticipantElements(){
    this._voiceParticipantEls.forEach(el => el.remove())
    this._voiceParticipantEls.clear()
    this._renderVoicePresenceParticipants()
  }

  _syncVoiceParticipantElements(){
    const activeChannelLi = this._activeVoiceChannelLi()
    if(!activeChannelLi) {
      this._clearVoiceParticipantElements()
      return
    }

    const participants = this._voiceParticipants()
    const currentKeys = new Set()

    participants.forEach(p => {
      const key = this._voiceParticipantKey(p)
      currentKeys.add(key)
      let user = this._voiceParticipantEls.get(key)
      if(!user) {
        user = this._createVoiceParticipantEl(p)
        this._voiceParticipantEls.set(key, user)
      } else if(!p.isLocal) {
        const identity = p.identity || p.name || 'Unknown'
        if(user.getAttribute('name') !== identity) user.setAttribute('name', identity)
      }
      if(user.parentElement !== activeChannelLi) activeChannelLi.appendChild(user)
    })

    this._voiceParticipantEls.forEach((user, key) => {
      if(currentKeys.has(key)) return
      user.remove()
      this._voiceParticipantEls.delete(key)
    })

    this._updateVoiceTalkingIndicators()
  }

  _updateVoiceTalkingIndicators(){
    if(!this._voiceRoom || !this._voiceParticipantEls.size) return
    const activeSpeakers = this._voiceRoom.activeSpeakers || []
    this._voiceParticipants().forEach(p => {
      const key = this._voiceParticipantKey(p)
      const user = this._voiceParticipantEls.get(key)
      if(!user) return
      const isInActiveSpeakers = activeSpeakers.some(s => s.sid === p.sid)
      const speaking = p.isLocal
        ? this._localVADSpeaking
        : (p.isSpeaking || isInActiveSpeakers)
      user.toggleAttribute('talking', !!speaking)
    })
  }

  _renderVoiceParticipants(){
    this._syncVoiceParticipantElements()
  }
}
