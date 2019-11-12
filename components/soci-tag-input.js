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
        background: none;
        height: 100%;
        padding: 0 calc(var(--tag-height) / 2.5);
        border-radius: calc(var(--tag-height) / 2);
        font-size: inherit;
        cursor: pointer;
        width: 100%;
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
      }
      :host input:focus::placeholder {
        color: transparent;
      }
      :host slot {
        display: inline-block;
      }
      :host slot:before {
        content: '#';
      }
      :host([upvoted]) slot:before {
        content: '▲';
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
        <input type="text" placeholder="+"></input>
      </container>
    `
  }
}
