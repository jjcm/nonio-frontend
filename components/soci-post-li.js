import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociPostLi extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        background: var(--bg);
        margin-bottom: 8px;
        display: block;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0px 1px 3px var(--shadow);
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
        cursor: zoom-in;
        float: left;
      }
      img[src] {
        display: block;
      }

      #preview {
        position: absolute;
        padding: 12px;
        top: 0;
        left: 0;
        pointer-events: none;
        box-sizing: border-box;
        width: 100%;
      }

      #preview img {
        opacity: 0;
      }

      content {
        display: flex;
        flex-direction: column;
        padding-left: 8px;
      }
      #top {
        display: flex;
        flex-direction: column;
      }
      #details {
        display: flex;
        gap: 8px;
        font-size: 12px;
        white-space: nowrap;
      }
      #time {
        color: var(--text-tertiary);
      }
      #votes:before, #time:before {
        content: '•';
        display: inline-block;
        margin-right: 1ch;
        color: var(--text-tertiary);
      }
      #comments {
        color: var(--text-secondary);
        letter-spacing: -0.16px;
        text-align: right;
        line-height: 16px;
        position: absolute;
        top: 12px;
        right: 12px;
      }
      #title {
        font-size: 16px;
        color: var(--text-bold);
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

      slot[name="tags"] {
        display: inline-block;
      }

      :host([score="0"]) #score {
        color: var(--bg-secondary);
      }

      :host([expanded]) {
        height: 400px;
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
        color: var(--text-secondary);
      }

      :host([expanded]) #comments:before {
        content: '•';
        display: inline-block;
        margin-right: 1ch;
        color: var(--text-tertiary);
      }
      :host([expanded]) slot[name="tags"] {
        margin-bottom: 12px;
        display: inline-block;
        opacity: 0;
        animation: load-in 0.2s var(--soci-ease) 0.14s forwards;
        z-index: 1;
      }

      :host([expanded]) ::slotted(soci-quill-view) {
        display: block;
        opacity: 0;
        animation: load-in 0.25s var(--soci-ease) 0.14s forwards;
        font-size: 14px;
      }

      slot[name="description"] {
        display: block;
        max-height: 100%;
        overflow: hidden;
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
    <div id="preview">
      <picture>
        <source class="heic">
        <source class="webp">
        <img @click=expand />
      </picture>
      <content></content>
    </div>
    <content>
      <div id="top">
        <div id="details">
          <slot name="user"></slot>
          <div id="votes"></div>
          <div id="time"></div>
          <div id="comments"></div>
        </div>
        <soci-link>
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
    return ['post-title', 'score', 'time', 'type', 'comments', 'url']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'post-title':
        this.select('#title').innerHTML = newValue
        break
      case 'type':
        this.loadContent(newValue)
        break
      case 'time':
        this.updateTime = this.updateTime.bind(this)
        this.updateTime(newValue, this.select('#time'))
        break
      case 'score':
        this.select('#votes').innerHTML = newValue + ' vote' + (newValue == 1 ? '' : 's')
        //this.querySelector('soci-tag-group').setAttribute('score', newValue)
        break;
      case 'comments':
        this.select('#comments').innerHTML = newValue + (newValue == 1 ? ' comment' : ' comments')
        break;
      case 'url':
        this.select('soci-link').setAttribute('href', '/' + newValue)
        break;

    }
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
