import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociVideo extends SociComponent {
  constructor() {
    super()
  }

  css(){ return `
    :host {
    }
    :host soci-icon {
      border: 1px solid #f00;
    }
    :host controls {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
    :host track {
      width: 100%;
      display: block;
      height: 4px;
      background: var(--n1);
      margin: 0 10px;
      border-radius: 2px;
    }
  `}

  html(){ return `
    <video>
      <source srcset="${config.VIDEO_HOST}">
    </video>
    <controls>
      <soci-icon glyph="play"></soci-icon>
      <soci-icon glyph="volume"></soci-icon>
      <track>
        <filled></filled>
        <thumb></thumb>
      </track>
      <soci-icon glyph="fullscreen"></soci-icon>
    </controls>
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
