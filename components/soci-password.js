import SociComponent from './soci-component.js'

export default class SociPassword extends SociComponent {
  static formAssociated = true

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  css() { return `
    :host {
      --entropy-percent: 0;
      position: relative;
    }

    svg {
      display: none;
      fill: none;
      stroke: var(--n2);
      stroke-width: 2px;
      stroke-dasharray: 56.55;
      stroke-dashoffset: calc(56.55 * (1 - var(--entropy-percent)));
      transition: stroke-dashoffset 0.3s ease;
      height: 20px;
      width: 20px;
      position: absolute;
      top: 2px;
      right: 0px;
    }

    :host(:focus-within) svg {
      display: block;
    }

    path { 
      stroke: #fff;
      stroke-width: 2px;
    }

    :host([valid]) svg {
      stroke: none;
      fill: var(--t2);
      transition: none;
    }

  `}

  html() { return `
    <svg>
      <circle cx="10" cy="10" r="9"></circle>
      <path d="M5 9.5 L8.5 13 L14.5 7"/>
    </svg>
    <slot></slot>
  `}

  connectedCallback() {
    this._internals.setValidity({customError: true}, 'Not enough entropy')
    this.field = document.createElement('input')
    this.field.setAttribute('type','password')
    this.field.addEventListener('keydown', this._onKeyDown.bind(this))
    this.appendChild(this.field)
    console.log('appended field')
  }

  checkValidity() {
    return this._internals.checkValidity()
  }

  get value() {
    return this.field.value
  }

  set value(val) {
    this._input.value = val
    this._internals.setFormValue(val)
  }

  _onFocus(e) {
    this._input.focus()
  }

  _onChange(e) {
    this._internals.setFormValue(this.value)
  }

  _onKeyDown() {
    setTimeout(this.checkEntropy.bind(this), 1)
  }

  checkEntropy(){
    const ENTROPY_REQUIREMENT = 40
    let value = this.value
    let charsets = {
      numbers: false,
      lowercase: false,
      uppercase: false,
      specials: false
    }

    for(var i = 0; i < value.length; i++){
      let char = value.charAt(i)
      charsets.numbers = charsets.numbers || char.match(/[0-9]/)
      charsets.lowercase = charsets.lowercase || char.match(/[a-z]/)
      charsets.uppercase = charsets.uppercase || char.match(/[A-Z]/)
      charsets.specials = charsets.specials || (!char.match(/[0-9]/) & !char.match(/[a-z]/) & !char.match(/[A-Z]/))
    }

    let entropyBase =
        (charsets.numbers ? 10 : 0)
      + (charsets.lowercase ? 26 : 0)
      + (charsets.uppercase ? 26 : 0)
      + (charsets.specials ? 50 : 0)
      
    let entropy = Math.log2(Math.pow(entropyBase, value.length))
    let entropyPercent = Math.min((entropy / ENTROPY_REQUIREMENT), 1)

    if(entropyPercent == 1) this.setAttribute('valid', '')
    else this.removeAttribute('valid')

    this.style.setProperty('--entropy-percent', entropyPercent)
  }
}