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
  },
  tabClick: e => {
    if(e.target.className == 'tab') {
      let container = user.dom.querySelector('.inner-content')
      let username = document.location.pathname.slice(6)
      e.target.parentElement.querySelector('[selected]').removeAttribute('selected')
      e.target.toggleAttribute('selected', true)
      if(e.target.innerHTML == 'Posts') {
        container.innerHTML = `<soci-post-list data="/posts?user=${username}"></soci-post-list>`
      }
      else {
        container.innerHTML = `<soci-comment-list url="andy"></soci-post-list>`
      }
    }
  },
  showPersonalControls: () => {

  },
  changePassword: async e => {
    let button = e.currentTarget
    let form = button.closest('form')
    if(form.reportValidity()){
      let data = soci.getJSONFromForm(button.closest('form'))
      let response = await soci.postData('user/change-password', data)
      button.wait()
      if(response == true) {
        button.success()
        user.cancelChangePassword()
      }
      else {
        button.error()
      }
    }
    else {
      button.error()
    }
  },
  cancelChangePassword: () => {
    Array.from(document.querySelectorAll('#user soci-password')).forEach(pass => pass.value = '')
  },
  checkFinancials: async () => {
    let response = await soci.getData('user/get-financials')
    document.querySelector('#user .profit h1').innerHTML = `$${Number.parseFloat(response.cash).toPrecision(3)}`
  }
}

user.dom.querySelector('soci-post-list').addEventListener('tabactivate', e=>{
  let username = document.location.pathname.slice(6)
  let myPosts = document.querySelector('#user soci-post-list')
  myPosts.setAttribute('data', `/posts?user=${username}`)
})

document.addEventListener('DOMContentLoaded', user.init)