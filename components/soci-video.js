import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociVideo extends SociComponent {
  constructor() {
    super()
  }

  css(){ return `
    :host {
    }
  `}

  html(){ return `
    <video>
      <source srcset="${config.VIDEO_HOST}">
    </video>
  `}

  static get observedAttributes() {
    return ['url']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'url':
        this.select('h1').innerHTML = newValue
        break
    }
  }
}
