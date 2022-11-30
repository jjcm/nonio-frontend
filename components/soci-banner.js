import SociComponent from './soci-component.js'

export default class SociBanner extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        --banner-bg: var(--bg-warning);
        --banner-stroke: var(--bg-warning);
        padding: 8px 16px 8px 54px;
        display: inline-block;
        background: var(--banner-bg);
        color: var(--text-inverse);
        border-radius: 4px;
        border: 1px solid var(--banner-stroke);
        margin-bottom: 12px;
        width: 100%;
        position: relative;
        box-sizing: border-box;
      }

      #title {
        font-weight: 600;
      }

      soci-icon {
        position: absolute;
        top: calc(50% - 12px);
        left: 16px;
      }
    `
  }

  html(){ return `
    <soci-icon glyph="warning"></soci-icon>
    <div id="title"></div>
    <slot></slot>
  `}

  static get observedAttributes() {
    return ['title']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case 'title':
        this.select('#title').innerHTML = newValue
        break
    }
  }

}
