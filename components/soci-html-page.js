import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociHTMLPage extends SociComponent {
  constructor() {
    super()
  }

  css(){ return `
    :host {
      width: 100%;
      display: block;
      overflow: hidden;
      position: relative;
    }
    
    iframe {
      width: 100%;
      border: 0;
    }
  `}

  html(){ return `
    <iframe id="page"></iframe>
  `}

  static get observedAttributes() {
    return ['src']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'src') this.src = newValue
  }

  connectedCallback(){
    const channel = new MessageChannel()
    this.select('iframe').addEventListener('load', () => {
      channel.port1.onmessage = (e) => {
        if(e.data.height)
          this.select('iframe').style.height = e.data.height + 'px'
      }

      this.select('iframe').contentWindow.postMessage('resize observer initialization', '*', [channel.port2])
    })
  }

  get src(){
    return this.getAttribute('url')
  }

  set src(val){
    if(this.getAttribute('src') != val){
      this.setAttribute('src', val)
      return
    }
    this.select('#page').src = config.HTML_HOST + '/' + val
  }
}
