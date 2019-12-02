import SociComponent from './soci-component.js'

export default class SociTagInput extends SociComponent {
  static formAssociated = true

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  css(){
    return `
      :host {
        --tag-height: 20px;
        display: inline-block;
        height: var(--tag-height);
        border-radius: calc(var(--tag-height) / 2);
        background: var(--n1);
        font-size: calc(var(--tag-height) / 2);
        line-height: var(--tag-height);
        color: var(--n3);
        cursor: pointer;
        font-weight: 600;
        user-select: none;
        transition: background 0.1s var(--soci-ease-out);
      }
      :host(:hover) {
        filter: brightness(0.9) contrast(1.2);
      }
      input {
        border: none;
        background: inherit;
        height: 100%;
        padding: 0 calc(var(--tag-height) / 2.5) 0 calc(var(--tag-height) / 2.5 + 1ch);
        border-radius: calc(var(--tag-height) / 2);
        font-size: inherit;
        cursor: pointer;
        width: 100%;
        position: relative;
      }
      input:focus,
      input:active {
        box-shadow: 0 0 0 2px var(--b2);
        outline: 0;
        cursor: text;
      }
      input::placeholder {
        text-align: center;
        font-size: calc(var(--tag-height) / 1.5);
        background: var(--n1);
        box-shadow: 0 0 0 20px var(--n1);
      }
      input:focus::placeholder {
        color: transparent;
        background: transparent;
        box-shadow: none;
      }
      slot {
        display: inline-block;
      }
      container {
        position: relative;
      }
      container div {
        position: absolute;
        left: calc(var(--tag-height) / 2.5);
        font-weight: 300;
      }
    `
  }

  html(){ return `
    <container>
      <div>#</div>
      <input type="text" placeholder="+"></input>
    </container>
  `}

  connectedCallback(){
    this._internals.setValidity({customError: true}, 'Submissions require at least one tag.')
    this._input = this.select('input')

    this._input.addEventListener('change', this._onChange.bind(this))
    this.addEventListener('focus', this._onFocus.bind(this))
  }

  checkValidity() {
    return this._internals.checkValidity()
  }

  get value() {
    return this._input.value
  }

  set value(val) {
    this._input.value = val
    this._internals.setFormValue(val)
  }

  _onFocus(e) {
    this._input.focus()
  }

  _onChange(e) {
    this._internals.setFormValue(this.value)
  }
}
