import SociComponent from './soci-component.js'

export default class SociTabGroup extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      tabs {
        display: flex;
        color: var(--n3);
        margin-top: 28px;
        margin-bottom: 10px;
        user-select: none;
      }
      tab {
        display: block;
        margin-right: 32px;
        font-weight: 500;
        position: relative;
        cursor: pointer;
        padding: 8px;
      }
      tab:first-child {
        padding-left: 0;
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
        top: 4px;
        border-radius: 2px;
        left: calc(50% - 8px);
      }
      tab[active]:first-child:after {
        left: calc(50% - 12px);
      }
    ` 
  }

  html(){ return `
      <tabs @click=_tabClick>
        ${this._createTabs()}
      </tabs>
      <slot></slot>
    `
  }

  connectedCallback(){
    this.addEventListener('tabactivate', this._tabActivated)
  }

  _createTabs(){
    let tabs = Array.from(this.querySelectorAll('soci-tab'))
    return `
      ${tabs.map((tab, i) => {
        let name = tab.getAttribute('name')
        if(!name) this.log('Tab is missing a name')
        return `<tab name=${name} ${i==0 ? 'active' : ''}>${name}</tab>`
      }).join('')}
    `
  }

  _tabClick(e){
    let tab = e.target
    if(tab.tagName != 'TAB') return 0
    let name = tab.innerText
    let tabs = Array.from(this.querySelectorAll('soci-tab'))
    tabs.forEach(tab=>tab[tab.getAttribute('name') == name ? 'activate' : 'deactivate']())
  }

  _tabActivated(e){
    let prevTab = this.select('[active]')
    if(prevTab) prevTab.removeAttribute('active')

    let name = e.target.getAttribute('name')
    this.select(`tab[name=${name}]`).setAttribute('active', '')
  }
}