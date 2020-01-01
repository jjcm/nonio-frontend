import SociComponent from './soci-component.js'
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
    window.addEventListener('link', this.onHashChange.bind(this))
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
    this.onHashChange()
  }

  onHashChange(e){
    let path = window.location.pathname.replace(config.BASE_URL, '') + window.location.hash
    path = path.slice(1)
    if(path == this._currentPath) return 0
    this._currentPath = path
    this.route(path, e && e.detail == 'refresh')
  }

  route(path, refresh){
    let matchFound = false
    this.querySelectorAll('soci-route').forEach(route=>{
      if(!matchFound && route.pattern.test(path)){
        matchFound = true
        route.activate(refresh)
      } else route.deactivate()
    })
  }
}
