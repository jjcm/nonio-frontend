import SociComponent from './soci-component.js'

export default class SociCommunityBar extends SociComponent {
  constructor() {
    super()
    this._boundLoad = this.loadCommunities.bind(this)
    this._boundActive = this.updateActiveState.bind(this)
  }

  css() {
    return `
      :host {
        width: 60px;
        min-width: 60px;
        height: 100dvh;
        display: block;
      }

      .rail {
        position: fixed;
        left: 0;
        top: 0;
        width: 60px;
        height: 100dvh;
        background: var(--bg);
        border-right: 1px solid var(--bg-secondary);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 0;
        gap: 12px;
        z-index: 4;
      }

      .icon-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        width: 100%;
        flex: 1;
        overflow-y: auto;
        scrollbar-width: none;
      }

      .community-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        border: 1px solid transparent;
        background: var(--bg-secondary);
        color: var(--text);
        font-weight: 600;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border 0.15s var(--soci-ease), background 0.15s var(--soci-ease);
        cursor: pointer;
        border: none;
        padding: 0;
      }

      .community-icon:hover {
        border-color: var(--bg-secondary-hover);
      }

      .community-icon[active] {
        border-color: var(--bg-brand);
        background: var(--bg-brand);
        color: var(--bg);
      }

      soci-button.create-button {
        width: 40px;
        height: 40px;
        min-width: 40px;
        border-radius: 12px;
        font-size: 24px;
        line-height: 1;
        padding: 0;
      }

      .create-panel {
        position: fixed;
        left: 70px;
        top: 20px;
        width: 280px;
        background: var(--bg);
        border: 1px solid var(--bg-secondary);
        box-shadow: 0 12px 32px rgba(0,0,0,0.12);
        border-radius: 12px;
        padding: 16px;
        z-index: 6;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .create-panel[hidden] {
        display: none;
      }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .panel-header h3 {
        margin: 0;
        font-size: 16px;
      }

      .panel-header soci-button {
        min-width: 32px;
        width: 32px;
        height: 32px;
        padding: 0;
        font-size: 18px;
        line-height: 1;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      input,
      textarea,
      select {
        border: 1px solid var(--bg-secondary);
        border-radius: 6px;
        padding: 8px;
        font-size: 14px;
        font-family: inherit;
        background: var(--bg);
        color: var(--text);
      }

      textarea {
        min-height: 60px;
        resize: vertical;
      }

      .actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .actions soci-button {
        min-width: 80px;
      }

      .error {
        color: var(--text-danger);
        font-size: 13px;
      }

      @media (max-width: 768px) {
        :host {
          display: none;
        }
      }
    `
  }

  html() {
    return `
      <div class="rail">
        <div class="icon-list"></div>
        <soci-button class="create-button" title="Create community" @click=openCreate>+</soci-button>
      </div>
      <div class="create-panel" hidden>
        <div class="panel-header">
          <h3>Create Community</h3>
          <soci-button subtle @click=closeCreate>&times;</soci-button>
        </div>
        <form @submit=createCommunity>
          <input name="name" placeholder="Name" required>
          <input name="url" placeholder="URL (no @)" required>
          <textarea name="description" placeholder="Description"></textarea>
          <select name="privacy">
            <option value="public">Public</option>
            <option value="invite-only">Invite only</option>
          </select>
          <div class="error" hidden></div>
          <div class="actions">
            <soci-button subtle @click=closeCreate>Cancel</soci-button>
            <soci-button async @click=submitCreate>Create</soci-button>
          </div>
        </form>
      </div>
    `
  }

  connectedCallback() {
    this.loadCommunities()
    document.addEventListener('login', this._boundLoad)
    document.addEventListener('username-updated', this._boundLoad)
    document.addEventListener('logout', this._boundLoad)
    window.addEventListener('hashchange', this._boundActive)
    window.addEventListener('popstate', this._boundActive)
    window.addEventListener('link', this._boundActive)
  }

  disconnectedCallback() {
    document.removeEventListener('login', this._boundLoad)
    document.removeEventListener('username-updated', this._boundLoad)
    document.removeEventListener('logout', this._boundLoad)
    window.removeEventListener('hashchange', this._boundActive)
    window.removeEventListener('popstate', this._boundActive)
    window.removeEventListener('link', this._boundActive)
  }

  async loadCommunities() {
    try {
      const endpoint = window.soci?.accessToken ? 'communities/subscribed' : 'communities'
      const response = await window.soci.getData(endpoint)
      this._communities = response.communities || []
      this.renderCommunities()
    } catch (err) {
      console.error('Failed to load communities', err)
    }
  }

  renderCommunities() {
    const list = this.select('.icon-list')
    list.innerHTML = ''
    this._communities.forEach(community => {
      const button = document.createElement('button')
      button.className = 'community-icon'
      button.title = community.name
      button.dataset.href = `/@${community.url}`
      button.innerText = this.getInitials(community.name)
      button.addEventListener('click', this.navigate.bind(this))
      list.appendChild(button)
    })
    this.updateActiveState()
  }

  getInitials(name) {
    if(!name) return '?'
    const parts = name.trim().split(' ')
    if(parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
  }

  navigate(e) {
    e.preventDefault()
    const href = e.currentTarget.dataset.href
    if(!href) return
    window.history.pushState(null, null, href)
    window.dispatchEvent(new CustomEvent('link'))
  }

  updateActiveState() {
    const path = window.location.pathname
    this.selectAll('.community-icon').forEach(icon => {
      const href = icon.dataset.href || ''
      icon.toggleAttribute('active', path.startsWith(href))
    })
  }

  openCreate() {
    if(!window.soci.accessToken) {
      window.soci.showLogin()
      return
    }
    this.select('.create-panel').hidden = false
    this.select('input[name="name"]').focus()
  }

  closeCreate() {
    this.select('.create-panel').hidden = true
    const form = this.select('form')
    form.reset()
    this.toggleError()
  }

  toggleError(message) {
    const error = this.select('.error')
    if(message) {
      error.hidden = false
      error.textContent = message
    } else {
      error.hidden = true
      error.textContent = ''
    }
  }

  createCommunity(e) {
    e.preventDefault()
  }

  async submitCreate(e) {
    if(!window.soci.accessToken) {
      window.soci.showLogin()
      return
    }
    const form = this.select('form')
    const submitButton = e.currentTarget
    this.toggleError()

    const payload = {
      name: form.name.value.trim(),
      url: form.url.value.trim().replace(/^@/, '').toLowerCase(),
      description: form.description.value.trim(),
      privacyType: form.privacy.value
    }

    try {
      const result = await window.api.community.create(payload)
      if(result.error) {
        this.toggleError(result.error)
        submitButton.error()
      } else {
        submitButton.success()
        this.closeCreate()
        await this.loadCommunities()
        if(result.url) {
          window.history.pushState(null, null, `/@${result.url}`)
          window.dispatchEvent(new CustomEvent('link'))
        }
      }
    } catch (err) {
      this.toggleError('Unable to create community')
      submitButton.error()
    }
  }
}

