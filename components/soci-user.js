import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociUser extends SociComponent {
  initialRender = false

  constructor() {
    super()
    this._imageFolder = '/thumbnail/'
  }

  css(){
    return `
      :host {
        color: var(--text);
        cursor: pointer;
        --font-size: 12px;
        --font-weight: 400;
        --avatar-size: 16px;
        --line-height: 16px;
        --spacing: 8px;
      }

      div {
        display: inline-flex;
      }

      img {
        width: var(--avatar-size);
        height: var(--avatar-size);
        border-radius: 50%;
        background: var(--bg-secondary);
        object-fit: cover;
      }

      username {
        font-size: var(--font-size);
        font-weight: var(--font-weight);
        line-height: var(--line-height);
        height: var(--line-height);
        letter-spacing: -0.16px;
        margin-left: var(--spacing);
        user-select: none;
        color: inherit;
        display: block;
        border-radius: 3px;
      }

      :host([op]) username {
        font-weight: 900;
        letter-spacing: 0.1px;
      }

      :host([admin]) username {
        color: var(--text-danger);
        font-weight: 900;
      }

      :host([size="small"]) {
        --avatar-size: 20px;
        --font-size: 12px;
        --font-weight: normal;
        --line-height: 20px;
        --spacing: 6px;
      }

      :host([size="large"]) {
        --avatar-size: 116px;
        --font-size: 32px;
        --font-weight: 600;
        --line-height: 32px;
        --spacing: 18px;
      }

      :host([avatar-only]) username {
        display: none;
      }
      
      :host([username-only]) picture {
        display: none;
      }

      :host([username-only]) username {
        margin-left: 0;
      }

      :host([size="small"][self]) username {
        background: var(--bg-brand);
        padding: 0 6px;
        color: var(--text-inverse);
        margin-right: -4px;
      }
    `
  }

  html(){ 
    this.initialRender = true
    let name = this.hasAttribute('self') ? soci.username : this.getAttribute('name')

    return `
    <soci-link ${name ? `href="/user/${name}"` : ''}>
      <div>
      <picture>${this._setImages(name)}</picture>
      <username>${name}</username>
      </div>
    </soci-link>
  `}

  connectedCallback(){
    this._updateUser = this._updateUser.bind(this)
    this._updateAvatar = this._updateAvatar.bind(this)
    document.addEventListener('username-updated', this._updateUser)
    document.addEventListener('avatar-updated', this._updateAvatar)
  }

  disconnectedCallback(){

  }

  static get observedAttributes() {
    return ['name', 'self']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(!this.initialRender) return

    switch(name) {
      case 'name':
        this.select('username').innerHTML = newValue
        this.select('soci-link').setAttribute('href', `/user/${newValue}`)
        this.select('picture').innerHTML = this._setImages(newValue)
        this.toggleAttribute('self', newValue == soci.username) 
        break
      case 'self':
        if(newValue != null){
          this._updateUser()
        }
    }
  }

  _updateUser(){
    if(this.hasAttribute('self') && soci.username){
      this.setAttribute('name', soci.username)
    }
  }

  _updateAvatar(){
    if(this.hasAttribute('self')){
      this.select('picture').innerHTML = this._setImages(soci.username, true)
    }
  }

  _setImages(path, force = false){
    let cacheBuster = force ? `?${Date.now()}` : ''
    let formats = ['webp', 'heic'].map(format=>`<source srcset="${config.AVATAR_HOST}${this._imageFolder}${path}.${format}${cacheBuster}" />`).join('')
    return (path == 'Anonymous coward' ? '' : formats) + `<img src="${config.AVATAR_HOST}/thumbnail/default.png"/>`
  }
}
