import {SociComponent, html} from './soci-component.js'

export default class SociTab extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: none;
      }
      :host([activating]),
      :host([active]) {
        display: block;
      }
    `
  }

  activate(){
    if(this.hasAttribute('active')) return 0
    this.innerHTML = this.data
    this.setAttribute('activating', '')
    setTimeout(()=>{
      this.removeAttribute('activating')
      this.setAttribute('active', '')

      let e = new CustomEvent('tabactivate', {bubbles: false})
      this.dispatchEvent(e)
    }, 1)
  }

  deactivate(){
    if(this.hasAttribute('active')){
      this.removeAttribute('active')
      this.data = this.innerHTML
      this.innerHTML = ''
    }
  }

  get active() {
    return this.hasAttribute('active')
  }

  connectedCallback(){
    this.data = this.innerHTML 
    this.innerHTML = ''

    this.activate = this.activate.bind(this)
  }

  render(){
    return html`
      ${this.getCss()}
      <slot></slot>
    `
  }
}