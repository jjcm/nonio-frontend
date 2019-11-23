import SociComponent from './soci-component.js'

export default class SociFileDrop extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        width: 100%;
        height: 240px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border: 2px dashed var(--n2);
        box-sizing: border-box;
        border-radius: 8px;
        margin-bottom: 12px;
        position: relative;
        transition: border 0.2s ease;
      }

      :host([dragover]) {
        border: 2px dashed var(--g1);
        transition: border 0.1s ease-out;
      }

      :host:before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--g1);
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
      }

      :host([dragover]):before {
        opacity: 0.1;
        transition: opacity 0.1s ease-out;
      }

      input {
        display: none;
      }

      div {
        font-weight: 500;
        color: var(--n3);
        margin-bottom: 12px;
      }

      label {
        border-radius: 14px;
        height: 28px;
        color: var(--n0);
        cursor: pointer;
        background: var(--b3);
        border: none;
        padding: 0 8px;
        line-height: 26px;
        text-align: center;
        outline: none;
        min-width: 100px;
      }
      label:active {
        background: var(--b2);
      }
    `
  }

  html(){ return `
    <div>drag file here</div>
    <label for="file">select file</label>
    <input id="file" type="file" accept="*"/>
  `}

  connectedCallback(){
    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach(
      e => this.addEventListener(e, this['_' + e])
    )
  }

  static get observedAttributes() {
    return ['type']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'type') {
      const TYPES = {
        image: 'image/*',
        video: 'video/*',
        audio: 'audio/*',
        html: 'zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed'
      }
      this.select('div').innerHTML = `drag ${newValue} here`
      this.select('label').innerHTML = `select ${newValue}`
      this.select('input').setAttribute('accept', TYPES[newValue])
    }
  }

  _dragenter(e){
    e.preventDefault()
    this.setAttribute('dragover', '')
  }

  _dragover(e){
    e.preventDefault()
  }

  _dragleave(e){
    this.removeAttribute('dragover', '')
  }

  _drop(e){
    e.preventDefault()
    e.stopPropagation()
    console.log(e.dataTransfer.files)
    this.select('div').innerHTML = "Image uploaded"
    this.select('label').innerHTML = e.dataTransfer.files[0].name
  }
}
