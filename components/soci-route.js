import SociComponent from './soci-component.js'

export default class SociRouter extends SociComponent {
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
        display: contents;
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

    let path = this.getAttribute('path') || ''
    this.path = new RegExp(path)

    let parentRoute = this.parentElement.closest('capacitor-route')
    if(parentRoute) {
      parentRoute.addEventListener('routeactivate', ()=>{
        if(this.test()) this.activate()
      })
    }
  }

  static get observedAttributes() {
    return ['path', 'active', 'script']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case "path":
        this.path = new RegExp(newValue)
        break
      case "script":
        fetch(newValue).then(res => res.text()).then(script => {
          let options = eval(script)
          if(options.onActivate) this.addEventListener('routeactivate', options.onActivate)
          if(options.onDeactivate) this.addEventListener('routedeactivate', options.onDeactivate)
          if(this.active) options.onActivate()
        })
    }
  }

  get active() {
    return this.hasAttribute('active')
  }

  activate(fresh){
    if(this.hasAttribute('active')) return 0
    // If fresh is true, we load a fresh copy of the route. Otherwise we load
    // the previous state.
    if(fresh) this.innerHTML = this.domCopy
    else this._attachChildren()

    // Very briefly add the activating class, followed immediately by the active
    // class. This allows us to bind animation transitions easily for page loads.
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

      let e = new CustomEvent('routedeactivate', {bubbles: false})
      this.dispatchEvent(e)
    }
  }

  test(){
    let routePath = this.getAttribute('path')
    if(!routePath) return 0
    let path
    switch(this.getAttribute('test')) {
      case 'hash':
        path = window.location.hash
        break
      case 'both':
        path = window.location.pathname + window.location.hash
        break
      default:
        path = window.location.pathname
        break
    }

    if(routePath.charAt(0) == '/') return this.getAttribute('path') == path
    return this.path.test(path)
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

/*
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
*/