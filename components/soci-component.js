import {html, render} from "../lib/lit-html/lit-html.js"
export {html} from "../lib/lit-html/lit-html.js"

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

  getCss() {
    if(this.css) return html`<style>${this.css()}</style>`
  }
}
