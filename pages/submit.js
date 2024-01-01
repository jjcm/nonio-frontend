let submit = {
  dom: document.currentScript.closest('soci-route'),
  init() {
    soci.registerPage(submit)
  },
  form: null, 
  onActivate() {
    submit.form = document.querySelector('#submit form')

    document.title = 'Submit post to Nonio'
    let title = submit.dom.querySelector('input[name="title"]')
    title.setCustomValidity("A title is required.")
    title.addEventListener('input', submit.checkTitleValidity)
    title.addEventListener('input', submit.populateUrl)
    title.addEventListener('blur', submit.checkUrl)
    title.focus()

    submit.submitButton = submit.dom.querySelector('soci-button')
    submit.submitButton.addEventListener('click', submit.submit)

    let linkInput = submit.dom.querySelector('soci-link-input')
    linkInput.addEventListener('url-metadata', submit.setLinkMetadata)
  },
  checkTitleValidity(e) {
    e.target.setCustomValidity(e.target.value.length ? '' : "A title is required.")
  },
  populateUrl(e){
    setTimeout(()=>{
      let title = e.target.value.replace(/[^a-zA-Z0-9\-\. ]/gi, '')
      title = title.replace(/ /g, '-')

      let urlInput = submit.dom.querySelector('soci-url-input')
      if(!urlInput.manuallySet) urlInput.value = title
    }, 1)
  },
  checkUrl(e){
    if(e.target.value.length > 0)
      submit.dom.querySelector('soci-url-input').checkUrlValidity()
  },
  async submit(e) {
    if(submit.form.reportValidity()){
      let data = new FormData(submit.form)
      let type = submit.dom.querySelector('soci-tab[active]').getAttribute('name').toLowerCase()
      let fileUploader = submit.dom.querySelector(`soci-${type}-uploader`)
      if(fileUploader){
        let newPath = await fileUploader.move(data.get('url'))
        if(newPath == null) {
          console.error("Error moving file to its new url")
          return 0
        }
      }
      let linkUploader = submit.dom.querySelector('soci-link-input')
      if(linkUploader && linkUploader.imageUrl) {
        let newPath = await linkUploader.move(data.get('url'))
        if(newPath == null) {
          console.error("Error moving file to its new url")
          return 0
        }
      }
      soci.postData('post/create', {
        title: data.get('title'),
        url: data.get('url'),
        content: data.get('description'),
        link: data.get('link'),
        type: type,
        width: fileUploader?.width,
        height: fileUploader?.height
      }).then(e=>{
        if(e.url){
          submit.submitButton.success()
          window.history.pushState(null, null, e.url)
          window.dispatchEvent(new HashChangeEvent('hashchange'))
          document.dispatchEvent(new CustomEvent('activitychange'))
        }
        else {
          submit.submitButton.error()
        }
      })
    }
    else {
      submit.submitButton.error()
    }
  },
  setLinkMetadata(e) {
    console.log(e.detail)
    let previewLi = submit.dom.querySelector('soci-post-li')
    previewLi.setAttribute('post-title', '&nbsp;')
    let title = submit.dom.querySelector('input[name="title"]')
    if(title.value == '') {
      title.value = e.detail.title
      title.setCustomValidity('')
    }
    if(title.value != '') {
      previewLi.setAttribute('post-title', title.value)
    }
    if(e.detail.image) {
      let img = previewLi.querySelector('img') || document.createElement('img')
      img.src = e.detail.image
      img.setAttribute('slot', 'thumbnail')
      previewLi.querySelector('[slot="thumbnail"]')?.remove()
      previewLi.appendChild(img)
    }
    if(title.value == '' || e.detail.image) {
      submit.dom.querySelector('.preview').classList.toggle('active', true)
      setTimeout(()=>{ 
        submit.dom.querySelector('.preview').style = 'overflow: inherit; height: auto;'
      }, 100)
    }

    let description = submit.dom.querySelector('soci-input[name="description"]')
    if(description.value == '{"ops":[{"insert":"\\n"}]}') {
      description.setText(e.detail.description)
    }
  }
}

submit.init()