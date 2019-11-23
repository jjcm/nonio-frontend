import SociComponent from './soci-component.js'

export default class SociLink extends SociComponent {
  constructor() {
    super()
  }

  static get observedAttributes() {
    return ['href']
  }

  html(){ return `
    <a style="text-decoration: inherit; color: inherit;" @click=localLink>
    <slot></slot>
    </a>
  `}

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'href') this.select('a').href = newValue
  }
}
