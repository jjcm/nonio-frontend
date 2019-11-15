import {SociComponent, html} from './soci-component.js'

export default class SociTabGroup extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
    `
  }

  updateTabs(){

  }

  render(){
    return html`
      ${this.getCss()}
      <slot></slot>
    `
  }
}