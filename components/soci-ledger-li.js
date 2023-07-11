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
        border-radius: 4px;
        line-height: 24px;
        margin-bottom: 4px;
      }

      :host([type="withdrawal"]) {
        border: 1px solid var(--bg-secondary);
      }

      soci-icon {
        display: none;
      }

      :host([type="withdrawal"]) soci-icon {
        display: block;
        transform: scale(0.8);
      }


      :host([type="withdrawal"]) slot[name="amount"] {
        color: var(--text-danger);
      }

      :host([type="withdrawal"]) slot[name="amount"]::before {
        content: "-$";
      }

      slot[name="description"] {
        white-space: nowrap;
      }

      :host([type="withdrawal"]) slot[name="description"] {
        font-weight: bold;
      }

      slot[name="date"] {
        display: block;
        color: var(--text-secondary);
        width: 100%;
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
    <soci-icon glyph="downvote"></soci-icon>
    <slot name="description"></slot>
    <slot name="date"></slot>
    <slot name="amount"></slot>
  `}
}
