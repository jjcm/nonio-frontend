import {html, render} from "../lib/lit-html/lit-html.js"
export {html, render} from "../lib/lit-html/lit-html.js"

export class SociComponent extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({'mode':'open'})
    if(this.render) render(this.render(), this._shadowRoot)
  }

  select(s){
    return this.shadowRoot.querySelector(s)
  }

  forceBindThis(functions){
    functions.forEach(key => (this[key] = this[key].bind(this)));
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

  getCss(){
    if(this.css) return html`<style>${this.css()}</style>`
  }

  localLink(e){
    e.preventDefault()
    window.history.pushState(null, null, this.href)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  get authenticated(){
    let token = localStorage.getItem('jwt')
    if(!token) return false
    try {
      let expiry = parseInt(JSON.parse(atob(token.split('.')[1])).expiresAt)
      if(expiry > Date.now() / 1000) return true
      return false
    }
    catch {
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


