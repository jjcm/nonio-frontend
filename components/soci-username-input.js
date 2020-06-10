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
      display: block;
    }

    input {
      margin: 0 0 8px;
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

    :host(:focus-within) soci-icon {
      display: block;
    }

    soci-icon {
      position: absolute;
      right: 0;
      top: 4px;
      display: none;
    }

    :host([available="false"]) input:focus {
      border-bottom: 2px solid var(--r3);
    }

    :host([available="false"]) soci-icon {
      display: block;
      color: var(--r3);
    }

    :host([available="true"]) input:focus {
      border-bottom: 2px solid var(--g1);
    }

    :host([available="true"]) soci-icon {
      color: var(--g1);
    }

    error {
      display: block;
      height: 0;
      transition: all 0.2s ease-out;
      line-height: 20px;
      font-size: 11px;
      color: var(--r3);
      position: relative;
      overflow: hidden;
    }

    :host([available="false"]) error {
      height: 40px;
    }
  `}

  html() { return `
    <input id="path" type="text" placeholder="Username" spellcheck="false"/>
    <soci-icon></soci-icon>
    <error></error>
  `}

  connectedCallback() {
    this._input = this.select('input')
    this._statusIcon = this.select('soci-icon')

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
    this.removeAttribute('available')
    this._statusIcon.glyph = ''
    clearTimeout(this._keyDownTimer)
    setTimeout(()=>{
      if(!this.value.match(/^[a-zA-Z0-9\-\._]*$/)){
        this._error = true
        this.setUsernameError('Invalid characters')
      }
      else if(this.value == '') {
        this._error = true
        this.setURLError("Username kinda necessary")
      }
      else {
        this._error = false
        this._internals.setValidity({})
        //this.select('error').innerHTML = ''
        this._keyDownTimer = setTimeout(()=>{
          this._keyDownTimer = null
          this.checkUsername()
        }, 500)
      }
    },1)
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
        let messages = [
          'Choose a better one for your dumb meme account.',
          'Choose a better one to post your Bob Ross paintings.',
          'It was probably a bad one anyway.',
          'Maybe try "juggaloboi95" instead?',
          'Maybe try surrounding it in xXx____xXx?',
          'Maybe add a _420 at the end?',
        ]

        message = messages[Math.floor(Math.random() * messages.length)]
      }
      this.setUsernameError('Username is not available. ' + message)
    }
  }
}