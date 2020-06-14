import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociPostLi extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        background: var(--n0);
        margin-bottom: 8px;
        display: block;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        max-height: 160px;
        transition: all 0.3s;
        opacity: 1;
        padding-left: 116px;
        position: relative;
      }
      #top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      #time {
        font-size: 12px;
        color: var(--n3);
        letter-spacing: -0.16px;
        text-align: right;
        line-height: 16px;
      }
      #mid {
        display: flex;
        font-size: 14px;
        text-decoration: none;
        color: var(--n4);
        letter-spacing: -0.08px;
        line-height: 20px;
        width: 100%;
        max-height: 72px;
        overflow: hidden;
        font-weight: 600;
        margin-bottom: 8px;
        cursor: pointer;
      }
      img {
        display: none;
        width: 96px;
        min-width: 96px;
        height: calc(100% - 24px);
        min-height: 72px;
        border-radius: 3px;
        object-fit: cover;
        margin-right: 8px;
        position: absolute;
        left: 12px;
        top: 12px;
      }
      img[src] {
        display: block;
      }
      #bot {
        display: flex;
        line-height: 20px;
        align-items: center;
        position: relative;
        padding-right: 90px;
      }
      #tags {
        margin-left: 8px;
        overflow: hidden;
        overflow-x: auto;
        height: 20px;
        line-height: 16px;
        border-radius: 10px;
        scrollbar-width: none;
      }
      #tags::-webkit-scrollbar {
        display: none;
      }
      #score {
        white-space: nowrap;
        display: block;
      }
      #score span {
        margin-left: 4px;
      }
      #add-tag {
        background: var(--n1);
        height: 20px;
        width: 32px;
        min-width: 32px;
        border-radius: 10px;
        text-align: center;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--n4);
        margin-left: 4px;
        cursor: pointer;
      }
      #add-tag:hover {
        background: var(--n2);
      }
      #comments {
        font-size: 12px;
        color: var(--n3);
        letter-spacing: -0.16px;
        text-align: right;
        line-height: 16px;
        white-space: nowrap;
        position: absolute;
        bottom: 2px;
        right: 0px;
      }
      :host([score="0"]) #score {
        color: var(--n2);
      }
    `
  }

  html(){ return `
    <div id="top">
      <slot name="user"></slot>
      <div id="time"></div>
    </div>
    <a id="mid" @click=localLink>
      <img id="thumbnail"></img>
      <div id="title"></div>
    </a>
    <div id="bot">
      <slot name="tags"></slot>
      <div id="comments"></div>
    </div>
  `}

  connectedCallback(){
    this.addEventListener('scoreChanged', this._scoreChanged)
  }

  static get observedAttributes() {
    return ['title', 'score', 'time', 'thumbnail', 'type', 'comments', 'url']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'title':
        this.select('#title').innerHTML = newValue
        break
      case 'type':
        this.loadContent(newValue)
        break
      case 'time':
        this._updateTime = this._updateTime.bind(this)
        this._updateTime()
        break
      case 'score':
        this.querySelector('soci-tag-group').setAttribute('score', newValue)
        break;
      case 'comments':
        this.select('#comments').innerHTML = newValue + (newValue == 1 ? ' comment' : ' comments')
        break;
      case 'url':
        this.select('#mid').href = newValue
        break;

    }
  }

  _updateTime() {
    function setTimeAgo(time, interval, unit){
      setTimeout(this._updateTime, Math.min(interval * 1000, 2147483647))
      this.select('#time').innerHTML = Math.floor(time / interval) + unit + ' ago'
    }
    setTimeAgo = setTimeAgo.bind(this)
    let time = this.getAttribute('time')
    time = Math.floor((Date.now() - parseInt(time)) / 1000)
    if(time < 60) setTimeAgo(time, 1, 's')
    else if(time < 3600) setTimeAgo(time, 60, 'min')
    else if(time < 86400) setTimeAgo(time, 3600, 'h')
    else if(time < 604800) setTimeAgo(time, 86400, ' days')
    else if(time < 2629746) setTimeAgo(time, 604800, ' weeks')
    else if(time < 31556952) setTimeAgo(time, 2629746, ' months')
    else setTimeAgo(time, 31556952, 'y')
  }

  get score(){
    let score = this.getAttribute('score') || 0
    return parseInt(score)
  }

  set score(val){
    this.setAttribute('score', val)
  }

  get url(){
    return this.getAttribute('url')
  }

  _scoreChanged(e){
    this.score = e.detail.score
  }

  loadContent(type) {
    let host = ''
    switch(type){
      case 'image':
        host = config.THUMBNAIL_HOST
        this.select('#thumbnail').src = `${host}/${this.url}.webp`
        break
    }
  }
}
