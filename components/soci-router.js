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
    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    this.onHashChange()
  }

  getDetailsFromUrl(){
    let tags = window.location.hash.replace('#','').split('+')
    tags = tags.filter(Boolean)

    let postUrl = window.location.pathname.replace(config.BASE_URL, '')
    if(postUrl.charAt(postUrl.length - 1) == '/') postUrl = postUrl.slice(0,-1)
    return {tags: tags, post: postUrl}
  }

  onPopState(e){
    console.log('pop state')
    /*
    if(e.state.post == '/') {
      let post = document.querySelector('soci-post')
      if(post) post.close()
    }
    */

    this.onHashChange()
  }

  onHashChange(e){
    let path = window.location.pathname.replace(config.BASE_URL, '') + window.location.hash
    path = path.slice(1)
    console.log(path)
    this.route(path)
  }

  route(path){
    switch(true){
      case path.length == 0: 
        console.log('home')
        break
      case /^#/.test(path): 
        console.log('postslists')
        break
      case /^settings/.test(path):
        console.log('settings')
        break
      default: 
        console.log('page')
        break
    }

  }

  render(){
    return html`
      ${this.getCss()}
      <slot></slot>

      <sidebar>
        <slot name="sidebar">
      </sidebar>
      <main>
        <slot name="postlists"></slot>
        <slot name="post"></slot>
        <slot name="settings"></slot>
        <slot name="404"></slot>
      </main>
    `
  }
}
