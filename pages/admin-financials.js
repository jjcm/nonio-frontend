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
    adminFinancials.dom.querySelector('.profit h1').innerHTML = `$${Number.parseFloat(response.cash || 0).toPrecision(3)}`
    adminFinancials.dom.querySelector('.stripe h1').innerHTML = `$${Number.parseFloat(response.stripe_wallet_balance || 0).toPrecision(3)}`
    adminFinancials.dom.querySelectorAll('a').forEach(a => a.href = response.stripe_dashboard_link || "#")
    adminFinancials.dom.querySelector('.subscription .cash').innerHTML = `$${Number.parseFloat(response.subscription_amount || 0)}<span>/mo</span>`
  },
}

document.addEventListener('DOMContentLoaded', adminFinancials.init)