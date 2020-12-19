let home = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(home)
  },
  onActivate: () => {
    document.title = "Nonio - A platform for creators"
  },
  onDeactivate: () => {
  }
}

document.addEventListener('DOMContentLoaded', home.init)