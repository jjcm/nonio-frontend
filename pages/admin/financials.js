let adminFinancials = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(adminFinancials)
  },
  onActivate: () => {
    document.title = "Nonio - Your Financials"
    adminFinancials.dom.querySelector('.header soci-button')?.wait()
    adminFinancials.checkFinancials()
  },
  onDeactivate: () => {
  },
  checkFinancials: async () => {
    let response = await soci.getData('user/get-financials')
    adminFinancials.dom.querySelector('.profit h1').innerHTML = adminFinancials.formatCash(response.cash || 53.67)
    adminFinancials.dom.querySelector('.stripe h1').innerHTML = adminFinancials.formatCash(response.stripe_wallet_balance || 844.33 )
    adminFinancials.dom.querySelectorAll('a').forEach(a => a.href = response.stripe_connect_link || "#")
    adminFinancials.dom.querySelector('.header soci-button')?.removeAttribute('state')
    adminFinancials.dom.querySelector('.subscription .cash').innerHTML = `$${Number.parseFloat(response.subscription_amount || 0)}<span>/mo</span>`
  },
  formatCash: cash => {
    cash = Number.parseFloat(cash)
    let formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})
    return formatter.format(cash)
  },
  showChangeSubscription: async () => {
    let subscription = await soci.getData('stripe/subscription')
    console.log(subscription)
  }
}

document.addEventListener('DOMContentLoaded', adminFinancials.init)