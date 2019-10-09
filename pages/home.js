/*
document.getElementById('home').addEventListener('routeactivate', ()=>{
})
*/

let home = {
  init: () => {
  },
  onActivate: () => {
    document.querySelector('#home-container #register').addEventListener('click', async ()=>{
      let creds = {
        email: document.querySelector('#home-container #email').value,
        password: document.querySelector('#home-container #password').value
      }

      let response = await soci.postData('https://api.non.io/register', creds)
      soci.log('Registration Successful! Token:', response.token)
    })
  },
  onDeactivate: () => {
  }
}

soci.registerPage(home, document.currentScript.closest('soci-route'))