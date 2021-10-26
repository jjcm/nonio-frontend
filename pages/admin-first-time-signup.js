let adminFirstTimeSignup = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(adminFirstTimeSignup)
  },
  onActivate: () => {
    document.title = "Nonio - Choose Your Account Type"
  },
  onDeactivate: () => {
  },
  chooseSupporter: async () => {
    let stripe = await soci.stripe
    let elements = stripe.elements()
    let currentStyles = getComputedStyle(document.documentElement)
    let card = elements.create('card', {
      style: {
        base: {
          iconColor: currentStyles.getPropertyValue('--base-text'),
          color: currentStyles.getPropertyValue('--base-text'),
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
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
    card.mount('#admin-first-time-signup #card-element')

    // TODO: https://stripe.com/docs/billing/subscriptions/fixed-price#add-elements-to-your-page
  },
}

document.addEventListener('DOMContentLoaded', adminFirstTimeSignup.init)