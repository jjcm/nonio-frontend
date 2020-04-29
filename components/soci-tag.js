import SociComponent from './soci-component.js'

export default class SociTag extends SociComponent {
  constructor() {
    super()
  }

  css(){
    let bgColor = this.getAttribute('color') || 'n2'
    let color = bgColor == 'n2' ? 'n3' : 'n0'
    return `
      :host {
        display: inline-block;
        height: 20px;
        border-radius: 3px;
        background: var(--n1);
        font-size: 10px;
        line-height: 20px;
        padding: 0 8px;
        color: var(--n3);
        cursor: pointer;
        font-weight: 600;
        user-select: none;
        transition: background 0.1s var(--soci-ease-out);
        margin-right: 4px;
      }

      :host(:hover) {
        filter: brightness(0.9) contrast(1.2);
      }
      :host([upvoted]) {
        background: var(--${bgColor});
        color: var(--${color});
      }
      slot {
        display: inline-block;
      }
      slot:before {
        content: '#';
      }
      :host([upvoted]) slot:before {
        content: '▲';
      }
    `
  }

  html(){ return `
    <slot></slot>
    <score></score>
  `}

  connectedCallback(){
    this.addEventListener('click', this.vote)
  }

  static get observedAttributes() {
    return ['color', 'name', 'upvoted', 'score']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'score') this.select('score').innerHTML = 
      newValue != 0 ? 
        '&bull; ' + newValue :
        ''
  }

  vote(){
    const score = parseInt(this.getAttribute('score')) || 0
    const upvoted = this.toggleAttribute('upvoted')
    this.setAttribute('score', score + (upvoted ? 1 : -1))
    this.fire('vote', {
      tag: this.innerHTML,
      upvoted: upvoted
    })

    const url = this.closest('[url]')
    if(url) {
      this.postData(`/posttag/${upvoted ? 'add' : 'remove'}-vote`, {
        post: url.getAttribute('url'),
        tag: this.innerHTML
      }).then(val => {
        console.log(val)
      })
    }
    else {
      console.warn('No parent element found with a url for tag:')
      console.warn(this)
    }
  }
}
