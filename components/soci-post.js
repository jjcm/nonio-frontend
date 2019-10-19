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
        box-shadow: 0 -2px 0 0 rgba(0,0,0,0.08);
        display: flex;
        position: relative;
      }

      :host #details-container {
        min-width: 400px;
      }

      :host #details {
        max-width: 900px;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 24px 36px;
      }

      :host h1 {
        font-size: 32px;
        line-height: 36px;
        margin: 12px 0 18px;
        font-weight: 400;
      }

      :host soci-comment-list {
        display: block;
        border-left: 2px solid rgba(0,0,0,0.08);
        width: 100%;
        box-sizing: border-box;
        position: relative;
        padding: 24px 36px 24px 34px;
      }

      :host soci-user {
        margin-top: -2px;
        --avatar-size: 24px;
        --font-weight: 400;
        --font-size: 16px;
      }

      :host description {
        margin-top: 18px;
        line-height: 24px;
        display: block;
      }

      @media (max-width: 1180px) { 
        :host footer {
          display: block;
        }

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

      //document.body.appendChild(this)
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
        }, 2)
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
            <description>
              Just a test of some filler details and making some line wraps happen who knows what should actually be in here but hey we're loading it in all fancy like ya know? Dont event sweat it brah.
            </description>
          </div>
        </div>
        <soci-comment-list>
          <soci-comment user="pwnies" score="1738" date="2">
            heyo im a comment this is amazing wow oh god I'm so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means I'm cutting off thousands of potential futures from my life
            <div slot="replies">
              <soci-comment user="pwnies" score="1738">heyo im a comment this is amazing wow oh god I'm so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means I'm cutting off thousands of potential futures from my life</soci-comment>
              <soci-comment user="pwnies" score="1738">heyo im a comment this is amazing wow oh god I'm so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means I'm cutting off thousands of potential futures from my life
                <div slot="replies">
                  <soci-comment user="pwnies" score="1738">heyo im a comment this is amazing wow oh god I'm so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means I'm cutting off thousands of potential futures from my life</soci-comment>
                </div>
              </soci-comment>
            </div>
          </soci-comment>
          <soci-comment user="pwnies" score="138" date="3">
            heyo im a comment this is amazing wow oh god I'm so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means I'm cutting off thousands of potential futures from my life
            <div slot="replies">
              <soci-comment user="pwnies" score="1738">heyo im a comment this is amazing wow oh god I'm so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means I'm cutting off thousands of potential futures from my life</soci-comment>
              <soci-comment user="pwnies" score="1738">heyo im a comment this is amazing wow oh god I'm so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means I'm cutting off thousands of potential futures from my life
                <div slot="replies">
                  <soci-comment user="pwnies" score="1738">heyo im a comment this is amazing wow oh god I'm so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means I'm cutting off thousands of potential futures from my life</soci-comment>
                </div>
              </soci-comment>
            </div>
          </soci-comment>
        </soci-comment-list>
      </footer>
    `
  }
}
