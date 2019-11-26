import SociComponent from './soci-component.js'

const IMAGE_SERVER = '//images.non.io/'

export default class SociFileDrop extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        width: 100%;
        min-height: 240px;
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

        --upload-progress: 0%;
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
        z-index: -1;
      }

      input {
        display: none;
      }

      div {
        font-weight: 500;
        color: var(--n3);
        margin-bottom: 12px;
        mix-blend-mode: multiply;
      }

      label {
        border-radius: 14px;
        height: 24px;
        color: var(--n0);
        cursor: pointer;
        background: var(--b3);
        border: 2px solid var(--b3);
        padding: 0 6px;
        line-height: 22px;
        text-align: center;
        outline: none;
        min-width: 100px;
        transition: height 0.1s ease-in-out;
        user-select: none;
        position: relative;
      }
      label:active {
        background: var(--b2);
        border-color: var(--b2);
      }
      label.uploading {
        height: 8px;
        transition: all 0.1s ease-in-out;
        background: #fff;
        border-color: var(--g1);
      }
      label.uploading:after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 8px;
        width: var(--upload-progress);
        transition: width 0.1s linear;
        background: var(--g1);
      }
    `
  }

  html(){ return `
    <div>drag file here</div>
    <label for="file">select file</label>
    <input id="file" type="file" accept="*"/>
    <picture>
    </picture>
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
    this.select('div').innerHTML = `Uploading ${e.dataTransfer.files[0].name}...`
    this.select('label').innerHTML = ''
    this.select('label').classList.add('uploading')
    this.upload(e.dataTransfer.files[0])
  }

  upload(file){
    let data = new FormData();
    let request = new XMLHttpRequest();

    data.append('file', file || this.select('input').files[0])
    data.append('url', 'a22')

    // AJAX request finished
    request.addEventListener('load', e => {
      // request.response will hold the response from the server
      console.log('upload finished')
      console.log(request.response);

      this.select('picture').innerHTML = `
        <source srcset="${IMAGE_SERVER + request.response.path}">
        <img src="${IMAGE_SERVER + request.response.path}">
      `
    });

    // Upload progress on request.upload
    request.upload.addEventListener('progress', e => {
      var percent_complete = (e.loaded / e.total) * 100;
      this.style.setProperty('--upload-progress', `${percent_complete}%`)
      
      // Percentage of upload completed
      console.log(percent_complete);
    });

    // If server is sending a JSON response then set JSON response type
    request.responseType = 'json';

    // Send POST request to the server side script
    request.open('post', IMAGE_SERVER + 'upload'); 
    request.send(data);
  }
}