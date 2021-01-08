import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociVideoUploader extends SociComponent {
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
        border: 2px dashed var(--base-background-subtle);
        box-sizing: border-box;
        border-radius: 8px;
        margin-bottom: 12px;
        position: relative;
        transition: border 0.2s ease;

        --upload-progress: 0%;
      }

      :host([dragover]) {
        border: 2px dashed var(--success-background);
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
        background: var(--success-background);
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
      }

      :host([dragover]):before {
        opacity: 0.1;
        transition: opacity 0.1s ease-out;
        z-index: -1;
      }

      div {
        font-weight: 500;
        color: var(--base-text-subtle);
        margin-bottom: 12px;
        mix-blend-mode: multiply;
      }

      label {
        border-radius: 14px;
        height: 24px;
        color: var(--base-text-inverse);
        cursor: pointer;
        background: var(--brand-background);
        border: 2px solid var(--brand-background);
        padding: 0 6px;
        line-height: 22px;
        text-align: center;
        outline: none;
        min-width: 100px;
        transition: height 0.1s ease-in-out;
        user-select: none;
        position: relative;
      }
      label:hover {
        background: var(--brand-background-hover);
        border-color: var(--brand-background-hover);
      }
      label:active {
        background: var(--brand-background-active);
        border-color: var(--brand-background-active);
      }
      label.uploading {
        height: 8px;
        transition: all 0.1s ease-in-out;
        background: var(--base-background);
        border-color: var(--success-background);
      }
      label.uploading:after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 8px;
        width: var(--upload-progress);
        transition: width 0.3s ease;
        background: var(--success-background);
      }
      :host([preview]) {
        min-height: 0;
        border-color: transparent;
        transition: all 0.2s ease-in-out;
        overflow: hidden;
      }
      :host([preview]):before {
        opacity: 0;
        transition: all 0.2s ease-in-out;
      }
      :host([preview]) label,
      :host([preview]) div {
        display: none;
      }
      #preview {
        max-width: 100%;
        display: none;
      }
      :host([preview]) #preview {
        display: block;
      }
      input {
        display: none;
      }
    `
  }

  html(){ return `
    <div>drag video here</div>
    <label for="file">select file</label>
    <input id="file" type="file" accept="video/*"/>
    <video id="preview" muted autoplay controls loop></video>
    <div id="encoding">
      <columns>
        <column>
          <div class="fidelity">
          </div>
      </columns>
    </div>
  `}

  connectedCallback(){
    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach(
      e => this.addEventListener(e, this['_' + e])
    )

    this.select("#file").addEventListener('change', this.upload.bind(this))
    this.select("#file").addEventListener('change', ()=>{console.log('file changed')})
    this.select("#file").addEventListener('input', ()=>{console.log('file input')})
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
      this.select('#preview')?.remove()
      switch (newValue) {
        case 'image':
          let picture = document.createElement('picture')
          picture.id = 'preview'
          this.shadowRoot.appendChild(picture)
          break
        case 'video':
          let video = document.createElement('video')
          video.toggleAttribute('muted', true)
          video.toggleAttribute('autoplay', true)
          video.toggleAttribute('controls', true)
          video.toggleAttribute('loop', true)
          video.id = 'preview'
          this.shadowRoot.appendChild(video)
      }
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

    let input = this.select('#file')
    input.files = e.dataTransfer.files
    let event = new Event('change')
    input.dispatchEvent(event)

    //this.upload(e.dataTransfer.files[0])
  }

  upload(){
    let data = new FormData()
    let request = new XMLHttpRequest()
    let UPLOAD_HOST = this.type == 'image' ? config.IMAGE_HOST : config.VIDEO_HOST

    data.append('files', this.select('input').files[0])
    data.append('url', this.closest('form').querySelector('soci-url-input').value)

    request.open('post', UPLOAD_HOST + '/upload') 

    request.addEventListener('load', e => {
      this.encode(request.response)
    })

    request.upload.addEventListener('progress', e => {
      var percent_complete = (e.loaded / e.total) * 100
      this.style.setProperty('--upload-progress', `${percent_complete}%`)
    })

    request.open('post', UPLOAD_HOST + '/upload') 
    request.setRequestHeader('Authorization', 'Bearer ' + this.authToken)
    request.send(data)
  }

  async encode(filename){
    var conn = new WebSocket(`ws://localhost:4204/encode?file=${filename}`);
    conn.onclose = function(evt) {
      console.log('connection closed')
    }
    conn.onmessage = function(evt) {
      let message = evt.data.split(':')
      if(message[0] == 'resolution'){
        console.log("resolution is: " + message[1])
      }
      else if(message[0].match(/480p|720p|1080p|1440p|4k/)){
        console.log(message[1])
      }
    }
  }

  async move(url){
    let UPLOAD_HOST = this.type == 'image' ? config.IMAGE_HOST : config.VIDEO_HOST
    return new Promise((resolve, reject) => {
      if(this.fileUrl == url) resolve(url)

      let data = new FormData()
      let request = new XMLHttpRequest()

      data.append('oldUrl', this.fileUrl)
      data.append('url', url)

      request.addEventListener('load', e => {
        if(request.status >= 200 && request.status < 300) {
          this.fileUrl = request.response
          resolve(request.response)
        }
        else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      })

      request.addEventListener('error', e => {
        reject({
          status: e.status,
          statusText: request.statusText
        })
      })

      request.open('post', UPLOAD_HOST + '/move')
      request.setRequestHeader('Authorization', 'Bearer ' + this.authToken)
      request.send(data)
    })
  }

  get type(){
    return this.getAttribute('type')
  }

  preview(filename){
    if(this.type == 'image'){
      this.select('#preview').innerHTML = `
        <source srcset="${UPLOAD_HOST + '/' + filename}.webp">
        <img src="${UPLOAD_HOST + '/' + filename}.webp">
      `
    }
    else {
      this.select('#preview').innerHTML = `
        <source type="video/webm" src="${UPLOAD_HOST + '/' + filename}.webm">
      `
    }
    this.toggleAttribute('preview', true)
    this.fileUrl = filename
  }
}