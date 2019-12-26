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
    this.data = []
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

  activate(){
    console.log('activating!')
    console.log(this)
    if(this.hasAttribute('active')) return 0
    this._attachChildren()
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
      this.data.push(this.removeChild(this.children[0]))
    }
  }

  _attachChildren(){
    while(this.data.length){
      this.appendChild(this.data.shift())
    }
  }
}
