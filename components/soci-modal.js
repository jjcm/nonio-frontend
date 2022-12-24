import SociComponent from './soci-component.js'

export default class SociModal extends SociComponent {
  constructor() {
    super()
  }

  static get observedAttributes() {
    return ['title']
  }

  css() { return `
    :host {
      display: flex;
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      pointer-events: none;
      opacity: 0;
      z-index: 100;
      justify-content: center;
      align-items: center;
      padding: 20px;
      transition: opacity 0.25s var(--soci-ease);
    }

    :host([active]) {
      pointer-events: all;
      opacity: 1;
    }

    :host([deactivating]) {
      transition: opacity 0.15s var(--soci-ease);
    }

    #blanket {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: var(--shadow);
      z-index: 5;
    }

    #modal {
      position: relative;
      z-index: 10;
      padding: 16px;
      min-width: 300px;
      max-width: 600px;
      background: var(--bg);
      border-radius: 4px;
      box-shadow: 0 0 0 1px var(--shadow), 0 4px 8px var(--shadow), 0 0 0 1px rgba(255,255,255,0.1) inset;
      transform: translateY(16px);
      transition: transform 0.25s var(--soci-ease);
    }

    :host([active]) #modal {
      transform: translateY(0);
    }

    :host([deactivating]) #modal {
      transform: translateY(-16px);
      transition: transform 0.15s var(--soci-ease);
    }

    h2 {
      margin-top: 0;
    }
  `}

  html(){ return `
    <div @click=deactivate id="blanket"></div>
    <div id="modal">
      <h2 id="title"></h2>
      <slot></slot>
    </div>
  `}

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'title') this.select('#title').innerHTML = newValue
  }

  deactivate(){
    this.toggleAttribute('deactivating', true)
    this.removeAttribute('active')
    setTimeout(()=>{
      this.removeAttribute('deactivating')
    }, 400)
  }
  
  activate(){
    this.toggleAttribute('active', true)
  }
}
