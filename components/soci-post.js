import {SociComponent, html} from './soci-component.js'
import SociRouter from './soci-router.js'

export default class SociPost extends SociComponent {
  constructor() {
    super()
  }

  css(){
    let FOOTER_HEIGHT = 200
    return `
      :host {
        background: var(--n0);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: all 0.3s, box-shadow 0.2s;
        z-index: 10;
        width: 100%;
        height: 100%;
      }

      :host content img {
        width: 100%;
        max-height: calc(100vh - ${FOOTER_HEIGHT}px);
        object-fit: contain;
      }

      :host content {
        display: block;
      }

      :host footer {
        height: 100%;
        box-shadow: 0 -2px 0 0 rgba(0,0,0,0.08);
        display: flex;
        position: relative;
      }

      :host #details-container {
        min-width: 400px;
      }

      :host #details {
        max-width: 800px;
        margin: 0 auto;
        padding: 24px;
      }

      :host h1 {
        font-size: 32px;
        line-height: 36px;
        margin: 10px 0 14px;
        font-weight: 400;
      }

      :host soci-comment-list {
        display: block;
        border-left: 2px solid rgba(0,0,0,0.08);
        width: 100%;
      }

      :host soci-user {
        margin-top: -2px;
        --avatar-size: 24px;
        --font-weight: 500;
        --font-size: 18px;
      }
    `
  }

  static get observedAttributes() {
    return ['title', 'score', 'time', 'thumbnail', 'type', 'comments']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'title':
        this.select('#title').innerHTML = newValue
        break
      case 'type':
        if(newValue.match(/video|image/)) this.select('#thumbnail').src = 'example-data/cat.jpg'
        break
      case 'time':
        this._updateTime = this._updateTime.bind(this)
        this._updateTime()
        break
      case 'score':
        this.select('#score').innerHTML = `▲ ${newValue} <span>→</span>`
        break;
      case 'comments':
        this.select('#comments').innerHTML = newValue + (newValue == 1 ? ' comment' : ' comments')
        break;

    }
  }

  open(fromElement){
    if(fromElement){
      let pos = fromElement.getBoundingClientRect()

      this.style.width = pos.width
      this.style.height = pos.height
      this.style.left = pos.left
      this.style.top = pos.top

      document.body.appendChild(this)
      setTimeout(()=>{
        this.style.width = ""
        this.style.height = ""
        this.style.top = ""
        this.style.left = ""
        setTimeout(()=>{
          this.setAttribute('open', '')
          let currentLocation = document.location.pathname + document.location.hash
          this._prevLocation = {
            url: currentLocation,
            title: document.title
          }

          let router = document.querySelector('soci-router')
          if(router) router.updateUrl(this.getAttribute('title'), this.getAttribute('url'))
        }, 200)
      }, 1)
    }

  }

  /*
  close(){
    if(this._prevLocation) {
      let router = document.querySelector('soci-router')
      if(router) router.updateUrl(this._prevLocation.title, this._prevLocation.url)
    }

    document.body.removeChild(this)
  }
  */

  connectedCallback(){
  }


  render(){
    //this.close = this.close.bind(this)
    return html`
      ${this.getCss()}
      <content>
        <img src="example-data/cat.jpg"/>
      </content>
      <footer>
        <div id="details-container">
          <div id="details">
            <soci-user size="large" name="pwnies"></soci-user>
            <h1>lowfi hip hop radio - beats to relax/study to</h1>
            <soci-tag-group score="234" size="large">
              <soci-tag>wtf</soci-tag>
            </soci-tag-group>
          </div>
        </div>
        <soci-comment-list></soci-comment-list>
      </footer>
    `
  }
}
