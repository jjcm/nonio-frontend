let user = {
  dom: document.currentScript.closest('soci-route'),
  postTab: document.querySelector("#user soci-tab[name='Posts']"),
  init: () => {
    soci.registerPage(user)
  },
  onActivate: () => {
    document.querySelector('#user .password soci-button').addEventListener('click', user.changePassword)
  },
  onDeactivate: () => {
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
  }

}

user.postTab.addEventListener('tabactivate', e=>{
  let myPosts = document.querySelector('#user soci-post-list.my-posts')
  myPosts.setAttribute('data', `/posts?user=${soci.username}`)
})

document.addEventListener('DOMContentLoaded', user.init)