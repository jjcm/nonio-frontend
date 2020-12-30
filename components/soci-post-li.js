import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociPostLi extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        background: var(--base-background);
        margin-bottom: 8px;
        display: flex;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0px 1px 3px var(--shadow);
        overflow: hidden;
        box-sizing: border-box;
        opacity: 1;
        position: relative;
      }
      img {
        display: none;
        width: 96px;
        height: 72px;
        border-radius: 3px;
        object-fit: cover;
        margin-right: 8px;
        cursor: zoom-in;
        float: left;
      }
      img[src] {
        display: block;
      }

      #preview img {
        position: absolute;
        top: 12px;
        left: 12px;
        opacity: 0;
        pointer-events: none;
      }

      content {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      #top {
        display: flex;
        flex-direction: column;
      }
      #time {
        font-size: 12px;
        color: var(--base-text-subtle);
        letter-spacing: -0.16px;
        text-align: right;
        line-height: 16px;
        position: absolute;
        top: 12px;
        right: 12px;
      }
      #title {
        font-size: 16px;
        color: var(--base-text-bold);
        letter-spacing: -0.08px;
        line-height: 20px;
        width: 100%;
        max-height: 72px;
        font-weight: 600;
        margin-bottom: 8px;
        margin-top: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
      #comments {
        font-size: 12px;
        color: var(--base-text-subtle);
        letter-spacing: -0.16px;
        text-align: right;
        line-height: 16px;
        white-space: nowrap;
        position: absolute;
        bottom: 12px;
        right: 12px;
      }
      :host([score="0"]) #score {
        color: var(--base-background-subtle);
      }

      :host([expanded]) img {
        transition: all 0.1s var(--soci-ease);
        max-width: calc(100% - 280px);
        margin-right: 12px;
      }

      picture {
        display: contents;
      }

      :host([expanded]) #top {
        flex-direction: column-reverse;
      }

      :host([expanded]) #title {
        font-size: 20px;
        line-height: 28px;
        white-space: normal;
        animation: load-in 0.2s var(--soci-ease) 0.14s forwards;
        opacity: 0;
        margin-top: 4px;
        margin-bottom: 12px;
      }

      :host([expanded]) #details {
        animation: load-in 0.2s var(--soci-ease) 0.14s forwards;
        opacity: 0;
        display: flex;
        margin-bottom: 8px;
      }

      :host([expanded]) #time,
      :host([expanded]) #comments {
        position: static;
        margin-left: 18px;
      }

      :host([expanded]) slot[name="tags"] {
        margin-bottom: 12px;
        display: block;
        opacity: 0;
        animation: load-in 0.2s var(--soci-ease) 0.14s forwards;
      }

      :host([expanded]) ::slotted(soci-quill-view) {
        display: block;
        opacity: 0;
        animation: load-in 0.25s var(--soci-ease) 0.14s forwards;
        font-size: 14px;
      }

      @keyframes load-in {
        from {
          transform: translateY(4px);
          opacity: 0;
        }

        to {
          transform: translateY(0px);
          opacity: 1;
        }
      }

    `
  }

  html(){ return `
    <picture id="thumbnail">
      <source class="heic">
      <source class="webp">
      <img @click=expand />
    </picture>
    <picture id="preview">
      <source class="heic">
      <source class="webp">
      <img @click=expand />
    </picture>
    <content>
      <div id="top">
        <div id="details">
          <slot name="user"></slot>
          <div id="time"></div>
          <div id="comments"></div>
        </div>
        <soci-link href=${this.url}>
          <div id="title"></div>
        </soci-link>
      </div>
      <slot name="tags"></slot>
      <slot name="description"></slot>
    </content>
  `}

  connectedCallback(){
    this.addEventListener('scoreChanged', this._scoreChanged)
  }

  static get observedAttributes() {
    return ['title', 'score', 'time', 'type', 'comments', 'url']
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
        this.select('soci-link').href = newValue
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

  expand(){
    this.toggleAttribute('expanded')
    let thumbnail = this.select('#thumbnail img')
    let preview = this.select('#preview img')
    if(this.hasAttribute('expanded')){
      thumbnail.style.height = preview.style.height = '376px'
      thumbnail.style.width = preview.style.width = `${(thumbnail.naturalWidth / thumbnail.naturalHeight) * 376}px`
      let description = document.createElement('soci-quill-view')
      this._setImageSource(this.select('#preview'), config.IMAGE_HOST)
      description.setAttribute('slot', 'description')
      setTimeout(()=>{
        if(this.hasAttribute('expanded'))
          preview.style.opacity = 1
      }, 100)
      this.getData(`/posts/${this.url}`).then(e=>{
        if(e.content.length && this.hasAttribute('expanded')){
          description.render(e.content)
          this.appendChild(description)
        }
      })
    }
    else {
      thumbnail.style.height = preview.style.height = ''
      thumbnail.style.width = preview.style.width = ''
      this.querySelector('soci-quill-view')?.remove()
      preview.style.opacity = ''
    }

  }

  _scoreChanged(e){
    this.score = e.detail.score
  }

  _setImageSource(container, host){
    container.querySelector('img').src = `${host}/${this.url}.webp`
    container.querySelector('.heic').src = `${host}/${this.url}.heic`
    container.querySelector('.webp').src = `${host}/${this.url}.webp`
  }

  loadContent(type) {
    let host = ''
    switch(type){
      case 'image':
        this._setImageSource(this.select('#thumbnail'), config.THUMBNAIL_HOST)
        break
    }
  }
}
