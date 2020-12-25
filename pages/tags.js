let tags = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(tags)
  },
  onActivate: () => {
    tags.dom.innerHTML = ''
    let urlTags = window.location.hash.split('+').map(tag => tag.replace('#',''))
    let activeTags = Array.from(tags.dom.querySelectorAll('soci-column')).map(c => c.getAttribute('tag'))
    if(urlTags.toString() != activeTags.toString()){
      tags.dom.innerHTML = ''
      
      urlTags.forEach(tag=>{
        let column = document.createElement('soci-column')
        column.filter = 'all'
        column.tag = tag
        tags.dom.appendChild(column)
      })
    }
  },
  onDeactivate: () => {
    document.querySelector('soci-sidebar').activateTag('')
  }
}

tags.init()