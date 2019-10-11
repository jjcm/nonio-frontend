let home = {
  init: () => {
  },
  onActivate: () => {
    document.querySelector('#home-container #register').addEventListener('click', async ()=>{
      let creds = {
        email: document.querySelector('#home-container #email').value,
        password: document.querySelector('#home-container #password').value
      }

      let response = await soci.postData('register', creds)
      soci.log('Registration Successful! Token:', response.token)
      soci.token = response.token

      /* Use this if we ever switch to a secure server for non.io only
      document.cookie = `Authorization=Bearer ${response.token}`
      */
    })
  },
  onDeactivate: () => {
  }
}

soci.registerPage(home, document.currentScript.closest('soci-route'))