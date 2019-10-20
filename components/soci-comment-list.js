import {SociComponent, html} from './soci-component.js'

export default class SociCommentList extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
      }
    `
  }

  static get observedAttributes() {
    return ['data']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'data':
        break
    }
  }

  _filter(e){
    let filter = e.currentTarget.innerHTML
    let comments = Array.from(this.children)
    
    comments = comments.sort((a,b)=>{
      return parseInt(b.getAttribute('date')) - parseInt(a.getAttribute('date'))
    })

    this.innerHTML = ''
    comments.forEach(comment => this.appendChild(comment))
  }

  render(){
    this._filter = this._filter.bind(this)
    return html`
      ${this.getCss()}
      <soci-input></soci-input>
      <controls>
        <filtering>
          <filter @click=${this._filter}>top</filter>
          <filter @click=${this._filter}>new</filter>
        </filtering>
        <comment-count>0 comments</comment-count>
      </controls>
      <content>
        <slot></slot>
      </content>
    `
  }
}
