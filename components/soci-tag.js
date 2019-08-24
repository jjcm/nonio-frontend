import {SociComponent, html} from './soci-component.js'

export default class SociTag extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: inline-block;
        height: 20px;
        border-radius: 10px;
        background: var(--n1);
        font-size: 10px;
        line-height: 20px;
        padding: 0 8px;
        color: var(--n3);
        cursor: pointer;
        font-weight: 600;
        user-select: none;
        transition: background 0.1s var(--soci-ease-out);
      }
      :host(:hover) {
        filter: brightness(0.9) contrast(1.2);
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

  vote(){
    let score = parseInt(this.getAttribute('score')) || 0
    this.setAttribute('score', 
      score + (this.toggleAttribute('upvoted') ? 1 : -1)
    )
    this.fire('vote')
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
      <x id="container">
        <slot></slot>
        <x id="score"></x>
      </x>
    `
  }
}
