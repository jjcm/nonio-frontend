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
    adminFinancials.dom.querySelector('#financial-wallet h1').innerHTML = adminFinancials.formatCash(response.stripe_wallet_balance || 844.33 )
    adminFinancials.dom.querySelectorAll('a').forEach(a => a.href = response.stripe_connect_link || "#")
    adminFinancials.dom.querySelector('.header soci-button')?.removeAttribute('state')
    adminFinancials.dom.querySelector('#financial-subscription h1').innerHTML = `$${Number.parseFloat(response.subscription_amount || 0)}<span>/mo</span>`
  },
  formatCash: cash => {
    cash = Number.parseFloat(cash)
    let formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})
    return formatter.format(cash)
  },
  showChangeSubscription: async () => {
    let subscription = await soci.getData('stripe/subscription')
    console.log('subscription:')
    console.log(subscription)
  },
  openWithdrawalModal: () => {
    adminFinancials.dom.querySelector('soci-modal')?.activate()
  },
  requestManualWithdrawal: async () => {
    let button = adminFinancials.dom.querySelector('soci-modal soci-button')
    await soci.postData('user/request-withdrawal', {

    }).then(response => {
      if(response.error) {
        console.error(response.error)
        button?.error()
      }
      else {
        button?.success()
        setTimeout(()=>{
          adminFinancials.dom.querySelector('soci-modal')?.deactivate()
        }, 1000)
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', adminFinancials.init)