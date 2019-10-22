import {SociComponent, html} from './soci-component.js'

export default class SociCommentList extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host controls {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin: 28px 0 20px;
        color: var(--n3);
        font-weight: 500;
        font-size: 16px;
      }
      :host filtering {
        display: flex;
        padding-left: 6px;
      }
      :host filter {
        margin-right: 32px;
        position: relative;
      }
      :host filter[active] {
        color: var(--n4);
      }
      :host filter[active]:after {
        content: '';
        display: block;
        position: absolute;
        top: -6px;
        left: calc(50% - 8px);
        width: 16px;
        height: 4px;
        border-radius: 2px;
        background: var(--n4);
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
    let current = this.select('filter[active]')
    if(current) current.removeAttribute('active')
    e.currentTarget.toggleAttribute('active')

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
          <filter @click=${this._filter} active>top</filter>
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
