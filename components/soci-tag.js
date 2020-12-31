import SociComponent from './soci-component.js'

export default class SociTag extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: inline-block;
        height: 20px;
        border-radius: 3px;
        background: var(--base-background-subtle);
        font-size: 0.625em;
        line-height: 20px;
        padding: 0 8px;
        color: var(--base-text-subtle);
        cursor: pointer;
        font-weight: 600;
        user-select: none;
        transition: background 0.1s var(--soci-ease-out);
        margin-right: 4px;
      }
      :host(:hover) {
        background: var(--base-background-subtle-hover);
        color: var(--base-text-subtle-hover);
      }
      :host([upvoted]) {
        background: var(--brand-background);
        color: var(--base-text-inverse);
        font-weight: 500;
      }
      :host([upvoted]:hover) {
        background: var(--brand-background-hover);
        color: var(--base-text-inverse-hover);
      }
      a,
      a:visited {
        color: inherit;
        text-decoration: inherit;
      }
      slot {
        display: inline-block;
        letter-spacing: 0.5px;
      }
      slot:before {
        content: '#';
      }
    `
  }

  html(){ return `
    <a>
      <slot></slot>
      <score></score>
    </a>
  `}

  connectedCallback(){
    this.addEventListener('click', this.vote)
    this.select('a').setAttribute('href', '/#' + this.innerHTML)
  }

  static get observedAttributes() {
    return ['color', 'name', 'upvoted', 'score', 'href']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'score') this.select('score').innerHTML = 
      newValue != 0 ? 
        '&bull; ' + newValue :
        ''
    
    else if(name == 'href') this.select('a').setAttribute('href', newValue)
  }

  get score(){
    return parseInt(this.getAttribute('score')) || 0
  }

  set score(val){
    this.setAttribute('score', val)
  }
  
  vote(e){
    e.preventDefault()
    const score = parseInt(this.getAttribute('score')) || 0
    const upvoted = this.toggleAttribute('upvoted')
    this.setAttribute('score', score + (upvoted ? 1 : -1))
    this.fire('vote', {
      dom: this,
      tag: this.innerHTML,
      upvoted: upvoted
    })

    const url = this.closest('[url]')
    if(url) {
      this.postData(`/posttag/${upvoted ? 'add' : 'remove'}-vote`, {
        post: url.getAttribute('url'),
        tag: this.innerHTML
      })
    }
    else {
      console.warn('No parent element found with a url for tag:')
      console.warn(this)
    }

    // if we're removing a vote, and it's the last vote, delete the tag
    if(!upvoted && this.score == 0) this.remove()
  }
}
