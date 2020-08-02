import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociPost extends SociComponent {
  constructor() {
    super()
  }

  css(){
    let FOOTER_HEIGHT = 300
    return `
       :host {
        background: var(--n0);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        transition: all 0.3s, box-shadow 0.2s;
        z-index: 10;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        min-width: 420px;
      }

       content img {
        width: 100%;
        max-height: calc(100vh - ${FOOTER_HEIGHT}px);
        object-fit: contain;
        position: relative;
        z-index: 10;
        margin-bottom: -200%;
      }

       content img#bg {
        position: inherit;
        z-index: 9;
        left: 0;
        object-fit: cover;
        transform: scale(1.1);
        filter: blur(20px) brightness(0.8) saturate(0.8);
        margin-bottom: 0;
      }

       content {
        display: block;
      }

       footer {
        box-shadow: 0 -2px 0 0 rgba(0,0,0,0.08);
        display: flex;
        position: relative;
        background: #fff;
        z-index: 10;
      }

       #details-container {
        min-width: 500px;
      }

       #details {
        margin: 0 auto;
        box-sizing: border-box;
        padding: 12px 18px 24px;
        position: sticky;
        top: 0;
      }

      title-container {
        display: block;
        padding-left: 60px;
        margin-bottom: 12px;
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
        color: var(--n3);
      }

      soci-user[username-only] {
        --font-size: 16px;
        --font-weight: 700;
        color: var(--n4);
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
        left: 18px;
      }

       description {
        margin-top: 12px;
        line-height: 24px;
        display: block;
      }

      soci-comment soci-comment {
        --border-color: var(--r1);
      }

      soci-comment soci-comment soci-comment {
        --border-color: var(--o1);
      }

      soci-comment soci-comment soci-comment soci-comment {
        --border-color: var(--y1);
      }

      soci-comment soci-comment soci-comment soci-comment soci-comment {
        --border-color: var(--l1);
      }

      soci-input {
        padding: 8px;
        border: 1px solid #eee;
        border-radius: 4px;
      }

      @media (max-width: 1280px) { 
         footer {
          display: block;
        }

      }
    `
  }

  html(){ return `
    <content>
      <picture>
        <source>
        <source>
        <img @load=_pictureLoaded src="/example-data/cat.jpg"/>
      </picture>
      <picture>
        <source>
        <source>
        <img id="bg" src="/example-data/cat.jpg"/>
      </picture>
    </content>
    <footer>
      <div id="details-container">
        <div id="details">
          <soci-user name="pwnies" avatar-only></soci-user>
          <title-container>
            <h1></h1>
            <meta-data>
              by <soci-user username-only></soci-user> &nbsp;|&nbsp; <time></time>
            </meta-data>
          </title-container>
          <slot name="tags"></slot>
          <description>
            <soci-input readonly></soci-input>
          </description>
        </div>
      </div>
      <slot name="comments"></slot>
    </footer>
  `}

  static get observedAttributes() {
    return ['title', 'score', 'time', 'user', 'thumbnail', 'type', 'comments', 'url']
  }

  connectedCallback(){
    this.select('content').addEventListener('click', this._click)
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'title':
        this.select('h1').innerHTML = newValue
        break
      case 'type':
        this.loadContent(newValue)
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
      case 'comments':
        this.select('#comments').innerHTML = newValue + (newValue == 1 ? ' comment' : ' comments')
        break
      case 'url':
        this.querySelector('soci-comment-list').setAttribute('url', newValue)
        this.loadPost(newValue)
        break
    }
  }

  loadPost(url) {
    this.getData('/posts/' + url).then(post => {
      for(let key in post) {
        switch(key){
          case 'content':
            this.renderDescription(post[key])
            break
          case 'tags':
            this.setAttribute(key, post[key].map(tag=>tag.tag).join(','))
            this.createTags(post[key])
            break
          case 'url':
            break
          default:
            this.setAttribute(key, post[key])
            break
        }
      }
    })

    this.loadContent('image')
  }

  loadContent(type) {
    switch(type){
      case 'image':
        this.select('img').src = `${config.THUMBNAIL_HOST}/${this.url}.webp`
        this.select('img#bg').src = `${config.THUMBNAIL_HOST}/${this.url}.webp`
        setTimeout(()=>{
          this.select('img').src = `${config.IMAGE_HOST}/${this.url}.webp`
          this.select('source').srcset = `${config.IMAGE_HOST}/${this.url}.webp`
        },1)
        break
    }
  }

  createTags(tags){
    let tagContainer = this.querySelector('soci-tag-group')
    tagContainer.innerHTML = ''
    tags.forEach(tag=>{
      let newTag = document.createElement('soci-tag')
      newTag.innerHTML = tag.tag
      newTag.setAttribute('score', tag.score)
      if(soci.votes[this.id]?.includes(tag.tagID)) newTag.toggleAttribute('upvoted')
      tagContainer.appendChild(newTag)
    })
  }

  renderDescription(description){
    this.select('soci-input').value = description
  }

  get url(){
    return this.getAttribute('url')
  }

  _pictureLoaded(e) {
    let image = e.currentTarget
    let width = image.naturalWidth
    let height = image.naturalHeight
    let sidebarWidth = document.querySelector('soci-sidebar').offsetWidth
    if(width > window.innerWidth - sidebarWidth){
      console.log('wide boi')
    }
    else if(height > window.innerHeight){
      console.log('tall boi')
    }
    else {
      console.log('mini boi')
    }
  }
}
