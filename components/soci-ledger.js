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

      svg {
        height: 200px;
        width: 100%;
        margin-bottom: 16px;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid var(--bg-secondary);
      }

      #line {
        opacity: 0;
        fill-opacity: 0;
        transition: opacity 1.2s var(--soci-ease), fill-opacity 0.4s var(--soci-ease) 1.0s;
      }

      :host([loaded]) #line {
        opacity: 1;
        fill-opacity: 0.1;
        stroke-dasharray: 4000;
        stroke-dashoffset: 4000;
        animation: line-in 2.25s var(--soci-ease) forwards;
        stroke: var(--text-success);
        fill: var(--text-brand);
      }
      @keyframes line-in {
        from {
          stroke-dasharray: 4000;
          stroke-dashoffset: 4000;
        }

        to {
          stroke-dasharray: 4000;
          stroke-dashoffset: 2000;
        }
      }
    `
  }

  html(){ return `
    <h3>Profit Over Time</h3>
    <svg id="graph-svg" viewBox="0 0 1000 200" preserveAspectRatio="none">
      <polyline id="line" fill="transparent" stroke-width="2" points="0,0 1000,0" />
    </svg>
    <h3>Recent Transactions</h3>
    <slot></slot>
  `}


  get fakeData(){
    let names = ['smith', 'johnson', 'ezra', 'gartner', 'blake', 'archbold', 'mroz', 'xue', 'miller', 'jones', 'williams', 'brown', 'davis', 'miller', 'wilson', 'moore', 'taylor', 'anderson', 'thomas', 'jackson', 'white', 'harris', 'martin', 'thompson', 'garcia', 'martinez', 'robinson', 'clark', 'rodriguez', 'lewis', 'lee', 'walker', 'hall', 'allen', 'young', 'hernandez', 'king', 'wright', 'lopez', 'hill', 'scott', 'green', 'adams', 'baker', 'gonzalez', 'nelson', 'carter', 'mitchell', 'perez', 'roberts', 'turner', 'phillips', 'campbell', 'parker', 'evans', 'edwards', 'collins', 'stewart', 'sanchez', 'morris', 'rogers', 'reed', 'cook', 'morgan', 'bell', 'murphy', 'bailey', 'rivera', 'cooper', 'richardson', 'cox', 'howard', 'ward', 'torres', 'peterson', 'gray', 'ramirez', 'james', 'watson', 'brooks', 'kelly', 'sanders', 'price', 'bennett', 'wood', 'barnes', 'ross', 'henderson', 'coleman', 'jenkins', 'perry', 'powell', 'long', 'patterson', 'hughes', 'flores', 'washington', 'butler', 'simmons', 'foster', 'gonzales', 'bryant', 'alexander', 'russell', 'griffin', 'diaz', 'hayes']
    let letters = 'abcdefghijklmnopqrstuvwxyz'
    let time = new Date().getTime()
    let data = []
    let amountModifier = 5000

    for(let i = 0; i < 2000; i++){
      let type = Math.random() > 0.005 ? 'deposit' : 'withdrawl'
      time -= Math.floor(Math.random() * 60000000)
      let entry = {}

      amountModifier -= 2

      if(type == 'deposit'){
        entry = {
          description: `${type} from ${letters[Math.floor(Math.random() * letters.length)]}${names[Math.floor(Math.random() * names.length)]}`,
          type: type,
          amount: Math.floor(Math.random() * amountModifier) / 1000,
          timestamp: time
        }
      } else {
        entry = {
          description: `Withdrawl to Stripe`,
          type: type,
          amount: (Math.ceil(Math.random() * 10) * 10) + '.00',
          timestamp: time
        }
      }

      data.push(entry)
    }
    console.log(data)
    return data
  }

  get perfData(){
    let names = ['smith', 'johnson', 'ezra', 'gartner', 'blake', 'archbold', 'mroz', 'xue', 'miller', 'jones', 'williams', 'brown', 'davis', 'miller', 'wilson', 'moore', 'taylor', 'anderson', 'thomas', 'jackson', 'white', 'harris', 'martin', 'thompson', 'garcia', 'martinez', 'robinson', 'clark', 'rodriguez', 'lewis', 'lee', 'walker', 'hall', 'allen', 'young', 'hernandez', 'king', 'wright', 'lopez', 'hill', 'scott', 'green', 'adams', 'baker', 'gonzalez', 'nelson', 'carter', 'mitchell', 'perez', 'roberts', 'turner', 'phillips', 'campbell', 'parker', 'evans', 'edwards', 'collins', 'stewart', 'sanchez', 'morris', 'rogers', 'reed', 'cook', 'morgan', 'bell', 'murphy', 'bailey', 'rivera', 'cooper', 'richardson', 'cox', 'howard', 'ward', 'torres', 'peterson', 'gray', 'ramirez', 'james', 'watson', 'brooks', 'kelly', 'sanders', 'price', 'bennett', 'wood', 'barnes', 'ross', 'henderson', 'coleman', 'jenkins', 'perry', 'powell', 'long', 'patterson', 'hughes', 'flores', 'washington', 'butler', 'simmons', 'foster', 'gonzales', 'bryant', 'alexander', 'russell', 'griffin', 'diaz', 'hayes']
    let letters = 'abcdefghijklmnopqrstuvwxyz'
    let time = new Date().getTime()
    let data = []
    for(let i = 0; i < 100; i++){
      let type = 'withdrawl'
      time -= Math.floor(Math.random() * 60000000)
      let entry = {}
      entry = {
        description: `Withdrawl to Stripe`,
        type: type,
        amount: (Math.ceil(Math.random() * 10) * 10) + '.00',
        timestamp: time
      }

      data.push(entry)
    }
    console.log(data)
    return data
  }

  static get observedAttributes() {
    return ['data', 'timespan', 'filter']
  }

  async connectedCallback(){
    performance.mark('ledger-start')
    //this.createEntries(this.perfData)
    let perf = this.fakeData
    let rendered = await this.createEntries(perf)
    performance.mark('ledger-end')
    performance.measure('ledger render time', 'ledger-start', 'ledger-end')
    console.log(performance.getEntriesByName('ledger render time')[0].duration)
    this.renderGraph()
  }

  async attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case 'data':
        this.toggleAttribute('loaded', false)
        let data = await this.getData(newValue, this.authToken)
        if(data.posts) {
          let rendered = await this.createEntries(data.posts)
          performance.mark('ledger-end')
          performance.measure('ledger render time', 'ledger-start', 'ledger-end')
          console.log(performance.getEntriesByName('ledger render time')[0].duration)
        }
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
      let entryMonth = new Date(entry.timestamp).getMonth()
      if(entry.type === 'withdrawl') {
        this.innerHTML += this.renderLedgerLi(entry)
      }
      else {
        if(entryMonth === currentMonth){
          monthsDeposits.push(entry)
        } else {
          // append the month's deposits
          let month = document.createElement('soci-ledger-month')
          month.createEntries(monthsDeposits)
          this.appendChild(month)
          // start a new month
          currentMonth = entryMonth
          monthsDeposits = [entry]
        }
      }
    })
    /*
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
    */
    setTimeout(()=>{
      this.toggleAttribute('loaded', true)
    }, 1)
    return true
  }

  renderLedgerLi(entry){
    let date = new Date(entry.timestamp).toLocaleString('default', {
      month: 'numeric',
      day: 'numeric'
    })
    return`
      <soci-ledger-li type="${entry.type}">
        <div slot="date">${date}</div>
        <div slot="description">${entry.description}</div>
        <div slot="amount">${entry.amount}</div>
      </soci-ledger-li>
    `
  }

  renderGraph(){
    let amounts = []
    let maxAmount = 0
    Array.from(this.querySelectorAll('soci-ledger-month')).forEach(month => {
      let amount = parseFloat(month.getAttribute('total').substring(1))
      maxAmount = Math.max(maxAmount, amount)
      amounts.push(amount)
    })

    amounts.reverse()
    let polyString = ''
    let distance = 1000 / (amounts.length - 1)
    let offset = 0
    amounts.forEach((a, i) => {
      let height = 190 - (a / maxAmount * 170)
      if(i == 0) polyString += `-10 ${height} `
      polyString += `${offset} ${height} `
      if(i == amounts.length - 1) polyString += ` 1010 ${height} 1010 210 -10 210`
      offset += distance
    })

    this.select('#line').setAttribute('points', polyString)
    console.log(polyString)
  }
}