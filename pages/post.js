let post = {
  init() {
  },
  onActivate() {
    console.log('activating')
    let post = document.querySelector('#post soci-post')
    post.setAttribute('href', document.location.pathname.substr(1))
  },
  submit(e) {
    if(submit.form.checkValidity()){
      e.preventDefault()
      let data = new FormData(submit.form)

      soci.postData('post/create', {
        title: data.get('title'),
        url: data.get('url'),
        content: data.get('description'),
        type: document.querySelector('#submit soci-tab[active]').getAttribute('name').toLowerCase()
      }).then(e=>{
        if(e.url){
          window.history.pushState(null, null, e.url)
          window.dispatchEvent(new HashChangeEvent('hashchange'))
        }
      })
    }
  }
}

soci.registerPage(post, document.currentScript.closest('soci-route'))