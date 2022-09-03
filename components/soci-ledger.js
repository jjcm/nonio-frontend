import SociComponent from './soci-component.js'

export default class SociLedger extends SociComponent {
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
        opacity: 1;
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
    <slot></slot>
  `}


  get fakeData(){
    let names = ['smith', 'johnson', 'ezra', 'gartner', 'blake', 'archbold', 'mroz', 'xue', 'miller', 'jones', 'williams', 'brown', 'davis', 'miller', 'wilson', 'moore', 'taylor', 'anderson', 'thomas', 'jackson', 'white', 'harris', 'martin', 'thompson', 'garcia', 'martinez', 'robinson', 'clark', 'rodriguez', 'lewis', 'lee', 'walker', 'hall', 'allen', 'young', 'hernandez', 'king', 'wright', 'lopez', 'hill', 'scott', 'green', 'adams', 'baker', 'gonzalez', 'nelson', 'carter', 'mitchell', 'perez', 'roberts', 'turner', 'phillips', 'campbell', 'parker', 'evans', 'edwards', 'collins', 'stewart', 'sanchez', 'morris', 'rogers', 'reed', 'cook', 'morgan', 'bell', 'murphy', 'bailey', 'rivera', 'cooper', 'richardson', 'cox', 'howard', 'ward', 'torres', 'peterson', 'gray', 'ramirez', 'james', 'watson', 'brooks', 'kelly', 'sanders', 'price', 'bennett', 'wood', 'barnes', 'ross', 'henderson', 'coleman', 'jenkins', 'perry', 'powell', 'long', 'patterson', 'hughes', 'flores', 'washington', 'butler', 'simmons', 'foster', 'gonzales', 'bryant', 'alexander', 'russell', 'griffin', 'diaz', 'hayes']
    let letters = 'abcdefghijklmnopqrstuvwxyz'
    let time = new Date().getTime()
    let data = []
    for(let i = 0; i < 10000; i++){
      let type = Math.random() > 0.05 ? 'deposit' : 'withdrawal'
      time -= Math.floor(Math.random() * 1000000)
      let entry = {
        description: `${type} from ${letters[Math.floor(Math.random() * letters.length)]}${names[Math.floor(Math.random() * names.length)]}`,
        type: type,
        amount: Math.floor(Math.random() * 3000) / 1000,
        timestamp: time
      }

      data.push(entry)
    }
    return data
  }

  static get observedAttributes() {
    return ['data', 'timespan', 'filter']
  }

  connectedCallback(){
    performance.mark('ledger-start')
    console.log('starting creation')
    this.createEntries(this.fakeData)
  }

  async attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case 'data':
        this.toggleAttribute('loaded', false)
        let data = await this.getData(newValue, this.authToken)
        if(data.posts) this.createEntries(data.posts)
        this.toggleAttribute('loaded', true)
        break
      case 'filter':
        
        break
    }
  }

  async createEntries(data){
    let monthsDeposits = []
    let currentMonth = new Date().getMonth()
    data.forEach(entry => {
      if(entry.type === 'withdrawl') 
        this.innerHTML += this.renderLedgerLi(entry)
      else {
        if(new Date(entry.timestamp).getMonth() === currentMonth){
          monthsDeposits.push(entry)
        } else {
          this.innerHTML += this.renderLedgerLi(monthsDeposits.reduce((a, b) => a + b.amount, 0))
          monthsDeposits = [entry]
        }
      }
    })
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
      performance.mark('ledger-end')
      performance.measure('ledger render time', 'ledger-start', 'ledger-end')
      console.log(performance.getEntriesByName('ledger render time')[0].duration)
      console.log('creation over')
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