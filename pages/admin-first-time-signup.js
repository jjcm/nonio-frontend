let adminFirstTimeSignup = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(adminFirstTimeSignup)
    adminFirstTimeSignup.dom.querySelector('form').addEventListener('submit', e => {
      e.preventDefault()
    })
  },
  onActivate: () => {
    document.title = "Nonio - Choose Your Account Type"
    adminFirstTimeSignup.loadStripe()
  },
  onDeactivate: () => {
  },
  loadStripe: async () => {
    adminFirstTimeSignup.stripe = await soci.stripe
    let elements = adminFirstTimeSignup.stripe.elements()
    let currentStyles = getComputedStyle(document.documentElement)
    adminFirstTimeSignup.card = elements.create('card', {
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
    adminFirstTimeSignup.card.on('change', adminFirstTimeSignup.cardError)
    adminFirstTimeSignup.card.mount('#admin-first-time-signup #card-element')

    //TODO https://stripe.com/docs/billing/subscriptions/fixed-price#create-subscription
  },
  cardError: event => {
    //changeLoadingStatePrices(false)
    let displayError = document.getElementById('card-element-errors')
    if (event.error) {
      displayError.textContent = event.error.message
      console.log(event.error)
    } else {
      displayError.textContent = ''
    }
  },
  chooseSupporter: () => {
    soci.postData('stripe/create-customer').then(result => {
      if(result === true) {
        adminFirstTimeSignup.dom.querySelector('soci-button.supporter-button').success()
        adminFirstTimeSignup.dom.querySelector('.column.supporter').toggleAttribute('active', true)
        setTimeout(()=>{
        }, 200)


      }
      else {

      }
    })
  },
  subscribe: () => {
    //adminFirstTimeSignup.dom.querySelector('#payment-form').submit()
    const customerId = "cus_FJntwBDjM8IFYt"
    let billingName = "Matthew Smith"
    let priceId = "price_1JpOwmH4gvdXgbs5uGPiaLb2"
    adminFirstTimeSignup.stripe.createPaymentMethod({
      type: 'card',
      card: adminFirstTimeSignup.card,
      billing_details: {
        name: billingName,
      },
    })
    .then(result => {
      if(result.error){
        adminFirstTimeSignup.cardError(result)
      }
      else {
        adminFirstTimeSignup.createSubscription({
          customerId: customerId,
          paymentMethodId: result.paymentMethod.id,
          priceId: priceId
        })
      }
    })
  },
  createSubscription: ({customerId, paymentMethodId, priceId}) => {
    return (
      soci.postData('stripe/create-subscription', {
        customerId: customerId,
        paymentMethodId: paymentMethodId,
        priceId: priceId,
      })
      // If the card is declined, display an error to the user.
      .then((result) => {
        if (result.error) {
          // The card had an error when trying to attach it to a customer.
          throw result
        }
        return result
      })
      // Normalize the result to contain the object returned by Stripe.
      // Add the additional details we need.
      .then((result) => {
        return {
          paymentMethodId: paymentMethodId,
          priceId: priceId,
          subscription: result,
        };
      })
      // Some payment methods require a customer to be on session
      // to complete the payment process. Check the status of the
      // payment intent to handle these actions.
      //.then(handlePaymentThatRequiresCustomerAction)
      // If attaching this card to a Customer object succeeds,
      // but attempts to charge the customer fail, you
      // get a requires_payment_method error.
      //.then(handleRequiresPaymentMethod)
      // No more actions required. Provision your service for the user.
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        // An error has happened. Display the failure to the user here.
        // We utilize the HTML element we created.
        console.log('oh fuck')
        console.log(error)
        //showCardError(error)
      })
    )
  }
}

document.addEventListener('DOMContentLoaded', adminFirstTimeSignup.init)