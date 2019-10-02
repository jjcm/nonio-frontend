let user = {
  init: () => {
    user.dom = document.getElementById('user')
    user.dom.addEventListener('routeactivate', user.activate)
  },
  dom: null,
  activate: () => {
    console.log('hi')
    console.log(user.dom)
  },
  deactivate: () => {

  }
}

document.addEventListener('DOMContentLoaded', user.init)