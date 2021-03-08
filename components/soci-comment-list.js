import SociComponent from './soci-component.js'

export default class SociCommentList extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: block;
        background: linear-gradient(var(--shadow-dark) 0px, var(--shadow-light) 1px, var(--base-background) 30px);
      }
      controls {
        display: flex;
        width: 100%;
        max-width: 840px;
        margin: 0 auto;
        justify-content: space-between;
        color: var(--base-text-subtle);
        font-weight: 500;
        font-size: 12px;
        box-sizing: border-box;
        height: 30px;
        line-height: 30px;
        padding: 0 22px;
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
        color: var(--base-text);
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
        background: var(--base-background);
        box-shadow: 0 1px 1px var(--shadow-light);
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
        box-sizing: border-box;
      }
      soci-input {
        min-height: 82px;
        border: 1px solid var(--base-background-subtle);
        border-radius: 4px;
        margin: 2px auto 20px;
      }
      comment-input {
        display: block;
        padding: 0 18px;
        max-width: 840px;
        box-sizing: border-box;
        margin: 0 auto;
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
      let newComment = this.commentFactory(comment.user, comment.upvotes - comment.downvotes, comment.date, comment.id, comment.content)
      let parent = comment.parent > 0 ? this.querySelector(`soci-comment[comment-id="${comment.parent}"] div[slot="replies"]`) : this
      parent.appendChild(newComment)
    })
  }

  addComment(){
    let value = this.select('soci-input').value
    this.postData('/comment/create', {
      post: this.url,
      content: value
    }).then(res=>{
      if(res.id){
        this.select('#submit').success()
        let comment = this.commentFactory(res.user, 0, res.date, res.id, res.content)
        // This chaos here is to animate in a comment
        comment.style.position = "absolute"
        comment.style.transition = 'all 0.1s ease-out 0.1s, transform 0.4s ease-in-out, opacity 0.4s ease-in-out'
        comment.style.margin = '0'
        comment.style.overflow = 'hidden'
        comment.style.opacity = '0'
        comment.style.transform = "translateY(-32px)"
        this.prepend(comment)
        setTimeout(()=>{
          let finalHeight = comment.offsetHeight
          comment.style.position = ''
          comment.style.height = '0'
          setTimeout(()=>{
            comment.style.height = finalHeight + 'px'
            comment.style.margin = ''
            comment.style.opacity = 1
            comment.style.transform = 'translateY(0)'
            setTimeout(()=>{
              comment.style.height = ''
              this.cancelComment()
            }, 100)
          }, 1)
        }, 1)
      }
      else {
        this.select('#submit').error()
      }
    })
  }

  commentFactory(user, score, date, id, content){
    let comment = document.createElement('soci-comment')
    comment.setAttribute('user', user)
    comment.setAttribute('score', score)
    comment.setAttribute('date', date)
    comment.setAttribute('comment-id', id)
    comment.content = content
    return comment
  }

  get url(){
    return this.getAttribute('url')
  }
}
