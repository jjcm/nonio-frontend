import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociPost extends SociComponent {
  constructor() {
    super()
  }

  css(){
    let CONTENT_HEIGHT = 300
    return `
       :host {
        background: var(--bg);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        z-index: 10;
        transition: opacity 0.1s var(--soci-ease);
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        min-width: 420px;
        opacity: 0;
      }

      :host([loaded]) {
        opacity: 1;
      }

      #media-container {
        --media-height: calc(100vh - 100px);
        --media-width: 100%;
      }

      .media video,
      .media img {
        width: 100%;
        max-width: var(--media-width);
        max-height: min(calc(100vh - 100px), var(--media-height));
        object-fit: contain;
        position: relative;
        z-index: 10;
        display: block;
        margin: 0 auto;
      }

      .media img {
        max-width: var(--media-width);
        max-height: var(--media-height);
      }

      .media img.bg {
        position: inherit;
        z-index: 9;
        left: 0;
        object-fit: cover;
        transform: scale(1.1);
        filter: blur(20px) brightness(0.8) saturate(0.8);
        margin-bottom: 0;
        position: absolute;
        top: 0;
        max-width: 100%;
      }

      .media {
        opacity: 0;
      }

      :host([loaded]) .media {
        opacity: 1;
        transition: opacity 0.3s var(--soci-ease);
        position: relative;
      }

      :host([type="image"]) #image {
        display: block;
      }

      :host([type="video"]) #video {
        display: block;
      }

      #video {
        background: #000;
      }

      content {
        box-shadow: 0 -2px 0 0 rgba(0,0,0,0.08);
        display: block;
        position: relative;
        background: var(--bg);
        z-index: 10;
      }

      #details-container {
        width: 100%;
        min-width: 500px;
        max-width: 840px;
        margin: 0 auto;
      }

      #details {
        margin: 0 auto;
        box-sizing: border-box;
        padding: 12px 18px;
      }

      title-container {
        display: block;
        padding-left: 60px;
        margin-bottom: 12px;
        transform: translateY(20px);
      }

      h1 {
        font-size: 24px;
        line-height: 28px;
        margin-top: -4px;
        font-weight: 400;
        margin-bottom: 0;
        min-height: 28px;
      }

      meta-data {
        display: block;
        margin-top: 4px;
        color: var(--text-secondary);
      }

      soci-user[username-only] {
        --font-size: 14px;
        --font-weight: 500;
        color: var(--text-brand);
      }

      soci-user[username-only]:hover {
        color: var(--text-brand-hover);
      }

       soci-comment-list {
        display: block;
        border-left: 2px solid rgba(0,0,0,0.08);
        width: 100%;
        box-sizing: border-box;
        position: relative;
      }

       soci-user[avatar-only] {
        --avatar-size: 48px;
        position: absolute;
        left: 0px;
        top: 2px;
      }

       slot[name="description"] {
        opacity: 0;
        display: block;
        transform: translateY(20px);
      }

      ::slotted(soci-quill-view){
        margin: 12px 0;
        border: 1px solid var(--bg-secondary);
        border-radius: 4px;
        line-height: 1.5;
        display: block;
        padding: 8px;
      }

      :host([type="blog"]) slot[name="description"] {
        transform: translateY(25px);
      }

      :host([type="blog"]) slot[name="description"] {
        padding: 32px 0 64px;
        border: 0;
      }

      :host([type="blog"]) #image {
        display: none;
      }

      :host([type="blog"]) content {
        padding-top: 60px;
      }

      :host([type="blog"]) title-container {
        padding-left: 0;
        margin-bottom: 8px;
        opacity: 0;
      }

      :host([type="blog"]) title-container h1 {
        font-size: 32px;
        line-height: 40px;
        margin-bottom: 8px;
      }

      :host([type="blog"]) soci-user[avatar-only] {
        float: left;
        position: static;
        transform: translateY(2px);
      }

      :host([type="blog"]) meta-data {
        padding-left: 60px;
        margin-top: 8px;
      }

      :host([type="blog"]) slot[name="tags"] {
        padding-left: 60px;
        display: block;
      }

      slot[name="tags"] {
        opacity: 0;
        transform: translateY(20px);
        display: block;
        position: relative;
        z-index: 1;
      }

      :host([loaded]) title-container,
      :host([loaded]) slot[name="tags"] {
        opacity: 1;
        transition: transform 0.3s cubic-bezier(.15,0,0,1), opacity 0.3s var(--soci-ease);
        transform: translateY(0);
      }

      :host([loaded]) slot[name="description"] {
        transition: transform 0.3s cubic-bezier(.15,0,0,1), opacity 0.3s var(--soci-ease);
        opacity: 1;
        transform: translateY(0);
      }

      :host([type="blog"][loaded]) slot[name="description"] {
        transition: all 0.35s cubic-bezier(.15,0,.20,1), opacity 0.35s var(--soci-ease);
      }

      :host([type="html"]) #media-container {
        background: var(--bg-bold);
      }


      slot[name="comments"] {
        display: block;
        opacity: 0;
        transform: translateY(30px);
      }

      :host([loaded]) slot[name="comments"] {
        opacity: 1;
        transform: translateY(0px);
        transition: all 0.4s cubic-bezier(.15,0,.35,1), opacity 0.4s var(--soci-ease);
      }

      #vote-message span {
        color: var(--text-success);
        font-size: 11px;
        transform: translateY(-1px);
        animation: load 0.1s var(--soci-ease) forwards;
        display: inline-block;
      }

      @keyframes load {
        from {
          transform: translateY(4px);
          opacity: 0;
        }
        to {
          transform: translateY(-1px);
          opacity: 1;
        }
      }
    `
  }

  html(){ 
    return `
    <div id="media-container"></div>
    <content>
      <div id="details-container">
        <div id="details">
          <title-container>
            <h1></h1>
            <soci-user avatar-only></soci-user>
            <meta-data>
              by <soci-user username-only></soci-user> &nbsp;|&nbsp; <time></time>
            </meta-data>
          </title-container>
          <slot name="tags"></slot>
          <slot name="description"></slot>
        </div>
      </div>
      <slot name="comments"></slot>
    </content>
  `}

  static get observedAttributes() {
    return ['post-title', 'score', 'time', 'user', 'thumbnail', 'type', 'comments', 'url']
  }

  connectedCallback(){
    this.addEventListener('scoreChanged', this._scoreChanged)
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'post-title':
        document.title = newValue
        let meta = document.head.querySelector('meta[property="og:title"]')
        if(meta) meta.setAttribute('content', newValue)
        else {
          meta = document.createElement('meta')
          meta.setAttribute('property', 'og:title')
          meta.setAttribute('content', newValue)
          document.head.appendChild(meta)
        }
        this.select('h1').innerHTML = newValue
        break
      case 'time':
        let date = new Date(parseInt(newValue))
        this.select('time').innerHTML = date.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
        break
      case 'user':
        this.selectAll('soci-user').forEach(user => user.setAttribute('name', newValue))
        break
      case 'score':
        this.querySelector('soci-tag-group').setAttribute('score', newValue)
        break
      case 'url':
        this.querySelector('soci-comment-list').setAttribute('url', newValue)
        this.loadPost(newValue)
        break
    }
  }

  loadPost(url) {
    this.toggleAttribute('loaded', false)
    this.getData('/posts/' + url).then(post => {
      for(let key in post) {
        switch(key){
          case 'content':
            this.renderDescription(post[key])
            break
          case 'type':
            this.loadContent(post[key])
            break
          case 'tags':
            this.setAttribute(key, post[key].map(tag=>tag.tag).join(','))
            this.createTags(post[key])
            break
          case 'url':
            this.setMeta('url', post[key])
            break
          case 'width':
            if(parseInt(post[key]) != 0) 
              this.select('#media-container').style.setProperty('--media-width', post[key] + 'px')
            break
          case 'height':
            if(parseInt(post[key]) != 0) 
              this.select('#media-container').style.setProperty('--media-height', post[key] + 'px')
            break
          case 'title':
            this.setAttribute('post-title', post[key])
            this.setMeta('title', post[key])
            break
          case 'ID':
            this.setAttribute('post-id', post[key])
            break
          default:
            this.setAttribute(key, post[key])
            break
        }
      }
      setTimeout(()=>{
        this.toggleAttribute('loaded', true)
      }, 100)
    })
  }

  loadContent(type) {
    this.querySelector('soci-tag-group')?.setAttribute('format', type)
    document.head.querySelector(`meta[property="og:image"]`)?.remove()
    switch(type){
      case 'image':
        this.setMeta('image', `${config.IMAGE_HOST}/${this.url}.webp`)
        this.select('#media-container').innerHTML = `
          <soci-image url="${this.url}"></soci-image>
          <div id="image" class="media" style="display: none">
            <picture>
              <source>
              <source>
              <img/>
            </picture>
            <picture>
              <source>
              <source>
              <img class="bg" />
            </picture>
          </div>
        `
        this.select('#media-container #image').addEventListener('click', this._zoomImage)
        this.select('#image img').src = `${config.THUMBNAIL_HOST}/${this.url}.webp`
        this.select('#image img.bg').src = `${config.THUMBNAIL_HOST}/${this.url}.webp`
        setTimeout(()=>{
          this.select('#image img').src = `${config.IMAGE_HOST}/${this.url}.webp`
          this.select('#image source').srcset = `${config.IMAGE_HOST}/${this.url}.webp`
        },1)
        break
      case 'video':
        this.select('#media-container').innerHTML = `
          <div id="video" class="media">
            <soci-video></soci-video>
          </div>
        `
        this.select('soci-video').url = this.url
        break
      case 'html':
        this.setAttribute('type', 'html')
        this.select('#media-container').innerHTML = `<soci-html-page src="${this.getAttribute('url')}"></soci-html-page>`
        break
    }
  }

  setMeta(property, value){
    let meta = document.head.querySelector(`meta[property="og:${property}"]`)
    if(!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', `og:${property}`)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', value)
  }

  createTags(tags){
    let tagContainer = this.querySelector('soci-tag-group')
    tagContainer.innerHTML += tags.map((tag) => `<soci-tag tag="${tag.tag}" score="${tag.score}" tag-id="${tag.tagID}" ${soci.votes[this.getAttribute('post-id')]?.includes(tag.tagID) ? 'upvoted':''}></soci-tag>`).join('')
  }

  renderDescription(description){
    let dom = this.querySelector('soci-quill-view[slot="description"]')
    if(!dom){
      dom = document.createElement('soci-quill-view')
      dom.setAttribute('slot', 'description')
      this.appendChild(dom)
    }
    dom.render(description)
    this.setMeta('description', dom.textContent)
  }

  get url(){
    return this.getAttribute('url')
  }

  _zoomImage(){
    this.select()
  }

  _scoreChanged(e){
    if(this.querySelector('soci-tag-group')?.hasAttribute('upvoted')){
      this.select('meta-data').innerHTML += '<span id="vote-message">&nbsp;| &nbsp;<span>Contributing one share of your subscription at the end of the month</span></span>'
    }
    else {
      this.select('meta-data #vote-message')?.remove()
    }
  }
}
