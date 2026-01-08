let tags = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(tags)
  },
  onActivate: () => {
    tags.dom.innerHTML = ''
    let tag = window.location.hash.replace('#', '').split('+')[0]
    if(tag == '') tag = 'all'

    let community = window.soci.routeContext.community

    let list = document.createElement('soci-post-list')
    list.setAttribute('tag', decodeURIComponent(tag))
    if(community) list.setAttribute('community', community)
    tags.dom.appendChild(list)
  },
  onDeactivate: () => {
    document.querySelector('soci-sidebar').activateTag('')
  }
}

tags.init()