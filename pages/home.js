let home = {
  init: () => {
  },
  onActivate: () => {
    document.title = "Nonio - A platform for creators"

  },
  onDeactivate: () => {
  }
}

soci.registerPage(home, document.currentScript.closest('soci-route'))