let post = {
  init() {
    let postRoute = document.querySelector('#post')
    if(postRoute) {
      postRoute.addEventListener('routeactivate', post.onActivate)
    }
  },
  onActivate(e) {
    let route = e.target
    let postElement = route.querySelector('soci-post')
    soci.ensureComponents([
      ['./components/soci-post.js', 'soci-post'],
      ['./components/soci-comment-list.js', 'soci-comment-list'],
      ['./components/soci-comment.js', 'soci-comment'],
      ['./components/soci-html-page.js', 'soci-html-page'],
      ['./components/soci-encoding-progress.js', 'soci-encoding-progress'],
      ['./components/soci-radial-progress.js', 'soci-radial-progress']
    ])
    let path = window.soci.routeContext.path
    let url = path.substr(1)

    // Check if it's a community post (/@community/post-slug)
    let match = path.match(/^\/@([\w-]+)\/([\w-]+)$/)
    if(match) {
        url = match[2] // The post slug (without community prefix)
        postElement.setAttribute('community', match[1])
    } else {
        postElement.removeAttribute('community')
    }

    postElement.setAttribute('url', url)
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
  },
}

document.addEventListener('DOMContentLoaded', post.init)