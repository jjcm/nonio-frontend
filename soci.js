import config from './config.js'

let soci = {
  init: () => {
    console.log(soci.checkTokenExpired())
  },
  get token() {
    return localStorage.getItem('jwt')
  },
  set token(val) {
    localStorage.setItem('jwt', val)
  },
  get stripe(){
    if("Stripe" in window) return Stripe

    let stripe = document.createElement('script')
    stripe.src = 'https://js.stripe.com/v3/'
    return new Promise(resolve =>{
      stripe.onload = ()=>{
        resolve(Stripe)
      }
      document.head.appendChild(stripe)
    })
  },
  storeToken: (token) => {
    soci.token = token
  },
  refreshToken: () => {

  },
  clearToken: () => {
    localStorage.removeItem('jwt')
  },
  checkTokenExpired: () => {
    try {
      let expiry = parseInt(JSON.parse(atob(soci.token.split('.')[1])).expiresAt)
      console.log(expiry)
      if(expiry > Date.now() / 1000) return false
      soci.clearToken()
      return true
    }
    catch {
      return true
    }
  },
  get username() {
    return localStorage.getItem('username')
  },
  set username(val) {
    localStorage.setItem('username', val)
    let e = new CustomEvent('username-updated', {detail: {username: val}})
    document.dispatchEvent(e)
  },
  registerPage: page => {
    if(page.onActivate) page.dom.addEventListener('routeactivate', page.onActivate)
    if(page.onDeactivate) page.dom.addEventListener('routedeactivate', page.onDeactivate)
    if(page.dom.active) page.onActivate()
  },
  getJSONFromForm: form => {
    let data = new FormData(form)
    let json = {}
    for(const [key, val] of data.entries()) {
      json[key] = val
    }
    return json
  },
  postData: async function(url, data = {}) {
    const response = await fetch(`${config.API_HOST}/${url}`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + soci.token
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) 
    })
    return await response.json()
  },
  getData: async function(url){
    /* Use this if we ever switch to a secure server for non.io only
    let options = {
      mode: 'cors',
      credentials: 'include'
    }
    */

    let options = {}
    if(soci.token) options.headers = { 
      Authorization: 'Bearer ' + soci.token
    }

    const response = await fetch(`${config.API_HOST}/${url}`, options)
    return await response.json()
  },
  log(message, details, type){
    let color = ['deebff', '0747ac']
    if(type == 'warning') color = ['fffae5', 'ee6900']
    if(type == 'error') color = ['ffbdad', 'bf2600']
    let name = 'system message'
    let groupLabel = `%csoci%c${name}%c${message}`
    let style = ['padding:4px 8px;border-radius: 3px 0 0 3px;background:#0052cc;color:#fff','padding: 4px 8px;background:#4c9aff;color:#172b4d;', `padding: 4px 8px;border-radius:0 3px 3px 0;background:#${color[0]};color:#${color[1]};border-left:1px solid #${color[1]}`]
    console.group(groupLabel, style[0], style[1], style[2])
    console.info(details)
    console.groupEnd(groupLabel)
  },

  lazyload(path, parent) {
    document.addEventListener('DOMContentLoaded', ()=>{

      let resource = document.createElement('script')
      resource.async = 'true'
      resource.src = path
      let root = parent ? parent : document.head
      root.appendChild(resource)
    })
  },
  votes: {},
  loadVotes() {
    soci.getData('votes').then(res=>{
      let votes = {}
      res.votes.forEach(vote => {
        if(!votes[vote.postID]) votes[vote.postID] = []
        votes[vote.postID].push(vote.tagID)
      })
      soci.votes = votes
    })
  },
  showRegister() {
    document.body.toggleAttribute('noauth', false)
    document.querySelector('soci-sidebar')._createAccount()
  },
  showLogin() {
    document.body.toggleAttribute('noauth', false)
  },
  setAnimationTimings(){
    console.log('timings')
    let root = document.documentElement
    root.style.setProperty('--anim-duration-short', '0.1s')
    root.style.setProperty('--anim-duration-med', '0.2s')
    root.style.setProperty('--anim-duration-long', '0.4s')
  }
}

if(!soci.checkTokenExpired()) {
  soci.loadVotes()
}
else {
  document.body.toggleAttribute('noauth', true)
}

window.soci = soci
document.addEventListener('DOMContentLoaded', soci.init)
window.addEventListener('load', soci.setAnimationTimings)