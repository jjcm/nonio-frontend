import {SociComponent, html} from './soci-component.js'

export default class SociRouter extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: none;
        width: 100%;
        height: 100vw;
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
    if(this.hasAttribute('active')) return 0
    this.innerHTML = this.data
    this.setAttribute('activating', '')
    setTimeout(()=>{
      this.removeAttribute('activating')
      this.setAttribute('active', '')

      let e = new CustomEvent('routeactivate', {bubbles: false})
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

    let pattern = this.getAttribute('pattern') || ''
    this.pattern = new RegExp(pattern)
  }

  static get observedAttributes() {
    return ['pattern', 'active']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case "pattern":
        this.pattern = new RegExp(newValue)
        break
    }
  }


  render(){
    return html`
      ${this.getCss()}
      <slot></slot>
    `
  }
}
