let adminFinancials = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(adminFinancials)
  },
  onActivate: () => {
    document.title = "Nonio - Your Financials"
    adminFinancials.checkFinancials()
  },
  onDeactivate: () => {
  },
  checkFinancials: async () => {
    let response = await soci.getData('user/get-financials')
    adminFinancials.dom.querySelector('.profit h1').innerHTML = `$${Number.parseFloat(response.cash).toPrecision(3)}`
  },
}

document.addEventListener('DOMContentLoaded', adminFinancials.init)