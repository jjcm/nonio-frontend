import SociComponent from '../components/soci-component.js'
import DS from '../lib/soci-design-system.js'
import config from '../config.js'

export default class BlogQuote2 extends SociComponent {

  constructor() {
    super()

    this._onScroll = this._onScroll.bind(this)
    this._intersectionObserver = new IntersectionObserver(elements => {
      let visible = elements[0].intersectionRatio > 0
      let parent = this.parentNode
      while(parent){
        parent[visible ? 'addEventListener' : 'removeEventListener']('scroll', this._onScroll)
        parent = parent.parentNode || parent.host
      }
    })
    this._intersectionObserver.observe(this)

    this._resizeObserver = new ResizeObserver(observable => {
      this.toggleAttribute('large', this.offsetWidth > 800)
    })
    
    this._mutationObserver = new MutationObserver(mutations => {
      this._picture = this.querySelector('picture')
      this.toggleAttribute('image', this._picture)

      if(this._picture) this._resizeObserver.observe(this)
      else this._resizeObserver.unobserve(this)

    })
    this._mutationObserver.observe(this, {childList: true})
  }

  css(){
    return `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 20px;
        position: relative;
        margin: var(--soci-blog-padding) 0;
        overflow: hidden;
      }
      :host([image]) {
        background: #ffffff80;
        box-shadow: 0 0 4px #00000080 inset;
        text-shadow: 0 2px 15px #ffffff80;
        margin: 0;
        padding: var(--soci-blog-padding) 0;
      }
      :host([invert][image]) {
        box-shadow: 0 0 4px #000 inset;
      }
      #container {
        padding: 0 var(--soci-blog-padding);
        max-width: var(--soci-blog-width);
      }
      ::slotted(:not([slot="attribution"])) {
        ${DS.header2}
        font-weight: 100;
        font-style: italic;
        line-height: 1.4;
        margin-bottom: 0.75em;
      }
      :host([image]) #title {
        font-weight: 500;
      }
      #quote {
        display: block;
      }
      ::slotted([slot="quote"]):before,
      ::slotted([slot="quote"]):after {
        display: inline-block;
        font-size: 60px;
        line-height: 20px;
        transform: translateY(16px);
        font-family: serif;
        opacity: 0.2;
      }
      ::slotted([slot="quote"]):before {
        content: "“";
        margin-right: 4px;
      }
      ::slotted([slot="quote"]):after {
        content: "”";
      }
      ::slotted([slot="attribution"]) {
        padding-bottom: 0.2em;
        font-weight: 300;
        display: block;
        text-align: center;
        padding: 0 var(--soci-padding);
        opacity: 0.3;
      }
      :host([image]) ::slotted([slot="attribution"]) {
        opacity: 1;
      }
      ::slotted([slot="attribution"]):before {
        content: "—";
      }
      div {
        max-width: 920px;
      }
      ::slotted([slot="image"]) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: -1;
        object-fit: cover;
        padding: 0 !important;
      }

      :host([align="left"]) ::slotted(*) {
        padding-right: 30%;
        text-align: left;
      }

      :host([align="right"]) ::slotted(*) {
        padding-left: 30%;
        text-align: right;
      }

      :host([invert]) {
        background: #00000060;
        color: #fff;
        text-shadow: 0 2px 15px #00000080;
      }

    `
  }

  html(){
    return `
      <div id="container">
        <slot name="quote"></slot>
        <slot name="attribution"></slot>
      </div>
      <slot name="image">
      </slot>
    `
  }

  connectedCallback(){
    this.innerHTML += `
      <div slot="quote">With software there are only two possibilites: either the users control the programme or the programme controls the users. If the programme controls the users, and the developer controls the programme, then the programme is an instrument of unjust power.</div>
      <div slot="attribution">Richard Stallman</div>
    `

    let image = this.querySelector('[slot="image"]')
    if(image){
    }
  }

  static get observedAttributes() {
    return ['image']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'image' && newValue){
      let formats = ['webp', 'heic'].map(format=>`<source srcset="${config.IMAGE_HOST}/${newValue}.${format}" />`).join('')
      let picture = this.querySelector('picture')
      if(!picture) {
        picture = document.createElement('picture')
        picture.setAttribute('slot', 'image')
        this.appendChild(picture)
      }
      if(picture) picture.innerHTML = `${formats}<img src="${config.IMAGE_HOST}/${newValue}.webp"/>`

    }
  }

  _onScroll(e){
    let boundingBox = this.getBoundingClientRect()
    let visibilityPercent = 1 - (boundingBox.top + boundingBox.height) / (window.innerHeight + boundingBox.height)
    let imageOffset = (this._picture.offsetHeight - this.offsetHeight) / 2

    this._picture.style.transform = `translateY(${(200 * visibilityPercent) - imageOffset}px)`
  }
}