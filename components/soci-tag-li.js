import SociComponent from './soci-component.js'

export default class SociTagLi extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        line-height: 32px;
      }
      
      a {
        display: block;
        padding-left: 54px;
        text-decoration: none;
        color: var(--n4);
        position: relative;
        cursor: pointer;
        box-sizing: border-box;
      }

      a:hover {
        background: var(--n1);
      }

      :host(:last-child) {
        margin-bottom: 20px;
      }

      svg {
        position: absolute;
        left: 20px;
      }
    `
  }

  html(){ return `
    <a>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="background: var(--n3); position: absolute; left: 24px; top: 8px; width: 16px; height: 16px; border-radius: 3px;">
        <g transform="translate(1,1.5)">
        <path d="M9.28 7.346H11.17V8.62H9.126L8.832 11H7.558L7.852 8.62H5.486L5.192 11H3.918L4.212 8.62H2.322V7.346H4.366L4.688 4.854H2.798V3.58H4.842L5.136 1.2H6.41L6.116 3.58H8.468L8.762 1.2H10.036L9.742 3.58H11.618L11.632 4.854H9.588L9.28 7.346ZM8.006 7.346L8.314 4.854H5.962L5.64 7.346H8.006Z" fill="white"/>
        </g>
      </svg>

      <slot></slot>
    </a>
  `}

  static get observedAttributes() {
    return ['tag']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'tag') {
      this.innerHTML = newValue
      this.select('a').href = `/#${newValue}`
    }
  }

  get tag(){
    return this.getAttribute('tag')
  }

  set tag(val){
    return this.setAttribute('tag', val)
  }

  toggleSubscribe(e){
    e.preventDefault()
    let subscribed = this.hasAttribute('subscribed')
    this.fire('subscribe', {
      dom: this,
      tag: this.innerHTML,
      subscribed: subscribed
    })

    this.postData(`/subscriptions/${subscribed ? 'create' : 'delete'}`, {
      tag: this.innerHTML
    }).then(val => {
      console.log(val)
    })
  }
}
