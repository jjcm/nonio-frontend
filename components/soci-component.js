import config from '../config.js'

export default class SociComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({'mode':'open'})
    this.shadowRoot.innerHTML = `
      ${this.css ? `<style>${this.css()}</style>` : ''}
      ${this.html ? this.html() : '<slot></slot>'}
    `

    this.shadowRoot.querySelectorAll('*').forEach(el=> {
      Array.from(el.attributes).forEach(attr => {
        const prefix = attr.name.charAt(0)
        if(prefix == '@'){
          this[attr.value] = this[attr.value].bind(this)
          el.addEventListener(attr.name.slice(1), this[attr.value])
          el.removeAttribute(attr.name)
        }
        if(prefix == '?'){
          el[attr.value != 'false' ? 'setAttribute' : 'removeAttribute'](attr.name.slice(1), '')
          el.removeAttribute(attr.name)
        }
      })
    })
  }

  select(s){
    return this.shadowRoot.querySelector(s)
  }

  selectAll(s){
    return this.shadowRoot.querySelectorAll(s)
  }

  async postData(url, data = {}) {
    const response = await fetch(config.API_HOST + url, {
      method: 'POST', 
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authToken
      },
      redirect: 'follow', 
      referrer: 'no-referrer', 
      body: JSON.stringify(data) 
    })
    return await response.json()
  }

  async getData(url, auth){
    let options = {}
    if(auth) options.headers = { 
      Authorization: 'Bearer ' + auth
    }

    const response = await fetch(config.API_HOST + url, options)
    return await response.json()
  }

  fire(event, detail, attr){
    if(!attr) attr = 'on' + event
    let tempAttr = this.getAttribute(attr)
    if(tempAttr) eval(tempAttr)
    this.removeAttribute(attr)
    let e = new CustomEvent(event, {detail: detail, bubbles: true})
    if(!attr) attr = 'on' + event
    this.dispatchEvent(e)
    setTimeout(()=>{
      this.setAttribute(attr, tempAttr)
    },1)
  }

  log(message, type){
    let color = ['deebff', '0747ac']
    if(type == 'warning') color = ['fffae5', 'ee6900']
    if(type == 'error') color = ['ffbdad', 'bf2600']
    let name = this.tagName.toLowerCase()
    let groupLabel = `%csoci%c${name}%c${message}`
    let style = ['padding:4px 8px;border-radius: 3px 0 0 3px;background:#0052cc;color:#fff','padding: 4px 8px;background:#4c9aff;color:#172b4d;', `padding: 4px 8px;border-radius:0 3px 3px 0;background:#${color[0]};color:#${color[1]};border-left:1px solid #${color[1]}`]
    console.group(groupLabel, style[0], style[1], style[2])
    console.info(this)
    console.groupEnd(groupLabel)
  }

  localLink(e){
    e.preventDefault()
    window.history.pushState(null, null, e.currentTarget.href)
    window.dispatchEvent(new HashChangeEvent('hashchange', {detail: 'asdf'}))
  }

  get authToken(){
    let token = localStorage.getItem('jwt')
    if(!token) return false
    try {
      let expiry = parseInt(JSON.parse(atob(token.split('.')[1])).expiresAt)
      if(expiry > Date.now() / 1000) return token
      return false
    }
    catch(err) {
      return false
    }
  }

  updateTime(time, dom){
    if(this._updateTimer) clearTimeout(this._updateTimer)

    const secondsPerUnit = [
      ['s', 1],
      ['m', 60],
      ['h', 3600],
      ['d', 86400],
      ['w', 604800],
      ['m', 2629746],
      ['y', 31556952]
    ]

    const secondsAgo = Math.floor((Date.now() - parseInt(time)) / 1000) + 1

    for(let i = 1; i < secondsPerUnit.length; i++){
      if(secondsAgo < secondsPerUnit[i][1]){
        let unit = secondsPerUnit[i - 1][0]
        let interval = secondsPerUnit[i - 1][1]
        this._updateTimer = setTimeout(()=>{this.updateTime(time, dom)}, interval * 1000)
        dom.innerHTML = Math.floor(secondsAgo / interval) + unit + ' ago'
        break
      }
    }
  }
}
