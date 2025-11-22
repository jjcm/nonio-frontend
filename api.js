import config from './config.js'

const api = {
  get accessToken() {
    return localStorage.getItem('accessToken')
  },

  headers() {
    const headers = {
      'Content-Type': 'application/json'
    }
    if(this.accessToken) {
      headers['Authorization'] = 'Bearer ' + this.accessToken
    }
    return headers
  },

  async postData(url, data = {}) {
    const response = await fetch(`${config.API_HOST}/${url}`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: this.headers(),
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify(data) 
    })
    return await response.json()
  },

  async getData(url) {
    const response = await fetch(`${config.API_HOST}/${url}`, {
      headers: this.headers()
    })
    return await response.json()
  }
}

api.posts = {
  create: (data) => api.postData('post/create', data),
  delete: (url) => api.postData('post/delete', { url })
}

api.user = {
  login: (data) => api.postData('user/login', data),
  register: (data) => api.postData('user/register', data),
  refreshAccessToken: (token) => api.postData('user/refresh-access-token', { refreshToken: token }),
  changePassword: (data) => api.postData('user/change-password', data),
  updateDescription: (description) => api.postData('user/update-description', { description }),
  forgotPassword: (email) => api.postData('user/forgot-password-request', { email }),
  changeForgottenPassword: (data) => api.postData('user/change-forgotten-password', data),
  requestWithdrawal: (data) => api.postData('user/request-withdrawal', data),
  chooseFreeAccount: () => api.postData('user/choose-free-account'),
  nuke: (username) => api.postData('admin/nuke', { username })
}

api.community = {
  create: (data) => api.postData('community/create', data),
  subscribe: (community) => api.postData('community/subscribe', { community }),
  unsubscribe: (community) => api.postData('community/unsubscribe', { community }),
  addModerator: (data) => api.postData('community/add-moderator', data),
  removeModerator: (data) => api.postData('community/remove-moderator', data)
}

api.stripe = {
  createCustomer: () => api.postData('stripe/create-customer'),
  createSubscription: (data) => api.postData('stripe/subscription/create', data),
  deleteSubscription: () => api.postData('stripe/subscription/delete', {})
}

api.votes = {
  get: () => api.getData('votes')
}

window.api = api
export default api
