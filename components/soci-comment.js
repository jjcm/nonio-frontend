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

      top {
        display: flex;
        align-items: flex-start;
      }

      soci-user {
        color: var(--brand-text);
      }

      time {
        color: var(--base-text-subtle);
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
        color: var(--base-text-subtle);
      }

      #actions > div {
        cursor: pointer;
      }

      #actions > div:hover {
        text-decoration: underline;
      }

      #actions .confirmable:hover {
        text-decoration: none;
      }

      #actions > div:not(:first-child) {
        margin-left: 12px;
      }

      #actions.replying {
        display: none;
      }

      #view-replies {
        position: relative;
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
        background: var(--base-text-subtle);
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
        background: var(--base-background-subtle);
        cursor: pointer;
        user-select: none;
        --fill-color: transparent;
        margin-right: 2px;
      }

      #upvote soci-icon {
        color: var(--base-text-subtle);
        height: 20px;
        width: 20px;
      }
      
      #upvote:hover {
        background: var(--base-background-subtle-hover);
        color: var(--base-text-subtle-hover);
      }

      #upvote:active {
        filter: brightness(0.9);
      }

      #upvote[upvoted] {
        background: var(--success-background);
        color: var(--base-text-inverse);
        --fill-color: var(--base-text-inverse);
      }

      #upvote[upvoted] soci-icon {
        color: transparent;

      }

      soci-icon[glyph=downvote] {
        cursor: pointer;
        color: var(--base-text-subtle);
        --fill-color: transparent;
        height: 20px;
        width: 20px;
      }

      soci-icon[glyph=downvote]:hover {
        color: var(--base-text-subtle-hover);
      }
      soci-icon[glyph=downvote]:active {
        color: var(--base-text-subtle-active);
        --fill-color: var(--base-text-subtle-active);
      }

      soci-icon[glyph=downvote][downvoted] {
        color: var(--error-text);
        --fill-color: var(--error-text);
      }

      #replies {
        position: relative;
        overflow: hidden;
        height: 0;
        height: auto;
      }

      .confirmable {
        display: flex;
      }

      .confirmable[active] > span:hover {
        text-decoration: none;
      }

      .confirmable span:hover {
        text-decoration: underline;
      }

      .confirm-controls {
        display: none;
      }

      .confirmable[active] .confirm-controls {
        display: flex;
        margin-left: 4px;
      }

      .confirm-controls span:first-child {
        margin-right: 4px;
        color: var(--error-text);
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
        background: var(--brand-background);
        color: var(--base-text-inverse);
        height: 20px;
        padding: 0 8px;
        font-size: 12px;
        margin-right: 4px;
        cursor: pointer;
      }

      #comment-reply.active actions button:hover {
        background: var(--brand-background-hover);
      }

      #comment-reply.active actions button.cancel {
        background: var(--base-background-subtle);
        color: var(--base-text-subtle);
      }

      #comment-reply.active actions button.cancel:hover {
        background: var(--base-background-subtle-hover);
        color: var(--base-text-subtle-hover);
      }


      #comment-reply.active actions button:focus,
      #comment-reply.active actions button:active {
        filter: brightness(0.9);
        outline: 0;
      }

      soci-input:not([readonly]) {
        border: 1px solid var(--base-background-subtle);
        border-radius: 4px;
        min-height: 140px;
      }

      :host(:not([self])) .user-control {
        display: none;
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
        <slot name="content"></slot>
      </div>
      <div id="actions">
        <div id="reply" @click=_reply>reply</div>
        <div id="view-replies" @click=_toggleReplies></div>
        <div id="edit" class="user-control" @click=_edit>edit</div>
        <div id="delete" class="user-control confirmable">
          <span @click=_promptDelete>delete</span>
          <div class="confirm-controls">
            <span @click=_delete>yes</span>
            <span @click=_cancelDelete>no</span>
          </div>
        </div>
        <div id="abandon" class="user-control confirmable">
          <span @click=_promptAbandon>abandon</span>
          <div class="confirm-controls">
            <span @click=_abandon>yes</span>
            <span @click=_cancelAbandon>no</span>
          </div>
        </div>
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
        this.toggleAttribute('self', newValue == soci.username) 
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

    this.innerHTML = '<soci-quill-view slot="content"></soci-quill-view><div slot="replies"></div>'
    this._renderContent()

    let user = this.select('soci-user')
    user.toggleAttribute('op', user.getAttribute('name') == this.closest('soci-post')?.getAttribute('user')) 
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

  get content() {
    return this._content
  }

  set content(val){
    this._content = val
    this._renderContent()
  }

  get url(){
    return this.closest('soci-comment-list').getAttribute('url')
  }

  _renderContent(){
    let contentContainer = this.querySelector('soci-quill-view[slot="content"]')
    contentContainer?.render(this._content)
  }

  _reply(){
    let replyContainer = this.select('#comment-reply')
    replyContainer.innerHTML = '<soci-input placeholder="Enter reply"></soci-input><actions><button>submit</button><button class="cancel">cancel</button></actions>'
    replyContainer.querySelector('.cancel').addEventListener('click', this._cancelReply.bind(this))
    replyContainer.querySelector('button').addEventListener('click', this._submitReply.bind(this))
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

  _submitReply(){
    console.log(this)
    this.postData('/comment/create', {
      post: this.url,
      content: this.select('soci-input').value,
      parent: parseInt(this.getAttribute('comment-id'))
    })
  }

  _delete(){
    this.postData('/comment/delete', {
      id: parseInt(this.getAttribute('comment-id'))
    })
    
    this.remove()
  }

  _cancelDelete(){
    this.select('#delete').toggleAttribute('active', false)
    this.select('#delete span').innerHTML = 'delete'
  }

  _promptDelete(){
    this.select('#delete').toggleAttribute('active', true)
    this.select('#delete span').innerHTML = 'confirm delete?'
  }

  _abandon(){
    this.postData('/comment/abandon', {
      id: parseInt(this.getAttribute('comment-id'))
    })

    this.setAttribute('user', 'Anonymous coward')
    this.toggleAttribute('self', false)
  }

  _cancelAbandon(){
    this.select('#abandon').toggleAttribute('active', false)
    this.select('#abandon span').innerHTML = 'abandon'
  }

  _promptAbandon(){
    this.select('#abandon').toggleAttribute('active', true)
    this.select('#abandon span').innerHTML = 'confirm abandon?'
  }

  _edit(){
    //todo
  }
}