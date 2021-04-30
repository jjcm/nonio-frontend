let adminForgotPassword = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(adminForgotPassword)
  },
  onActivate: () => {
    document.title = 'Forgot password?'
    adminForgotPassword.submitButton = adminForgotPassword.dom.querySelector('soci-button')
    adminForgotPassword.submitButton.addEventListener('click', adminForgotPassword.submitRequest)
  },
  onDeactivate: () => {
  },
  submitRequest: async e => {
    soci.postData('user/forgot-password-request', {
      email: adminForgotPassword.dom.querySelector('input')?.value
    }).then(res=>{
      console.log(res)
      adminForgotPassword.submitButton.success()
    })
  },
}

adminForgotPassword.init()
