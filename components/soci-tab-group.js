import {SociComponent, html} from './soci-component.js'

export default class SociTabGroup extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      tabs {
        display: flex;
        color: var(--n3);
        margin-top: 36px;
        margin-bottom: 18px;
      }
      tab {
        display: block;
        margin-right: 42px;
        font-weight: 500;
        position: relative;
        cursor: pointer;
      }
      tab:hover {
        color: var(--n4);
      }
      tab[active]{
        color: var(--n4);
      }
      tab[active]:after{
        content: '';
        height: 4px;
        width: 16px;
        background-color: var(--n4);
        display: block;
        position: absolute;
        top: -4px;
        border-radius: 2px;
        left: calc(50% - 8px);
      }
    `
  }

  createTabs(){
    let tabs = Array.from(this.querySelectorAll('soci-tab'))
    this.activateTab = this.activateTab.bind(this)
    return html`
      ${tabs.map((tab, i) => {
        let name = tab.getAttribute('name')
        if(!name) this.log('Tab is missing a name')
        return html`<tab @click=${this.activateTab} ?active=${i==0}>${name}</tab>`
      })}
    `
  }

  activateTab(e){
    let prevTab = this.select('[active]')
    if(prevTab) prevTab.removeAttribute('active')
    let tab = e.currentTarget
    tab.toggleAttribute('active')
    console.log(tab)
    let name = tab.innerText
    let tabs = Array.from(this.querySelectorAll('soci-tab'))
    tabs.forEach(tab=>tab[tab.getAttribute('name') == name ? 'activate' : 'deactivate']())
  }

  connectedCallback(){
    let firstTab = this.querySelector('soci-tab')
    if(firstTab) firstTab.activate()
    else this.log('Tab group has no children - add some tabs ya kook')
  }

  render(){
    return html`
      ${this.getCss()}
      <tabs>
        ${this.createTabs()}
      </tabs>
      <slot></slot>
    `
  }
}