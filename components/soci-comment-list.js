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
        border-top: 1px solid var(--n2);
        box-sizing: border-box;
        height: 30px;
        line-height: 30px;
        padding: 0 14px 0 64px;
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
        margin-right: 2px;
      }
      content {
        display: block;
        padding: 0 12px 24px;
      }
      soci-input {
        min-height: 82px;
      }
      soci-input:focus-within {
        min-height: 200px;
        padding-bottom: 40px;
      }
      button-container {
        padding-top: 6px;
        max-width: 0;
        min-width: 0;
        overflow: hidden;
        position: relative;
        padding-left: 0;
        transition: all 0.1s var(--soci-ease);
      }
      button-container[active] {
        max-width: 60px;
        min-width: 52px;
        padding-left: 6px;
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
      <soci-input @focus=_onFocus @blur=_onBlur></soci-input>
      <controls>
        <filtering @click=_filter>
          <filter active>Top</filter>
          <filter>New</filter>
        </filtering>
        <comment-count>0 comments</comment-count>
        <button-container>
          <button>submit</button>
        </button-container>
      </controls>
      <content>
        <slot></slot>
      </content>
    `
  }

  static get observedAttributes() {
    return ['data']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'data':
        this.renderComments(newValue)
        break
    }
  }

  connectedCallback(){
    this.renderComments()
  }

  _onFocus(){
    this.select('button-container').setAttribute('active', '')
  }

  _onBlur(){
    if(this.select('soci-input').value == '{"ops":[{"insert":"\\n"}]}')
      this.select('button-container').removeAttribute('active')
  }

  _filter(e){
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

  async renderComments(){
    //data = await soci.getData('comments')
    let data = [
      {
        user: "pwnies",
        score: "1234",
        date: Date.now() - 100000,
        content: 'heyo im a comment this is amazing wow oh god Im so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means Im cutting off thousands of potential futures from my life',
        children: [
          {
            user: "pwnies",
            score: "1234",
            date: Date.now() - 10000000,
            content: 'heyo im a comment',
          }
        ]
      },
      {
        user: "pwnies",
        score: "1234",
        date: Date.now() - 100000,
        content: 'heyo im a comment this is amazing wow oh god Im so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means Im cutting off thousands of potential futures from my life',
        children: [
          {
            user: "pwnies",
            score: "1234",
            date: Date.now() - 10000000,
            content: 'heyo im a comment',
          }
        ]
      },
      {
        user: "pwnies",
        score: "1234",
        date: Date.now() - 100000,
        content: 'heyo im a comment this is amazing wow oh god Im so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means Im cutting off thousands of potential futures from my life',
        children: [
          {
            user: "pwnies",
            score: "1234",
            date: Date.now() - 10000000,
            content: 'heyo im a comment',
          }
        ]
      },
      {
        user: "pwnies",
        score: "1234",
        date: Date.now() - 100000,
        content: 'heyo im a comment this is amazing wow oh god Im so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means Im cutting off thousands of potential futures from my life',
        children: [
          {
            user: "pwnies",
            score: "1234",
            date: Date.now() - 10000000,
            content: 'heyo im a comment',
          }
        ]
      },
      {
        user: "pwnies",
        score: "1234",
        date: Date.now() - 100000,
        content: 'heyo im a comment this is amazing wow oh god Im so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means Im cutting off thousands of potential futures from my life',
        children: [
          {
            user: "pwnies",
            score: "1234",
            date: Date.now() - 10000000,
            content: 'heyo im a comment',
          }
        ]
      },
      {
        user: "pwnies",
        score: "1234",
        date: Date.now() - 100000,
        content: 'heyo im a comment this is amazing wow oh god Im so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means Im cutting off thousands of potential futures from my life',
        children: [
          {
            user: "pwnies",
            score: "1234",
            date: Date.now() - 10000000,
            content: 'heyo im a comment',
          }
        ]
      },
      {
        user: "pwnies",
        score: "1234",
        date: Date.now() - 100000,
        content: 'heyo im a comment this is amazing wow oh god Im so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means Im cutting off thousands of potential futures from my life',
        children: [
          {
            user: "pwnies",
            score: "1234",
            date: Date.now() - 10000000,
            content: 'heyo im a comment',
          }
        ]
      },
      {
        user: "pwnies",
        score: "1234",
        date: Date.now() - 100000,
        content: 'heyo im a comment this is amazing wow oh god Im so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means Im cutting off thousands of potential futures from my life',
        children: [
          {
            user: "pwnies",
            score: "1234",
            date: Date.now() - 10000000,
            content: 'heyo im a comment',
          }
        ]
      },
      {
        user: "pwnies",
        score: "123",
        date: Date.now() - 10000,
        content: 'heyo im a comment this is amazing wow oh god Im so bored what even is life how do I do this what steps do I take next there are so many decisions and each one means Im cutting off thousands of potential futures from my life',
        children: [
          {
            user: "pwnies",
            score: "1234",
            date: Date.now() - 100000,
            content: 'heyo im a comment',
            children: [
              {
                user: "pwnies",
                score: "1234",
                date: Date.now() - 100000,
                content: 'heyo im a comment',
              },
              {
                user: "pwnies",
                score: "1234",
                date: Date.now() - 100000,
                content: 'heyo im a comment',
              },
            ]
          },
          {
            user: "pwnies",
            score: "1234",
            date: Date.now(),
            content: 'heyo im a comment',
          },
          {
            user: "pwnies",
            score: "1234",
            date: Date.now(),
            content: 'heyo im a comment',
          }
        ]
      },
    ]

    this.innerHTML = this.createComments(data)

  }

  createComments(comments){
    return `
      ${comments.map((comment) => `
        <soci-comment user=${comment.user} score=${comment.score} date=${comment.date}>
          ${comment.content}
          <div slot="replies">
            ${this.recurseComments(comment)}
          </div>
        </soci-comment>
      `).join('')}
    `
  }

  recurseComments(comment){
    if(comment.children){
      return this.createComments(comment.children)
    }
  }
}
