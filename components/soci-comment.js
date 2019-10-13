import {SociComponent, html} from './soci-component.js'

export default class SociComment extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
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
      }

      :host #actions {
        display: flex;
        font-weight: 500;
        font-size: 14px;
        padding-left: 52px;
        margin-top: 12px;
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

  connectedCallback(){
  }

  render(){
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
        <div id="view-replies">View 3 replies</div>
        <div id="vote-container">
          <div id="upvote-container">
            <div id="upvote">
              <soci-icon glyph="upvote"></soci-icon>
              <div id="score"></div>
            </div>
            <soci-icon glyph="downvote"></soci-icon>
          </div>
        </div>
      </div>
    `
  }
}
