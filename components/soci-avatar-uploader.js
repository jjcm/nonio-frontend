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
        border: 2px dashed var(--bg-success);
        transition: border 0.1s ease-out;
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
      :host([cropping]) actions {
        transition: height 0.2s var(--soci-ease), min-height 0.2s var(--soci-ease);
        height: 32px;
        min-height: 32px;
      }
      :host([cropping]) #preview {
        opacity: 1;
        position: relative;
        object-fit: contain;
        max-height: 100%;
      }
      :host([cropping]) picture {
        display: none;
      }
      :host([cropping]) cropping {
        height: 100%;
      }
      #container {
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        border: 2px dashed transparent;
        transition: border 0.2s var(--soci-ease), width 0.2s var(--soci-ease), height 0.2s var(--soci-ease);
        margin: -2px;
      }
      img { width: 100%; border-radius: 6px; }
      input { display: none; }
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
      :host([type="banner"]) #drag {
        border-radius: 4px;
      }
      :host([type="banner"]) #container {
        aspect-ratio: 280 / 63;
      }
      :host([type="banner"]) picture {
        display: flex;
        height: 100%;
      }
      :host([type="banner"]) picture img {
        object-fit: cover;
        height: 100%;
      }
      .resizer {
        position: absolute;
        width: 50%;
        height: 50%;
        z-index: 3;
        &::before, &::after {
          content: '';
          position: absolute;
          width: 1px;
          height: 1px;
          background: #fff;
          display: block;
          opacity: 0.2;
        }
        &::before { width: 10px; }
        &::after { height: 9px; }
      }
      #nw {
        top: -1px;
        left: -1px;
        cursor: nw-resize;
        &::before { top: -1px; left: -1px; }
        &::after { top: 0px; left: -1px; }
      }
      #ne {
        top: -1px;
        right: -1px;
        cursor: ne-resize;
        &::before { top: -1px; right: -1px; }
        &::after { top: 0px; right: -1px; }
      }
      #sw {
        bottom: -1px;
        left: -1px;
        cursor: sw-resize;
        &::before { bottom: -1px; left: -1px; }
        &::after { bottom: 0px; left: -1px; }
      }
      #se {
        bottom: -1px;
        right: -1px;
        cursor: se-resize;
        &::before { bottom: -1px; right: -1px; }
        &::after { bottom: 0px; right: -1px; }
      }
      svg {
        height: 100%;
        pointer-events: none;
        width: 100%;
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
        opacity: 0;
      }
      actions {
        display: flex;
        justify-content: flex-end;
        height: 0;
        min-height: 0;
        overflow: hidden;
        soci-button { margin: 8px 2px; }
      }
      #preview {
        position: absolute;
        pointer-events: none;
        opacity: 0;
        z-index: 1;
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
            <rect x="0" y="0" width="100%" height="9999px" fill="white"/>
            <circle id="mask-circle" cx="0" cy="0" r="10" fill="black"/>
            <rect id="mask-rect" x="0" y="0" width="0" height="0" rx="19" fill="black"/>
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

  static get observedAttributes() {
    return ['community', 'type']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(name === 'community') this._loadCurrentAvatar()
  }

  get _isBanner() {
    return this.getAttribute('type') === 'banner'
  }

  // Banner aspect ratio: 280:63 (final size 560x126)
  _BANNER_ASPECT = 280 / 63
  _BANNER_MIN_WIDTH = 560
  _BANNER_MIN_HEIGHT = 126

  connectedCallback(){
    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach(
      e => this.addEventListener(e, this['_' + e])
    )

    this.select("#file").addEventListener('change', this._loadCropPreview.bind(this))
    this._resizer = this.select('#resizer')

    this._loadCurrentAvatar()
  }

  get _avatarPath() {
    let community = this.getAttribute('community')
    if(community) {
      let name = community.replace('@', '')
      return `@${name}`
    }
    return soci.username
  }

  _loadCurrentAvatar(){
    let formats = [
      {tag: 'source', extension: 'webp'},
      {tag: 'source', extension: 'heic'},
      {tag: 'img', extension: 'webp'},
    ]
    let html = formats.map(format=>{
      return `<${format.tag} src${format.tag == 'source' ? 'set' : ''}="${config.AVATAR_HOST}/${this._avatarPath}.${format.extension}?${Date.now()}">`
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
      console.log('Load end', preview.naturalWidth, preview.naturalHeight)
      if(this._isBanner) {
        if(preview.naturalWidth < this._BANNER_MIN_WIDTH || preview.naturalHeight < this._BANNER_MIN_HEIGHT){
          this.log(`File too small. Banners must be at least ${this._BANNER_MIN_WIDTH}x${this._BANNER_MIN_HEIGHT}px.`, "error")
          return 0
        }
      } else if(Math.min(preview.naturalWidth, preview.naturalHeight) < this._MINIMUMSIZE){
        this.log("File too small. Avatars must be a minimum of 240px on both sides.", "error")
        document.querySelector("#avatar-size-modal")?.activate()
        return 0
      }
      this.toggleAttribute('cropping', true)
      let containedDimensions = this._getContainedImageDimensions(preview)
      this.width = containedDimensions.width
      this.height = containedDimensions.height
      this.scale = containedDimensions.scale

      let containerBox = preview.getBoundingClientRect()
      
      // Calculate actual visible image dimensions (accounting for object-fit: contain)
      let containerW = containerBox.width
      let containerH = containerBox.height
      let imgAspect = preview.naturalWidth / preview.naturalHeight
      let containerAspect = containerW / containerH
      
      if(imgAspect > containerAspect) {
        // Image is wider - fills width, letterboxed top/bottom
        this._imgOffsetX = 0
        this._imgOffsetY = (containerH - this.height) / 2
      } else {
        // Image is taller - fills height, letterboxed left/right
        this._imgOffsetX = (containerW - this.width) / 2
        this._imgOffsetY = 0
      }

      let resizer = this.select('#resizer')

      if(this._isBanner) {
        // Calculate max crop size that fits within the visible image while maintaining aspect ratio
        let maxWidth = this.width
        let maxHeight = maxWidth / this._BANNER_ASPECT
        if(maxHeight > this.height) {
          maxHeight = this.height
          maxWidth = maxHeight * this._BANNER_ASPECT
        }
        this._cropWidth = maxWidth
        this._cropHeight = maxHeight
        this._cropMinWidth = this._BANNER_MIN_WIDTH / this.scale
        this._cropMinHeight = this._BANNER_MIN_HEIGHT / this.scale
        resizer.style.width = this._cropWidth + 'px'
        resizer.style.height = this._cropHeight + 'px'
        this._positionX = this._imgOffsetX + (this.width - this._cropWidth) / 2
        this._positionY = this._imgOffsetY + (this.height - this._cropHeight) / 2
      } else {
        this._cropSize = Math.min(this.width, this.height)
        this._cropMinSize = this._MINIMUMSIZE / this.scale
        resizer.style.width = this._cropSize + 'px'
        resizer.style.height = this._cropSize + 'px'
        this._positionX = this._imgOffsetX + (this.width - this._cropSize) / 2
        this._positionY = this._imgOffsetY + (this.height - this._cropSize) / 2
      }

      resizer.style.left = this._positionX + 'px'
      resizer.style.top = this._positionY + 'px'

      if(this._isBanner) {
        this._maskRect = this.select('#mask-rect')
        this._maskCircle = this.select('#mask-circle')
        this._maskCircle.setAttribute('r', 0)
        this._setCropRect(this._positionX, this._positionY, this._cropWidth, this._cropHeight)
      } else {
        this._mask = this.select('#mask-circle')
        this.select('#mask-rect').setAttribute('width', 0)
        let radius = this._cropSize / 2
        this._mask.setAttribute('r', radius)
        this._mask.setAttribute('cx', radius + this._positionX)
        this._mask.setAttribute('cy', radius + this._positionY)
      }
      this.select('#mask rect').style.minHeight = '100%'
    })
    reader.readAsDataURL(files)
  }

  _cancelCropPreview(){
    console.log('Cancelling crop preview')
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

    // Convert from container coordinates to image coordinates
    let imgX = this._positionX - this._imgOffsetX
    let imgY = this._positionY - this._imgOffsetY

    data.append('files', this.select('input').files[0])
    data.append('xoffset', Math.floor(imgX * this.scale))
    data.append('yoffset', Math.floor(imgY * this.scale))

    if(this._isBanner) {
      data.append('width', Math.floor(this._cropWidth * this.scale))
      data.append('height', Math.floor(this._cropHeight * this.scale))
      data.append('type', 'banner')
    } else {
      data.append('size', Math.floor(this._cropSize * this.scale))
    }

    let community = this.getAttribute('community')
    if(community) data.append('community', community.replace('@', ''))

    request.open('post', config.AVATAR_HOST + '/upload') 

    /*
    request.addEventListener('load', e => {
    })
    */

    request.onreadystatechange = e => {
      if(request.readyState === 4) {
        if(request.status >= 200 && request.status < 300) {
          this.select('soci-button').success()
          setTimeout(()=>{
            this._loadCurrentAvatar()
            let container = this.select('#container')
            let sizeBox = container.getBoundingClientRect()
            container.style.width = (sizeBox.width - 4) + 'px'
            container.style.height = (sizeBox.height - 4) + 'px'
            setTimeout(()=>{
              let targetWidth, targetHeight, scale
              let containedDimensions = this._getContainedImageDimensions(this.select('#preview'))
              console.log('Contained dimensions', containedDimensions)
              console.log('Crop width', this._cropWidth)
              console.log('Crop height', this._cropHeight)
              if(this._isBanner) {
                targetWidth = this._cropWidth
                targetHeight = this._cropHeight
                scale = containedDimensions.scale
              } else {
                let size = Math.min(sizeBox.width, sizeBox.height)
                targetWidth = size - 4
                targetHeight = size - 4
                scale = size / (this._cropSize + 4)
              }
              container.style.width = targetWidth + 'px'
              container.style.height = targetHeight + 'px'
              console.log('Container size', targetWidth, targetHeight)
              this.select('cropping').style.transform = `translate(-${this._positionX * scale}px, -${this._positionY * scale}px) scale(${scale})`
              console.log('Cropping transform', this.select('cropping').style.transform)
              this.select('svg').style.opacity = 0
              this.select('#resizer').style.opacity = 0
              setTimeout(()=>{
                this._cancelCropPreview()
                this.fire('avatar-updated', { community })
              }, 4000)
            }, 400)
          }, 400)
        } else {
          console.error('Error uploading avatar', request.statusText)
          this.select('soci-button').error()
          return
        }
      }
    }

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
    if(this._isBanner) {
      this._tempCropWidth = this._cropWidth
      this._tempCropHeight = this._cropHeight
    } else {
      this._tempCropSize = this._cropSize
    }
    document.body.toggleAttribute('dragging', true)
  }

  _dragMouseMove(e){
    this._deltaX = e.clientX - this._mouseDownX
    this._deltaY = e.clientY - this._mouseDownY

    if(this._isBanner) {
      this._dragMouseMoveBanner()
    } else {
      this._dragMouseMoveAvatar()
    }
  }

  _dragMouseMoveAvatar(){
    let minX = this._imgOffsetX
    let minY = this._imgOffsetY
    let maxX = this._imgOffsetX + this.width
    let maxY = this._imgOffsetY + this.height
    
    switch(this._resizeAction){
      case 'drag':
        this._tempYPos = Math.min(
          Math.max(this._positionY + this._deltaY, minY),
          maxY - this._cropSize 
        ) 
        this._tempXPos = Math.min(
          Math.max(this._positionX + this._deltaX, minX),
          maxX - this._cropSize 
        ) 
        this._setCropCircle(this._tempXPos, this._tempYPos, this._cropSize)
        break
      case 'se':
        this._tempCropSize = Math.max(Math.min(
          this._cropSize + Math.min(this._deltaY, this._deltaX),
          maxX - this._positionX,
          maxY - this._positionY
        ), this._cropMinSize)
        this._setCropCircle(this._positionX, this._positionY, this._tempCropSize)
        break
      case 'nw':
        this._tempCropSize = Math.max(Math.min(
          this._cropSize - Math.max(this._deltaY, this._deltaX), 
          Math.min(this._positionX - minX, this._positionY - minY) + this._cropSize,
        ), this._cropMinSize)
        this._tempXPos = this._positionX + this._cropSize - this._tempCropSize
        this._tempYPos = this._positionY + this._cropSize - this._tempCropSize
        this._setCropCircle(this._tempXPos, this._tempYPos, this._tempCropSize)
        break
      case 'ne':
        this._tempCropSize = Math.max(Math.min(
          this._cropSize - Math.max(this._deltaY, this._deltaX * -1),
          maxX - this._positionX,
          this._positionY - minY + this._cropSize
        ), this._cropMinSize)
        this._tempYPos = this._positionY + this._cropSize - this._tempCropSize
        this._setCropCircle(this._positionX, this._tempYPos, this._tempCropSize)
        break
      case 'sw':
        this._tempCropSize = Math.max(Math.min(
          this._cropSize - Math.max(this._deltaY * -1, this._deltaX),
          maxY - this._positionY,
          this._positionX - minX + this._cropSize
        ), this._cropMinSize)
        this._tempXPos = this._positionX + this._cropSize - this._tempCropSize
        this._setCropCircle(this._tempXPos, this._positionY, this._tempCropSize)
        break
    }
  }

  _dragMouseMoveBanner(){
    let minX = this._imgOffsetX
    let minY = this._imgOffsetY
    let maxX = this._imgOffsetX + this.width
    let maxY = this._imgOffsetY + this.height
    
    switch(this._resizeAction){
      case 'drag':
        this._tempYPos = Math.min(
          Math.max(this._positionY + this._deltaY, minY),
          maxY - this._cropHeight
        )
        this._tempXPos = Math.min(
          Math.max(this._positionX + this._deltaX, minX),
          maxX - this._cropWidth
        )
        this._setCropRect(this._tempXPos, this._tempYPos, this._cropWidth, this._cropHeight)
        break
      case 'se':
        this._tempCropWidth = Math.max(Math.min(
          this._cropWidth + this._deltaX,
          maxX - this._positionX
        ), this._cropMinWidth)
        this._tempCropHeight = this._tempCropWidth / this._BANNER_ASPECT
        if(this._tempCropHeight > maxY - this._positionY) {
          this._tempCropHeight = maxY - this._positionY
          this._tempCropWidth = this._tempCropHeight * this._BANNER_ASPECT
        }
        if(this._tempCropHeight < this._cropMinHeight) {
          this._tempCropHeight = this._cropMinHeight
          this._tempCropWidth = this._cropMinWidth
        }
        this._setCropRect(this._positionX, this._positionY, this._tempCropWidth, this._tempCropHeight)
        break
      case 'nw':
        this._tempCropWidth = Math.max(Math.min(
          this._cropWidth - this._deltaX,
          this._positionX - minX + this._cropWidth
        ), this._cropMinWidth)
        this._tempCropHeight = this._tempCropWidth / this._BANNER_ASPECT
        if(this._tempCropHeight > this._positionY - minY + this._cropHeight) {
          this._tempCropHeight = this._positionY - minY + this._cropHeight
          this._tempCropWidth = this._tempCropHeight * this._BANNER_ASPECT
        }
        if(this._tempCropHeight < this._cropMinHeight) {
          this._tempCropHeight = this._cropMinHeight
          this._tempCropWidth = this._cropMinWidth
        }
        this._tempXPos = this._positionX + this._cropWidth - this._tempCropWidth
        this._tempYPos = this._positionY + this._cropHeight - this._tempCropHeight
        this._setCropRect(this._tempXPos, this._tempYPos, this._tempCropWidth, this._tempCropHeight)
        break
      case 'ne':
        this._tempCropWidth = Math.max(Math.min(
          this._cropWidth + this._deltaX,
          maxX - this._positionX
        ), this._cropMinWidth)
        this._tempCropHeight = this._tempCropWidth / this._BANNER_ASPECT
        if(this._tempCropHeight > this._positionY - minY + this._cropHeight) {
          this._tempCropHeight = this._positionY - minY + this._cropHeight
          this._tempCropWidth = this._tempCropHeight * this._BANNER_ASPECT
        }
        if(this._tempCropHeight < this._cropMinHeight) {
          this._tempCropHeight = this._cropMinHeight
          this._tempCropWidth = this._cropMinWidth
        }
        this._tempYPos = this._positionY + this._cropHeight - this._tempCropHeight
        this._setCropRect(this._positionX, this._tempYPos, this._tempCropWidth, this._tempCropHeight)
        break
      case 'sw':
        this._tempCropWidth = Math.max(Math.min(
          this._cropWidth - this._deltaX,
          this._positionX - minX + this._cropWidth
        ), this._cropMinWidth)
        this._tempCropHeight = this._tempCropWidth / this._BANNER_ASPECT
        if(this._tempCropHeight > maxY - this._positionY) {
          this._tempCropHeight = maxY - this._positionY
          this._tempCropWidth = this._tempCropHeight * this._BANNER_ASPECT
        }
        if(this._tempCropHeight < this._cropMinHeight) {
          this._tempCropHeight = this._cropMinHeight
          this._tempCropWidth = this._cropMinWidth
        }
        this._tempXPos = this._positionX + this._cropWidth - this._tempCropWidth
        this._setCropRect(this._tempXPos, this._positionY, this._tempCropWidth, this._tempCropHeight)
        break
    }
  }

  _dragMouseUp(e){
    this._positionX = this._tempXPos
    this._positionY = this._tempYPos
    if(this._isBanner) {
      this._cropWidth = this._tempCropWidth || this._cropWidth
      this._cropHeight = this._tempCropHeight || this._cropHeight
    } else {
      this._cropSize = this._tempCropSize
    }

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

  _setCropRect(x, y, width, height) {
    this._resizer.style.width = width + 'px'
    this._resizer.style.height = height + 'px'
    this._resizer.style.left = x + 'px'
    this._resizer.style.top = y + 'px'

    this._maskRect.setAttribute('x', x)
    this._maskRect.setAttribute('y', y)
    this._maskRect.setAttribute('width', width)
    this._maskRect.setAttribute('height', height)
  }

  // This is a duplicate of the code above to get the object-fit: contain dimensions of the image
  // TODO: unify this into a single function
  _getContainedImageDimensions(img) {
    // Ensure the image and its natural dimensions are available (must be loaded)
    if (!img.naturalWidth || !img.naturalHeight) {
      console.error("Image is not loaded or has invalid dimensions.");
      return { width: 0, height: 0 };
    }

    // Get the original aspect ratio of the image
    const imageAspectRatio = img.naturalWidth / img.naturalHeight;

    // Get the rendered dimensions of the <img> element's content box
    const elementWidth = img.width;
    const elementHeight = img.height;
    const elementAspectRatio = elementWidth / elementHeight;

    let renderedWidth;
    let renderedHeight;

    // Compare the aspect ratios to determine how it's 'contained'
    if (imageAspectRatio > elementAspectRatio) {
      // The image is limited by the container's width (pillarboxed)
      renderedWidth = elementWidth;
      renderedHeight = elementWidth / imageAspectRatio;
    } else {
      // The image is limited by the container's height (letterboxed)
      renderedHeight = elementHeight;
      renderedWidth = elementHeight * imageAspectRatio;
    }

    return {
      width: renderedWidth,
      height: renderedHeight,
      scale: img.naturalWidth / renderedWidth
    };
  }
}