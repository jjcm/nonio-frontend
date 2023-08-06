import SociComponent from './soci-component.js'

export default class SociNotificationBadge extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: inline-flex;
        border: 0;
        border-radius: 3px;
        height: 20px;
        min-height: 20px;
        line-height: 20px;
        padding: 0 4px;
        font-size: 12px;
        margin-right: 4px;
        cursor: pointer;
        position: relative;
        float: right;
        user-select: none;
        text-align: center;
        box-sizing: border-box;
        background: var(--bg-secondary-hover);
        color: var(--text-secondary);
        gap: 0px;
        --transition-time: 0.1s;
        transition: all var(--transition-time) ease;
      }

      :host([loaded]) {
        --transition-time: 0.2s;
      }

      :host([count]) {
        color: var(--text-danger);
        gap: 4px;
        padding: 0 8px;
      }

      span {
        transform: translateY(8px);
        opacity: 0;
        transition: opacity var(--transition-time) ease, transform var(--transition-time) ease;
        color: var(--text-danger);
      }

      :host([count]) span {
        transform: translateY(0);
        opacity: 1;
      }

      :host([count]:hover) {
        color: var(--text-danger-hover);
      }

      :host([count]:hover) span {
        color: var(--text-danger-hover);
      }

      soci-link {
        display: contents;
      }
    `
  }

  html(){ return `
    <soci-link href="/notifications" fresh>
      <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 14C10.7761 14 11 13.7761 11 13.5V6.5C11 6.22386 10.7761 6 10.5 6H1.5C1.22494 6 1.00175 6.22211 1.00001 6.49677C1 6.49784 1 6.49892 1 6.5L1 7.5C1 7.49981 1 7.50019 1 7.5V13.5C1 13.7761 1.22386 14 1.5 14H10.5ZM3 8L5.29289 10.2929C5.68342 10.6834 6.31658 10.6834 6.70711 10.2929L9 8V12H3V8Z" fill="currentColor"/></svg>
      <span></span>
    </soci-link>
  `}

  static get observedAttributes() {
    return ['count']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case 'count':
        this.select('span').innerHTML = newValue
        break
    }
  }

  async connectedCallback(){
    // Start checking every 10s
    this.exponentialBackoff = 10000
    await this.checkNotifications()
    setTimeout(() => {
      this.toggleAttribute('loaded', true)
    }, 100)

    // Triggers when you switch tabs back to nonio 
    document.addEventListener('visibilitychange', () => {
      if(document.visibilityState == 'visible'){
        this.checkNotifications()
        this.exponentialBackoff = 10000
      }
    })

    // Creating posts and comments triggers this
    document.addEventListener('activitychange', () => {
      this.checkNotifications()
      this.exponentialBackoff = 10000
    })
  }

  async checkNotifications(){
    if(this.nextCheck) clearTimeout(this.nextCheck)
    let count = await this.getData('/notifications/unread-count', this.authToken)
    if(count == 0) this.removeAttribute('count')
    else this.setAttribute('count', count)
    this.nextCheck = setTimeout(this.checkNotifications.bind(this), this.exponentialBackoff)
    this.exponentialBackoff = Math.min(this.exponentialBackoff * 1.3, 1800000 /* 30 minutes */)
  }
}
