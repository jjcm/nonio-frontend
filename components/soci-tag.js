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
      soci-link:hover {
        text-decoration: underline;
      }
      slot {
        letter-spacing: 0.5px;
      }
      slot:before {
        content: '';
      }
      svg {
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
      #vote:active {
        background: var(--brand-background-subtle);
        border-right: 1px solid transparent;
        --fill-color: var(--base-text);
      }
      :host([upvoted]) {
        --fill-color: var(--base-text-color);
      }
      :host([upvoted]) #vote {
        color: var(--brand-text);
        font-weight: 500;
      }
      :host([upvoted]) #vote:active {
        --fill-color: transparent;
        background: var(--base-background-subtle-hover);
        border-right: 1px solid var(--base-background-subtle-hover);
      }
      :host([tag="nsfw"]) soci-link {
        color: var(--error-text);
      }
      :host([tag="nsfw"]) #vote:active {
        background: var(--error-background-subtle);
      }
      :host([tag="nsfw"][upvoted]) #vote {
        color: var(--error-text);
      }
      :host([tag="nsfw"][upvoted]) #vote:active {
        background: var(--base-background-subtle-hover);
      }

    `
  }

  html(){ return `
    <div id="vote" @click=vote >
      <svg viewBox="0 0 24 24" fill='currentColor'>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4 5.53331C12.2 5.26665 11.8 5.26665 11.6 5.53331L6.59999 12.2C6.35278 12.5296 6.58797 13 6.99999 13H9.99999V18C9.99999 18.5523 10.4477 19 11 19H13C13.5523 19 14 18.5523 14 18V13H17C17.412 13 17.6472 12.5296 17.4 12.2L12.4 5.53331Z" fill="var(--fill-color)"/><path d="M11.6 5.53331L12 5.83331L12 5.83331L11.6 5.53331ZM12.4 5.53331L12 5.83331L12 5.83331L12.4 5.53331ZM6.59999 12.2L6.99999 12.5L6.99999 12.5L6.59999 12.2ZM9.99999 13H10.5V12.5H9.99999V13ZM14 13V12.5H13.5V13H14ZM17.4 12.2L17.8 11.9L17.8 11.9L17.4 12.2ZM12 5.83331L12 5.83331L12.8 5.23331C12.4 4.69998 11.6 4.69998 11.2 5.23331L12 5.83331ZM6.99999 12.5L12 5.83331L11.2 5.23331L6.19999 11.9L6.99999 12.5ZM6.99999 12.5L6.99999 12.5L6.19999 11.9C5.70557 12.5592 6.17595 13.5 6.99999 13.5V12.5ZM9.99999 12.5H6.99999V13.5H9.99999V12.5ZM10.5 18V13H9.49999V18H10.5ZM11 18.5C10.7238 18.5 10.5 18.2761 10.5 18H9.49999C9.49999 18.8284 10.1716 19.5 11 19.5V18.5ZM13 18.5H11V19.5H13V18.5ZM13.5 18C13.5 18.2761 13.2761 18.5 13 18.5V19.5C13.8284 19.5 14.5 18.8284 14.5 18H13.5ZM13.5 13V18H14.5V13H13.5ZM17 12.5H14V13.5H17V12.5ZM17 12.5L17 12.5V13.5C17.824 13.5 18.2944 12.5592 17.8 11.9L17 12.5ZM12 5.83331L17 12.5L17.8 11.9L12.8 5.23331L12 5.83331Z" fill="currentColor"/>
      </svg>
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
    e?.preventDefault()
    const score = parseInt(this.getAttribute('score')) || 0
    const upvoted = this.toggleAttribute('upvoted')
    this.setAttribute('score', score + (upvoted ? 1 : -1))
    this.fire('vote', {
      dom: this,
      tag: this.tag,
      upvoted: upvoted
    })

    const post = this.closest('[post-id]')
    if(post) {
      this.postData(`/posttag/${upvoted ? 'add' : 'remove'}-vote`, {
        post: post.getAttribute('url'),
        tag: this.tag
      }).then(()=>{
        soci.votes[post.getAttribute('post-id')].push(parseInt(this.getAttribute('tag-id')))
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
