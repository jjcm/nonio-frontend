import {SociComponent, html} from './soci-component.js'

export default class SociCommentList extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
      }

      :host header {
        position: relative;
        display: flex;
        align-items: center;
      }

      :host input {
        height: 36px;
        border-radius: 18px;
        background: var(--n1);
        box-shadow: 0 0 0 2px var(--n2);
        border: 0;
        padding: 0 40px 0 18px;
        width: calc(100% - 40px);
      }

      :host input:focus,
      :host input:active {
        outline: 0;
        box-shadow: 0 0 0 2px var(--b1);
      }

      :host soci-user {
        --avatar-size: 40px;
        margin-right: 14px;
      }

      :host soci-icon {
        position: absolute;
        right: 8px;
        top: 8px;
        cursor: pointer;
        color: var(--n3);
      }
    `
  }

  static get observedAttributes() {
    return ['data']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'data':
        break
    }
  }

  render(){
    return html`
      ${this.getCss()}
      <header>
        <soci-user name="pwnies" avatar-only></soci-user>
        <input placeholder="Add a comment"></input>
        <soci-icon glyph="attachment"></soci-user>
      </header>
      <content>
        <slot></slot>
      </content>
    `
  }
}
