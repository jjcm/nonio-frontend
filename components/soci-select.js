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
      --color: #fff;

      position: relative;
      line-height: var(--height);
      user-select: none;
      font-weight: 500;
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
    }

    selected:hover::before {
      opacity: 0.1;
    }

    dropdown {
      display: none;
      position: absolute;
      top: calc(var(--height) - 2px);
      cursor: pointer;
      background: var(--n0);
      border-radius: 3px;
      color: var(--n6);
      overflow: hidden;
      padding: 4px 0;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 2px 10px 0px rgba(0, 0, 0, 0.2);
      min-width: 100px;
      z-index: 1;
    }

    dropdown[open] {
      display: block;
    }

  `}

  html(){ return `
    <selected @click=toggleDropdown>
      <slot name="selected"></slot>
    </selected>
    <dropdown @click=closeDropdown>
      <slot></slot>
    </dropdown>
  `}

  static get observedAttributes() {
    return ['default']
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
    this.select('dropdown').setAttribute('open', '')
  }

  closeDropdown() {
    this.select('dropdown').removeAttribute('open')
  }

  toggleDropdown() {
    this.select('dropdown').toggleAttribute('open')
  }
}

export class SociOption extends SociComponent {
  constructor() {
    super()
  }

  css(){ return `
    :host(:not([slot="selected"])) {
      height: var(--height);
      line-height: var(--height);
      position: relative;
      user-select: none;
      cursor: pointer;
      color: var(--n4);
      padding: 0 8px;
      width: 100%;
      display: block;
    }
    :host(:not([slot="selected"]):hover) {
      background: var(--n1);
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
