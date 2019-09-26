import {SociComponent, html, render} from './soci-component.js'
import config from '../config.js'

export default class SociRouter extends SociComponent {
  constructor() {
    super()
  }


  css(){
    return `
      :host {
        display: contents;
      }
    `
  }

  connectedCallback(){
    let details = this.getDetailsFromUrl()
    history.replaceState(details, '', document.location.pathname + document.location.hash)
    window.addEventListener('popstate', this.onPopState)
  }

  getDetailsFromUrl(){
    let tags = window.location.hash.replace('#','').split('+')
    tags = tags.filter(Boolean)

    let postUrl = window.location.pathname.replace(config.BASE_URL, '')
    if(postUrl.charAt(postUrl.length - 1) == '/') postUrl = postUrl.slice(0,-1)
    return {tags: tags, post: postUrl}
  }

  onPopState(e){
    console.log(e.state)
    if(e.state.post == '/') {
      let post = document.querySelector('soci-post')
      if(post) post.close()
    }
  }

  render(){
    return html`
      ${this.getCss()}
      <slot></slot>
    `
  }
}
