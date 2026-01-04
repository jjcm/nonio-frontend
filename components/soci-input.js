export default class SociInput extends HTMLElement {
  static get formAssociated() {
    return true
  }

  constructor() {
    super()
    this._internals = this.attachInternals()
    this._onInput = this._onInput.bind(this)
  }

  connectedCallback(){
    const placeholder = this.getAttribute('placeholder') || 'Enter comment'
    const readOnly = this.hasAttribute('readonly')

    this.innerHTML = `
      <style>
        soci-input {
          --min-height: 0px;
          --padding: 8px 12px;
          min-height: var(--min-height);
          position: relative;
          display: flex;
          flex-direction: column;
          transition: padding 0.1s ease-out, border-color 0.5s ease;
          padding-bottom: 0px;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          soci-input {
            font-size: 16px;
          }
        }

        soci-input[subtle]{
          --padding: 0px;
          border-color: transparent !important;
        }

        textarea {
          box-sizing: border-box;
          width: 100%;
          min-height: var(--min-height);
          transition: min-height 0.1s ease-out, padding 0.1s var(--soci-ease);
          padding: var(--padding);
          font: inherit;
          line-height: 1.42;
          color: var(--text);
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          overflow-y: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        textarea[readonly] {
          opacity: 0.7;
          cursor: default;
        }
      </style>

      <textarea class="md-input" ${readOnly ? 'readonly' : ''} placeholder="${this._escapeHtml(placeholder)}"></textarea>
    `

    this._textarea = this.querySelector('textarea.md-input')

    if (!readOnly) {
      this._textarea.addEventListener('input', this._onInput)
    }

    if (this._value != null) this.value = this._value
  }

  checkValidity() {
    return this._internals.checkValidity()
  }

  _escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }

  get value(){
    return this._textarea?.value ?? this._value ?? ''
  }

  focus() {
    this._textarea?.focus()
  }

  setSelection(val) {
    if (!this._textarea) return
    if (Array.isArray(val)) {
      this._textarea.setSelectionRange(val[0] || 0, val[1] || val[0] || 0)
    } else if (val && typeof val === 'object') {
      this._textarea.setSelectionRange(val.start || 0, val.end || val.start || 0)
    }
  }

  setText(val) {
    this.value = val
  }

  set value(val){
    if (val == null) return
    const v = String(val)
    this._value = v
    if (this._textarea) this._textarea.value = v
    this._internals.setFormValue(v)
  }

  clear(){
    this.value = ''
  }

  _onInput() {
    this._internals.setFormValue(this.value)
    this.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }))
  }
}