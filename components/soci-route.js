import SociComponent from './soci-component.js'

export default class SociRouter extends SociComponent {
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

  connectedCallback(){
    this.currentDom = []
    /* Routes have two copies of their DOM. One is a simple string representation
    *  of the DOM, the other is the detached children in their current state. The 
    *  first is great if we need a fresh copy of the route, but the second is good
    *  If we want to preserve the state of things like input fields and js listeners
    */
    this.domCopy = this.innerHTML
    this._detachChildren()

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

  get active() {
    return this.hasAttribute('active')
  }

  activate(refresh){
    if(this.hasAttribute('active')) return 0
    // If refresh is true, we load a fresh copy of the route. Otherwise we load
    // the previous state.
    if(refresh) this.innerHTML = this.domCopy
    else this._attachChildren()
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
      this._detachChildren()
    }
  }

  _detachChildren(){
    while(this.children.length){
      this.currentDom.push(this.removeChild(this.children[0]))
    }
  }

  _attachChildren(){
    while(this.currentDom.length){
      this.appendChild(this.currentDom.shift())
    }
  }
}
