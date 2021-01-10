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

      :host([state="uploading"]),
      :host([state="encoding"]) {
        border: 2px dashed var(--brand-background);
      }

      #uploading {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .info {
        font-weight: 500;
        color: var(--base-text-subtle);
        margin-bottom: 12px;
        mix-blend-mode: multiply;
        text-align: center;
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
        border-color: var(--brand-background);
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
        background: var(--brand-background);
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
      #encoding {
        width: 240px;
        display: none;
      }
      :host([state="encoding"]) #encoding {
        display: block;
      }
      :host([state="encoding"]) #uploading {
        display: none;
      }
      columns {
        display: flex;
      }
      column {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .fidelity {
        line-height: 24px;
        width: 100px;
        display: flex;
        margin-bottom: 8px;
      }
      soci-radial-progress {
        margin-right: 10px;
      }

    `
  }

  html(){ return `
    <div id="uploading">
    <div class="info">drag video here</div>
    <label for="file">select file</label>
    <input id="file" type="file" accept="video/*"/>
    <video id="preview" muted autoplay controls loop></video>
    </div>
    <div id="encoding">
      <div class="info">encoding video...</div>
      <columns>
        <column>
          <div class="fidelity" resolution="source">
            <soci-radial-progress percent="0" ></soci-radial-progress>
            <div class="resolution">Source</div>
          </div>
          <div class="fidelity" resolution="2160p">
            <soci-radial-progress percent="0" ></soci-radial-progress>
            <div class="resolution">2160p</div>
          </div>
          <div class="fidelity" resolution="1440p">
            <soci-radial-progress percent="0" ></soci-radial-progress>
            <div class="resolution">1440p</div>
          </div>
        </column>
        <column>
          <div class="fidelity" resolution="1080p">
            <soci-radial-progress percent="0" waiting></soci-radial-progress>
            <div class="resolution">1080p</div>
          </div>
          <div class="fidelity" resolution="720p">
            <soci-radial-progress percent="0" ></soci-radial-progress>
            <div class="resolution">720p</div>
          </div>
          <div class="fidelity" resolution="480p">
            <soci-radial-progress percent="0" waiting></soci-radial-progress>
            <div class="resolution">480p</div>
          </div>
        </column>
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

    this.encode = this.encode.bind(this)
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
    this.removeAttribute('dragover', '')
    e.preventDefault()
    e.stopPropagation()

    let input = this.select('#file')
    input.files = e.dataTransfer.files
    this.filename = e.dataTransfer.files[0].name
    let event = new Event('change')
    input.dispatchEvent(event)
  }

  upload(e){
    if(this.filename == "") {
      this.filename = this.select('input')?.files[0]?.name
    }
    this.setAttribute('state', 'uploading')
    this.select('#uploading .info').innerHTML = `Uploading ${this.filename}...`
    this.select('label').innerHTML = ''
    this.select('label').classList.add('uploading')
    let data = new FormData()
    let request = new XMLHttpRequest()
    let UPLOAD_HOST = this.type == 'image' ? config.IMAGE_HOST : config.VIDEO_HOST

    data.append('files', this.select('input').files[0])
    data.append('url', this.closest('form').querySelector('soci-url-input').value)

    request.open('post', UPLOAD_HOST + '/upload') 

    request.addEventListener('load', e => {
      this.setAttribute('state', 'encoding')
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
    this.time = Date.now()
    var conn = new WebSocket(`ws://localhost:4204/encode?file=${filename}`);
    conn.onclose = function(evt) {
      console.log('connection closed')
    }
    conn.addEventListener('message', evt => {
      let message = evt.data.split(':')
      if(message[0] == 'resolution'){
        console.log("resolution is: " + message[1])
      }
      else if(message[0].match(/480p|720p|1080p|1440p|4k/)){
        let progress = this.select(`[resolution="${message[0]}"] soci-radial-progress`)
        progress.toggleAttribute('waiting', false)
        if(progress) {
          progress.percent = message[1]
        }
        console.log(Date.now() - this.time)
        this.time = Date.now()
        console.log(message[1])
      }
    })
  }

  time = 0

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