import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociMessageRow extends SociComponent {
  constructor() {
    super()
  }

  css() {
    return `
      :host {
        display: block;
        max-width: 100%;
        animation: message-row-load 0.2s var(--soci-ease, ease-out) both;
      }

      #row {
        max-width: 100%;
        position: relative;
        padding: 20px 0 0 32px;
      }

      #meta {
        position: absolute;
        left: 0;
        top: 0;
        flex-shrink: 0;
        display: flex;
        gap: 8px;
        align-items: center;
      }

      soci-user {
        --font-size: 14px;
        --avatar-size: 24px;
        --font-weight: 600;
      }

      .message-body {
        flex: 1;
        min-width: 0;
      }

      ::slotted(soci-markdown-view) {
        display: block;
        font-size: 14px;
        line-height: 1.5;
        margin-top: 2px;
      }

      .message-image {
        margin-top: 8px;
        max-width: 100%;
        border-radius: 4px;
      }

      #time {
        font-size: 12px;
        color: var(--text-tertiary);
      }

      :host([compact]) {
        margin-top: -8px;
        #meta {
          display: none;
        }
        #row {
          padding-top: 0;
        }
      }

      @keyframes message-row-load {
        from {
          transform: translateY(4px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `
  }

  html() {
    return `
      <div id="row">
        <div id="meta">
          <soci-user id="user"></soci-user>
          <div id="time"><span id="meta-time"></span><suffix id="meta-suffix"> ago</suffix></div>
        </div>
        <div class="message-body">
          <slot></slot>
          <img class="message-image" id="image" alt="Attachment" hidden>
        </div>
      </div>
    `
  }

  static get observedAttributes() {
    return ['user', 'time', 'image-url']
  }

  setCompact(compact) {
    this.toggleAttribute('compact', !!compact)
  }

  connectedCallback() {
    this._syncUser()
    this._syncTime()
    this._syncImage()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return
    if (name === 'user') this._syncUser()
    if (name === 'time') this._syncTime()
    if (name === 'image-url') this._syncImage()
  }

  _syncUser() {
    const user = this.select('#user')
    const userName = this.getAttribute('user') || ''
    if (!user) return
    const isSelf = userName && userName === window.soci?.username
    user.setAttribute('name', userName)
    user.toggleAttribute('self', !!isSelf)
  }

  _syncTime() {
    const meta = this.select('#meta-time')
    const suffix = this.select('#meta-suffix')
    const time = this.getAttribute('time')
    if (!meta) return
    if (!time || time === 'now') {
      meta.textContent = 'just now'
      if (suffix) suffix.style.display = 'none'
      return
    }
    if (suffix) suffix.style.display = ''
    this.updateTime = this.updateTime.bind(this)
    this.updateTime(time, meta)
  }

  _syncImage() {
    const image = this.select('#image')
    const imageUrl = this.getAttribute('image-url') || ''
    if (!image) return

    if (imageUrl) {
      image.hidden = false
      image.src = imageUrl.startsWith('http')
        ? imageUrl
        : `${config.IMAGE_HOST}/${imageUrl}.webp`
    } else {
      image.hidden = true
      image.removeAttribute('src')
    }
  }
}
