import SociComponent from './soci-component.js'

export default class SociLedgerMonth extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: block;
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        opacity: 0;
        transform: translateY(12px);
        border: 1px solid var(--base-text);
        border-radius: 4px;
        line-height: 24px;
      }
      :host([loaded]) {
        transform: translateY(0);
        opacity: 1;
        transition: transform 0.35s cubic-bezier(0.15, 0, 0.2, 1), opacity 0.35s var(--soci-ease);
      }
      ::slotted(soci-ledger-li){
        margin-top: 8px;
      }

      #header {
        display: flex;
      }

      soci-icon {
        margin-right: 8px;
      }

      #total {
        margin-right: 10px; 
      }

      #number {
        margin-right: 10px;
      }

      #deposits {
        display: none;
      }
    `
  }

  html(){ return `
    <div id="header">
      <soci-icon glyph="create"></soci-icon>
      <div id="date"></div>
      <div id="description"></div>
      <div id="number"></div>
      <div id="total"></div>
    </div>
    <slot id="deposits"></slot>
  `}

  static get observedAttributes() {
    return ['total', 'description', 'number']
  }

  async attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case 'total':
        this.select('#total').innerHTML = newValue
        break
      case 'number':
        this.select('#number').innerHTML = newValue
        break
      case 'filter':
        break
    }
  }

  async createEntries(data){
    let totalDeposits = 0
    data.forEach(entry => {
      totalDeposits += entry.amount
      console.log(entry.amount)
    })
    this.setAttribute('total', totalDeposits)
    this.setAttribute('number', data.length)
    this.renderLedgerLi = this.renderLedgerLi.bind(this)
    let numberToRender = Math.ceil(window.innerHeight / 40) // the height of a post li
    // render only the amount visible on the screen first, and animate them in
    this.innerHTML = data.splice(0, numberToRender).map(this.renderLedgerLi).join('')
    // then once the main batch is done, load in the rest. 
    setTimeout(()=>{
      let tempDom = document.createElement('div')
      tempDom.innerHTML = data.map(this.renderLedgerLi).join('')
      Array.from(tempDom.children).forEach(child=>{
        this.appendChild(child)
      })
    }, 1)
    this.toggleAttribute('loaded', true)
  }

  renderLedgerLi(entry){
    return`
      <soci-ledger-li type="${entry.type}">
        <div slot="description">${entry.description}</div>
        <div slot="amount">${entry.amount}</div>
      </soci-ledger-li>
    `
  }
}