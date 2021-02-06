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

    canvas {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100%;
    }
  `}

  html(){ return `
    <img id="image"/>
    <img class="bg"/>
    <canvas width="10" height="10"></canvas>
  `}

  static get observedAttributes() {
    return ['url']
  }

  connectedCallback(){
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'url':
        this.url = newValue
        break
    }
  }

  get url(){
    return this.getAttribute('url')
  }

  set url(val){
    if(this.getAttribute('url') != val){
      this.setAttribute('url', val)
      return
    }

    console.log('setting url')

    let image = this.select('#image')
    let thumbUrl = `${config.THUMBNAIL_HOST}/${this.url}.webp`
    image.src = thumbUrl
    this.select('img.bg').src = thumbUrl
    this._createBlur(thumbUrl)
    setTimeout(()=>{
      image.src = `${config.IMAGE_HOST}/${this.url}.webp`
    },1)


  }

  _createBlur(url){
    let canvas = this.select('canvas')
    let ctx = canvas.getContext('2d')
    var imageObj = new Image();
    imageObj.onload = () => {
      ctx.drawImage(imageObj, 0, 0, 10, 10)
      setTimeout(()=>{
        console.log(canvas.toDataURL('image/png'))
      }, 1000)
    }
    imageObj.src = 'https://image.non.io/painting.webp'
  }
}
