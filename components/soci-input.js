import {SociComponent, html} from './soci-component.js'

export default class SociInput extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        position: relative;
        display: flex;
      }
      :host textarea {
        height: 36px;
        margin-top: 2px;
        border-radius: 18px;
        background: var(--n1);
        box-shadow: 0 0 0 2px var(--n2);
        border: 0;
        padding: 0 40px 0 18px;
        width: calc(100% - 40px);
        resize: none;
        transition: all 0.2s ease-out;
        padding-top: 8px;
        font-size: 14px;
      }

      :host textarea:focus,
      :host textarea:active {
        outline: 0;
        border-radius: 0;
        padding-top: 12px;
        box-shadow: 0 0 0 2px var(--b1);
        height: 300px;
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

  get value(){
    let text = this.select('textarea').value
    text = text.replace(/^(#{1,3}) +(.*)/gm, (match, level, text)=>{
      return `<h${level.length}>${text}<h${level.length}>`
    })
    text = text.replace(/^a/g, 'b')
    return text
  }

  render(){
    return html`
      ${this.getCss()}
      <soci-user name="pwnies" avatar-only></soci-user>
      <textarea placeholder="Add a comment"></textarea>
      <soci-icon glyph="attachment"></soci-user>
    `
  }
}
