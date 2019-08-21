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

  getCss() {
    if(this.css) return html`<style>${this.css()}</style>`
  }
}
