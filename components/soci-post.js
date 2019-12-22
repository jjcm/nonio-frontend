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
      }

       #details-container {
        min-width: 400px;
      }

       #details {
        max-width: 900px;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 24px 36px;
        position: sticky;
        top: 0;
      }

       h1 {
        font-size: 32px;
        line-height: 36px;
        margin: 12px 0 18px;
        font-weight: 400;
      }

       soci-comment-list {
        display: block;
        border-left: 2px solid rgba(0,0,0,0.08);
        width: 100%;
        box-sizing: border-box;
        position: relative;
      }

       soci-user {
        margin-top: -2px;
        --avatar-size: 24px;
        --font-weight: 400;
        --font-size: 16px;
      }

       description {
        margin-top: 18px;
        line-height: 24px;
        display: block;
      }

      @media (max-width: 1180px) { 
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
          <soci-user size="large" name="pwnies"></soci-user>
          <h1></h1>
          <soci-tag-group score="234" size="large">
            <soci-tag>wtf</soci-tag>
          </soci-tag-group>
          <description>
            Just a test of some filler details and making some line wraps happen who knows what should actually be in here but hey we're loading it in all fancy like ya know? Dont event sweat it brah.
          </description>
        </div>
      </div>
      <soci-comment-list></soci-comment-list>
    </footer>
  `}

  static get observedAttributes() {
    return ['title', 'score', 'time', 'user', 'thumbnail', 'type', 'comments', 'href']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'title':
        console.log('updating title')
        this.select('h1').innerHTML = newValue
        break
      case 'type':
        this.loadContent(newValue)
        break
      case 'time':
        console.log('updating time')
        break
      case 'user':
        console.log('updating user')
        this.select('soci-user').setAttribute('name', newValue)
        break
      case 'score':
        console.log('updating score')
        this.select('#score').innerHTML = `▲ ${newValue} <span>→</span>`
        break
      case 'comments':
        console.log('updating comments')
        this.select('#comments').innerHTML = newValue + (newValue == 1 ? ' comment' : ' comments')
        break
      case 'href':
        console.log('updating href')
        this.select('soci-comment-list').setAttribute('href', newValue)
        this.loadPost(newValue)
        break
    }
  }

  loadPost(url) {
    this.getData('/posts/' + url).then(post => {
      for(let key in post) {
        console.log(key)
        this.setAttribute(key, post[key])
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

  get href(){
    return this.getAttribute('href')
  }
}
