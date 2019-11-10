let submit = {
  init: () => {
  },
  onActivate: () => {
    submit.input = document.querySelector('#submit input#path')
    submit.statusIcon = document.querySelector('#submit .url soci-icon')
    submit.input.addEventListener('keydown', submit.onKeyDown)
  },
  keyDownTimer: null,
  error: null,
  onKeyDown: () => {
    document.querySelector('#submit .url').removeAttribute('available')
    submit.statusIcon.glyph = ''
    clearTimeout(submit.keyDownTimer)
    setTimeout(()=>{
      if(!submit.input.value.match(/^[a-zA-Z0-9\-\._]*$/)){
        submit.error = true
        submit.setURLError('URL can only contain alphanumerics, periods, dashes, and underscores')
      }
      else if(submit.input.value == '') {
        submit.error = true
        submit.setURLError("URL can't be empty")
      }
      else {
        submit.error = false
        document.querySelector('#submit .error').innerHTML = ''
        submit.keyDownTimer = setTimeout(()=>{
          submit.keyDownTimer = null
          submit.checkURL()
        }, 500)
      }
    },1)
  },
  setURLError: (message) => {
    submit.statusIcon.glyph = 'error'
    document.querySelector('#submit .url').setAttribute('available', false)
    document.querySelector('#submit .error').innerHTML = message
  },
  checkURL: async () => {
    submit.statusIcon.glyph = 'spinner'

    let url = submit.input.value
    let available = await soci.getData(`posts/url-is-available/${url}`)
    if(submit.keyDownTimer || submit.error) return 0
    if(available === true){
      submit.statusIcon.glyph = 'success'
      document.querySelector('#submit .url').setAttribute('available', true)
    }
    else {
      let message = ''
      if(available.error){
        message = available.error
      }
      else {
        message = 'URL is not available. Please choose a better one for your dumb meme.'
      }
    }

  },
  onDeactivate: () => {
  }
}

soci.registerPage(submit, document.currentScript.closest('soci-route'))