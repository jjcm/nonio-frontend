import {SociComponent, html, render} from './soci-component.js'

export default class SociColumn extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
      }
    `
  }

  static get observedAttributes() {
    return ['data']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == "data"){
    }
  }

  render(){
    let data = 'data-example.json'
    return html`
      ${this.getCss()}
      <h1>Column</h1>
      <soci-post-list data=${data}></soci-post-list>
    `
  }
}
