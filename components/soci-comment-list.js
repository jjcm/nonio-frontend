import SociComponent from './soci-component.js'

export default class SociCommentList extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      controls {
        display: flex;
        width: 100%;
        justify-content: space-between;
        color: var(--n3);
        font-weight: 500;
        font-size: 12px;
        box-sizing: border-box;
        height: 30px;
        line-height: 30px;
        padding: 0 14px 0 22px;
        background: linear-gradient(var(--n1), #fff);
      }
      filtering {
        display: flex;
        width: 100%;
      }
      filter {
        margin-right: 32px;
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
        padding: 0 6px 24px;
      }
      soci-input {
        min-height: 82px;
        border: 1px solid #eee;
        border-radius: 4px;
        margin: 8px 18px;
      }
      soci-input:focus-within {
        min-height: 200px;
        padding-bottom: 40px;
      }
      button-container {
        display: block;
        height: 0;
        overflow: hidden;
        position: relative;
        padding-left: 12px;
        transition: all 0.1s var(--soci-ease);
      }
      button-container[active] {
        height: 20px;
        margin-bottom: 16px;
      }
      button {
        border: 0;
        border-radius: 10px;
        background: var(--b2);
        height: 20px;
        color: #fff;
        padding: 0 8px;
        font-size: 12px;
      }
      button:focus {
        outline: 0;
        box-shadow: 0 0 0 2px var(--b1);
      }
      button:active {
        box-shadow: none;
        background: var(--b3);
      }
    `
  }

  html(){ return `
      <controls>
        <filtering @click=_filter>
          <filter active>Top</filter>
          <filter>New</filter>
        </filtering>
        <comment-count>0 comments</comment-count>
      </controls>
      <soci-input @focus=_onFocus @blur=_onBlur></soci-input>
      <button-container>
        <button @click=addComment>submit</button>
      </button-container>
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
    this.select('button-container').setAttribute('active', '')
  }

  _onBlur(){
    if(this.select('soci-input').value == '{"ops":[{"insert":"\\n"}]}')
      this.select('button-container').removeAttribute('active')
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
    console.log(url)
    let data = await this.getData('/comments/post/' + url)
    let comments = data.comments

    comments.forEach(comment => {
      let newComment = document.createElement('soci-comment')
      newComment.setAttribute('user', comment.user)
      newComment.setAttribute('score', comment.upvotes - comment.downvotes)
      newComment.setAttribute('date', comment.date)
      newComment.setAttribute('comment-id', comment.id)
      newComment.content = comment.content

      this.appendChild(newComment)
    })

    //this.innerHTML = this.createComments(comments)

  }

  createComments(comments){
    let renderer = document.createElement('soci-input')
    renderer.style.display = 'none'
    document.body.appendChild(renderer)

    let html = `
      ${comments.map((comment) => `
        <soci-comment user=${comment.user} score=${comment.upvotes - comment.downvotes} date=${comment.date} comment-id=${comment.id} parent-id=${comment.parent}>
          ${renderer.renderOpsToHTML(comment.content)}
          <div slot="replies">
            ${this.recurseComments(comment)}
          </div>
        </soci-comment>
      `).join('')}
    `

    renderer.remove()
    return html
  }

  recurseComments(comment){
    return comment.children ? this.createComments(comment.children) : ''
  }

  addComment(){
    this.postData('/comment/create', {
      post: this.url,
      content: this.select('soci-input').value
    })
  }

  get url(){
    return this.getAttribute('url')
  }
}
