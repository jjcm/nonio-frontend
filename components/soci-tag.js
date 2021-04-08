import SociComponent from './soci-component.js'

export default class SociTag extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: inline-flex;
        align-items: center;
        height: 20px;
        border-radius: 3px;
        background: var(--base-background-subtle);
        box-shadow: 0 0 0 1px var(--base-background-subtle-hover) inset;
        font-size: 0.625em;
        line-height: 20px;
        padding-right: 8px;
        color: var(--base-text-subtle);
        cursor: pointer;
        font-weight: 600;
        user-select: none;
        //transition: background 0.1s var(--soci-ease-out);
        margin-right: 6px;
        overflow: hidden;
        --fill-color: none;
      }
      :host([upvoted]) {
        box-shadow: none;
        background: var(--success-background-subtle);
        color: var(--success-text);
        --fill-color: var(--base-text-color);
      }
      :host([upvoted]) #vote {
        background: var(--success-background);
        color: var(--base-text-inverse);
        font-weight: 500;
        border-right: 0;
      }
      soci-link:hover {
        text-decoration: underline;
      }
      slot {
        letter-spacing: 0.5px;
      }
      slot:before {
        content: '';
      }
      soci-icon {
        width: 16px;
        height: 24px;
        margin-right: 2px;
      }
      #vote {
        padding: 0 6px 0 3px;
        display: inline-flex;
        align-items: center;
        margin-right: 6px;
        border-right: 1px solid var(--base-background-subtle-hover);
      }
      #vote:hover {
        background: var(--base-background-subtle-hover);
        color: var(--base-text-subtle-hover);
      }
      :host([tag="nsfw"]),
      :host([tag="nsfw"]) #vote:hover {
        color: var(--error-text);
      }
      :host([tag="nsfw"][upvoted]) {
        background: var(--error-background-subtle);
      }
      :host([tag="nsfw"][upvoted]) #vote {
        background: var(--error-background);
        color: var(--base-text-inverse);
      }

    `
  }

  html(){ return `
    <div id="vote" @click=vote >
      <soci-icon glyph="upvote"></soci-icon>
      <score></score>
    </div>
    <soci-link></soci-link>
  `}

  static get observedAttributes() {
    return ['color', 'name', 'upvoted', 'score', 'tag']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case 'score':
        this.select('score').innerHTML = newValue
        break
      case 'tag':
        let link = this.select('soci-link')
        link.setAttribute('href', '/#' + newValue)
        link.innerHTML = newValue
    }
  }

  get score(){
    return parseInt(this.getAttribute('score')) || 0
  }

  set score(val){
    this.setAttribute('score', val)
  }

  get tag(){
    return this.getAttribute('tag')
  }

  set tag(val){
    this.setAttribute('tag', val)
  }
  
  vote(e){
    e.preventDefault()
    const score = parseInt(this.getAttribute('score')) || 0
    const upvoted = this.toggleAttribute('upvoted')
    this.setAttribute('score', score + (upvoted ? 1 : -1))
    console.log(this.tag)
    this.fire('vote', {
      dom: this,
      tag: this.tag,
      upvoted: upvoted
    })

    const url = this.closest('[url]')
    if(url) {
      this.postData(`/posttag/${upvoted ? 'add' : 'remove'}-vote`, {
        post: url.getAttribute('url'),
        tag: this.tag
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
