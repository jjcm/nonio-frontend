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
        padding: 4px 16px 4px 52px;
        position: relative;
      }
      :host(:hover) {
        background: var(--bg-hover);
      }
      #hover-time {
        position: absolute;
        left: 8px;
        top: 10px;
        width: 38px;
        font-size: 11px;
        color: var(--text-tertiary);
        opacity: 0;
        pointer-events: none;
        text-align: right;
      }
      :host(:hover) #hover-time {
        opacity: 1;
      }

      #row {
        max-width: 100%;
        position: relative;
        padding: 20px 0 0 0;
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
      #overlay {
        position: absolute;
        top: -2px;
        right: 0;
        display: flex;
        gap: 4px;
        opacity: 0;
        pointer-events: none;
        background: var(--bg);
        border: 1px solid var(--bg-secondary);
        border-radius: 4px;
        padding: 2px;
      }
      :host(:hover) #overlay {
        opacity: 1;
        pointer-events: auto;
      }
      .action {
        border: 0;
        background: transparent;
        color: var(--text-secondary);
        font-size: 12px;
        line-height: 1;
        padding: 4px 6px;
        border-radius: 3px;
        cursor: pointer;
      }
      .action:hover {
        background: var(--bg-secondary);
        color: var(--text);
      }
      #reply-action[hidden] {
        display: none;
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
        padding-top: 0px;
        #meta {
          display: none;
        }
        #row {
          padding-top: 0;
        }
        #overlay {
          top: -8px;
        }
      }
      :host([compact]) #hover-time {
        top: 2px;
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
        <div id="overlay">
          <button id="react-action" class="action" type="button" title="Add reaction">😊</button>
          <button id="reply-action" class="action" type="button" title="Reply in thread">Reply</button>
        </div>
        <div id="meta">
          <soci-user id="user"></soci-user>
          <div id="time"><span id="meta-time"></span><suffix id="meta-suffix"> ago</suffix></div>
        </div>
        <div class="message-body">
          <slot></slot>
          <img class="message-image" id="image" alt="Attachment" hidden>
          <slot name="reactions"></slot>
        </div>
      </div>
      <div id="hover-time"></div>
    `
  }

  static get observedAttributes() {
    return ['user', 'time', 'image-url', 'parent-id']
  }

  setCompact(compact) {
    this.toggleAttribute('compact', !!compact)
  }

  connectedCallback() {
    this._syncUser()
    this._syncTime()
    this._syncImage()
    this._syncReplyVisibility()
    const react = this.select('#react-action')
    const reply = this.select('#reply-action')
    if (react) react.addEventListener('click', () => this._emitAction('message-react'))
    if (reply) reply.addEventListener('click', () => this._emitAction('message-reply'))
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return
    if (name === 'user') this._syncUser()
    if (name === 'time') this._syncTime()
    if (name === 'image-url') this._syncImage()
    if (name === 'parent-id') this._syncReplyVisibility()
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
    const hoverTime = this.select('#hover-time')
    const time = this.getAttribute('time')
    if (!meta) return
    const ts = Number.parseInt(time || '', 10)
    if (hoverTime && Number.isFinite(ts) && ts > 0) hoverTime.textContent = this._formatClock(ts)
    else if (hoverTime) hoverTime.textContent = ''
    if (!time || time === 'now') {
      meta.textContent = 'just now'
      if (suffix) suffix.style.display = 'none'
      return
    }
    if (suffix) suffix.style.display = ''
    this.updateTime = this.updateTime.bind(this)
    this.updateTime(time, meta)
  }

  _formatClock(ts) {
    const d = new Date(ts)
    if (Number.isNaN(d.getTime())) return ''
    let h = d.getHours()
    const m = String(d.getMinutes()).padStart(2, '0')
    const ampm = h >= 12 ? 'pm' : 'am'
    h = h % 12
    if (h === 0) h = 12
    return `${h}:${m}${ampm}`
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

  _syncReplyVisibility() {
    const reply = this.select('#reply-action')
    if (!reply) return
    reply.hidden = this.hasAttribute('parent-id')
  }

  _emitAction(name) {
    const messageID = Number.parseInt(this.dataset.messageId || '', 10)
    this.fire(name, { messageID })
  }
}
