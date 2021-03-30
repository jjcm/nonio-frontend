let user = {
  dom: document.currentScript.closest('soci-route'),
  postTab: document.querySelector("#user soci-tab[name='Posts']"),
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
    document.querySelector('#user .password soci-button').addEventListener('click', user.changePassword)
    document.querySelector('#user soci-tab[name="Financials"]').addEventListener('tabactivate', user.checkFinancials)
  },
  onDeactivate: () => {
  },
  showPersonalControls: () => {
    document.querySelector('#user soci-tab[name="Financials"]').style.display = 'block'
    document.querySelector('#user soci-tab[name="Settings"]').style.display = 'block'
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

user.postTab.addEventListener('tabactivate', e=>{
  let myPosts = document.querySelector('#user soci-post-list.my-posts')
  myPosts.setAttribute('data', `/posts?user=${soci.username}`)
})

document.addEventListener('DOMContentLoaded', user.init)