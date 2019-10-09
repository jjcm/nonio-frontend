let user = {
  init: () => {
  },
  onActivate: () => {
    console.log('ayy')
  },
  onDeactivate: () => {
  }
}

soci.registerPage(user, document.currentScript.closest('soci-route'))