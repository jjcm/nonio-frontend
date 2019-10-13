import {SociComponent, html} from './soci-component.js'

export default class SociComment extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        margin-top: 18px;
        display: block;
        position: relative;
      }

      :host top {
        display: flex;
        align-items: flex-start;
      }

      :host soci-user {
        --avatar-size: 40px;
        --font-size: 12px;
        --font-weight: normal;
        --line-height: 18px;
        color: var(--b3);
      }

      :host #time {
        color: var(--n3);
        display: inline;
        font-size: 12px;
        line-height: 18px;
        margin-left: 8px;
      }

      :host #comment {
        padding-left: 52px;
        margin-top: -18px;
        font-size: 14px;
        max-width: 900px;
      }

      :host #actions {
        display: flex;
        font-weight: 500;
        font-size: 14px;
        padding-left: 52px;
        margin-top: 12px;
        align-items: center;
        max-width: 900px;
      }

      :host #view-replies {
        position: relative;
        margin-left: 32px;
        cursor: pointer;
      }

      :host #reply {
        cursor: pointer;
      }

      :host #reply:hover,
      :host #view-replies:hover {
        text-decoration: underline;
      }


      :host #view-replies:after {
        content: '';
        display: block;
        width: 3px;
        border-radius: 2px;
        height: 3px;
        background: var(--n4);
        position: absolute;
        top: 9px;
        left: -17px;
      }

      :host #vote-container {
        display: flex;
        margin-left: auto;
      }

      :host #upvote {
        display: flex;
        align-items: center;
        height: 24px;
        padding: 0 9px 0 2px;
        border-radius: 12px;
        background: var(--n1);
        cursor: pointer;
      }

      :host #upvote soci-icon {
        color: var(--n3);
      }
      
      :host #upvote:hover {
        background: var(--n2);
      }

      :host #upvote:hover soci-icon {
        color: var(--n4);
      }

      :host soci-icon[glyph=downvote] {
        cursor: pointer;
        color: var(--n3);
      }

      :host soci-icon[glyph=downvote]:hover {
        color: var(--n4);
      }

      :host #replies {
        position: relative;
        overflow: hidden;
        height: 0;
        padding-left: 50px;
        opacity: 0;
        transition: all 0.1s ease-out;
        transform: translateY(-2px);
      }

      :host([expanded]) #replies {
        height: auto;
        opacity: 1;
        transform: translateY(0);
      }
      :host guide {
        display: block;
        position: absolute;
        left: 18px;
        width: 4px;
        height: 0; 
        border-radius: 2px;
        top: 52px;
        background: var(--n1);
        opacity: 0;
      }

      :host([expanded]) guide {
        height: calc(100% - 52px);
        opacity: 1;
      }

    `
  }

  static get observedAttributes() {
    return ['score', 'user', 'replies']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'score':
        this.select('#score').innerHTML = newValue
        break
      case 'user':
        this.select('soci-user').setAttribute('name', newValue)
        break
    }
  }

  _toggleReplies(e){
    this.toggleAttribute('expanded')
    let button = e.currentTarget
    if(this.hasAttribute('expanded')){
      button.innerHTML = "Hide replies"
      let replies = this.querySelector('div[slot="replies"]')
    }
    else {
      button.innerHTML = `View ${this.querySelectorAll('soci-comment').length} replies`
    }
  }

  connectedCallback(){
    let numberOfReplies = this.querySelectorAll('soci-comment').length
    if(numberOfReplies)
      this.select('#view-replies').innerHTML = `View ${this.querySelectorAll('soci-comment').length} replies`
    else this.select('#view-replies').style.display = "none"
  }

  render(){
    this._toggleReplies = this._toggleReplies.bind(this)
    return html`
      ${this.getCss()}
      <top>
        <soci-user size="large"></soci-user>
        <div id="time">2m ago</div>
      </top>
      <div id="comment">
        <slot></slot>
      </div>
      <div id="actions">
        <div id="reply">Reply</div>
        <div id="view-replies" @click=${this._toggleReplies}></div>
        <div id="vote-container">
          <div id="upvote">
            <soci-icon glyph="upvote"></soci-icon>
            <div id="score"></div>
          </div>
          <soci-icon glyph="downvote"></soci-icon>
        </div>
      </div>
      <div id="replies">
        <slot name="replies">
        </slot>
      </div>
      <guide></guide>
    `
  }
}
