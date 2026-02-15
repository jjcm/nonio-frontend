import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociTextChannelView extends SociComponent {
  constructor() {
    super()
    this._lastMessageId = 0
    this._lastRenderedMessage = null
  }

  css(){
    return `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        position: relative;
        background: var(--bg-bold);
        box-sizing: border-box;
      }
      #messages-scroll {
        flex: 1;
        overflow: auto;
        padding: 12px 0 80px;
        scrollbar-width: auto;
        scrollbar-color: var(--text-secondary) var(--bg-bold);
      }
      #messages-scroll::-webkit-scrollbar {
        width: 12px;
      }
      #messages-scroll::-webkit-scrollbar-track {
        background: var(--bg-bold);
      }
      #messages-scroll::-webkit-scrollbar-thumb {
        border-radius: 7px;
        border: 3px solid var(--bg-bold);
      }
      slot#messages {
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      slot#messages::slotted(*) {
        max-width: 100%;
      }
      #compose {
        position: absolute;
        left: 16px;
        right: 16px;
        bottom: 12px;
        border: 1px solid var(--bg-secondary);
        border-radius: 4px;
        background: var(--bg);
        box-shadow: 0 1px 2px var(--shadow);
        z-index: 2;
      }
      #compose-row {
        display: flex;
        gap: 8px;
        align-items: flex-end;
        width: 100%;
      }
      #message-input {
        height: 38px;
        flex: 1;
        min-height: 38px;
        max-height: 180px;
        resize: none;
        overflow-y: hidden;
        border: 0;
        outline: none;
        background: transparent;
        color: var(--text);
        font: inherit;
        line-height: 1.4;
        padding: 9px 39px 9px 11px;
        box-sizing: border-box;
      }
      #message-input::placeholder {
        color: var(--text-tertiary);
      }
      #compose soci-button {
        flex-shrink: 0;
        position: absolute;
        top: 3px;
        right: 0;
        height: 32px;
        background: transparent;
      }
      #compose soci-button:hover {
        background: var(--bg-secondary);
      }
      #attach-btn {
        flex-shrink: 0;
        padding: 8px;
      }
      #attach-preview {
        font-size: 12px;
        color: var(--text-secondary);
        margin-top: 4px;
      }
    `
  }

  html(){
    return `
      <div id="messages-scroll">
        <slot id="messages"></slot>
      </div>
      <div id="compose">
        <div id="compose-row">
          <textarea id="message-input" placeholder="Message..."></textarea>
          <soci-button id="attach-btn" subtle title="Attach image">
            <soci-icon glyph="filterImages" size="16"></soci-icon>
          </soci-button>
          <input type="file" id="file-input" accept="image/*" style="display:none">
        </div>
        <div id="attach-preview" style="display:none"></div>
      </div>
    `
  }

  static get observedAttributes() {
    return ['community', 'channel']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if (name === 'community' || name === 'channel') {
      if (this.getAttribute('community') && this.getAttribute('channel')) {
        this._loadMessages()
      }
    }
  }

  connectedCallback(){
    super.connectedCallback?.()
    this._pendingImageUrl = ''
    const input = this.select('#message-input')
    const attachBtn = this.select('#attach-btn')
    const fileInput = this.select('#file-input')
    if (input) input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this._sendMessage()
      }
    })
    input.addEventListener('input', () => this._autoResizeInput())
    if (attachBtn && fileInput) {
      attachBtn.addEventListener('click', () => fileInput.click())
      fileInput.addEventListener('change', () => this._onFileSelected())
    }
    if (this.getAttribute('community') && this.getAttribute('channel')) {
      this._loadMessages()
    }
  }

  _onFileSelected(){
    const fileInput = this.select('#file-input')
    if (!fileInput?.files?.length || !this.authToken) return
    const file = fileInput.files[0]
    const fd = new FormData()
    fd.append('files', file)
    fd.append('url', '')
    const xhr = new XMLHttpRequest()
    xhr.open('POST', config.IMAGE_HOST + '/upload')
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.authToken)
    xhr.onload = () => {
      fileInput.value = ''
      if (xhr.status >= 200 && xhr.status < 300) {
        const slug = (xhr.responseText || '').trim().replace(/\.webp$/i, '')
        if (slug) {
          this._pendingImageUrl = slug
          const preview = this.select('#attach-preview')
          if (preview) {
            preview.textContent = 'Image attached'
            preview.style.display = 'block'
          }
        }
      }
    }
    xhr.send(fd)
  }

  get community() {
    return this.getAttribute('community')
  }

  get channel() {
    return this.getAttribute('channel')
  }

  async _loadMessages(){
    const community = this.community
    const channel = this.channel
    if (!community || !channel) return
    if (!this.authToken) {
      this._clearMessages()
      const p = document.createElement('p')
      p.setAttribute('data-message-state', '')
      p.style.padding = '12px'
      p.style.color = 'var(--text-secondary)'
      p.textContent = 'Log in to view messages.'
      this.appendChild(p)
      return
    }
    try {
      const res = await window.api.channelMessages.list(community, channel)
      const messages = res?.messages || []
      this._clearMessages()
      this._lastRenderedMessage = null
      const ordered = [...messages].reverse()
      ordered.forEach(m => this._appendMessageEl(m))
      this._scrollToBottom()
      if (messages.length) this._lastMessageId = Math.max(...messages.map(m => m.id))
    } catch (e) {
      console.warn('TextChannelView: load messages failed', e)
      this._clearMessages()
      const p = document.createElement('p')
      p.setAttribute('data-message-state', '')
      p.style.padding = '12px'
      p.style.color = 'var(--text-danger)'
      p.textContent = 'Failed to load messages.'
      this.appendChild(p)
    }
  }

  _appendMessageEl(msg){
    const row = document.createElement('soci-message-row')
    row.dataset.messageId = String(msg.id || '')
    row.setAttribute('user', msg.user || '')
    const ts = this._toTimestamp(msg.date)
    row.setAttribute('time', ts ? String(ts) : 'now')
    if (msg.imageUrl) row.setAttribute('image-url', msg.imageUrl)
    row.setCompact?.(this._shouldCompactWithPrevious(this._lastRenderedMessage, msg))

    const markdown = document.createElement('soci-markdown-view')
    if (msg.content) markdown.render(msg.content).catch(() => {})
    else markdown.style.display = 'none'
    row.appendChild(markdown)

    this.appendChild(row)
    this._lastRenderedMessage = msg
  }

  _clearMessages(){
    Array.from(this.querySelectorAll('soci-message-row, [data-message-state]')).forEach(el => el.remove())
  }

  _shouldCompactWithPrevious(prev, current){
    if (!prev || !current) return false
    if (!prev.user || !current.user) return false
    if (prev.user !== current.user) return false

    const prevTs = this._toTimestamp(prev.date)
    const currentTs = this._toTimestamp(current.date)
    if (!prevTs || !currentTs) return false
    const msDiff = currentTs - prevTs
    if (msDiff < 0) return false
    return msDiff <= 5 * 60 * 1000
  }

  _toTimestamp(ts){
    if (!ts && ts !== 0) return null
    if (typeof ts === 'number') return ts
    const parsed = parseInt(ts, 10)
    return Number.isFinite(parsed) ? parsed : null
  }

  async _sendMessage(){
    const community = this.community
    const channel = this.channel
    const input = this.select('#message-input')
    if (!community || !channel || !input || !this.authToken) return
    const content = (input.value || '').trim()
    if (!content && !this._pendingImageUrl) return
    try {
      const res = await window.api.channelMessages.send({
        community,
        channel,
        content: content || '',
        imageUrl: this._pendingImageUrl || ''
      })
      if (res?.error) {
        return
      }
      input.value = ''
      this._autoResizeInput()
      this._pendingImageUrl = ''
      const preview = this.select('#attach-preview')
      if (preview) { preview.textContent = ''; preview.style.display = 'none' }
      if (res.id) {
        this._appendMessageEl({
          id: res.id,
          user: res.user || window.soci?.username,
          content: res.content,
          imageUrl: res.imageUrl,
          date: res.date || Date.now()
        })
        this._lastMessageId = Math.max(this._lastMessageId, res.id)
        this._scrollToBottom()
      }
    } catch (e) {
      console.warn('TextChannelView: send message failed', e)
    }
  }

  setPendingImageUrl(url) {
    this._pendingImageUrl = url || ''
  }

  _autoResizeInput(){
    const input = this.select('#message-input')
    if (!input) return
    input.style.height = '38px'
    const maxHeight = 180
    input.style.height = Math.min(input.scrollHeight, maxHeight) + 'px'
    input.style.overflowY = input.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }

  _scrollToBottom(){
    const scroll = this.select('#messages-scroll')
    if (!scroll) return
    requestAnimationFrame(() => {
      scroll.scrollTop = scroll.scrollHeight
    })
  }
}
