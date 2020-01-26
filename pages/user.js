let user = {
  init: () => {
  },
  onActivate: () => {
    let myPosts = document.querySelector('#user soci-post-list.my-posts')
    myPosts.setAttribute('data', `/posts/user/${soci.username}`)
    console.log('ayy')
  },
  onDeactivate: () => {
  }
}

soci.registerPage(user, document.currentScript.closest('soci-route'))