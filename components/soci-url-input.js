import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociUrlInput extends SociComponent {
  static get formAssociated() {
    return true
  }

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  css() { return `
    :host {
      display: flex;
      align-items: center;
      position: relative;
      height: 32px;
      min-width: 540px;
      line-height: 28px;
      border: 1px solid var(--border);
      box-sizing: border-box;
      width: 100%;
      font-size: 14px;
      padding: 0 8px;
      border-radius: 8px;
      transition: none;
      margin-bottom: 20px;
      transition: margin-bottom 0.1s var(--soci-ease);
    }
    :host(:focus) {
      outline: 0;
    }
    :host([available="true"]) {
      background: var(--bg-success);
      border: 1px solid var(--bg-success);
      color: var(--text-inverse);
      cursor: pointer;
      transition: all 0.1s ease-in-out, color 0s ease-in-out;
    }
    input {
      cursor: pointer;
      text-decoration: inherit;
      font-weight: bold;
      border: none;
      outline: none;
      padding: 0;
      font-size: 14px;
      width: 100%;
      background: transparent;
      color: inherit;
    }
    input::placeholder {
      font-weight: normal;
      text-transform: none;
      opacity: 0.5;
      font-style: italic;
    }
    :host([available="false"]) {
      border: 1px solid var(--bg-danger);
      margin-bottom: 32px;
    }
    soci-icon {
      pointer-events: none;
      position: absolute;
      right: 2px;
    }
    :host([available="false"]) soci-icon {
      color: var(--bg-danger);

    }
    error {
      position: absolute;
      left: 2px;
      bottom: -18px;
      color: var(--text-danger);
      height: 20px;
      font-size: 12px;
    }
    label {
      cursor: inherit;
    }
  `}

  html() { return `
    <label for="path">${config.HOST}/</label>
    <input id="path" type="text" placeholder="post-url" spellcheck="false" autocomplete="one-time-code"/>
    <soci-icon></soci-icon>
    <error></error>
  `}

  connectedCallback() {
    this._input = this.select('input')
    this._statusIcon = this.select('soci-icon')

    this._keyDownTimer = null
    this._error = null

    this._input.addEventListener('keydown', this.checkUrlValidity.bind(this))
    this._input.addEventListener('change', this._onChange.bind(this))
    this.addEventListener('focus', this._onFocus.bind(this))

    this._internals.setValidity({customError: true}, 'Submissions require a url')
    this.manuallySet = false
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
    this.manuallySet = true
  }

  _onChange(e) {
    this._internals.setFormValue(this.value)
  }

  checkUrlValidity() {
    this.removeAttribute('available')
    this._statusIcon.glyph = ''
    clearTimeout(this._keyDownTimer)
    setTimeout(()=>{
      if(!this.value.match(/^[a-zA-Z0-9\-\._]*$/)){
        this._error = true
        this.setURLError('URL can only contain alphanumerics, periods, dashes, and underscores')
      }
      else if(this.value == '') {
        this._error = true
        this.setURLError("URL can't be empty")
      }
      else {
        this._error = false
        this._internals.setValidity({})
        this.select('error').innerHTML = ''
        this._keyDownTimer = setTimeout(()=>{
          this._keyDownTimer = null
          this.checkURL()
        }, 500)
      }
    },1)
  }

  setURLError(message) {
    this._statusIcon.glyph = 'error'
    this.setAttribute('available', false)
    this.select('error').innerHTML = message
    this._internals.setValidity({customError: true}, message)
  }

  async checkURL(){
    this._statusIcon.glyph = 'spinner'

    let url = this._input.value
    let available = await fetch(`${config.API_HOST}/post/url-is-available/${url}`)
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
        message = 'URL is not available. Please choose a better one for your lovely meme.'
      }
      this.setURLError(message)
    }

  }
}