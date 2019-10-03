let soci = {
  init: () => {
    console.log('soci init')

  },
  registerPage: (page, dom) => {
    page.dom = document.querySelector(dom)
    if(page.activate) page.dom.addEventListener('routeactivate', page.activate)
    if(page.deactivate) page.dom.addEventListener('routedeactivate', page.deactivate)
    page.init()
  }
}

document.addEventListener('DOMContentLoaded', soci.init)