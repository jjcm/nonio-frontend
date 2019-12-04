let submit = {
  init() {
  },
  form: null, 
  onActivate() {
    submit.form = document.querySelector('#submit form')
  },
  submit() {
    let data = new FormData(submit.form)

    soci.postData('post/create', {
      title: data.get('title'),
      url: data.get('url'),
      content: data.get('description'),
      type: document.querySelector('#submit soci-tab[active]').getAttribute('name').toLowerCase()
    })
  }
}

soci.registerPage(submit, document.currentScript.closest('soci-route'))