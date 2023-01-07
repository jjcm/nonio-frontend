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
    <iframe src="/lib/demo-uploadable-page.pug"></iframe>
  `}

  static get observedAttributes() {
    return ['url']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'url') this.url = newValue
  }

  connectedCallback(){
    /*
    this._resizeObserver = new ResizeObserver(this._checkZoomable)
    this._resizeObserver.observe(this)
    */
    this.resizeEvent = this.resizeEvent.bind(this)
    document.addEventListener('iframeSizeEvent', this.resizeEvent, false)
  }

  disconnectedCallback(){
    this._resizeObserver.unobserve(this)
    document.removeEventListener('iframeSizeEvent', this.resizeEvent, false)
  }

  resizeEvent(e){
    let height = e.detail.height
    this.select('iframe').style.height = height + 'px'
  }

  get url(){
    return this.getAttribute('url')
  }

  set url(val){
    return 0
    if(this.getAttribute('url') != val){
      this.setAttribute('url', val)
      return
    }
    let iframe = this.select('iframe')
    iframe.src = val
  }
}
