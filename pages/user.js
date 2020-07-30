let user = {
  init: () => {
    let tab = document.querySelector("#user soci-tab[name='Posts']")
    tab.addEventListener('tabactivate', e=>{
      let myPosts = document.querySelector('#user soci-post-list.my-posts')
      myPosts.setAttribute('data', `/posts?user=${soci.username}`)
    })

  },
  onActivate: () => {
    document.querySelector('#user .password soci-button').addEventListener('click', user.changePassword)
  },
  onDeactivate: () => {
  },
  changePassword: async e => {
    let button = e.currentTarget
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
  },
  cancelChangePassword: () => {
    Array.from(document.querySelectorAll('#user soci-password')).forEach(pass => pass.value = '')
  }

}

soci.registerPage(user, document.currentScript.closest('soci-route'))