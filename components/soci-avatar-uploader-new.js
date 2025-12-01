import SociComponent from './soci-component.js'
import config from '../config.js'

// TODO
// Uploader 
// Dragover support
// Cropping support
// Banner support
// Upload success
// Upload failure
// Modal error

export default class SociAvatarUploader extends SociComponent {
  // Banner aspect ratio: 280:63 (final size 560x126)
  _aspectRatio = 280 / 63
  _aspectRatio = 1
  _minWidth = 48
  _minHeight = 48

  _AVATAR_MIN_SIZE = 240

  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: block;
        margin-bottom: 12px;
        width: 100%;
        height: 300px;
        cursor: pointer;
        border-radius: 8px;
        transition: margin-bottom 0.2s var(--soci-ease);
      }

      input { display: none; }

      #container,
      #cropping,
      #preview,
      svg {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 8px;
      }
      
      #container {
        position: relative;
      }

      svg {
        position: absolute;
        pointer-events: none;
      }

      #preview {
        object-fit: contain;
      }

      #actions {
        height: 0;
        opacity: 0;
        overflow: hidden;
        transition: all 0.2s var(--soci-ease);
        margin-top: 0;
      }

      :host([editing]) {
        margin-bottom: 56px;
      }
      :host([editing]) #actions {
        height: 32px;
        opacity: 1;
        margin-top: 12px;
      }

      #mask-rect {
        rx: 50%;
      }

      :host([type="banner"]) #mask-rect {
        rx: 8px;
      }
      
      #resizer {
        position: absolute;
        width: 100px;
        height: 100px;
        top: 100px;
        left: 100px;
        opacity: 0.8;
      }
      
      .resizer {
        position: absolute;
        width: min(12px, 50%);
        height: min(12px, 50%);
        border-color: #fff;
        border-width: 0;
      }
      .corner {
        border-style: solid;
        z-index: 2;
      }
      .edge {
        border-style: dotted;
        z-index: 1;
        opacity: 0.2;
      }

      #nw {
        top: 0px;
        left: 0px;
        cursor: nw-resize;
        border-width: 1px 0 0 1px;
      }
      #ne {
        top: 0px;
        right: 0px;
        cursor: ne-resize;
        border-width: 1px 1px 0 0;
      }
      #se {
        bottom: 0px;
        right: 0px;
        cursor: se-resize;
        border-width: 0 1px 1px 0;
      }
      #sw {
        bottom: 0px;
        left: 0px;
        cursor: sw-resize;
        border-width: 0 0 1px 1px;
      }

      #n {
        width: 100%;
        border-top-width: 1px;
        top: 0px;
        cursor: n-resize;
      }
      #e {
        height: 100%;
        border-right-width: 1px;
        right: 0px;
        cursor: e-resize;
      }
      #s {
        width: 100%;
        border-bottom-width: 1px;
        bottom: 0px;
        cursor: s-resize;
      }
      #w {
        height: 100%;
        border-left-width: 1px;
        left: 0px;
        cursor: w-resize;
      }
      #drag {
        position: absolute;
        width: calc(100% - 8px);
        height: calc(100% - 8px);
        border-radius: 4px;
        top: 4px;
        left: 4px;
        cursor: move;
      }

    `
  }

  html(){ return `
    <input id="file" type="file" accept="image/*"/>
    <div id="container">
      <div id="cropping">
        <svg>
          <mask id="mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white"/>
            <rect id="mask-rect" x="100" y="100" width="100" height="100" fill="black"/>
          </mask>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#mask)"/>
        </svg>
        <div id="resizer" @mousedown=_mousedown>
          <div class="resizer corner" id="nw"></div>
          <div class="resizer edge" id="n"></div>
          <div class="resizer corner" id="ne"></div>
          <div class="resizer edge" id="e"></div>
          <div class="resizer corner" id="se"></div>
          <div class="resizer edge" id="s"></div>
          <div class="resizer corner" id="sw"></div>
          <div class="resizer edge" id="w"></div>
          <div id="drag"></div>
        </div>
        <img id="preview" src="http://localhost:4202/@furries.webp?1764551171812"/>
      </div>
      <picture>
        <img src="http://localhost:4202/@furries.webp?1764551171812"/>
      </picture>
    </div>
    <div id="actions">
      <soci-button async>submit</soci-button>
      <soci-button subtle>cancel</soci-button>
    </div>
  `}

  static get observedAttributes() {
    return ['type']
  }

  attributeChangedCallback(name, oldValue, newValue) {
  }



  connectedCallback(){
    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach(
      e => this.addEventListener(e, this['_' + e])
    )

    this._mousemove = this._mousemove.bind(this)
    this._mouseup = this._mouseup.bind(this)
    this._beginCropping = this._beginCropping.bind(this)
    this._beginCropping()
  }

  _beginCropping() {
    this._editorDimensions = this._getContainedImageDimensions(this.select('#preview'))
    this._maximizeCrop()
  }

  _dragType = null
  _dragStartX = 0
  _dragStartY = 0
  _dragDeltaX = 0
  _dragDeltaY = 0
  _x = 100
  _y = 100
  _width = 100
  _height = 100

  _mousedown(e){
    console.log('starting drag')
    document.body.toggleAttribute('dragging', true)
    this._dragType = e.target.id
    this._dragStartX = e.clientX
    this._dragStartY = e.clientY

    // todo - set sensible initial positions rather than using the current values
    /*
    this._x = 50
    this._y = 50
    this._width = 100
    this._height = 100
    */

    this._editorDimensions = this._getContainedImageDimensions(this.select('#preview'))

    document.addEventListener('mousemove', this._mousemove)
    document.addEventListener('mouseup', this._mouseup)
  }

  _mousemove(e){
    this._dragDeltaX = e.clientX - this._dragStartX
    this._dragDeltaY = e.clientY - this._dragStartY
    let size, offset;
    switch(this._dragType){
      case 'drag':
        this._resizeCrop(
          Math.min(Math.max(this._editorDimensions.xOffset, this._x + this._dragDeltaX), this._editorDimensions.width + this._editorDimensions.xOffset - this._width),
          Math.min(Math.max(this._editorDimensions.yOffset, this._y + this._dragDeltaY), this._editorDimensions.height + this._editorDimensions.yOffset - this._height),
          this._width, 
          this._height
        )
        break
      case 'nw':
        offset = Math.min(this._dragDeltaX, this._dragDeltaY)
        this._resizeCrop(this._x + offset, this._y + offset, this._width - offset, this._height - offset)
        break
      case 'se':
        offset = Math.max(this._dragDeltaX, this._dragDeltaY)
        this._resizeCrop(this._x, this._y, this._width + offset, this._height + offset)
        break
      case 'ne':
        size = Math.max(this._width + this._dragDeltaX, this._height - this._dragDeltaY)
        this._resizeCrop(this._x, this._y + (this._height - size), size, size)
        break
      case 'sw':
        size = Math.max(this._width - this._dragDeltaX, this._height + this._dragDeltaY)
        this._resizeCrop(this._x + (this._width - size), this._y, size, size)
        break
    }
  }

  _mouseup(e){
    document.body.toggleAttribute('dragging', false)
    this._x = parseInt(this.select('#mask-rect').getAttribute('x'))
    this._y = parseInt(this.select('#mask-rect').getAttribute('y'))
    this._width = parseInt(this.select('#mask-rect').getAttribute('width'))
    this._height = parseInt(this.select('#mask-rect').getAttribute('height'))
    document.removeEventListener('mousemove', this._mousemove)
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

  _resizeCrop(x, y, width, height) {
    const ed = this._editorDimensions
    if (width < this._minWidth / ed.scale || 
        height < this._minHeight / ed.scale ||
        x < ed.xOffset || y < ed.yOffset || 
        x + width > ed.xOffset + ed.width || 
        y + height > ed.yOffset + ed.height) return

    let maskRect = this.select('#mask-rect')
    maskRect.setAttribute('x', x)
    maskRect.setAttribute('y', y)
    maskRect.setAttribute('width', width)
    maskRect.setAttribute('height', height)

    let resizer = this.select('#resizer')
    resizer.style.left = x + 'px'
    resizer.style.top = y + 'px'
    resizer.style.width = width + 'px'
    resizer.style.height = height + 'px'
  }

  _maximizeCrop() {
    const ed = this._editorDimensions
    if (!ed) return

    let width, height
    if (ed.width / ed.height > this._aspectRatio) {
      height = ed.height
      width = height * this._aspectRatio
    } else {
      width = ed.width
      height = width / this._aspectRatio
    }

    const x = ed.xOffset + (ed.width - width) / 2
    const y = ed.yOffset + (ed.height - height) / 2

    this._x = x
    this._y = y
    this._width = width
    this._height = height
    this._resizeCrop(x, y, width, height)
  }

  _getContainedImageDimensions(img) {
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
      xOffset: (elementWidth - renderedWidth) / 2,
      yOffset: (elementHeight - renderedHeight) / 2,
      width: renderedWidth,
      height: renderedHeight,
      scale: img.naturalWidth / renderedWidth
    };
  }

}