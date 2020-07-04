let tags = {
  init: () => {
  },
  onActivate: () => {
    tags.dom.innerHTML = ''
    console.log('activate')
    let urlTags = window.location.hash.split('+').map(tag => tag.replace('#',''))
    console.log(urlTags)
    let activeTags = Array.from(tags.dom.querySelectorAll('soci-column')).map(c => c.getAttribute('tag'))
    console.log(activeTags)
    if(urlTags.toString() != activeTags.toString()){
      tags.dom.innerHTML = ''
      
      urlTags.forEach(tag=>{
        let column = document.createElement('soci-column')
        column.filter = 'all'
        column.tag = tag
        column.color = 'purple'
        tags.dom.appendChild(column)
      })
    }
  },
  onDeactivate: () => {
  }
}

soci.registerPage(tags, document.currentScript.closest('soci-route'))