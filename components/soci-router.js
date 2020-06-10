export default class SociRouter {

  constructor(){
    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('link', this.onHashChange.bind(this))
    this.onHashChange()
  }

  onPopState(e){
    this.onHashChange()
  }

  onHashChange(e){
    let path = window.location.pathname + window.location.hash
    path = path.slice(1)
    if(path == this._currentPath) return 0
    this._currentPath = path
    this.route(path, e && e.detail == 'fresh')
  }

  route(path, fresh){
    document.querySelectorAll('soci-route').forEach(route=>{
      if(route.test()){
        route.activate(fresh)
      } else route.deactivate()
    })

    document.querySelectorAll('soci-route[default]').forEach(defRoute => {
      let siblingsActivated = false
      let siblingRoutes = Array.from(defRoute.parentNode.children).filter(el => el!=defRoute && el.tagName == 'SOCI-ROUTE')

      siblingRoutes.forEach(sibling => {
        if(sibling.test()) siblingsActivated = true
      })

      if(!siblingsActivated) defRoute.activate()
    })
  }
}

/*
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
  */