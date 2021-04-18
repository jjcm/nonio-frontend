import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociUserComment extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: block;
        padding: 12px;
        margin: 8px 0;
        border-radius: 8px;
        background: var(--base-background);
        box-shadow: 0px 1px 3px var(--shadow);
      }

      #post {
        display: flex;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--base-background-subtle-hover);
      }

      img {
        width: 48px;
        min-width: 48px;
        height: 36px;
        border-radius: 3px;
        object-fit: cover;
        margin-right: 12px;
      }

      .container {
        display: flex;
        align-items: center;
      }

      #title {
        font-size: 16px;
        color: var(--base-text-bold);
        letter-spacing: -0.08px;
        line-height: 20px;
        width: 100%;
        max-height: 72px;
        font-weight: 600;
        margin-bottom: 8px;
        margin-top: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `
  }

  html(){ return `
    <soci-link id="post">
      <div class="container">
        <img id="thumbnail"/>
        <div id="title"></div>
      </div>
    </soci-link>
    <slot></slot>
  `}

  static get observedAttributes() {
    return ['url', 'title', 'score', 'user', 'replies', 'date', 'content']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'url':
        this.select('#post').setAttribute('href', '/' + newValue)
        this.select('img').setAttribute('src', `${config.THUMBNAIL_HOST}/${newValue}.webp`)
        break
      case 'title':
        this.select('#title').innerHTML = newValue
        break
      default:
        this.querySelector('soci-comment').setAttribute(name, newValue)
        break
    }
  }

  factory(user, score, lineageScore, date, id, content, edited, postUrl, postTitle){
    let userComment = document.createElement('soci-user-comment')
    userComment.setAttribute('url', postUrl)
    userComment.setAttribute('title', postTitle)

    let comment = document.createElement('soci-comment')
    comment = comment.factory(user, score, lineageScore, date, id, content, edited)
    userComment.appendChild(comment)
    return userComment
  }
}