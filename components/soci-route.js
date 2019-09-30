import {SociComponent, html} from './soci-component.js'

export default class SociRouter extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: contents;
      }
    `
  }

  connectedCallback(){
  }

  static get observedAttributes() {
    return ['pattern']
  }

  attributeChangedCallback(name, oldValue, newValue){
  }


  render(){
    return html`
      ${this.getCss()}
      <slot></slot>
    `
  }
}
