let home = {
  init: () => {
  },
  onActivate: () => {
    document.querySelector('#home-container #register').addEventListener('click', async ()=>{
      let creds = {
        email: document.querySelector('#home-container #registration input').value,
        password: document.querySelector('#home-container #registration input[type="password"]').value
      }

      let response = await soci.postData('register', creds)
      console.log(response)
      soci.log('Registration Successful! Token:', response.token)
      soci.storeToken(response.token)

      /* Use this if we ever switch to a secure server for non.io only
      document.cookie = `Authorization=Bearer ${response.token}`
      */
    })

    document.querySelector('#home-container #login').addEventListener('click', async ()=>{
      let creds = {
        email: document.querySelector('#home-container #login-container input').value,
        password: document.querySelector('#home-container #login-container input[type="password"]').value
      }

      console.log(creds)

      let response = await soci.postData('login', creds)
      if(repsonse){
        soci.log('Login Successful! Token:', response.token)
        soci.storeToken(response.token)
      }

      /* Use this if we ever switch to a secure server for non.io only
      document.cookie = `Authorization=Bearer ${response.token}`
      */
    })
  },
  onDeactivate: () => {
  }
}

soci.registerPage(home, document.currentScript.closest('soci-route'))