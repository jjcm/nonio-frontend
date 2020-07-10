import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociFileDrop extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        min-height: 240px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        //border: 2px dashed var(--n2);
        box-sizing: border-box;
        border-radius: 8px;
        margin-bottom: 12px;
        position: relative;
        //transition: border 0.2s ease;
        overflow: hidden;
      }

      :host([dragover]) {
        //border: 2px dashed var(--g1);
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
      img {
        max-width: 420px;
        max-height: 420px;
        border-radius: 6px;
      }
      input {
        display: none;
      }
      #resizer {
        position: absolute;
      }
      #drag {
        border: 2px dashed #fff;
        cursor: move;
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        z-index: 2;
        top: -2px;
        left: -2px;
      }
      .resizer {
        position: absolute;
        width: 50%;
        height: 50%;
        z-index: 1;
      }
      .resizer:before, .resizer:after {
        content: '';
        position: absolute;
        width: 1px;
        height: 1px;
        background: #fff;
        display: block;
        opacity: 0.2;
      }
      .resizer:before {
        width: 10px;
      }
      .resizer:after {
        height: 9px;
      }
      #nw {
        top: -1px;
        left: -1px;
        cursor: nw-resize;
      }
      #nw:before {
        top: -1px;
        left: -1px;
      }
      #nw:after {
        top: 0px;
        left: -1px;
      }
      #ne {
        top: -1px;
        right: -1px;
        cursor: ne-resize;
      }
      #ne:before {
        top: -1px;
        right: -1px;
      }
      #ne:after {
        top: 0px;
        right: -1px;
      }
      #sw {
        bottom: -1px;
        left: -1px;
        cursor: sw-resize;
      }
      #sw:before {
        bottom: -1px;
        left: -1px;
      }
      #sw:after {
        bottom: 0px;
        left: -1px;
      }
      #se {
        bottom: -1px;
        right: -1px;
        cursor: se-resize;
      }
      #se:before {
        bottom: -1px;
        right: -1px;
      }
      #se:after {
        bottom: 0px;
        right: -1px;
      }

      svg {
        height: 420px;
        pointer-events: none;
        width: 420px;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        transition: opacity 0.1s ease-in-out;
      }

      :host([drop]) svg {
        opacity: 1;
      }

    `
  }

  html(){ return `
    <input id="file" type="file" accept="*"/>
    <div id="resizer" @mousedown=_dragMouseDown>
      <div class="resizer" id="nw"></div>
      <div class="resizer" id="ne"></div>
      <div class="resizer" id="sw"></div>
      <div class="resizer" id="se" @mousedown=_seResizeDown></div>
      <div id="drag"></div>
    </div>
    <svg>
      <mask id="mask">
        <rect x="0" y="0" width="100%" height="100%" fill="white"/>
        <circle cx="0" cy="0" r="10" fill="black"/>
      </mask>
      <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#mask)"/>
    </svg>
    <img src="/example-data/profile.jpg"/>
  `}

  connectedCallback(){
    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach(
      e => this.addEventListener(e, this['_' + e])
    )

    this.select("#file").addEventListener('change', this.upload.bind(this))
    this.select("#file").addEventListener('change', ()=>{console.log('file changed')})
    this.select("#file").addEventListener('input', ()=>{console.log('file input')})
    this._resizer = this.select('#resizer')
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
    this.toggleAttribute('dragover', true)
  }

  _dragover(e){
    e.preventDefault()
  }

  _dragleave(e){
    this.toggleAttribute('dragover', false)
  }

  _drop(e){
    e.preventDefault()
    e.stopPropagation()
    this.toggleAttribute('dragover', false)
    this.toggleAttribute('drop', true)

    let input = this.select('#file')
    input.files = e.dataTransfer.files
    let event = new Event('change')
    input.dispatchEvent(event)

    let preview = this.select('img')
    let reader = new FileReader()
    reader.addEventListener('load', e => {
      preview.src = e.target.result
    })
    reader.addEventListener('loadend', ()=>{
      console.log('ayy')
      console.log(preview.offsetWidth)
      this._cropSize = Math.min(preview.offsetWidth, preview.offsetHeight)
      let resizer = this.select('#resizer')
      resizer.style.width = this._cropSize + 'px'
      resizer.style.height = this._cropSize + 'px'
      this._positionX = (preview.offsetWidth - this._cropSize) / 2
      this._positionY = (preview.offsetHeight - this._cropSize) / 2
      resizer.style.left = this._positionX + 'px'
      resizer.style.top = this._positionY + 'px'

      this._mask = this.select('circle')
      let radius = this._cropSize / 2
      this._mask.setAttribute('r', radius)
      this._mask.setAttribute('cx', radius + this._positionX)
      this._mask.setAttribute('cy', radius + this._positionY)

    })
    reader.readAsDataURL(e.dataTransfer.files[0])
  }

  upload(){
    return 0
    console.log('upload time')
    let data = new FormData()
    let request = new XMLHttpRequest()

    data.append('files', this.select('input').files[0])
    data.append('url', this.closest('form').querySelector('soci-url-input').value)

    request.open('post', config.IMAGE_HOST + '/upload') 

    request.addEventListener('load', e => {
      this.select('picture').innerHTML = `
        <source srcset="${config.IMAGE_HOST + '/' + request.response}.webp">
        <img src="${config.IMAGE_HOST + '/' + request.response}.webp">
      `
      this.setAttribute('preview', '')
      this.fileUrl = request.response
    })

    request.upload.addEventListener('progress', e => {
      var percent_complete = (e.loaded / e.total) * 100
      this.style.setProperty('--upload-progress', `${percent_complete}%`)
    })

    request.open('post', config.IMAGE_HOST + '/upload') 
    request.setRequestHeader('Authorization', 'Bearer ' + this.authToken)
    request.send(data)
  }

  _positionX = 0
  _positionY = 0
  _mouseDownX = 0
  _mouseDownY = 0
  _deltaX = 0
  _deltaY = 0
  _tempXPos = 0
  _tempYPos = 0
  _tempCropSize = 0
  _dragging = false
  _dragMouseDown(e){
    if(this._dragging) return 0
    this._dragging = true
    this._resizeAction = e.target.id
    this._dragMouseMove = this._dragMouseMove.bind(this)
    this._dragMouseUp = this._dragMouseUp.bind(this)
    document.addEventListener('mousemove', this._dragMouseMove)
    document.addEventListener('mouseup', this._dragMouseUp)

    this._mouseDownX = e.clientX
    this._mouseDownY = e.clientY
    this._tempXPos = this._positionX
    this._tempYPos = this._positionY
    this._tempCropSize = this._cropSize
    document.body.toggleAttribute('dragging', true)
  }
  _dragMouseMove(e){
    this._deltaX = e.clientX - this._mouseDownX
    this._deltaY = e.clientY - this._mouseDownY

    switch(this._resizeAction){
      case 'drag':
        this._tempYPos = Math.min(
          Math.max(this._positionY + this._deltaY, 0),
          this.offsetHeight - this._cropSize 
        ) 
        this._tempXPos = Math.min(
          Math.max(this._positionX + this._deltaX, 0),
          this.offsetWidth - this._cropSize 
        ) 
        this._setCropCircle(this._tempXPos, this._tempYPos, this._cropSize)
        break
      case 'se':
        this._tempCropSize = this._cropSize + Math.min(this._deltaY, this._deltaX)
        this._setCropCircle(this._positionX, this._positionY, this._tempCropSize)
        break
      case 'nw':
        this._tempCropSize = Math.min(
          this._cropSize - Math.max(this._deltaY, this._deltaX), 
          Math.min(this._positionX, this._positionY) + this._cropSize
        )
        this._tempXPos = this._positionX + this._cropSize - this._tempCropSize
        this._tempYPos = this._positionY + this._cropSize - this._tempCropSize
        this._setCropCircle(this._tempXPos, this._tempYPos, this._tempCropSize)
        break
      case 'ne':
        this._tempCropSize = this._cropSize - Math.max(this._deltaY, this._deltaX * -1)
        this._tempYPos = this._positionY + this._cropSize - this._tempCropSize
        this._setCropCircle(this._positionX, this._tempYPos, this._tempCropSize)
        break
      case 'sw':
        this._tempCropSize = this._cropSize - Math.max(this._deltaY * -1, this._deltaX)
        this._tempXPos = this._positionX + this._cropSize - this._tempCropSize
        this._setCropCircle(this._tempXPos, this._positionY, this._tempCropSize)
        break
    }

    //TODO - Add x axis
  }
  _dragMouseUp(e){
    this._positionX = this._tempXPos
    this._positionY = this._tempYPos
    this._cropSize = this._tempCropSize

    document.removeEventListener('mousemove', this._dragMouseMove)
    document.removeEventListener('mouseup', this._dragMouseUp)
    document.body.toggleAttribute('dragging', false)
    this._dragging = false
  }

  _seResizeDown(e){
    this._seResizeMove = this._seResizeMove.bind(this)
    this._seResizeUp = this._seResizeUp.bind(this)
    document.addEventListener('mousemove', this._seResizeMove)
    document.addEventListener('mouseup', this._seResizeUp)

    this._mouseDownX = e.clientX
    this._mouseDownY = e.clientY
    document.body.toggleAttribute('dragging', true)
  }
  _seResizeMove(e){
    this._deltaX = e.clientX - this._mouseDownX
    this._deltaY = e.clientY - this._mouseDownY

    let size = this._cropSize + Math.min(this._deltaY, this._deltaX)
    this._setCropCircle(this._positionX, this._positionY, size)
  }
  _seResizeUp(e){
    document.removeEventListener('mousemove', this._seResizeMove)
    document.removeEventListener('mouseup', this._seResizeUp)
    document.body.toggleAttribute('dragging', false)
  }

  _setCropCircle(x, y, size) {
    this._resizer.style.width = size + 'px'
    this._resizer.style.height = size + 'px'
    this._resizer.style.left = x + 'px'
    this._resizer.style.top = y + 'px'

    let radius = size / 2
    this._mask.setAttribute('r', radius)
    this._mask.setAttribute('cx', radius + x)
    this._mask.setAttribute('cy', radius + y)
  }
}