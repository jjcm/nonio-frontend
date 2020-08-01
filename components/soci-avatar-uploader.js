import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociFileDrop extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: inline-flex;
        flex-direction: column;
        margin-bottom: 12px;
        width: 100%;
        flex: 1;
        cursor: pointer;
      }
      :host([dragover]) #container {
        border: 2px dashed var(--g1);
        transition: border 0.1s ease-out;
      }
      #container {
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        border: 2px dashed transparent;
        transition: border 0.2s var(--soci-ease), width 0.2s var(--soci-ease), height 0.2s var(--soci-ease);
        margin: -2px;
      }
      img {
        width: 100%;
        border-radius: 6px;
      }
      input {
        display: none;
      }
      #resizer {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }
      #drag {
        border: 2px dashed #fff;
        cursor: move;
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        z-index: 4;
        top: -2px;
        left: -2px;
      }
      .resizer {
        position: absolute;
        width: 50%;
        height: 50%;
        z-index: 3;
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
        z-index: 2;
        top: 0;
        left: 0;
        opacity: 0;
        pointer-events: none;
      }
      :host([cropping]) {
        cursor: default;
      }
      :host([cropping]) #resizer,
      :host([cropping]) svg {
        opacity: 1;
        transition: opacity 0.1s var(--soci-ease);
        pointer-events: all;
      }
      actions {
        display: flex;
        justify-content: flex-end;
        height: 0;
        overflow: hidden;
      }
      :host([cropping]) actions {
        transition: height 0.2s var(--soci-ease);
        height: 32px;
      }
      actions soci-button {
        margin: 8px 2px;
      }

      #preview {
        position: absolute;
        pointer-events: none;
        opacity: 0;
        z-index: 1;
      }

      :host([cropping]) #preview {
        opacity: 1;
        position: relative;
      }

      :host([cropping]) picture {
        display: none;
      }

      cropping {
        display: block;
        position: relative;
        transition: all 0.2s var(--soci-ease);
        transform: scale(1);
        transform-origin: top left;
      }

    `
  }

  html(){ return `
    <input id="file" type="file" accept="image/*"/>
    <div id="container">
      <cropping>
        <div id="resizer" @mousedown=_dragMouseDown>
          <div class="resizer" id="nw"></div>
          <div class="resizer" id="ne"></div>
          <div class="resizer" id="sw"></div>
          <div class="resizer" id="se"></div>
          <div id="drag"></div>
        </div>
        <svg>
          <mask id="mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white"/>
            <circle cx="0" cy="0" r="10" fill="black"/>
          </mask>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#mask)"/>
        </svg>
        <img id="preview" />
      </cropping>
      <picture @click=_selectFile >
        <img/>
      </picture>
    </div>
    <actions>
      <soci-button async @click=upload>submit</soci-button>
      <soci-button subtle @click=_cancelCropPreview >cancel</soci-button>
    </actions>
  `}

  connectedCallback(){
    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach(
      e => this.addEventListener(e, this['_' + e])
    )

    this.select("#file").addEventListener('change', this._loadCropPreview.bind(this))
    this._resizer = this.select('#resizer')

    this._loadCurrentAvatar()
  }

  _loadCurrentAvatar(){
    let formats = [
      {tag: 'source', extension: 'webp'},
      {tag: 'source', extension: 'heic'},
      {tag: 'img', extension: 'webp'},
    ]
    let html = formats.map(format=>{
      return `<${format.tag} src${format.tag == 'source' ? 'set' : ''}="${config.AVATAR_HOST}/${soci.username}.${format.extension}?${Date.now()}">`
    })
    this.select('picture').innerHTML = html.join('')
  }

  _selectFile(e){
    this.select('input').click()
  }

  _loadCropPreview(e){
    let files = e?.target?.files[0]
    if(files == null || files.type.indexOf("image/") != 0) return 0
    let preview = this.select('#preview')
    this._oldAvatarURL = preview.src
    let reader = new FileReader()
    reader.addEventListener('load', e => {
      preview.src = e.target.result
    })
    reader.addEventListener('loadend', ()=>{
      if(Math.min(preview.naturalWidth, preview.naturalHeight) < this._MINIMUMSIZE){
        this.log("File too small. Avatars must be a minimum of 240px on both sides.", "error")
        return 0
      }
      this.toggleAttribute('cropping', true)
      let sizeBox = preview.getBoundingClientRect()
      this.width = sizeBox.width
      this.height = sizeBox.height
      this._cropSize = Math.min(this.width, this.height)
      this.scale = Math.min(preview.naturalHeight, preview.naturalWidth) / Math.min(this.width, this.height)
      this._cropMinSize = this._MINIMUMSIZE / this.scale
      let resizer = this.select('#resizer')
      resizer.style.width = this._cropSize + 'px'
      resizer.style.height = this._cropSize + 'px'
      this._positionX = (this.width - this._cropSize) / 2
      this._positionY = (this.height - this._cropSize) / 2
      resizer.style.left = this._positionX + 'px'
      resizer.style.top = this._positionY + 'px'

      this._mask = this.select('circle')
      let radius = this._cropSize / 2
      this._mask.setAttribute('r', radius)
      this._mask.setAttribute('cx', radius + this._positionX)
      this._mask.setAttribute('cy', radius + this._positionY)
    })
    reader.readAsDataURL(files)
  }

  _cancelCropPreview(){
    this.toggleAttribute('cropping', false)
    this.select('#container').style.width = ''
    this.select('#container').style.height = ''
    this.select('cropping').style.transform = ''
    this.select('svg').style.opacity = ''
    this.select('#resizer').style.opacity = ''
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
    if(e.dataTransfer.files.length == 0) return 0

    let input = this.select('#file')
    input.files = e.dataTransfer.files
    let event = new Event('change')
    input.dispatchEvent(event)
  }

  upload(){
    let data = new FormData()
    let request = new XMLHttpRequest()

    data.append('files', this.select('input').files[0])
    data.append('size', Math.floor(this._cropSize * this.scale))
    data.append('xoffset', Math.floor(this._positionX * this.scale))
    data.append('yoffset', Math.floor(this._positionY * this.scale))

    request.open('post', config.AVATAR_HOST + '/upload') 

    request.addEventListener('load', e => {
      this._loadCurrentAvatar()
      this.select('soci-button').success()
      let container = this.select('#container')
      let sizeBox = container.getBoundingClientRect()
      let size = Math.min(sizeBox.width, sizeBox.height)
      container.style.width = (sizeBox.width - 4) + 'px'
      container.style.height = (sizeBox.height - 4) + 'px'
      setTimeout(()=>{
        container.style.width = (size - 4) + 'px'
        container.style.height = (size - 4) + 'px'
        let scale = size / (this._cropSize + 4)
        this.select('cropping').style.transform = `translate(-${this._positionX * scale}px, -${this._positionY * scale}px) scale(${scale})`
        this.select('svg').style.opacity = 0
        this.select('#resizer').style.opacity = 0
        setTimeout(()=>{
          this._cancelCropPreview()
          this.fire('avatar-updated')
        }, 200)
      }, 400)
    })

    request.upload.addEventListener('progress', e => {
      var percent_complete = (e.loaded / e.total) * 100
      this.style.setProperty('--upload-progress', `${percent_complete}%`)
    })

    request.open('post', config.AVATAR_HOST + '/upload') 
    request.setRequestHeader('Authorization', 'Bearer ' + this.authToken)
    request.send(data)
  }

  _MINIMUMSIZE = 240
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
          this.height - this._cropSize 
        ) 
        this._tempXPos = Math.min(
          Math.max(this._positionX + this._deltaX, 0),
          this.width - this._cropSize 
        ) 
        this._setCropCircle(this._tempXPos, this._tempYPos, this._cropSize)
        break
      case 'se':
        this._tempCropSize = Math.max(Math.min(
          this._cropSize + Math.min(this._deltaY, this._deltaX),
          this.width - this._positionX,
          this.height - this._positionY
        ), this._cropMinSize)
        this._setCropCircle(this._positionX, this._positionY, this._tempCropSize)
        break
      case 'nw':
        this._tempCropSize = Math.max(Math.min(
          this._cropSize - Math.max(this._deltaY, this._deltaX), 
          Math.min(this._positionX, this._positionY) + this._cropSize,
        ), this._cropMinSize)
        this._tempXPos = this._positionX + this._cropSize - this._tempCropSize
        this._tempYPos = this._positionY + this._cropSize - this._tempCropSize
        this._setCropCircle(this._tempXPos, this._tempYPos, this._tempCropSize)
        break
      case 'ne':
        this._tempCropSize = Math.max(Math.min(
          this._cropSize - Math.max(this._deltaY, this._deltaX * -1),
          this.width - this._positionX,
          this._positionY + this._cropSize
        ), this._cropMinSize)
        this._tempYPos = this._positionY + this._cropSize - this._tempCropSize
        this._setCropCircle(this._positionX, this._tempYPos, this._tempCropSize)
        break
      case 'sw':
        this._tempCropSize = Math.max(Math.min(
          this._cropSize - Math.max(this._deltaY * -1, this._deltaX),
          this.height - this._positionY,
          this._positionX + this._cropSize
        ), this._cropMinSize)
        this._tempXPos = this._positionX + this._cropSize - this._tempCropSize
        this._setCropCircle(this._tempXPos, this._positionY, this._tempCropSize)
        break
    }
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