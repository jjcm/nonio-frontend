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
        transition: width 0.3s linear;
        background: var(--brand-background);
      }
      :host([state="preview"]) {
        min-height: 0;
        border-color: transparent;
        transition: all 0.2s ease-in-out;
        overflow: hidden;
      }
      :host([state="preview"]):before {
        opacity: 0;
        transition: all 0.2s ease-in-out;
      }
      :host([state="preview"]) label,
      :host([state="preview"]) div {
        display: none;
      }
      #preview {
        max-width: 100%;
        display: none;
      }
      :host([state="preview"]) #preview {
        display: block;
      }
      input {
        display: none;
      }
      #encoding {
        /* heh */
        width: 420px;
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
        align-items: flex-end;
      }
      .fidelity {
        line-height: 24px;
        width: 152px;
        display: flex;
        margin-bottom: 8px;
        transition: opacity 0.3s var(--soci-ease);
      }
      .fidelity[disabled] {
        opacity: 0.3;
      }
      .fidelity span {
        color: var(--brand-text);
        font-size: 11px;
        position: relative;
        top: -4px;
        left: 6px;
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
          <div class="fidelity" resolution="4320p" disabled>
            <soci-radial-progress percent="0"></soci-radial-progress>
            <div class="resolution">8k or higher</div>
          </div>
          <div class="fidelity" resolution="2160p" disabled>
            <soci-radial-progress percent="0" ></soci-radial-progress>
            <div class="resolution">2160p</div>
          </div>
          <div class="fidelity" resolution="1440p" disabled>
            <soci-radial-progress percent="0" ></soci-radial-progress>
            <div class="resolution">1440p</div>
          </div>
        </column>
        <column>
          <div class="fidelity" resolution="1080p" disabled>
            <soci-radial-progress percent="0" waiting></soci-radial-progress>
            <div class="resolution">1080p</div>
          </div>
          <div class="fidelity" resolution="720p" disabled>
            <soci-radial-progress percent="0" ></soci-radial-progress>
            <div class="resolution">720p</div>
          </div>
          <div class="fidelity" resolution="480p" disabled>
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

    data.append('files', this.select('input').files[0])
    data.append('url', this.closest('form').querySelector('soci-url-input').value)

    request.addEventListener('load', e => {
      setTimeout(()=>{
        this.setAttribute('state', 'encoding')
        this.encode(request.response)
      }, 400)
    })

    request.upload.addEventListener('progress', e => {
      var percent_complete = (e.loaded / e.total) * 100
      this.style.setProperty('--upload-progress', `${percent_complete}%`)
    })

    request.open('post', `${config.VIDEO_HOST}/upload`) 
    request.setRequestHeader('Authorization', 'Bearer ' + this.authToken)
    request.send(data)
  }

  async encode(filename){
    this.fileUrl = filename.slice(0, -4)
    let protocol = config.VIDEO_HOST.match(/^https/) ? 'wss' : 'ws'
    let server = config.VIDEO_HOST.replace(/(^\w+:|^)\/\//, '')
    console.log(`protocol: ${protocol}. server: ${server}`)
    var conn = new WebSocket(`${protocol}://${server}/encode?file=${filename}`);
    conn.addEventListener('close', e => {
      let previewResolution = this.equivalentResolution.match(/480p|720p/) ? '' : '-720p'
      this.select('video').setAttribute('src', `${config.VIDEO_HOST}/${filename.slice(0, -4)}${previewResolution}.mp4`)
      setTimeout(()=> {
        this.setAttribute('state', 'preview')
      }, 500)
    })
    conn.addEventListener('message', e => {
      let message = e.data.split(':')
      if(message[0] == 'resolution'){
        let resolution = message[1].split('x')
        this.videoWidth = parseInt(resolution[0])
        this.videoHeight = parseInt(resolution[1])
        resolution = Math.max(this.videoWidth, this.videoHeight)
        console.log(resolution)
        console.log(this.videoWidth)
        this.equivalentResolution = '480p'
        let resolutionBreakpoints = {
          "480p": 0,
          "720p": 1067,
          "1080p": 1600,
          "1440p": 2240,
          "2160p": 3200,
          "4320p": 5760
        }
        for(let res in resolutionBreakpoints) {
          if(resolution > resolutionBreakpoints[res]) {
            this.equivalentResolution = res
            this.select(`[resolution="${res}"]`)?.toggleAttribute('disabled', false)
          }
        }
        console.log(this.equivalentResolution)
        let fidelity = this.select(`[resolution="${this.equivalentResolution}"] .resolution`)
        fidelity.innerHTML += '<span>source</span>'
      }
      else if(message[0].match(/source|480p|720p|1080p|1440p|4k/)){
        let resolution = message[0] == 'source' ? this.equivalentResolution : message[0]
        let progress = this.select(`[resolution="${resolution}"] soci-radial-progress`)
        progress.toggleAttribute('waiting', false)
        if(progress) {
          progress.percent = message[1]
        }
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

  get width(){
    return this.videoWidth
  }

  get height(){
    return this.videoHeight
  }
}