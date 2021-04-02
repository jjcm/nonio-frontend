let user = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(user)
  },
  onActivate: () => {
    let username = document.location.pathname.slice(6)

    document.querySelectorAll('#user soci-user').forEach(user => {
      user.setAttribute('name', username)
    })

    if(username == soci.username){
      user.showPersonalControls()
    }

    let myPosts = document.querySelector('#user soci-post-list')
    myPosts.setAttribute('data', `/posts?user=${username}`)
    //document.querySelector('#user .password soci-button').addEventListener('click', user.changePassword)
    //document.querySelector('#user soci-tab[name="Financials"]').addEventListener('tabactivate', user.checkFinancials)

    user.dom.querySelector('header').addEventListener('click', user.tabClick)

    user.checkInfo()
  },
  tabClick: e => {
    if(e.target.className == 'type') {
      let container = user.dom.querySelector('.inner-content')
      let username = document.location.pathname.slice(6)
      e.target.parentElement.querySelector('[selected]').removeAttribute('selected')
      e.target.toggleAttribute('selected', true)
      if(e.target.innerHTML == 'Posts') {
        container.innerHTML = `<soci-post-list data="/posts?user=${username}"></soci-post-list>`
      }
      else {
        container.innerHTML = `<soci-user-comment-list user="${username}"></soci-post-list>`
      }
    }
  },
  showPersonalControls: () => {

  },
  checkInfo: async () => {
    let username = document.location.pathname.slice(6)
    let response = await soci.getData(`users/${username}`)

    for (var property in response){
      let dom = user.dom.querySelector(`.sidebar [value="${property}"]`)
      if(property == 'description') dom.value = response[property]
      else dom.innerHTML = response[property]
    }
  }
}

user.dom.querySelector('soci-post-list').addEventListener('tabactivate', e=>{
  let username = document.location.pathname.slice(6)
  let myPosts = document.querySelector('#user soci-post-list')
  myPosts.setAttribute('data', `/posts?user=${username}`)
})

document.addEventListener('DOMContentLoaded', user.init)