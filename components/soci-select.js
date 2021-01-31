import SociComponent from './soci-component.js'

export class SociSelect extends SociComponent {
  constructor() {
    super()
  }

  css(){ return `
    :host {
      --height: 30px;
      --text-transform: capitalize;
      --font-weight: 500;
      --font-size: 12px;
      --color: var(--base-background);

      position: relative;
      line-height: var(--height);
      user-select: none;
      font-weight: var(--font-weight, 500);
      font-size: 12px;
      text-transform: capitalize;
    }

    selected {
      height: var(--height);
      padding: 0 24px 0 8px;
      cursor: pointer;
    }

    selected::after {
      content: '';
      position: absolute;
      right: 8px;
      top: calc(var(--height) / 2 - 2px);
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid var(--color);
    }

    selected::before {
      content: '';
      background: var(--color);
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      border-radius: 3px;
    }

    selected:hover::before {
      opacity: 0.1;
    }

    :host([open]) selected::before {
      opacity: 0.1;
    }

    dropdown {
      display: none;
      position: absolute;
      top: calc(var(--height) + 4px);
      cursor: pointer;
      background: var(--base-background-subtle);
      border-radius: 3px;
      color: var(--base-text);
      overflow: hidden;
      padding: 4px 0;
      box-shadow: 0px 1px 1px var(--shadow), 0px 2px 10px var(--shadow);
      min-width: 100px;
      z-index: 1;
    }

    :host([open]) dropdown {
      display: block;
    }

    :host([dropdown-horizontal-position="right"]) dropdown {
      left: auto;
      right: 0;
    }

    :host([dropdown-vertical-position="top"]) dropdown {
      top: auto;
      bottom: calc(var(--height) + 4px);
    }

  `}

  html(){ return `
    <selected @click=openDropdown>
      <slot name="selected"></slot>
    </selected>
    <dropdown @click=closeDropdown>
      <slot></slot>
    </dropdown>
  `}

  static get observedAttributes() {
    return ['default']
  }

  connectedCallback(){
    this._blurClose = this._blurClose.bind(this)
  }

  attributeChangedCallback(name, oldValue, newValue){
    let svg = this.select('svg')
    if(name == 'glyph') svg.innerHTML = icons[newValue]
  }

  get value() {
    let option = this.querySelector('soci-option[slot="selected"]')
    return option.getAttribute('value') || option.innerHTML
  }

  openDropdown() {
    if(this.hasAttribute('open')) return
    this.toggleAttribute('open', true)
    setTimeout(()=>{
      document.addEventListener('click', this._blurClose)
    }, 1)
  }

  closeDropdown() {
    this.removeAttribute('open')
  }

  _blurClose(e){
    this.closeDropdown()
    document.removeEventListener('click', this._blurClose)
  }
}

export class SociOption extends SociComponent {
  constructor() {
    super()
  }

  css(){ return `
    :host(:not([slot="selected"])) {
      height: 30px;
      line-height: 30px;
      position: relative;
      user-select: none;
      cursor: pointer;
      color: var(--base-text);
      padding: 0 8px;
      width: 100%;
      display: block;
    }
    :host(:not([slot="selected"]):hover) {
      background: var(--base-background-subtle-hover);
    }
  `}

  html(){ return '<slot></slot>'}

  connectedCallback(){
    this.addEventListener('click', this.select)
  }

  select() {
    let options = Array.from(this.parentNode.children)
    options.forEach(option => {
      option.removeAttribute('slot')
    })

    this.setAttribute('slot', 'selected')
    this.fire('selected')
  }
}
