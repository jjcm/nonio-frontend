import SociComponent from './soci-component.js'

export default class SociContributionSlider extends SociComponent {
  static formAssociated = true

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  css(){
    return `
      :host {
        margin-bottom: 16px;
        display: block;
      }

      h2 {
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: normal;
        color: var(--n3);
        line-height: 40px;
        margin-bottom: 4px;
      }

      slider {
        position: relative;
        display: block;
        margin: 8px 0 16px;
      }

      slider-track {
        height: 4px;
        width: 100%;
        background: var(--b1);
        display: block;
        opacity: 0.4;
        position: relative;
      }

      slider-track::before {
        content: '';
        width: 30px;
        height: 4px;
        background: var(--n3);
        border-right: 2px solid #fff;
        display: block;
      }

      slider-handle {
        width: 16px;
        height: 16px;
        background: var(--b1);
        display: block;
        position: absolute;
        top: -6px;
        left: 110px;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 0 0 8px var(--b2) inset;
        transition: box-shadow 0.1s var(--soci-ease-out);
      }

      slider-handle:focus {
        outline: 0;
      }

      slider-handle:focus:not(:active) {
        box-shadow: 0 0 0 2px var(--b2) inset;
      }

      info {
        display: flex;
      }

      amount {
        display: block;
        font-size: 22px;
        font-weight: bold; 
      }

      label {
        font-size: 11px;
        color: var(--n3);
      }

      server {
        max-width: 42px;
      }

      server amount {
        color: var(--n3);
      }

      contribution {
        max-width: 80px;
        margin-right: auto;
        margin-left: 8px;
      }

      contribution amount {
        color: var(--b2);
      }

      total {
        min-width: 110px;
        text-align: right;
      }

      total span {
        font-weight: 100;
        color: var(--n3);
      }

    `
  }

  html(){
    return `
      <slider>
        <slider-track></slider-track>
        <slider-handle @mousedown=_mouseDown tabindex="0"></slider-handle>
      </slider>
      <info>
        <server>
          <amount>$1</amount>
          <label>server fee</label>
        </server>
        <contribution>
          <amount>$4</amount>
          <label>artist contribution</label>
        </contribution>
        <total>
          <amount>$5<span>/month</span></amount>
        </total>
      </info>
    `
  }

  connectedCallback(){
    this.state = {}
    this.state.x = 110
    this._contributionHandle = this.select('slider-handle')
    this._contributionAmount = this.select('contribution amount')
    this._totalAmount = this.select('total amount')
  }

  checkValidity() {
    return this._internals.checkValidity()
  }

  get value(){
    let val = (this._dragOffset - 52) / 22
    return Math.floor(val + 2)
  }

  set value(val){
  }

  get _dragOffset(){
    let leftOffset = this.state.x - (this.state.xDown - this.state.mouseClientX)
    leftOffset = Math.min(228, Math.max(52, leftOffset))
    return leftOffset
  }

  _mouseDown(e){
    this.state.xDown = e.clientX
    this._mouseMove = this._mouseMove.bind(this)
    this._mouseUp = this._mouseUp.bind(this)
    document.addEventListener('mousemove', this._mouseMove)
    document.addEventListener('mouseup', this._mouseUp)
  }

  _mouseMove(e){
    document.body.setAttribute('dragging', '')
    this.state.mouseClientX = e.clientX
    this._contributionHandle.style.left = this._dragOffset + 'px'
    this._contributionAmount.innerHTML = '$' + (this.value - 1)
    this._totalAmount.innerHTML = `$${this.value}<span>/month</span>`
    let message = ''
    switch(this.value) {
      case 2: 
        message = 'I\'m a starving artist'
        break;
      case 3: 
      case 4: 
        message = 'I\'m a regular joe'
        break;
      case 5: 
      case 6: 
        message = 'I support the arts!'
        break;
      case 7: 
      case 8: 
        message = 'I\'m a philanthropist!!!'
        break;
      case 9: 
        message = 'Epstein didnt kill himself'
        break;
      case 10: 
        message = '<3 <3 <3'
        break;
    }
    this.previousElementSibling.innerHTML = message
  }

  _mouseUp(){
    document.body.removeAttribute('dragging')
    document.removeEventListener('mousemove', this._mouseMove)
    document.removeEventListener('mouseup', this._mouseUp)
    this.state.x = this._dragOffset
    this.previousElementSibling.innerHTML = 'Contribution'
    this._contributionHandle.blur()
  }
}
