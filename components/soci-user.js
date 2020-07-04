import SociComponent from './soci-component.js'

export default class SociUser extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: inline-flex;
        color: var(--n4);
        cursor: pointer;
        --font-size: 12px;
        --font-weight: 300;
        --avatar-size: 16px;
        --line-height: 16px;
        --spacing: 4px;
      }

      #avatar {
        width: var(--avatar-size);
        height: var(--avatar-size);
        border-radius: 50%;
        background: var(--n2);
        object-fit: cover;
      }

      username {
        font-size: var(--font-size);
        font-weight: var(--font-weight);
        line-height: var(--line-height);
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
        color: var(--r1);
        font-weight: 900;
      }

      :host([size="small"]) {
        --avatar-size: 20px;
        --font-size: 12px;
        --font-weight: normal;
        --line-height: 18px;
        --spacing: 6px;
      }

      :host([size="x-large"]) #avatar {
        --avatar-size: 120px;
        margin-right: 18px;
      }
      :host([size="x-large"]) {
        --font-size: 48px;
        --font-weight: 600;
        --line-height: 84px;
      }

      :host([avatar-only]) username {
        display: none;
      }
      
      :host([username-only]) img {
        display: none;
      }

      :host([username-only]) username {
        margin-left: 0;
      }

      :host([size="small"][self]) username {
        background: var(--b3);
        padding: 0 6px;
        color: #fff;
        margin-right: -4px;
      }
    `
  }

  html(){ return `
    <img id="avatar"></img>
    <username></username>
  `}

  connectedCallback(){
    document.addEventListener('username-updated', this._updateUser.bind(this))
  }

  static get observedAttributes() {
    return ['name', 'op', 'self']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'name':
        this.select('username').innerHTML = newValue
        this.select('#avatar').src = '/example-data/profile.jpg'
        this.toggleAttribute('self', newValue == soci.username) 
        break
      case 'self':
        if(newValue != null){
          this._updateUser()
        }
        break
    }
  }

  _updateUser(){
    let username = soci.username
    this.setAttribute('name', username)
  }
}
