import SociComponent from './soci-component.js'

export default class SociTagLi extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        line-height: 32px;
        --hash-color: var(--n3);
        position: relative;
        display: block;
        overflow: hidden;
      }

      :host([subscribed]) {
        --hash-color: var(--b3);
      }

      :host([active]) a {
        color: var(--b3);
        font-weight: 600;
        background: #1357a020;
      }

      :host([active]) a:hover {
        background: #1357a030;
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

      #hash {
        position: absolute;
        left: 20px;
      }

      #toggleSubscribe {
        width: 24px;
        height: 24px;
        position: absolute;
        right: 8px;
        top: 4px;
        border-radius: 3px;
        cursor: pointer;
        display: none;
      }

      :host(:hover) #toggleSubscribe {
        display: block;
      }

      #toggleSubscribe:hover {
        background: var(--n1);
      }

      :host([active]) #toggleSubscribe:hover {
        background: #1357a018;
      }

      :host([subscribed]) #toggleSubscribe svg {
        transform: rotate(45deg);
      }

      :host([load-in]){
        animation: load-in 0.2s var(--soci-ease) forwards;
      }

      :host([load-in][subscribed]) a {
        animation: load-in-up 0.2s var(--soci-ease) forwards;
      }
      :host([load-in]:not([subscribed])) a {
        animation: load-in-down 0.2s var(--soci-ease) forwards;
      }

      :host([load-out]){
        animation: load-out 0.2s var(--soci-ease) forwards;
      }

      :host([load-out][subscribed]) a {
        animation: load-out-down 0.2s var(--soci-ease) forwards;
      }
      :host([load-out]:not([subscribed])) a {
        animation: load-out-up 0.2s var(--soci-ease) forwards;
      }

      @keyframes load-in {
        from {
          height: 0;
          opacity: 0;
        }

        to {
          height: 32px;
          opacity: 1;
        }
      }

      @keyframes load-out {
        from {
          height: 32px;
          opacity: 1;
        }

        to {
          height: 0;
          opacity: 0;
        }
      }

      @keyframes load-in-up {
        from { transform: translateY(10px) }
        to { transform: translateY(0px) }
      }

      @keyframes load-out-up {
        from { transform: translateY(0px) }
        to { transform: translateY(-42px) }
      }

      @keyframes load-in-down {
        from { transform: translateY(-42px) }
        to { transform: translateY(0px) }
      }

      @keyframes load-out-down {
        from { transform: translateY(0px) }
        to { transform: translateY(10px) }
      }
    `
  }

  html(){ return `
    <a @click=_tagClick>
      <svg id="hash" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="background: var(--hash-color); position: absolute; left: 24px; top: 8px; width: 16px; height: 16px; border-radius: 3px;">
        <g transform="translate(1,1.5)">
        <path d="M9.28 7.346H11.17V8.62H9.126L8.832 11H7.558L7.852 8.62H5.486L5.192 11H3.918L4.212 8.62H2.322V7.346H4.366L4.688 4.854H2.798V3.58H4.842L5.136 1.2H6.41L6.116 3.58H8.468L8.762 1.2H10.036L9.742 3.58H11.618L11.632 4.854H9.588L9.28 7.346ZM8.006 7.346L8.314 4.854H5.962L5.64 7.346H8.006Z" fill="white"/>
        </g>
      </svg>

      <slot></slot>
    </a>
    <div id="toggleSubscribe" @click=_toggleSubscribe>
      <svg viewBox="0 0 24 24" fill="currentColor"><rect x="8" y="11.5" width="8" height="1" rx="0.5" fill="currentColor"></rect><rect x="11.5" y="8" width="1" height="8" rx="0.5" fill="currentColor"></rect></svg>
    </div>
  `}

  static get observedAttributes() {
    return ['tag']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'tag') {
      this.innerHTML = newValue
      this.select('a').href = `/#${newValue}`
      this.setAttribute('href', `/#${newValue}`)
    }
  }

  get tag(){
    return this.getAttribute('tag')
  }

  set tag(val){
    return this.setAttribute('tag', val)
  }

  _toggleSubscribe(e){
    e.preventDefault()
    let subscribing = !this.hasAttribute('subscribed')
    this.fire(subscribing ? 'subscribe' : 'unsubscribe', {
      dom: this,
      tag: this.innerHTML
    })

    this.postData(`/subscription/${subscribing ? 'create' : 'delete'}`, {
      tag: this.innerHTML
    })
  }

  _tagClick(e){
    e.preventDefault()
    let href = '/#' + this.tag
    window.history.pushState(null, null, href)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    document.querySelector('#tags soci-column')?.setAttribute('tag', this.tag)
  }
}
