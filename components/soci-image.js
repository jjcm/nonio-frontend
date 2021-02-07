import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociImageViewer extends SociComponent {
  constructor() {
    super()
  }

  css(){ return `
    :host {
      width: 100%;
      display: block;
      max-height: min(calc(100vh - 100px), var(--media-height));
      overflow: hidden;
      position: relative;
    }
    #image {
      max-width: min(var(--media-width), 100%);
      margin: 0 auto;
      height: 100%;
      display: block;
      position: relative;
      z-index: 2;
    }
    img.bg {
      position: inherit;
      z-index: 1;
      left: 0;
      object-fit: cover;
      filter: blur(20px) brightness(0.8) saturate(0.8);
      margin-bottom: 0;
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
    }
    :host([zoomable]) #image {
      cursor: zoom-in;
    }

    :host([zoomed]) #image {
      cursor: zoom-out;
    }
    :host([zoomed]) {
      max-height: var(--media-height);
    }
    :host([zoomed]) #image {
      max-width: var(--media-width);
    }
  `}

  html(){ return `
    <img id="image" @click=_toggleZoom />
    <img class="bg"/>
  `}

  static get observedAttributes() {
    return ['url']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'url') this.url = newValue
  }

  connectedCallback(){
    this._checkZoomable = this._checkZoomable.bind(this)
    this._image = this.select('#image')
    this._resizeObserver = new ResizeObserver(this._checkZoomable)
    this._resizeObserver.observe(this)
  }

  disconnectedCallback(){
    this._resizeObserver.unobserve(this)
  }

  _checkZoomable(){
    if(this.naturalWidth > this._image.offsetWidth || this.naturalHeight > this.offsetHeight){
      this.toggleAttribute('zoomable', true)
    }
    else {
      if(!this.hasAttribute('zoomed'))
        this.toggleAttribute('zoomable', false)
    }
  }

  _toggleZoom(){
    if(this.hasAttribute('zoomable')) this.toggleAttribute('zoomed')
  }

  get url(){
    return this.getAttribute('url')
  }

  set url(val){
    if(this.getAttribute('url') != val){
      this.setAttribute('url', val)
      return
    }
    let image = this.select('#image')
    let thumbUrl = `${config.THUMBNAIL_HOST}/${this.url}.webp`
    image.src = thumbUrl
    this.select('img.bg').src = thumbUrl
    setTimeout(()=>{
      image.onload = () => {
        this.naturalWidth = image.naturalWidth
        this.naturalHeight = image.naturalHeight
        this._checkZoomable()
      }
      image.src = `${config.IMAGE_HOST}/${this.url}.webp`
    },1)
  }
}
