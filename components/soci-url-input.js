import {SociComponent, html} from './soci-component.js'

export default class SociUrlInput extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: flex;
        align-items: center;
        position: relative;
        height: 32px;
        min-width: 540px;
        line-height: 28px;
        border: 2px solid var(--n2);
        box-sizing: border-box;
        width: 100%;
        font-size: 14px;
        padding: 0 8px;
        border-radius: 16px;
        transition: none;
      }
      :host([available="true"]) {
        background: var(--g1);
        border: 2px solid var(--g1);
        color: #fff;
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
        font-size: 14px;
      }
      :host([available="false"]) {
        border: 2px solid var(--r3);
      }
      soci-icon {
        pointer-events: none;
        position: absolute;
        right: 2px;
      }
      :host([available="false"]) soci-icon {
        color: var(--r3);
      }
      error {
        position: absolute;
        left: 2px;
        bottom: -20px;
        color: var(--r3);
        height: 20px;
        font-size: 12px;
      }
      label {
        cursor: inherit;
      }
    `
  }

  connectedCallback() {
    this.input = this.select('input')
    this.statusIcon = this.select('soci-icon')
    this.input.addEventListener('keydown', this.onKeyDown)
    this.keyDownTimer = null
    this.error = null
  }
  
  onKeyDown() {
    this.removeAttribute('available')
    this.statusIcon.glyph = ''
    clearTimeout(this.keyDownTimer)
    setTimeout(()=>{
      if(!this.input.value.match(/^[a-zA-Z0-9\-\._]*$/)){
        this.error = true
        this.setURLError('URL can only contain alphanumerics, periods, dashes, and underscores')
      }
      else if(this.input.value == '') {
        this.error = true
        this.setURLError("URL can't be empty")
      }
      else {
        this.error = false
        this.select('error').innerHTML = ''
        this.keyDownTimer = setTimeout(()=>{
          this.keyDownTimer = null
          this.checkURL()
        }, 500)
      }
    },1)
  }

  setURLError(message) {
    console.log('check url')
    this.statusIcon.glyph = 'error'
    this.setAttribute('available', false)
    this.select('error').innerHTML = message
  }

  async checkURL(){
    console.log('check url')
    this.statusIcon.glyph = 'spinner'

    let url = this.input.value
    let available = await soci.getData(`posts/url-is-available/${url}`)
    if(this.keyDownTimer || this.error) return 0
    console.log(available)
    if(available === true){
      this.statusIcon.glyph = 'success'
      this.setAttribute('available', true)
    }
    else {
      let message = ''
      if(available.error){
        message = available.error
      }
      else {
        message = 'URL is not available. Please choose a better one for your dumb meme.'
      }
    }

  }

  render(){
    this.onKeyDown = this.onKeyDown.bind(this)
    this.setURLError = this.setURLError.bind(this)
    this.checkURL = this.checkURL.bind(this)
    return html`
      ${this.getCss()}
      <label for="path">http://non.io/</label>
      <input id="path" type="text" placeholder="post-url" spellcheck="false"/>
      <soci-icon></soci-icon>
      <error></error>
    `
  }
}
