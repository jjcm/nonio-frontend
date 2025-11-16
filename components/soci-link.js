import SociComponent from './soci-component.js'

export default class SociLink extends SociComponent {
  constructor() {
    super()
  }

  static get observedAttributes() {
    return ['href']
  }

  css() { return `
    :host {
      display: inline-block;
      cursor: pointer;
    }
    
    a {
      text-decoration: inherit;
      color: inherit;
      display: contents;
    }
  `}

  // Even though we're just doing fake navigation, we still want users to be able to middle
  // click on links, so we wrap our slot in an <a> rather than just binding the click event
  // to the host.
  html(){ return `
    <a @click=localLink ?fresh=${this.hasAttribute('fresh')}>
      <slot></slot>
    </a>
  `}

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'href') this.shadowRoot.querySelector('a').href = newValue
  }

  set href(val){
    this.setAttribute('href', val)
  }

  get href(){
    return this.getAttribute('href')
  }

  localLink(e){
    console.log('localLink', e)
    e.preventDefault()
    let link = e.currentTarget
    console.log('link', link)
    window.history.pushState(null, null, link.href)
    window.dispatchEvent(new CustomEvent('link', {detail: link.hasAttribute('fresh') ? 'fresh' : ''}))
  }
}
