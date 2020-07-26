let user = {
  init: () => {
    let tab = document.querySelector("#user soci-tab[name='Posts']")
    tab.addEventListener('tabactivate', e=>{
      let myPosts = document.querySelector('#user soci-post-list.my-posts')
      myPosts.setAttribute('data', `/posts?user=${soci.username}`)
    })
  },
  onActivate: () => {
    console.log('ayy lmao')
  },
  onDeactivate: () => {
  }
}

soci.registerPage(user, document.currentScript.closest('soci-route'))