import SociComponent from './soci-component.js'

export class SociSidebarPanel extends SociComponent {
  constructor() {
    super()
  }

  html(){ return `
    <slot></slot>
  `}

  activeHTML(){ return `
  `}

  static get observedAttributes() {
    return ['active']
  }

  connectedCallback(){
  }

  activatedCallback(){
  }

  deactivatedCallback(){
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name !== 'active' || oldValue === newValue) return
    const active = newValue !== null && newValue !== 'false'
    if(active) {
      this.innerHTML = this.activeHTML()
      this.activatedCallback()
    } else {
      setTimeout(()=>{
        this.innerHTML = ''
        this.deactivatedCallback()
      }, 200)
    }
  }
}

export class SociSidebarCommunityPanel extends SociSidebarPanel {
  activeHTML(){ return `
    <div class="panel-header">
      <soci-select id="community-switcher"></soci-select>
    </div>
    <header>
      <div id="community-avatar">
        <img id="community-avatar-img" alt="">
      </div>
      <soci-button id="community-subscribe" style="display: none;">Subscribe</soci-button>
      <div id="community-description">
        <soci-markdown-view></soci-markdown-view>
        <div id="admin-links">
          <soci-link href="#">Settings</soci-link>
          <soci-link href="#">Users</soci-link>
          <soci-link href="#">Financials</soci-link>
        </div>
      </div>
    </header>
    <div id="tag-container">
      <content>
        <section id="all-tags">
          <soci-tag-li href="/#all" hide-subscribe>
            All posts
            <soci-icon slot="icon" glyph="allPosts"></soci-icon>
          </soci-tag-li>
          <soci-tag-li id="sidebar-submit-post" href="/submit" hide-subscribe>
            Submit post
            <soci-icon slot="icon" glyph="addPosts"></soci-icon>
          </soci-tag-li>
        </section>
        <section id="subscribed-tags" style="height: 0px; opacity: 0; display: none;">
          <h2>Subscribed Tags</h2>
          <tags></tags>
        </section>
        <section id="tags">
          <h2>Tags</h2>
          <tags></tags>
        </section>
      </content>
    </div>
    <section id="sidebar-user">
      <div id="sidebar-user-logged-in">
        <div class="footer-bar">
          <soci-user self></soci-user>
          <div id="sidebar-user-actions">
            <soci-notification-badge></soci-notification-badge>
            <soci-button id="logout-btn" subtle>
              <soci-icon glyph="logout"></soci-icon><span>logout</span>
            </soci-button>
          </div>
        </div>
      </div>
      <div id="sidebar-user-logged-out" hidden>
        <div class="footer-bar">
          <soci-link id="login-link" href="#">login</soci-link>
          <soci-link id="signup-link" href="#">signup</soci-link>
          <soci-link id="about-link" href="/about">about</soci-link>
        </div>
      </div>
    </section>
  `}

  activatedCallback(){
    const sidebar = this.closest('soci-sidebar')
    if(!sidebar) return

    this.querySelector('#community-switcher')?.addEventListener('selected', (e) => sidebar._onCommunitySelect(e))
    this.querySelector('#community-subscribe')?.addEventListener('click', () => sidebar.toggleSubscribe())
    this.querySelector('content')?.addEventListener('subscribe', (e) => sidebar._createSubscribedTag(e))
    this.querySelector('content')?.addEventListener('unsubscribe', (e) => sidebar._removeSubscribedTag(e))

    sidebar._syncAuthUI()
    sidebar._loadCommunities()
    sidebar._loadCommonTags()
    if(sidebar.authToken) sidebar._loadSubscribedTags()
    sidebar._onRouteChange()

    // Panel re-renders on activation; repopulate community-dependent DOM even if route didn't change.
    sidebar._updateCommunitySelection?.(sidebar.currentCommunity)
    sidebar._updateCommunityAvatar?.(sidebar.currentCommunity)
    sidebar._toggleCommunityHeaderVisible?.(sidebar.currentCommunity)
    sidebar._populateCommunityDetails?.()
  }
}

export class SociSidebarLoginPanel extends SociSidebarPanel {
  activeHTML(){ return `
    <soci-button subtle class="panel-back" id="back-to-community">&larr; back</soci-button>
    <h2>Login to your account</h2>
    <form>
      <input type="email" name="email" placeholder="Email address" autocomplete="email">
      <soci-password name="password"></soci-password>
      <soci-button async id="login-btn">login</soci-button>
    </form>
    <div class="panel-footer">
      <soci-link id="create-account" href="#">create account</soci-link>
      <soci-link id="im-stupid" href="/admin/forgot-password">forgot password</soci-link>
    </div>
  `}

  activatedCallback(){
    const sidebar = this.closest('soci-sidebar')
    if(!sidebar) return

    this.querySelector('#back-to-community')?.addEventListener('click', (e) => {
      e.preventDefault()
      sidebar.setView('community')
    })

    const form = this.querySelector('form')
    const btn = this.querySelector('#login-btn')
    const create = this.querySelector('#create-account')

    const submit = (e) => {
      e?.preventDefault?.()
      btn?.wait?.()
      this._login()
    }

    form?.addEventListener('submit', submit)
    btn?.addEventListener('click', submit)
    create?.addEventListener('click', (e) => {
      e.preventDefault()
      sidebar.setView('create')
    })

    this.addEventListener('keydown', (e) => {
      if(e.key === 'Enter') submit(e)
    })

    setTimeout(() => this.querySelector('input[type="email"]')?.focus?.(), 0)
  }

  async _login(){
    const sidebar = this.closest('soci-sidebar')
    if(!sidebar) return
    const form = this.querySelector('form')
    const btn = this.querySelector('#login-btn')

    this.querySelector('soci-password')?.checkValidity?.()
    const loginData = window.soci.getJSONFromForm(form)
    if(!form.reportValidity()) return btn?.error?.()

    const response = await window.api.user.login(loginData)
    if(!response?.accessToken) return btn?.error?.()
    btn?.success?.()
    sidebar._onLoggedIn(response)
  }
}

export class SociSidebarAccountCreation extends SociSidebarPanel {
  activeHTML(){ return `
    <soci-button subtle class="panel-back" id="back-to-community">&larr; back</soci-button>
    <form>
      <h2>Create Account</h2>
      <soci-username-input name="username" tabindex="1"></soci-username-input>
      <input type="email" name="email" placeholder="Email address" autocomplete="email">
      <soci-password tabindex="0" name="password"></soci-password>
      <soci-password tabindex="0" name="confirmPassword" placeholder="Confirm Password" match="password"></soci-password>
      <soci-button async id="register-btn">Create Account</soci-button>
    </form>
  `}

  activatedCallback(){
    const sidebar = this.closest('soci-sidebar')
    this.querySelector('#back-to-community')?.addEventListener('click', (e) => {
      e.preventDefault()
      sidebar?.setView?.('community')
    })

    const form = this.querySelector('form')
    const btn = this.querySelector('#register-btn')
    const submit = (e) => {
      e?.preventDefault?.()
      btn?.wait?.()
      this._register()
    }
    form?.addEventListener('submit', submit)
    btn?.addEventListener('click', submit)
  }

  async _register(){
    const sidebar = this.closest('soci-sidebar')
    if(!sidebar) return
    const form = this.querySelector('form')
    const btn = this.querySelector('#register-btn')
    if(!form.reportValidity()) return btn?.error?.()
    const formData = window.soci.getJSONFromForm(form)
    const response = await window.api.user.register(formData)
    if(!response?.accessToken) return btn?.error?.()
    btn?.success?.()
    sidebar._onLoggedIn(response)
  }
}

export class SociSidebarCreateCommunityPanel extends SociSidebarPanel {
  activeHTML(){ return `
    <div class="panel-header">
      <soci-button subtle id="close-create-community">
        &larr; back
      </soci-button>
      <h3>Create Community</h3>
    </div>
    <form id="create-community-form">
      <input name="name" placeholder="Name" required>
      <input name="url" placeholder="URL (no @)" required>
      <textarea name="description" placeholder="Description"></textarea>
      <select name="privacy">
        <option value="public">Public</option>
        <option value="invite-only">Invite only</option>
      </select>
      <div class="error" hidden></div>
      <div class="actions">
        <soci-button async id="submit-create-community">Create</soci-button>
      </div>
    </form>
  `}

  activatedCallback(){
    const sidebar = this.closest('soci-sidebar')
    if(!sidebar) return
    this.querySelector('#close-create-community')?.addEventListener('click', (e) => {
      e.preventDefault()
      sidebar.setView('community')
    })
    const submit = (e) => {
      e?.preventDefault?.()
      this._submit()
    }
    this.querySelector('#submit-create-community')?.addEventListener('click', submit)
    this.querySelector('#create-community-form')?.addEventListener('submit', submit)
    setTimeout(() => this.querySelector('input[name="name"]')?.focus?.(), 0)
  }

  _toggleError(message) {
    const error = this.querySelector('.error')
    if(!error) return
    if(message) {
      error.hidden = false
      error.textContent = message
    } else {
      error.hidden = true
      error.textContent = ''
    }
  }

  async _submit(){
    const sidebar = this.closest('soci-sidebar')
    if(!sidebar) return
    if(!sidebar.authToken) return window.soci?.requireLogin?.('create a community')

    const form = this.querySelector('#create-community-form')
    const btn = this.querySelector('#submit-create-community')
    btn?.wait?.()
    this._toggleError()

    const payload = {
      name: form.name.value.trim(),
      url: form.url.value.trim().replace(/^@/, '').toLowerCase(),
      description: form.description.value.trim(),
      privacyType: form.privacy.value
    }

    try {
      const result = await window.api.community.create(payload)
      if(result?.error) {
        this._toggleError(result.error)
        return btn?.error?.()
      }
      btn?.success?.()
      await sidebar._loadCommunities()
      sidebar.setView('community')
      if(result?.url) {
        window.history.pushState(null, null, `/@${result.url}`)
        window.dispatchEvent(new CustomEvent('link'))
      }
    } catch {
      this._toggleError('Unable to create community')
      btn?.error?.()
    }
  }
}