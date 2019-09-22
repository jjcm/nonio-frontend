import {SociComponent, html} from './soci-component.js'

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
      }

      :host #avatar {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--n2);
        object-fit: cover;
      }

      :host #username {
        line-height: 16px;
        font-size: 12px;
        letter-spacing: -0.16px;
        margin-left: 4px;
        user-select: none;
      }

      :host([op]) {
        color: var(--b1);
        font-weight: 700;
      }

      :host([admin]) {
        color: var(--r1);
        font-weight: 900;
      }

      :host([size="large"]) #avatar {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }
      :host([size="large"]) #username {
        font-size: 16px;
        font-weight: bold;
        line-height: 24px;
      }
    `
  }

  static get observedAttributes() {
    return ['name', 'op']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'name') {
      this.select('#username').innerHTML = newValue
      this.select('#avatar').src = 'example-data/profile.jpg'
    }
  }

  connectedCallback(){
    //this.addEventListener('click', this.vote)
  }

  render(){
    return html`
      ${this.getCss()}
      <img id="avatar"></img>
      <div id="username"></div>
    `
  }
}
