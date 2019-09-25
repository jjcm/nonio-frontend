import {SociComponent, html} from './soci-component.js'

export default class SociPost extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        background: var(--n0);
        box-sizing: border-box;
        display: block;
        border-radius: 8px;
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 8px 8px 0 16px rgba(255,255,255,0);
        overflow: hidden;
        transition: all 0.3s, box-shadow 0.2s;
        position: fixed;
        z-index: 10;
      }

      :host,
      :host content {
        width: calc(100vw - 314px);
        height: calc(100vh - 32px);
        top: 16px;
        left: 298px;
      }

      :host([open]) {
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2), 8px 8px 0 16px rgba(255,255,255,1);
      }

      :host content {
        display: block;
        padding: 12px;
      }

      :host #title {
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        font-size: 20px;
        margin-top: 0;
      }

      :host([open]) #title {
        opacity: 1;
        transform: none;
      }

      :host img {
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease 0.2s;
        margin: 0 -12px;
      }

      :host([open]) img {
        opacity: 1;
        width: 100%;
        transform: none;
      }

      :host #close {
        position: absolute;
        top: 8px;
        right: 12px;
        font-size: 24px;
        cursor: pointer;
        width: 24px;
        height: 24px;
        line-height: 18px;
        text-align: center;
      }
      :host #close:hover {
        background: var(--n1);
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
    console.log(fromElement)
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
      }, 200)
    }, 1)
  }

  close(){
    document.body.removeChild(this)
  }

  connectedCallback(){
  }


  render(){
    this.close = this.close.bind(this)
    return html`
      ${this.getCss()}
      <content>
        <div id="close" @click=${this.close}>x</div>
        <h1 id="title"></h1>
        <img src="example-data/cat.jpg"/>
      </content>
    `
  }
}
