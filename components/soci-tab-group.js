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
    return html`
      ${tabs.map((tab) => {
        let name = tab.getAttribute('name')
        if(!name) this.log('Tab is missing a name')
        let active = tab.hasAttribute('active')
        return html`<tab @click=${tab.activate} ?active=${active}>${name}</tab>`
      })}
    `
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