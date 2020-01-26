import SociComponent from './soci-component.js'

export default class SociComment extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        margin-top: 4px;
        display: block;
        position: relative;
        padding: 10px 10px 5px 10px;
        border: 1px solid var(--n1);
        border-radius: 4px;
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
        margin-left: 18px;
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
        font-size: 11px;
        padding-left: 52px;
        margin-top: 6px;
        align-items: center;
        max-width: 900px;
        user-select: none;
      }
      
      #cancel-reply {
        display: none;
        cursor: pointer;
      }

      #actions.replying #cancel-reply {
        display: block;
      }

      #actions.replying #reply,
      #actions.replying #view-replies {
        display: none;
      }

      #view-replies {
        position: relative;
        margin-left: 14px;
        cursor: pointer;
      }

      #reply {
        cursor: pointer;
      }

      #reply:hover,
      #cancel-reply:hover,
      #view-replies:hover {
        text-decoration: underline;
      }

      #vote-container {
        display: flex;
        position: relative;
        margin-left: 8px;
      }

      #vote-container:after {
        content: '';
        display: block;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        background: var(--n2);
        position: absolute;
        top: 8px;
        right: -9px;
      }

      #upvote {
        display: flex;
        align-items: center;
        height: 20px;
        line-height: 20px;
        padding: 0 9px 0 2px;
        border-radius: 12px;
        font-size: 12px;
        background: var(--n1);
        cursor: pointer;
        user-select: none;
        --fill-color: transparent;
      }

      #upvote soci-icon {
        color: var(--n3);
        height: 20px;
        width: 20px;
      }
      
      #upvote:hover {
        background: var(--n2);
      }

      #upvote:active {
        filter: brightness(0.9);
      }

      #upvote[upvoted] {
        background: var(--g1);
        color: #fff;
        --fill-color: #fff;
      }

      #upvote:hover soci-icon {
        color: var(--n4);
      }

      #upvote[upvoted] soci-icon {
        color: transparent;

      }

      soci-icon[glyph=downvote] {
        cursor: pointer;
        color: var(--n3);
        --fill-color: transparent;
        height: 20px;
        width: 20px;
      }

      soci-icon[glyph=downvote]:hover {
        color: var(--n4);
      }
      soci-icon[glyph=downvote]:active {
        color: var(--n3);
        --fill-color: var(--n3);
      }

      soci-icon[glyph=downvote][downvoted] {
        color: var(--r2);
        --fill-color: var(--r2);
      }

      #replies {
        position: relative;
        overflow: hidden;
        height: 0;
        padding-left: 2px;
        opacity: 0;
        margin-top: 0;
        transition: all 0.1s ease-out, margin 0s linear;
        transform: translateY(-2px);
      }

      :host([expanded]) #replies {
        height: auto;
        opacity: 1;
        transform: translateY(0);
        margin-top: 4px;
      }

      #comment-reply {
        height: 0px;
        position: relative;
        overflow: hidden;
        transition: all 0.1s ease-out, margin 0s linear;
        margin-left: 3px;
        border: 1px solid transparent;
      }

      #comment-reply.active {
        margin-top: 12px;
        height: 200px;
        border: 1px solid #eee;
        border-radius: 4px;
      }
    `
  }

  html(){ return `
    <top>
      <soci-user size="large"></soci-user>
      <div id="vote-container">
        <div id="upvote" @click=_upvote>
          <soci-icon glyph="upvote"></soci-icon>
          <div id="score"></div>
        </div>
        <soci-icon glyph="downvote" @click=_downvote></soci-icon>
      </div>
      <time>0s ago</time>
    </top>
    <div id="comment">
      <slot></slot>
    </div>
    <div id="actions">
      <div id="reply" @click=_reply>reply</div>
      <div id="view-replies" @click=_toggleReplies></div>
      <div id="cancel-reply" @click=_cancelReply>cancel</div>
    </div>
    <div id="comment-reply"></div>
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

  connectedCallback(){
    let numberOfReplies = this.querySelectorAll('soci-comment').length
    if(numberOfReplies)
      this.select('#view-replies').innerHTML = `view ${this.querySelectorAll('soci-comment').length} replies`
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

  _reply(){
    let replyContainer = this.select('#comment-reply')
    replyContainer.innerHTML = '<soci-input></soci-input>'
    replyContainer.classList.add('active')

    this.select('#actions').classList.add('replying')
    if(!this.hasAttribute('expanded')) this._toggleReplies()
  }

  _cancelReply(){
    let replyContainer = this.select('#comment-reply')
    replyContainer.classList.remove('active')
    this.select('#actions').classList.remove('replying')
    setTimeout(()=>{
      replyContainer.innerHTML = ''
    }, 200)
  }

  _toggleReplies(e){
    this.toggleAttribute('expanded')
    console.log(this.hasAttribute('expanded'))
    let button = this.select('#view-replies')
    if(this.hasAttribute('expanded')){
      button.innerHTML = "hide replies"
    }
    else {
      button.innerHTML = `view ${this.querySelectorAll('soci-comment').length} replies`
    }
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
