let submit = {
  init() {
  },
  form: null, 
  onActivate() {
    submit.form = document.querySelector('#submit form')

    let title = document.querySelector('#submit input[name="title"]')
    title.focus()

    let submitButton = document.querySelector('#submit button')
    submitButton.addEventListener('click', submit.submit)
  },
  async submit(e) {
    if(submit.form.checkValidity()){
      e.preventDefault()
      let data = new FormData(submit.form)
      let fileDrop = document.querySelector('#submit soci-file-drop')
      let newPath = await fileDrop.move(data.get('url'))
      if(newPath == null) {
        console.error("Error moving file to its new url")
        return 0
      }
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

soci.registerPage(submit, document.currentScript.closest('soci-route'))