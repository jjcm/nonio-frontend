import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociUsernameInput extends SociComponent {
  static formAssociated = true

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  css() { return `
    :host {
      position: relative;
    }

    input {
      margin: 0 0 8px;
      padding: 0 10px;
      border: 0;
      border-bottom: 2px solid var(--n2);
      height: 38px;
      font-size: 14px;
      width: 100%;
    }

    :host input:focus {
      outline: 0;
      border-bottom: 2px solid var(--b1);
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
    <input id="path" type="text" placeholder="Username" spellcheck="false"/>
  `}

  connectedCallback() {
    this._input = this.select('input')

    this._keyDownTimer = null
    this._error = null

    this._input.addEventListener('keydown', this._onKeyDown.bind(this))
    this._input.addEventListener('change', this._onChange.bind(this))
    this.addEventListener('focus', this._onFocus.bind(this))

    this._internals.setValidity({customError: true}, 'Submissions require a url')
  }

  checkValidity() {
    return this._internals.checkValidity()
  }

  get value() {
    return this._input.value
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
  }

  setUsernameError(message) {
    this._statusIcon.glyph = 'error'
    this.setAttribute('available', false)
    this.select('error').innerHTML = message
    this._internals.setValidity({customError: true}, message)
  }

  async checkUsername(){
    this._statusIcon.glyph = 'spinner'

    let username = this._input.value
    let available = await fetch(`${config.API_HOST}/users/username-is-available/${username}`)
    if(this._keyDownTimer || this._error) return 0
    if(await available.json() === true){
      this._statusIcon.glyph = 'success'
      this.setAttribute('available', true)
    }
    else {
      let message = ''
      if(available.error){
        message = available.error
      }
      else {
        message = 'Username is not available. Please choose a better one for your dumb meme.'
      }
      this.setUsernameError(message)
    }
  }
}