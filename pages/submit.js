let submit = {
  dom: document.currentScript.closest('soci-route'),
  init() {
    soci.registerPage(submit)
  },
  form: null, 
  onActivate() {
    submit.form = document.querySelector('#submit form')

    let title = document.querySelector('#submit input[name="title"]')
    title.focus()

    submit.submitButton = document.querySelector('#submit soci-button')
    submit.submitButton.addEventListener('click', submit.submit)
  },
  async submit(e) {
    if(submit.form.reportValidity()){
      let data = new FormData(submit.form)
      let fileDrop = document.querySelector('#submit soci-file-drop')
      if(fileDrop){
        let newPath = await fileDrop.move(data.get('url'))
        if(newPath == null) {
          console.error("Error moving file to its new url")
          return 0
        }
      }
      soci.postData('post/create', {
        title: data.get('title'),
        url: data.get('url'),
        content: data.get('description'),
        type: document.querySelector('#submit soci-tab[active]').getAttribute('name').toLowerCase()
      }).then(e=>{
        if(e.url){
          submit.submitButton.success()
          window.history.pushState(null, null, e.url)
          window.dispatchEvent(new HashChangeEvent('hashchange'))
        }
        else {
          submit.submitButton.error()
        }
      })
    }
    else {
      submit.submitButton.error()
    }
  }
}

document.addEventListener('DOMContentLoaded', submit.init)