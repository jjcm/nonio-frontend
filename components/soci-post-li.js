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
        min-height: 96px;
      }

      :host(.no-image) slot[name="thumbnail"] {
        display: none;
      }

      ::slotted(img),
      img {
        display: none;
        width: 96px;
        height: 72px;
        border-radius: 3px;
        object-fit: cover;
        cursor: zoom-in;
        float: left;
      }
      ::slotted(img[src]),
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
        flex-wrap: wrap;
      }
      #domain,
      #time {
        color: var(--text-tertiary);
      }
      :host([time="now"]) #time suffix {
        display: none;
      }

      #metadata-link > div:before {
        content: '•';
        display: inline-block;
        margin-right: 1ch;
        color: var(--text-tertiary);
      }
      #comments {
        color: var(--text-secondary);
        letter-spacing: -0.16px;
        line-height: 16px;
      }
      #time svg,
      #comments svg {
        display: none;
      }

      #domain {
        display: none;
        pointer-events: none;
      }

      :host([type="link"]) #domain {
        display: block;
      }

      .title {
        font-size: 16px;
        color: var(--text-bold);
        letter-spacing: -0.08px;
        line-height: 20px;
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

      #metadata-link,
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

      #external-link {
        color: var(--text);
        display: none;
      }

      #external-link:visited {
        color: var(--text-secondary);
      }

      #external-link svg {
        margin-left: 4px;
        margin-top: 6px;
        color: var(--text-tertiary);
      }

      :host([type="link"]) #external-link {
        display: flex;
      }

      :host([type="link"]) #internal-link {
        display: none;
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

      @media (max-width: 768px) {
        :host {
          display: flex;
          flex-direction: column;
          padding-top: 28px;
        }
        :host([expanded]) {
          height: auto;
        }
        :host([expanded]) img {
          max-width: 100%;
          margin-right: 0;
        }
        :host([expanded]) #details,
        :host([expanded]) #title {
          animation: none;
          opacity: 1;
        }
        img {
          width: 100%;
          height: 200px;
          margin-top: 4px;
        }
        #preview img {
          transform: translateY(16px);
        }
        #time,
        #comments {
          position: static;
          display: inline-flex;
          color: var(--text-tertiary);
        }
        #time svg,
        #comments svg {
          display: inline-block;
          margin-right: 4px;
        }
        #time suffix,
        #comments suffix {
          display: none;
        }
        content {
          padding-left: 0;
        }
        #details {
          position: absolute;
          top: 8px;
          width: calc(100% - 24px);
          flex-wrap: nowrap;
        }
        #metadata-link > div:before {
          display: none;
        }
        #metadata-link > div {
          order: 1;
        }
        #metadata-link #domain {
          order: 0;
        }
        #domain:after {
          content: "•";
          margin-left: 1ch;
        }
        slot[name="user"] {
          width: 100%;
          display: inline-block;
        }
        #title {
          margin-top: 0;
          margin-bottom: 12px;
        }
      }

    `
  }

  html(){ return `
    <slot name="thumbnail">
      <picture id="thumbnail">
        <source class="heic">
        <source class="webp">
        <img @click=expand />
      </picture>
    </slot>
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
          <soci-link id="metadata-link">
            <div id="votes"></div>
            <div id="comments"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 9.5V4.5C1.5 3.39543 2.39543 2.5 3.5 2.5H12.5C13.6046 2.5 14.5 3.39543 14.5 4.5V9.5C14.5 10.6046 13.6046 11.5 12.5 11.5H9.81522C9.61005 11.5 9.40984 11.5631 9.24176 11.6808L5.28673 14.4493C4.95534 14.6813 4.5 14.4442 4.5 14.0397V12C4.5 11.7239 4.27614 11.5 4 11.5H3.5C2.39543 11.5 1.5 10.6046 1.5 9.5Z" stroke="currentColor"/></svg><span></span></div>
            <div id="time"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="5.5"/><path d="M7.5 5V8.5H10" stroke-linecap="round"/></svg><span></span><suffix> ago</suffix></div>
            <div id="domain"></div>
          </soci-link>
        </div>
        <soci-link id="internal-link">
          <div class="title"></div>
        </soci-link>
        <a id="external-link">
          <div class="title"></div>
        </a>
      </div>
      <slot name="tags"></slot>
      <slot name="description"></slot>
    </content>
  `}

  connectedCallback(){
    this.addEventListener('scoreChanged', this._scoreChanged)
  }

  static get observedAttributes() {
    return ['post-title', 'score', 'time', 'type', 'comments', 'url', 'link']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'post-title':
        this.select('#internal-link .title').innerHTML = newValue
        this.select('#external-link .title').innerHTML = newValue
        break
      case 'type':
        this.loadContent(newValue)
        break
      case 'link':
        let link = this.select('#external-link')
        link.setAttribute('href', newValue)
        this.select('#domain').innerHTML = link.hostname.replace('www.', '')
        break
      case 'time':
        if(newValue == "now") return this.select('#time span').innerHTML = "just now"
        this.updateTime = this.updateTime.bind(this)
        this.updateTime(newValue, this.select('#time span'))
        break
      case 'score':
        this.select('#votes').innerHTML = newValue + ' vote' + (newValue == 1 ? '' : 's')
        //this.querySelector('soci-tag-group').setAttribute('score', newValue)
        break;
      case 'comments':
        this.select('#comments span').innerHTML = `${newValue}<suffix> comment${(newValue == 1 ? '' : 's')}</suffix>`
        break;
      case 'url':
        this.select('#metadata-link').setAttribute('href', '/' + newValue)
        this.select('#internal-link').setAttribute('href', '/' + newValue)
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
      //TODO - this only works for desktop. Mobile this logic is a bit funky
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
    let img = container.querySelector('img')
    img.src = `${host}/${this.url}.webp`
    img.onerror = () => {
      this.classList.toggle('no-image', true)
    }
    container.querySelector('.heic').src = `${host}/${this.url}.heic`
    container.querySelector('.webp').src = `${host}/${this.url}.webp`
  }

  loadContent(type) {
    switch(type){
      case 'image':
      case 'link':
        this._setImageSource(this.select('#thumbnail'), config.THUMBNAIL_HOST)
        break
    }
  }
}
