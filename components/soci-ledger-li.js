import SociComponent from './soci-component.js'

export default class SociLedgerLi extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        background: var(--base-background);
        margin-bottom: 8px;
        display: flex;
        padding: 0 12px;
        border-radius: 8px;
        box-shadow: 0px 1px 3px var(--shadow);
        box-sizing: border-box;
        opacity: 1;
        position: relative;
      }

      :host([type="deposit"]) {
        background: var(--success-text);
        color: var(--base-text-inverse);
      }

      slot {
        height: 40px;
        line-height: 40px;
      }

      slot[name="description"] {
        display: block;
        border-right: 1px solid var(--base-text-inverse);
        padding-right: 12px;
        margin-right: 12px;
        width: 100%;
      }

      slot[name="amount"] {
        padding-left: 12px;
        min-width: 120px;
        display: flex;
        font-size: 18px;
        font-weight: bold;
        justify-content: flex-end;
      }
      
      slot[name="amount"]::before {
        content: '$';
        opacity: 0.5;
        font-weight: normal;
      }
    `
  }

  html(){ return `
    <slot name="description"></slot>
    <slot name="amount"></slot>
  `}
}
