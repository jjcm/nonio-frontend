import SociComponent from './soci-component.js'

export default class SociLink extends SociComponent {
  constructor() {
    super()
  }

  static get observedAttributes() {
    return ['href']
  }

  html(){ return `
    <a style="text-decoration: inherit; color: inherit;" @click=localLink ?refresh=${this.hasAttribute('refresh')}>
    <slot></slot>
    </a>
  `}

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'href') this.select('a').href = newValue
  }

  localLink(e){
    e.preventDefault()
    let link = e.currentTarget
    window.history.pushState(null, null, link.href)
    window.dispatchEvent(new CustomEvent('link', {detail: link.hasAttribute('refresh') ? 'refresh' : ''}))
  }
}
