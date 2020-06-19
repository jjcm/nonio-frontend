import SociComponent from './soci-component.js'

export default class SociComment extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        --border-color: transparent
        margin-top: 4px;
        display: block;
        position: relative;
        padding: 0px 12px; 
        margin: 12px 0 8px;
      }

      :host(:last-child) {
        margin-bottom: 0;
      }

      comment {
        display: block;
        position: relative;
      }

      comment:after {
        content: '';
        height: 100%;
        width: 2px;
        left: -12px;
        top: 0;
        position: absolute;
        display: block;
        background-color: var(--border-color);
        border-radius: 1px;
      }

      top {
        display: flex;
        align-items: flex-start;
      }

      soci-user {
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
        margin-top: 4px;
        font-size: 14px;
        max-width: 900px;
      }

      #actions {
        display: flex;
        font-weight: 500;
        font-size: 11px;
        margin-top: 6px;
        align-items: center;
        max-width: 900px;
        user-select: none;
      }

      #actions.replying {
        margin-top: 0;
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
        padding-right: 6px;
        border-radius: 3px;
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
      }

      :host([expanded]) #replies {
        height: auto;
      }

      #comment-reply {
        height: 0px;
        position: relative;
        overflow: hidden;
        border: 1px solid transparent;
      }

      #comment-reply.active {
        margin-top: 10px;
        height: auto;
      }

      #comment-reply.active actions {
        display: flex;
        margin: 4px 0 8px;
      }

      #comment-reply.active actions button {
        border: 0;
        border-radius: 3px;
        background: var(--b2);
        height: 20px;
        color: #fff;
        padding: 0 8px;
        font-size: 12px;
        margin-right: 4px;
        cursor: pointer;
      }

      #comment-reply.active actions button.cancel {
        background: var(--n1);
        color: var(--n4);
      }

      #comment-reply.active actions button:hover {
        filter: brightness(0.95);
      }

      #comment-reply.active actions button:focus,
      #comment-reply.active actions button:active {
        filter: brightness(0.9);
        outline: 0;
      }

      soci-input:not([readonly]) {
        border: 1px solid #eee;
        border-radius: 4px;
        min-height: 140px;
      }


    `
  }

  html(){ return `
    <comment>
      <top>
        <soci-user size="small"></soci-user>
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
        <soci-input readonly></soci-input>
        <slot></slot>
      </div>
      <div id="actions">
        <div id="reply" @click=_reply>reply</div>
        <div id="view-replies" @click=_toggleReplies></div>
      </div>
    </comment>
    <div id="comment-reply"></div>
    <div id="replies">
      <slot name="replies">
      </slot>
    </div>
    <guide></guide>
  `}

  static get observedAttributes() {
    return ['score', 'user', 'replies', 'date', 'content']
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
      case 'content':
        this.select('soci-input').value = newValue
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
    replyContainer.innerHTML = '<soci-input show-user placeholder="Enter reply"></soci-input><actions><button>submit</button><button class="cancel">cancel</button></actions>'
    replyContainer.querySelector('.cancel').addEventListener('click', this._cancelReply.bind(this))
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
