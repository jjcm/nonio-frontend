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
        padding: 2px 8px 28px;
        box-sizing: border-box;
        opacity: 0;
        transform: translateY(12px);
      }
      :host([loaded]) {
        transform: translateY(0);
        opacity: 1;
        transition: transform 0.35s cubic-bezier(0.15, 0, 0.2, 1), opacity 0.35s var(--soci-ease);
      }
      ::slotted(soci-ledger-li){
        margin-top: 8px;
      }
    `
  }

  html(){ return `
    <div id="description"></div>
    <div id="amount"></div>
    <slot></slot>
  `}

  connectedCallback(){
    this.createEntries(this.fakeData)
  }

  static get observedAttributes() {
    return ['amount', 'description']
  }

  async attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case 'amount':
        this.select('#amount').innerHTML = newValue
        break
      case 'filter':
        break
    }
  }

  async createEntries(data){
    let totalDeposits = 0
    data.forEach(entry => {
      totalDeposits += entry.amount
    })
    this.setAttribute('amount', totalDeposits)
    this.renderLedgerLi = this.renderLedgerLi.bind(this)
    let numberToRender = Math.ceil(window.innerHeight / 40) // the height of a post li
    console.log(numberToRender)
    // render only the amount visible on the screen first, and animate them in
    console.log(data.length)
    let dommy = data.splice(0, numberToRender).map(this.renderLedgerLi).join('')
    console.log(dommy)
    this.innerHTML = dommy
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