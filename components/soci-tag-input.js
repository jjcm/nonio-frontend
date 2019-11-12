import {SociComponent, html} from './soci-component.js'

export default class SociTagInput extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        --tag-height: 20px;
        display: inline-block;
        height: var(--tag-height);
        border-radius: calc(var(--tag-height) / 2);
        background: var(--n1);
        font-size: calc(var(--tag-height) / 2);
        line-height: var(--tag-height);
        color: var(--n3);
        cursor: pointer;
        font-weight: 600;
        user-select: none;
        transition: background 0.1s var(--soci-ease-out);
      }
      :host(:hover) {
        filter: brightness(0.9) contrast(1.2);
      }
      :host input {
        border: none;
        background: inherit;
        height: 100%;
        padding: 0 calc(var(--tag-height) / 2.5) 0 calc(var(--tag-height) / 2.5 + 1ch);
        border-radius: calc(var(--tag-height) / 2);
        font-size: inherit;
        cursor: pointer;
        width: 100%;
        position: relative;
      }
      :host input:focus,
      :host input:active {
        box-shadow: 0 0 0 2px var(--b2);
        outline: 0;
        cursor: text;
      }
      :host input::placeholder {
        text-align: center;
        font-size: calc(var(--tag-height) / 1.5);
        background: var(--n1);
        box-shadow: 0 0 0 20px var(--n1);
      }
      :host input:focus::placeholder {
        color: transparent;
        background: transparent;
        box-shadow: none;
      }
      :host slot {
        display: inline-block;
      }
      :host container {
        position: relative;
      }
      :host container div {
        position: absolute;
        left: calc(var(--tag-height) / 2.5);
        font-weight: 300;
      }
    `
  }

  static get observedAttributes() {
    return ['color', 'name', 'upvoted', 'score']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'score') this.select('#score').innerHTML = 
      newValue != 0 ? 
        '&bull; ' + newValue :
        ''
  }

  connectedCallback(){
    this.addEventListener('click', this.vote)
  }

  render(){
    let bgColor = this.getAttribute('color') || 'n2'
    let color = bgColor == 'n2' ? 'n3' : 'n0'
    return html`
      ${this.getCss()}
      <style>
        :host([upvoted]) {
          background: var(--${bgColor});
          color: var(--${color});
        }
      </style>
      <container>
        <div>#</div>
        <input type="text" placeholder="+"></input>
      </container>
    `
  }
}
