import SociComponent from './soci-component.js'

export default class SociLedgerLi extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: flex;
        padding: 8px;
        gap: 8px;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid var(--base-background-subtle);
        border-radius: 4px;
        line-height: 24px;
        margin-bottom: 4px;
      }

      :host([type="withdrawl"]) slot[name="amount"] {
        color: var(--error-text);
      }

      :host([type="withdrawl"]) slot[name="amount"]::before {
        content: "-$";
      }

      slot[name="description"] {
        display: block;
        padding-right: 12px;
        margin-right: 12px;
        width: 100%;
        font-weight: bold;
      }

      slot[name="date"] {
        color: var(--base-text-subtle);
      }

      slot[name="amount"] {
        padding-left: 12px;
        min-width: 120px;
        display: flex;
        font-weight: bold;
        justify-content: flex-end;
      }
      
      slot[name="amount"]::before {
        content: '$';
      }
    `
  }

  html(){ return `
    <soci-icon glyph="create"></soci-icon>
    <slot name="date"></slot>
    <slot name="description"></slot>
    <slot name="amount"></slot>
  `}
}
