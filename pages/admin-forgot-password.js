let adminForgotPassword = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(adminForgotPassword)
    console.log('inited')
  },
  onActivate: () => {
    document.title = 'Forgot password?'
  },
  onDeactivate: () => {
  },
  changePassword: async e => {
  },
}

adminForgotPassword.init()
