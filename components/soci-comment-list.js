import {SociComponent, html, render} from './soci-component.js'

export default class SociCommentList extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host controls {
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
        padding: 0 34px 0 64px;
        background: linear-gradient(var(--n1), #fff);
      }
      :host filtering {
        display: flex;
      }
      :host filter {
        margin-right: 32px;
        position: relative;
        cursor: pointer;
      }
      :host filter:hover,
      :host filter[active] {
        color: var(--n4);
      }
      :host filter[active]:after {
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
      :host content {
        display: block;
        padding: 0 24px 24px 12px;
      }
      :host soci-input {
        min-height: 82px;
      }
      :host soci-input:focus-within {
        min-height: 200px;
        padding-bottom: 40px;
      }

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

  _filter(e){
    let current = this.select('filter[active]')
    if(current) current.removeAttribute('active')
    e.currentTarget.toggleAttribute('active')

    let filteredAttr = e.currentTarget.innerHTML == 'Top' ? 'score' : 'date'
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

    render(this.createComments(data), this)
  }

  createComments(comments){
    return html`
      ${comments.map((comment) => html`
        <soci-comment user=${comment.user} score=${comment.score} date=${comment.date}>
          ${comment.content}
          <div slot="replies">
            ${this.recurseComments(comment)}
          </div>
        </soci-comment>
      `)}
    `
  }

  recurseComments(comment){
    if(comment.children){
      return this.createComments(comment.children)
    }
  }

  render(){
    this._filter = this._filter.bind(this)
    return html`
      ${this.getCss()}
      <soci-input></soci-input>
      <controls>
        <filtering>
          <filter @click=${this._filter} active>Top</filter>
          <filter @click=${this._filter}>New</filter>
        </filtering>
        <comment-count>0 comments</comment-count>
      </controls>
      <content>
        <slot></slot>
      </content>
    `
  }
}
