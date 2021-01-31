import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociVideoPlayer extends SociComponent {
  constructor() {
    super()
  }

  css(){ return `
    :host {
      display: block;
      width: 100%;
      position: relative;
      background: #000;
    }
    video {
      max-width: var(--media-width);
      max-height: min(calc(100vh - 100px), var(--media-height));
      margin: 0 auto;
      display: block;
    }
    controls {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      padding: 60px 12px 0;
      position: absolute;
      width: 100%;
      bottom: 0;
      opacity: 0;
      transition: opacity 0.2s var(--soci-ease);
      background: linear-gradient(#00000000, #00000088);
      box-sizing: border-box;
      color: #fff;
      z-index: 2;
    }
    :host([paused]) controls,
    :host(:hover) controls {
      /* visual bug in chrome windows makes opacity 1 do strange things */
      opacity: 0.99;
      transition: none;
    }
    .track-container {
      width: 100%;
      position: relative;
      margin: 0 6px;
      padding: 8px 0;
      cursor: pointer;
    }
    .track {
      position: relative;
      width: 100%;
      display: block;
      height: 4px;
      background: #ffffff30;
      border-radius: 3px;
      overflow: hidden;
      pointer-events: none;
      transition: all 0.1s linear;
    }
    .track-container:hover .track {
      height: 6px;
      border-radius: 3px;
    }
    soci-icon {
      opacity: 0.7;
      cursor: pointer;
      width: 32px;
      cursor: pointer;
      padding: 4px 0;
    }
    soci-icon:hover {
      opacity: 1;
    }
    #click-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100% - 32px);
      z-index: 1;
    }
    .progress,
    #seek,
    .buffer {
      position: absolute;
      top: 0;
      display: block;
      height: 100%;
      width: 0;
      transition: width 0.3s ease;
      background: #ffffff40;
    }
    .progress {
      transition: width 0.1s linear;
      background: var(--brand-background);
      width: 0;
    }
    #seek {
      transition: none;
      background: #ffffff60;
      display: none;
    }
    .track-container:hover #seek {
      display: block;
    }
    #buffers {
      opacity: 0.3;
      pointer-events: none;
    }
    .buffer {
      background: #fff;
    }
    .thumb {
      width: 12px;
      height: 12px;
      transition: all 0.1s linear;
      background: var(--brand-background);
      border-radius: 50%;
      position: absolute;
      top: 5px;
      transform-origin: left center;
      transform: scale(0) translateX(-6px);
      pointer-events: none;
    }
    .track-container:hover .thumb {
      transform: scale(1) translateX(-6px);
    }
    .track-container[seeking] .progress, 
    .track-container[seeking] .thumb {
      transition: none;
    }
    :host(:fullscreen) video {
      max-width: 100vw;
      max-height: 100vh;
      width: 100%;
    }
    soci-icon[glyph="exitfullscreen"],
    :host(:fullscreen) soci-icon[glyph="fullscreen"] {
      display: none;
    }
    :host(:fullscreen) soci-icon[glyph="exitfullscreen"] {
      display: block;
    }

    #volume-container {
      display: flex;
      align-items: center;
      width: 36px;
      transition: all 0.2s var(--soci-ease);
      padding-right: 0;
      position: relative;
      overflow: hidden;
    }

    #volume-container[active],
    #volume-container:hover {
      width: 140px;
      padding-right: 6px;
    }

    #volume-container .track-container:hover .track {
      height: 4px;
    }

    #volume-container[active] .thumb,
    #volume-container:hover .thumb {
      transition: scale 0.1s linear 0.06s;
      transform: scale(1) translateX(-6px);
      top: 4px;
    }

    #volume .progress {
      transition: none;
    }

    soci-select {
      height: 32px;
      margin-left: 4px;
      --color: transparent;
      --font-weight: 900;
      flex-shrink: 0;
    }

    soci-option[slot="selected"] {
      margin-right: -16px;
      --color: transparent;
    }

    soci-option[slot="selected"] {
      opacity: 0.5;
    }
    soci-select:hover soci-option[slot="selected"] {
      opacity: 1;
    }
  `}

  html(){ return `
    <video autoplay @play=_onplay @pause=_onpause></video>
    <controls>
      <soci-icon id="play" glyph="play" @click=_togglePlay></soci-icon>
      <div id="volume-container">
        <soci-icon glyph="volume" @click=_toggleMute></soci-icon>
        <div id="volume" class="track-container" @mousedown=_volumeDown>
          <div class="track">
            <div class="progress" style="width: 100%"></div>
          </div>
          <div class="thumb" style="left: 100%"></div>
        </div>
      </div>
      <div id="timeline" class="track-container" @mousedown=_seekDown @mousemove=_seekMove>
        <div class="track">
          <div id="buffers"></div>
          <div id="seek"></div>
          <div class="progress"></div>
        </div>
        <div class="thumb"></div>
      </div>
      <soci-select id="resolution" dropdown-vertical-position="top" dropdown-horizontal-position="right">
        <soci-option slot="selected">480p</soci-option>
        <soci-option value="images">720p</soci-option>
        <soci-option value="videos">1080p</soci-option>
        <soci-option value="blogs">1440p</soci-option>
        <soci-option value="blogs">4k</soci-option>
        <soci-option value="blogs">8k+</soci-option>
      </soci-select>
      <soci-icon glyph="fullscreen" @click=_fullscreen></soci-icon>
      <soci-icon glyph="exitfullscreen" @click=_exitFullscreen></soci-icon>
    </controls>
    <div id="click-overlay" @click=_togglePlay></div>
  `}

  static get observedAttributes() {
    return ['url', 'resolution']
  }

  connectedCallback(){
    this._bufferInterval = setInterval(this._updateBuffer.bind(this), 1000)
    this._playInterval = setInterval(this._updateTime.bind(this), 100)
    this._video = this.select('video')
    this._seekUp = this._seekUp.bind(this)
    this._volumeMove = this._volumeMove.bind(this)
    this._volumeUp = this._volumeUp.bind(this)
    this._closeVolume = this._closeVolume.bind(this)
    this.toggleAttribute('paused', true)
  }

  disconnectedCallback(){
    clearInterval(this._bufferInterval)
    clearInterval(this._playInterval)
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'url':
        this.url = newValue
        break
    }
  }

  _togglePlay(){
    if(this.playing) {
      this._video.pause()
    } 
    else {
      this._video.play()
    }
  }

  _updateBuffer(){
    let buffer = this._video.buffered
    let container = this.select('#buffers')

    for(let i = 0; i < buffer.length; i++) {
      let dom = container.children[i]
      if(dom == undefined){
        dom = document.createElement('div')
        dom.className = 'buffer'
        container.appendChild(dom)
      }
      dom.style.left = `${100 * buffer.start(i) / this._video.duration}%`
      dom.style.width = `${100 * buffer.end(i) / this._video.duration}%`
    }
  }

  _updateTime(){
    let percent = `${100 * this._video.currentTime / this._video.duration}%`
    this.select('#timeline .progress').style.width = percent
    this.select('#timeline .thumb').style.left = percent
  }

  _onplay(){
    this.select('#play').setAttribute('glyph', 'pause')
    this.toggleAttribute('paused', false)
  }

  _onpause(){
    this.select('#play').setAttribute('glyph', 'play')
    this.toggleAttribute('paused', true)
  }

  _volumeDown(e){
    document.addEventListener('mousemove', this._volumeMove)
    document.addEventListener('mouseup', this._volumeUp)
    this.select('#volume-container').toggleAttribute('active', true)
    this.addEventListener('mouseout', this._closeVolume)
    this._volumeMove(e)
    if(this.hasAttribute('muted')){
      this.select('#volume-container soci-icon').setAttribute('glyph', 'volume')
      this.removeAttribute('muted')
    }
  }

  _volumeUp(e){
    document.removeEventListener('mousemove', this._volumeMove)
    document.removeEventListener('mouseup', this._volumeUp)
  }

  _volumeMove(e){
    let container = this.select('#volume')
    let offsetX = e.clientX - container.getBoundingClientRect().x
    let percent = Math.min(Math.max(offsetX / container.offsetWidth, 0), 1)
    this.volume = percent
  }

  _toggleMute(e){
    console.log('toigglemute')
    this.toggleAttribute('muted')
    if(this.hasAttribute('muted')){
      this.select('#volume-container soci-icon').setAttribute('glyph', 'muted')
      this._unmutedVolume = this.volume
      this.volume = 0
    }
    else {
      this.select('#volume-container soci-icon').setAttribute('glyph', 'volume')
      this.volume = Math.sqrt(this._unmutedVolume)
    }
  }

  _closeVolume(e){
    if(!this.hasAttribute('paused')){
      this.removeEventListener('mouseout', this._closeVolume)
      this.select('#volume-container').toggleAttribute('active', false)
    }
  }

  _seekDown(e){
    this._video.pause()
    this._seeking = true
    this._seekMove(e)
    let container = this.select('#timeline')
    container.toggleAttribute('seeking', true)
    container.removeEventListener('mousemove', this._seekMove)
    document.addEventListener('mousemove', this._seekMove)
    document.addEventListener('mouseup', this._seekUp)
  }

  _seekUp(e){
    this._video.play()
    this._seeking = false
    let container = this.select('#timeline')
    container.toggleAttribute('seeking', false)
    container.addEventListener('mousemove', this._seekMove)
    document.removeEventListener('mousemove', this._seekMove)
    document.removeEventListener('mouseup', this._seekUp)
  }

  _seekMove(e){
    let container = this.select('#timeline')
    let offsetX = e.clientX - container.getBoundingClientRect().x
    let percent = offsetX / container.offsetWidth
    this.select('#seek').style.width = `${100 * percent}%`
    if(this._seeking){
      this._video.currentTime = percent * this._video.duration
      this.select('#timeline .progress').style.width = `${100 * percent}%`
      this.select('#timeline .thumb').style.left = `${100 * percent}%`
    }
  }

  _fullscreen(e){
    this.requestFullscreen()
  }

  _exitFullscreen(e){
    document.exitFullscreen()
  }

  get volume(){
    return this._video.volume
  }

  set volume(percent){
    this.select('#volume .progress').style.width = `${100 * percent}%`
    this.select('#volume .thumb').style.left = `${100 * percent}%`
    this._video.volume = percent * percent
  }

  get playing(){
    return this._video.currentTime > 0 && !this._video.paused && !this._video.ended && this._video.readyState > 2
  }

  get url() {
    return this.getAttribute('url')
  }

  set url(val) {
    if(this.getAttribute('url') != val){
      this.setAttribute('url', val)
      return
    }
    let startingRes = '480p'
    this._video.src = `${config.VIDEO_HOST}/${val}.mp4`
  }
}
