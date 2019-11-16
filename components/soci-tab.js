import {SociComponent, html} from './soci-component.js'

export default class SociTab extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: none;
        width: 100%;
        height: 100vh;
        overflow: auto;
        box-sizing: border-box;
        transition: opacity 0.1s ease-in-out;
      }
      :host([activating]),
      :host([active]) {
        display: flex;
      }

      :host([active]) {
        opacity: 1;
      }
      :host([activating]) {
        opacity: 0;
      }
    `
  }

  activate(){
    console.log('activate')
    console.log(this)
    if(this.hasAttribute('active')) return 0
    this.innerHTML = this.data
    this.setAttribute('activating', '')
    setTimeout(()=>{
      this.removeAttribute('activating')
      this.setAttribute('active', '')

      let e = new CustomEvent('tabactivate', {bubbles: false})
      this.dispatchEvent(e)
    },1)
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

  static get observedAttributes() {
    return ['name']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'name') {
      //register this with the tab group here

    }
  }

  render(){
    return html`
      ${this.getCss()}
      <slot></slot>
    `
  }
}