import {SociComponent, html} from './soci-component.js'

export default class SociLink extends SociComponent {
  constructor() {
    super()
  }

  static get observedAttributes() {
    return ['href']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'href') this.select('a').href = newValue
  }

  render(){
    return html`
      <a style="text-decoration: inherit; color: inherit;" @click=${this.localLink}>
      <slot></slot>
      </a>
    `
  }
}
