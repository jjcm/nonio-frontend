import SociComponent from './soci-component.js'

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

      top {
        display: flex;
        align-items: flex-start;
      }

      soci-user {
        --avatar-size: 40px;
        --font-size: 12px;
        --font-weight: normal;
        --line-height: 18px;
        color: var(--b3);
      }

      time {
        color: var(--n3);
        display: inline;
        font-size: 12px;
        line-height: 18px;
        margin-left: 8px;
      }

      #comment {
        padding-left: 52px;
        margin-top: -18px;
        font-size: 14px;
        max-width: 900px;
      }

      #actions {
        display: flex;
        font-weight: 500;
        font-size: 14px;
        padding-left: 52px;
        margin-top: 12px;
        align-items: center;
        max-width: 900px;
      }

      #view-replies {
        position: relative;
        margin-left: 32px;
        cursor: pointer;
      }

      #reply {
        cursor: pointer;
      }

      #reply:hover,
      #view-replies:hover {
        text-decoration: underline;
      }


      #view-replies:after {
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

      #vote-container {
        display: flex;
        margin-left: auto;
      }

      #upvote {
        display: flex;
        align-items: center;
        height: 24px;
        padding: 0 9px 0 2px;
        border-radius: 12px;
        background: var(--n1);
        cursor: pointer;
        user-select: none;
        --fill-color: transparent;
      }

      #upvote soci-icon {
        color: var(--n3);
      }
      
      #upvote:hover {
        background: var(--n2);
      }

      #upvote[upvoted],
      #upvote:active {
        background: var(--g1);
        color: #fff;
        --fill-color: #fff;
      }

      #upvote:hover soci-icon {
        color: var(--n4);
      }

      #upvote[upvoted] soci-icon,
      #upvote:active soci-icon {
        color: transparent;

      }

      soci-icon[glyph=downvote] {
        cursor: pointer;
        color: var(--n3);
        --fill-color: transparent;
      }

      soci-icon[glyph=downvote]:hover {
        color: var(--n4);
      }

      soci-icon[glyph=downvote][downvoted],
      soci-icon[glyph=downvote]:active {
        color: var(--r2);
        --fill-color: var(--r2);
      }

      #replies {
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
      guide {
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

  html(){ return `
    <top>
      <soci-user size="large"></soci-user>
      <time>0s ago</time>
    </top>
    <div id="comment">
      <slot></slot>
    </div>
    <div id="actions">
      <div id="reply">Reply</div>
      <div id="view-replies" @click=_toggleReplies></div>
      <div id="vote-container">
        <div id="upvote" @click=_upvote>
          <soci-icon glyph="upvote"></soci-icon>
          <div id="score"></div>
        </div>
        <soci-icon glyph="downvote" @click=_downvote></soci-icon>
      </div>
    </div>
    <div id="replies">
      <slot name="replies">
      </slot>
    </div>
    <guide></guide>
  `}

  static get observedAttributes() {
    return ['score', 'user', 'replies', 'date']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'score':
        this.select('#score').innerHTML = newValue
        break
      case 'user':
        this.select('soci-user').setAttribute('name', newValue)
        break
      case 'date':
        this.updateTime(newValue, this.select('time'))
        break
    }
  }

  _toggleReplies(e){
    this.toggleAttribute('expanded')
    let button = e.currentTarget
    if(this.hasAttribute('expanded')){
      button.innerHTML = "Hide replies"
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

    if(this.hasAttribute('date')) this.updateTime(this.getAttribute('date'), this.select('time'))
  }

  disconnectedCallback(){
    if(this._updateTimer){
      clearTimeout(this._updateTimer)
    } 
  }

  get score(){
    return parseInt(this.getAttribute('score'))
  }

  set score(val){
    this.setAttribute('score', val)
  }

  _upvote(){
    let upvote = this.select('#upvote')
    let downvote = this.select('soci-icon[glyph="downvote"]')
    upvote.toggleAttribute('upvoted')
    if(upvote.hasAttribute('upvoted')){
      this.score += downvote.hasAttribute('downvoted') ? 2 : 1
      downvote.removeAttribute('downvoted')
    }
    else {
      this.score--
    }
  }

  _downvote(){
    let upvote = this.select('#upvote')
    let downvote = this.select('soci-icon[glyph="downvote"]')
    downvote.toggleAttribute('downvoted')
    if(downvote.hasAttribute('downvoted')){
      this.score -= upvote.hasAttribute('upvoted') ? 2 : 1
      upvote.removeAttribute('upvoted')
    }
    else {
      this.score++
    }
  }

}
