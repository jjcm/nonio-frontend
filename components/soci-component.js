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

  getCss() {
    if(this.css) return html`<style>${this.css()}</style>`
  }
}

