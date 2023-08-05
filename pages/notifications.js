let notifications = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(notifications)
  },
  onActivate: () => {
    notifications.dom.querySelector('header').addEventListener('click', user.tabClick)
  },
  tabClick: e => {
    if(e.target.className.match(/type|sort/)){
      let container = notifications.dom.querySelector('.inner-content')
      e.target.parentElement.querySelector('[selected]').removeAttribute('selected')
      e.target.toggleAttribute('selected', true)

      if(e.target.innerHTML == "unread")
        container.innerHTML = `<soci-user-comment-list data="/notifications?unread=true"></soci-user-comment-list>`
      else 
        container.innerHTML = `<soci-user-comment-list data="/notifications"></soci-user-comment-list>`
    }
  }
}

document.addEventListener('DOMContentLoaded', notifications.init)