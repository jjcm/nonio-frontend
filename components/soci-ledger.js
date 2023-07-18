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
        padding: 2px 0 28px;
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
      <polyline vector-effect="non-scaling-stroke" id="line" fill="transparent" stroke-width="2" points="0,0 1000,0" />
    </svg>
    <h3>Recent Transactions</h3>
    <slot></slot>
  `}


  async connectedCallback(){
    let ledgerData = await this.getData('/user/get-financial-ledger', this.authToken)
    await this.createEntries(ledgerData)
    this.renderGraph()
  }

  disconnectedCallback(){
    this.innerHTML = ''
  }

  async createEntries(data){
    let monthsDeposits = []
    let currentMonth = new Date().getMonth()
    data.forEach(entry => {
      let entryMonth = new Date(entry.createdAt).getMonth()
      if(entry.type === 'withdrawal') {
        this.innerHTML += this.renderLedgerLi(entry)
      }
      else {
        if(entryMonth === currentMonth){
          monthsDeposits.push(entry)
        } else {
          // append the month's deposits
          this.createMonth(monthsDeposits)
          // start a new month
          currentMonth = entryMonth
          monthsDeposits = [entry]
        }
      }
    })
    this.createMonth(monthsDeposits)
    setTimeout(()=>{
      this.toggleAttribute('loaded', true)
    }, 1)
    return true
  }

  createMonth(monthsDeposits){
    let dedupedMonthsDeposits = []
    let prevEntry = null
    monthsDeposits.forEach(entry => {
      if(prevEntry && prevEntry.description === entry.description){
        prevEntry.amount = parseFloat(prevEntry.amount) + parseFloat(entry.amount)
        prevEntry.count++
      } else {
        dedupedMonthsDeposits.push(entry)
        prevEntry = entry
        prevEntry.count = 1
      }
    })
    dedupedMonthsDeposits.map(entry => {
      entry.description = `${entry.count} ${entry.description.replace('deposit', `vote${entry.count > 1 ? 's' : ''}`)}`
    })
    let month = document.createElement('soci-ledger-month')
    month.createEntries(dedupedMonthsDeposits)
    this.appendChild(month)
  }

  renderLedgerLi(entry){
    let date = new Date(entry.createdAt).toLocaleString('default', {
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
  }
}