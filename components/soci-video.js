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
      padding: 60px 16px 4px;
      position: absolute;
      width: 100%;
      bottom: 0;
      opacity: 0;
      transition: opacity 0.2s var(--soci-ease);
      background: linear-gradient(#00000000, #00000088);
      box-sizing: border-box;
      color: #fff;
    }
    :host(:hover) controls {
      opacity: 1;
      transition: none;
    }
    #track {
      position: relative;
      width: 100%;
      display: block;
      height: 4px;
      background: #ffffff30;
      margin: 0 10px;
      border-radius: 2px;
      overflow: hidden;
    }
    soci-icon {
      opacity: 0.7;
      cursor: pointer;
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
    }
    #progress,
    .buffer {
      position: absolute;
      top: 0;
      display: block;
      height: 100%;
      width: 0;
      transition: width 0.3s ease;
      background: #ffffff40;
    }
    #progress {
      transition: width 0.1s linear;
      background: var(--brand-background);
      width: 0;
    }
    #buffers {
      opacity: 0.3;
      pointer-events: none;
    }
    .buffer {
      background: #fff;
    }
  `}

  html(){ return `
    <video autoplay @play=_onplay @pause=_onpause></video>
    <controls>
      <soci-icon id="play" glyph="play" @click=_togglePlay></soci-icon>
      <soci-icon glyph="volume"></soci-icon>
      <div id="track" @click=_seekClick>
        <div id="buffers"></div>
        <div id="thumb"></div>
        <div id="progress"></div>
      </div>
      <soci-icon glyph="resolution"></soci-icon>
      <soci-icon glyph="fullscreen"></soci-icon>
    </controls>
    <div id="click-overlay" @click=_togglePlay></div>
  `}

  static get observedAttributes() {
    return ['url']
  }

  connectedCallback(){
    this._bufferInterval = setInterval(this._updateBuffer.bind(this), 1000)
    this._playInterval = setInterval(this._updateTime.bind(this), 100)
    this._video = this.select('video')
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
    console.log(buffer.length)
  }

  _updateTime(){
    this.select('#progress').style.width = `${100 * this._video.currentTime / this._video.duration}%`
  }

  _onplay(){
    this.select('#play').setAttribute('glyph', 'pause')
  }

  _onpause(){
    this.select('#play').setAttribute('glyph', 'play')
  }

  _seekClick(e){
    let percent = e.layerX / this.select('#track').offsetWidth
    console.log(percent)
    console.log(this._video.duration)
    this._video.currentTime = percent * this._video.duration
  }

  get playing(){
    return this._video.currentTime > 0 && !this._video.paused && !this._video.ended && this._video.readyState > 2
  }

  get url() {
    return this.getAttribute('url')
  }

  set url(val) {
    let startingRes = '480p'
    this._video.src = `${config.VIDEO_HOST}/${val}.mp4`
  }
}
