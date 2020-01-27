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
        margin-bottom: -100%;
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
        padding-left: 52px;
        margin-bottom: 12px;
      }

      h1 {
        font-size: 24px;
        line-height: 28px;
        margin-top: -4px;
        font-weight: 400;
        margin-bottom: 0;
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
        --avatar-size: 40px;
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
      <img src="/example-data/cat.jpg"/>
      <img id="bg" src="/example-data/cat.jpg"/>
    </content>
    <footer>
      <div id="details-container">
        <div id="details">
          <soci-user name="pwnies" avatar-only></soci-user>
          <title-container>
            <h1></h1>
            <meta-data>
              by <soci-user name="pwnies" username-only></soci-user> &nbsp; | &nbsp; Published: Jan 22, 2020
            </meta-data>
          </title-container>
          <soci-tag-group score="234" size="large">
            <soci-tag>wtf</soci-tag>
          </soci-tag-group>
          <description>
            <soci-input readonly></soci-input>
          </description>
        </div>
      </div>
      <soci-comment-list></soci-comment-list>
    </footer>
  `}

  static get observedAttributes() {
    return ['title', 'score', 'time', 'user', 'thumbnail', 'type', 'comments', 'href']
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
        break
      case 'user':
        this.select('soci-user').setAttribute('name', newValue)
        break
      case 'score':
        this.select('soci-tag-group').setAttribute('score', newValue)
        break
      case 'comments':
        this.select('#comments').innerHTML = newValue + (newValue == 1 ? ' comment' : ' comments')
        break
      case 'href':
        this.select('soci-comment-list').setAttribute('href', newValue)
        this.loadPost(newValue)
        break
    }
  }

  loadPost(url) {
    this.getData('/posts/' + url).then(post => {
      for(let key in post) {
        if(key == 'content') this.renderDescription(post[key])
        else this.setAttribute(key, post[key])
      }
    })

    this.loadContent('image')
  }

  loadContent(type) {
    let host = ''
    switch(type){
      case 'image':
        host = config.IMAGE_HOST
        this.select('img').src = `${host}/${this.href}.webp`
        this.select('img#bg').src = `${host}/${this.href}.webp`
        break
    }
  }

  renderDescription(description){
    this.select('soci-input').value = description
  }

  get href(){
    return this.getAttribute('href')
  }
}
