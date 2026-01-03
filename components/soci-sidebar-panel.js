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
          <soci-tag-li href="/#all" icon="home" hide-subscribe>
            All posts
            <svg slot="icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.22109 1.04962L7.55491 1.72123L7.22109 1.04962L1.72109 3.78334C1.12618 4.07904 0.75 4.6861 0.75 5.35044V12.5C0.75 13.4665 1.5335 14.25 2.5 14.25H13.5C14.4665 14.25 15.25 13.4665 15.25 12.5V5.35044C15.25 4.6861 14.8738 4.07904 14.2789 3.78334L8.77891 1.04962C8.28827 0.805746 7.71173 0.805747 7.22109 1.04962Z" stroke="var(--text-brand)" stroke-width="1.5"></path>
              <rect x="5.25" y="7.25" width="5.5" height="7" stroke="var(--text-brand)" stroke-width="1.5" stroke-linejoin="round"></rect>
            </svg>
          </soci-tag-li>
          <soci-tag-li href="/#images" hide-subscribe>
            Images
            <svg slot="icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4.25C10.4142 4.25 10.75 3.91421 10.75 3.5V3C10.75 2.0335 9.9665 1.25 9 1.25H7C6.0335 1.25 5.25 2.0335 5.25 3V3.5C5.25 3.91421 5.58579 4.25 6 4.25H10Z" stroke="var(--text-brand)" stroke-width="1.5" stroke-linejoin="round"></path>
              <rect x="0.75" y="4.25" width="14.5" height="9.5" rx="1.75" stroke="var(--text-brand)" stroke-width="1.5" stroke-linejoin="round"></rect>
              <circle cx="8" cy="9" r="2.25" stroke="var(--text-brand)" stroke-width="1.5"></circle>
            </svg>
          </soci-tag-li>
          <soci-tag-li href="/#videos" hide-subscribe>
            Videos
            <svg slot="icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.75" y="1.75" width="14.5" height="12.5" rx="1.75" stroke="var(--text-brand)" stroke-width="1.5" stroke-linejoin="round"></rect>
              <path d="M6.8975 4.864C6.6663 4.7195 6.37489 4.71185 6.13642 4.84402C5.89796 4.97619 5.75 5.22736 5.75 5.5V10.5C5.75 10.7726 5.89796 11.0238 6.13642 11.156C6.37489 11.2882 6.6663 11.2805 6.8975 11.136L10.8975 8.636C11.1168 8.49894 11.25 8.25859 11.25 8C11.25 7.74141 11.1168 7.50106 10.8975 7.364L6.8975 4.864Z" stroke="var(--text-brand)" stroke-width="1.5" stroke-linejoin="round"></path>
            </svg>
          </soci-tag-li>
          <soci-tag-li href="/#blogs" hide-subscribe>
            Blogs
            <svg slot="icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2.25" y="0.75" width="11.5" height="14.5" rx="1.75" stroke="var(--text-brand)" stroke-width="1.5" stroke-linejoin="round"></rect>
              <path d="M5 4H11" stroke="var(--text-brand)" stroke-width="1.5" stroke-linecap="round"></path>
              <path d="M5 7H11" stroke="var(--text-brand)" stroke-width="1.5" stroke-linecap="round"></path>
              <path d="M5 10H8.5" stroke="var(--text-brand)" stroke-width="1.5" stroke-linecap="round"></path>
            </svg>
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
            <soci-link class="submit-link" href="/submit" fresh>
              <soci-button id="submit" subtle>
                <soci-icon glyph="create"></soci-icon><span>submit</span>
              </soci-button>
            </soci-link>
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
    if(!window.soci.accessToken) return sidebar.needsLogin()

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