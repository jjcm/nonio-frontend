let adminFirstTimeSignup = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(adminFirstTimeSignup)
  },
  onActivate: () => {
    document.title = "Nonio - Choose Your Account Type"
    adminFirstTimeSignup.loadStripe()
  },
  onDeactivate: () => {
  },
  loadStripe: async () => {
    let stripe = await soci.stripe
    let elements = stripe.elements()
    let currentStyles = getComputedStyle(document.documentElement)
    let card = elements.create('card', {
      style: {
        base: {
          iconColor: currentStyles.getPropertyValue('--base-text'),
          color: currentStyles.getPropertyValue('--base-text'),
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
          lineHeight: '38px',
          fontSize: '14px',
          ':-webkit-autofill': {
            color: currentStyles.getPropertyValue('--brand-text')
          },
          '::placeholder': {
            color: currentStyles.getPropertyValue('--base-text-subtle')
          }
        },
        invalid: {
          iconColor: currentStyles.getPropertyPriority('--error-text'),
          color: currentStyles.getPropertyPriority('--error-text')
        }
      }
    })
    card.on('change', adminFirstTimeSignup.cardError)
    card.mount('#admin-first-time-signup #card-element')

    //TODO https://stripe.com/docs/billing/subscriptions/fixed-price#create-subscription
  },
  cardError: event => {
    changeLoadingStatePrices(false)
    let displayError = document.getElementById('card-element-errors')
    if (event.error) {
      displayError.textContent = event.error.message
    } else {
      displayError.textContent = ''
    }
  },
  chooseSupporter: () => {
    adminFirstTimeSignup.dom.querySelector('.column.supporter').toggleAttribute('active', true)
  },
  subscribe: () => {
    adminFirstTimeSignup.dom.querySelector('#payment-form').submit()
  }
}

document.addEventListener('DOMContentLoaded', adminFirstTimeSignup.init)