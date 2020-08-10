import SociComponent from './soci-component.js'

export default class SociCommentList extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: block;
        background: linear-gradient(var(--n2) 0px, var(--n1) 1px, #fff 30px);
      }
      controls {
        display: flex;
        width: 100%;
        max-width: 840px;
        margin: 0 auto;
        justify-content: space-between;
        color: var(--n3);
        font-weight: 500;
        font-size: 12px;
        box-sizing: border-box;
        height: 30px;
        line-height: 30px;
        padding: 0 22px 0 14px;
      }
      filtering {
        display: flex;
      }
      filter {
        margin-left: 32px;
        position: relative;
        cursor: pointer;
      }
      filter:hover,
      filter[active] {
        color: var(--n4);
      }
      filter[active]:after {
        content: '';
        display: block;
        position: absolute;
        top: -2px;
        left: calc(50% - 8px);
        width: 16px;
        height: 4px;
        border-radius: 2px;
        background: var(--n4);
      }
      comment-count {
        white-space: nowrap;
        margin-right: 6px;
      }
      content {
        display: block;
        padding: 0 8px 24px;
        max-width: 840px;
        margin: 0 auto;
      }
      soci-input {
        min-height: 82px;
        border: 1px solid #eee;
        border-radius: 4px;
        margin: 8px 18px;
        max-width: 840px;
        margin: 2px auto 20px;
      }
      comment-input[active] soci-input {
        min-height: 200px;
        padding-bottom: 40px;
        margin-bottom: 8px;
      }
      button-container {
        display: block;
        height: 0;
        overflow: hidden;
        position: relative;
        padding-left: 12px;
        transition: all 0.1s var(--soci-ease);
        max-width: 840px;
        margin: 0 auto;
      }
      comment-input[active] button-container {
        height: 20px;
      }
    `
  }

  html(){ return `
      <controls>
        <comment-count>0 comments</comment-count>
        <filtering @click=_filter>
          <filter active>Top</filter>
          <filter>New</filter>
        </filtering>
      </controls>
      <comment-input>
        <soci-input @focus=_onFocus ></soci-input>
        <button-container>
          <soci-button @click=cancelComment subtle>cancel</soci-button>
          <soci-button id="submit" @click=addComment async>submit</soci-button>
        </button-container>
      </comment-input>
      <content>
        <slot></slot>
      </content>
    `
  }

  static get observedAttributes() {
    return ['url']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'url':
        this.renderComments(newValue)
        break
    }
  }

  _onFocus(){
    this.select('comment-input').toggleAttribute('active', true)
  }

  cancelComment(){
    this.select('soci-input').clear()
    this.select('comment-input').toggleAttribute('active', false)
  }

  _filter(e){
    if(e.target.tagName != 'FILTER') return 0
    let current = this.select('filter[active]')
    if(current) current.removeAttribute('active')
    e.target.toggleAttribute('active')

    let filteredAttr = e.target.innerHTML == 'Top' ? 'score' : 'date'
    let comments = Array.from(this.children)
    comments = comments.sort((a,b)=>{
      return parseInt(b.getAttribute(filteredAttr)) - parseInt(a.getAttribute(filteredAttr))
    })
    this.innerHTML = ''
    comments.forEach(comment => this.appendChild(comment))
  }

  async renderComments(url){
    let data = await this.getData('/comments/post/' + url)
    let comments = data.comments

    comments.forEach(comment => {
      let newComment = document.createElement('soci-comment')
      newComment.setAttribute('user', comment.user)
      newComment.setAttribute('score', comment.upvotes - comment.downvotes)
      newComment.setAttribute('date', comment.date)
      newComment.setAttribute('comment-id', comment.id)
      newComment.content = comment.content

      let parent = comment.parent > 0 ? this.querySelector(`soci-comment[comment-id="${comment.parent}"] div[slot="replies"]`) : this
      parent.appendChild(newComment)
    })
  }

  addComment(){
    this.postData('/comment/create', {
      post: this.url,
      content: this.select('soci-input').value
    }).then(res=>{
      if(res.id){
        this.select('#submit').success()
        this.cancelComment()
      }
      else {
        this.select('#submit').error()
      }
    })
  }

  get url(){
    return this.getAttribute('url')
  }
}
