export default class SociInput extends HTMLElement {
  static get formAssociated() {
    return true
  }

  constructor() {
    super()
    this._internals = this.attachInternals()
    this._onInput = this._onInput.bind(this)
    this._onFocusIn = this._onFocusIn.bind(this)
    this._onFocusOut = this._onFocusOut.bind(this)
  }

  connectedCallback(){
    // Vanilla markdown input + preview.
    // The renderer is delegated to <soci-markdown-view> which uses markdown-wasm.
    const placeholder = this.getAttribute('placeholder') || 'Enter comment'
    const readOnly = this.hasAttribute('readonly')

    this.innerHTML = `
      <style>
        /* Ported from the old Quill-based soci-input styling (was in quillStyle.css) */
        soci-input {
          --min-height: 0px;
          --padding: 12px 16px;
          min-height: var(--min-height);
          position: relative;
          display: flex;
          flex-direction: column;
          transition: padding 0.1s ease-out, border-color 0.5s ease;
          padding-bottom: 0px;
          box-sizing: border-box;
        }

        /* quick fix for ios zooming inputs */
        @media (max-width: 768px) {
          soci-input {
            font-size: 16px;
          }
        }

        soci-input[subtle]{
          --padding: 0px;
          border-color: transparent !important;
        }

        .container {
          display: flex;
          flex-direction: column;
        }

        textarea {
          box-sizing: border-box; /* requested */
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

        /* Preview should only show while actively editing */
        .preview-shell {
          overflow: hidden;
          max-height: 0px;
          opacity: 0;
          transform: translateY(-4px);
          transition: max-height 0.2s var(--soci-ease), opacity 0.2s var(--soci-ease), transform 0.2s var(--soci-ease);
          border-top: 1px solid var(--bg-bold);
        }

        soci-input[editing] .preview-shell {
          max-height: 520px;
          opacity: 1;
          transform: translateY(0px);
        }

        .preview {
          padding-top: 10px;
        }

        .preview-label {
          font-size: 12px;
          letter-spacing: 0.2px;
          text-transform: uppercase;
          opacity: 0.7;
          margin-bottom: 6px;
        }
      </style>

      <div class="container">
        <textarea class="md-input" ${readOnly ? 'readonly' : ''} placeholder="${this._escapeHtml(placeholder)}"></textarea>
        <div class="preview-shell" aria-hidden="true">
          <div class="preview">
            <div class="preview-label">Preview</div>
            <soci-markdown-view class="md-preview"></soci-markdown-view>
          </div>
        </div>
      </div>
    `

    this._textarea = this.querySelector('textarea.md-input')
    this._preview = this.querySelector('soci-markdown-view.md-preview')
    this._previewShell = this.querySelector('.preview-shell')

    if (!readOnly) {
      this._textarea.addEventListener('input', this._onInput)
      this._textarea.addEventListener('focusin', this._onFocusIn)
      this._textarea.addEventListener('focusout', this._onFocusOut)
    }

    // Initialize preview if value was set before connectedCallback.
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
    // Markdown string
    return this._textarea?.value ?? this._value ?? ''
  }

  focus() {
    this._textarea?.focus()
  }

  setSelection(val) {
    // Rough parity: expects { start, end } or [start,end]; map to textarea selection.
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

  renderOpsToHTML(val){
    if (val != null) this.value = val
    return this._preview?.innerHTML || ''
  }

  set value(val){
    if (val == null) return
    const v = String(val)
    this._value = v
    if (this._textarea) this._textarea.value = v
    this._internals.setFormValue(v)
    if (this._preview) this._preview.value = v
  }

  clear(){
    this.value = ''
  }

  _onInput() {
    const v = this.value
    this._internals.setFormValue(v)
    if (this._preview) this._preview.value = v
    this.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }))
  }

  _onFocusIn() {
    // "Actively editing" = focused textarea.
    this.toggleAttribute('editing', true)
    if (this._previewShell) this._previewShell.setAttribute('aria-hidden', 'false')
    // ensure preview is in sync immediately
    if (this._preview) this._preview.value = this.value
  }

  _onFocusOut() {
    this.toggleAttribute('editing', false)
    if (this._previewShell) this._previewShell.setAttribute('aria-hidden', 'true')
  }
}