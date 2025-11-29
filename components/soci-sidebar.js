import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociSidebar extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        width: 280px;
        min-width: 280px;
        display: block;
        height: 100dvh;
        overflow: auto;
        overflow-x: hidden;
        position: fixed;
        padding-bottom: 90px;
        box-sizing: border-box;
        transition: opacity 0.1s var(--soci-ease);
        opacity: 1;
      }
      :host([noauth]) #noauth { left: 0; }
      :host([noauth]) #auth { left: -100%; }
      :host([create]) #create { left: 0; }
      :host([create]) #auth,
      :host([create]) #noauth,
      :host([create-community]) #auth,
      :host([create-community]) #noauth { left: 100%; }
      :host([create-community]) #create-community { left: 0; }
      :host([dragging]) { user-select: none; }

      h2 {
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 1.4px;
        font-weight: normal;
        color: var(--text-secondary);
        line-height: 40px;
        margin: 12px 0 4px 0;
        &:first-child { margin-top: 0; }
      }

      section {
        position: relative;
        transition: all var(--anim-duration-med) var(--soci-ease), opacity var(--anim-duration-long) var(--soci-ease);
      }
      
      content section {
        border: none;
        padding: 0 12px;
      }

      #user {
        position: sticky;
        top: 0;
        background: var(--bg-secondary);
        z-index: 10;
        height: 40px;
        border-bottom: 1px solid var(--bg-bold);
        
        soci-user {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding-left: 16px;
          width: 100%;
          height: 100%;
          margin: 0;
          --spacing: 12px;
          --font-weight: 500;
          --font-size: 14px;
          --avatar-size: 20px;
          --line-height: 20px;
        }
        soci-button {
          display: inline-flex;
          background: var(--bg-secondary-hover);
          &:hover soci-icon { margin: -2px -2px -2px -8px; }
        }
        soci-icon {
          margin: -2px 8px -2px -10px;
          transition: margin 0.1s var(--soci-ease);
        }
        #submit {
          transition: width 0.1s var(--soci-ease);
          width: 20px;
          overflow: hidden;
          &:hover { width: 64px; }
        }
        svg { margin: -2px 0px -2px -6px; }
      }

      #user-actions {
        position: absolute;
        right: 8px;
        top: 10px;
      }

      #footer {
        font-size: 12px;
        padding: 18px 22px;
        line-height: 24px;
        position: fixed;
        bottom: 0;
        box-sizing: border-box;
        width: 280px;
        color: var(--text-secondary);
        background: var(--bg);
        border-top: 2px solid transparent;
        transition: border-top 0.3s var(--soci-ease);
        
        links {
          justify-content: flex-start;
          display: flex;
          font-size: 14px;
        }
        soci-link, a {
          color: var(--text-tertiary);
          text-decoration: none;
          margin-right: 28px;
          &:hover { color: var(--text-secondary); }
        }
        svg { margin-bottom: 12px; }
      }

      #admin-links {
        display: none;
        padding-top: 8px;
        margin: 0 -8px;
        
        soci-link {
          display: inline-block;
          font-size: 14px;
          padding: 4px 8px;
          border-radius: 4px;
          color: var(--text-tertiary);
          text-decoration: none;
          &:hover { color: var(--text-secondary); }
        }
      }

      panel {
        position: absolute;
        height: calc(100% - 62px);
        overflow-y: auto;
        overflow-x: hidden;
        display: block;
        top: 0;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        transition: left 0.2s ease-in-out;
      }

      #create, #noauth, #create-community {
        padding: 24px 22px 20px;
        left: -100%;
      }

      #noauth {
        svg { margin-bottom: 24px; }
        h2 { padding-left: 0; }
        soci-link {
          display: block;
          margin-top: 32px;
          font-size: 13px;
          color: var(--text-brand);
          font-weight: 700;
          letter-spacing: 0.5px;
          opacity: 0.8;
          cursor: pointer;
          text-align: center;
        }
        #im-stupid {
          margin-top: 12px;
          color: var(--text-secondary);
          font-weight: 400;
          opacity: 0.5;
        }
      }

      #auth {
        input {
          margin-bottom: 0;
          border-bottom: 0 !important;
          padding-left: 54px;
          &::placeholder {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1.4px;
            font-weight: normal;
            color: var(--text-secondary);
          }
        }
        content {
          display: flex;
          flex-direction: column;
          height: calc(100% - 42px);
          overflow-x: hidden;
          gap: 16px;
        }
        h2 {
          padding-left: 12px;
          line-height: 32px;
        }
      }

      #create {
        form { display: flex; flex-direction: column; }
        h2:not(:first-child) { margin-top: 50px; }
        soci-button { margin-top: 16px; align-self: flex-end; }
      }

      #create-community {
        form { display: flex; flex-direction: column; }
        soci-button { margin-top: 16px; align-self: flex-end; }
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 24px;
          & h3 { margin: 0 0 0 12px; font-size: 16px; }
        }
        textarea { min-height: 60px; resize: vertical; }
        select {
          border: 1px solid var(--bg-secondary);
          border-radius: 6px;
          padding: 8px;
          font-size: 14px;
          font-family: inherit;
          background: var(--bg);
          color: var(--text);
          margin-bottom: 8px;
        }
        .error { color: var(--text-danger); font-size: 13px; margin-top: 8px; }
      }

      input {
        margin: 0 0 8px;
        border: 0;
        color: var(--text);
        border-bottom: 2px solid var(--bg-secondary);
        background: var(--bg);
        height: 38px;
        font-size: 14px;
        width: 100%;
        &:focus { outline: 0; border-bottom: 2px solid var(--bg-brand); }
        &[type="email"] { margin-bottom: 24px; }
      }
      
      textarea {
        margin: 0 0 8px;
        border: 1px solid var(--bg-secondary);
        color: var(--text);
        background: var(--bg);
        padding: 8px;
        font-size: 14px;
        width: 100%;
        box-sizing: border-box;
        border-radius: 4px;
        &:focus { outline: 0; border-color: var(--bg-brand); }
      }
      
      select:focus { outline: 0; border-color: var(--bg-brand); }

      cc-details {
        display: flex;
        & input:first-child { min-width: 160px; margin-right: 12px; }
      }
      
      #community-selector {
        padding: 0 12px;
        z-index: 2;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      soci-select {
        width: 100%;
        --height: 32px;
        --padding: 12px;
        color: var(--text);
        height: 64px;
      }
      
      #nonio-community {
        span {
          display: block;
        }
        svg {
          display: none;
        }
      }

      soci-option[slot="selected"] {
        margin: 0 -12px;
        padding: 0 16px;
        height: 64px;
        --shadow: 0px 1px 2px #000000f0, 0px 4px 16px #000000f0;
        font-size: 16px;
        border-bottom: 1px solid var(--bg-bold);
      }

      #nonio-community[slot="selected"] {
        img,
        span {
          display: none;
        }
        svg {
          display: block;
        }
      }

      
      #community-subscribe {
        width: 100%;
        margin: 0;
        background: var(--bg-secondary);
        color: var(--text);
        border-radius: 4px;
        justify-content: center;
        &:hover { background: var(--bg-secondary-hover); }
        &[subscribed] {
          background: var(--bg-brand);
          color: var(--text-inverse);
          &:hover { background: var(--bg-brand-hover); }
        }
      }

      #community-description {
        padding: 0 16px;
        height: 0;
        min-height: 0;
        opacity: 0;
        overflow: hidden;
        margin-bottom: -16px;
        transition: all 0.2s var(--soci-ease);
        border-bottom: 1px solid var(--bg-secondary);
        
        soci-quill-view {
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-secondary);
          padding: 8px 0;
          p {
            margin: 0 0 8px;
            &:last-child { margin-bottom: 0; }
          }
        }
      }

      ::-webkit-scrollbar { width: 14px; }
      ::-webkit-scrollbar-track { background: var(--bg); }
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(90deg, var(--text-secondary) -1500px, transparent 1000px);
        border-radius: 7px;
        border: 3px solid var(--bg);
        &:hover { background: linear-gradient(90deg, var(--text-secondary-hover) -1500px, transparent 1000px); }
      }

      @media (max-height: 780px) {
        #footer { border-top: 1px solid var(--bg-bold); }
      }

      @media (max-width: 768px) {
        :host { width: 100%; }
        :host([overlay]) { background: var(--bg); left: 0 !important; }
        panel { height: 100%; }
        #footer { display: none; }
      }
    `
  }

  html(){
    return `
      <panel id="auth">
        <section id="user">
          <soci-user self></soci-user>
          <div id="user-actions">
            <soci-notification-badge></soci-notification-badge>
            <soci-link href="/submit" fresh>
              <soci-button id="submit" subtle><soci-icon glyph="create"></soci-icon><span>submit</span></soci-button>
            </soci-link>
          </div>
        </section>
        <content>
          <div id="community-selector">
             <soci-select></soci-select>
             <soci-button id="community-subscribe" @click=toggleSubscribe style="display: none;">Subscribe</soci-button>
          </div>
          <div id="community-description">
             <soci-quill-view></soci-quill-view>
             <div id="admin-links">
               <soci-link href="#">Settings</soci-link>
               <soci-link href="#">Users</soci-link>
               <soci-link href="#">Financials</soci-link>
             </div>
          </div>
          <section id="all-tags">
            <soci-tag-li href="/#all" icon="home" hide-subscribe>
              All posts
              <svg slot="icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.22109 1.04962L7.55491 1.72123L7.22109 1.04962L1.72109 3.78334C1.12618 4.07904 0.75 4.6861 0.75 5.35044V12.5C0.75 13.4665 1.5335 14.25 2.5 14.25H13.5C14.4665 14.25 15.25 13.4665 15.25 12.5V5.35044C15.25 4.6861 14.8738 4.07904 14.2789 3.78334L8.77891 1.04962C8.28827 0.805746 7.71173 0.805747 7.22109 1.04962Z" stroke="var(--text-brand)" stroke-width="1.5"/>
                <rect x="5.25" y="7.25" width="5.5" height="7" stroke="var(--text-brand)" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
            </soci-tag-li>
            <soci-tag-li href="/#images" hide-subscribe>
              Images
              <svg slot="icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4.25C10.4142 4.25 10.75 3.91421 10.75 3.5V3C10.75 2.0335 9.9665 1.25 9 1.25H7C6.0335 1.25 5.25 2.0335 5.25 3V3.5C5.25 3.91421 5.58579 4.25 6 4.25H10Z" stroke="var(--text-brand)" stroke-width="1.5" stroke-linejoin="round"/>
                <rect x="0.75" y="4.25" width="14.5" height="9.5" rx="1.75" stroke="var(--text-brand)" stroke-width="1.5" stroke-linejoin="round"/>
                <circle cx="8" cy="9" r="2.25" stroke="var(--text-brand)" stroke-width="1.5"/>
              </svg>
            </soci-tag-li>
            <soci-tag-li href="/#videos" hide-subscribe>
              Videos
              <svg slot="icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.75" y="1.75" width="14.5" height="12.5" rx="1.75" stroke="var(--text-brand)" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M6.8975 4.864C6.6663 4.7195 6.37489 4.71185 6.13642 4.84402C5.89796 4.97619 5.75 5.22736 5.75 5.5V10.5C5.75 10.7726 5.89796 11.0238 6.13642 11.156C6.37489 11.2882 6.6663 11.2805 6.8975 11.136L10.8975 8.636C11.1168 8.49894 11.25 8.25859 11.25 8C11.25 7.74141 11.1168 7.50106 10.8975 7.364L6.8975 4.864Z" stroke="var(--text-brand)" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
            </soci-tag-li>
            <soci-tag-li href="/#blogs" hide-subscribe>
              Blogs
              <svg slot="icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2.25" y="0.75" width="11.5" height="14.5" rx="1.75" stroke="var(--text-brand)" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M5 4H11" stroke="var(--text-brand)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M5 7H11" stroke="var(--text-brand)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M5 10H8.5" stroke="var(--text-brand)" stroke-width="1.5" stroke-linecap="round"/>
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
      </panel>
      <panel id="noauth">
        <h2>Login to your account</h2>
        <slot name="login">
        </slot>
        <soci-link href="/admin/create-account" @click=_createAccount>create account</soci-link>
        <soci-link id="im-stupid" href="/admin/forgot-password">forgot password</soci-link>
      </panel>
      <panel id="create">
        <slot name="create">
        </slot>
      </panel>
      <panel id="create-community">
        <div class="panel-header">
          <soci-button subtle @click=closeCreateCommunity>
            <soci-icon glyph="view-back"></soci-icon>
          </soci-button>
          <h3>Create Community</h3>
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
            <soci-button async @click=submitCreateCommunity>Create</soci-button>
          </div>
        </form>
      </panel>
      <section id="footer">
        <links>
          <soci-link href="/about">About</soci-link>
          <a href="https://github.com/jjcm/nonio/issues/new">Feedback</a>
          <soci-link id="logout" @click=logout href="/">Logout</soci-link>
        </links>
      </section>
    `
  }

  get currentCommunity() {
    return window.soci.routeContext.community
  }

  async connectedCallback(){
    this.toggleAttribute('loading', false)
    if(!this.authToken) {
      this.setAttribute('noauth', '')
      this.querySelector('input').focus()
    }
    else {
      this._loadSubscribedTags()
      this._loadCommonTags()
      this._loadCommunities()
    }

    this.select('#noauth').addEventListener('keydown', this._loginOnEnter.bind(this))
    this.select('content').addEventListener('subscribe', this._createSubscribedTag.bind(this))
    this.select('content').addEventListener('unsubscribe', this._removeSubscribedTag.bind(this))
    
    // Update submit button href based on current route
    window.addEventListener('hashchange', this._onRouteChange.bind(this))
    window.addEventListener('popstate', this._onRouteChange.bind(this))
    window.addEventListener('link', this._onRouteChange.bind(this))
    
    // Listen for community selection
    this.select('soci-select').addEventListener('selected', this._onCommunitySelect.bind(this))

    // Set initial routes and community details
    setTimeout(() => this._onRouteChange(), 0)
  }

  _onRouteChange() {
    this._updateLinks()
    this._checkCommunityChange()
  }

  _lastCommunity = null
  _communities = []
  _communitiesLoaded = false

  _checkCommunityChange() {
    let community = this.currentCommunity
    if(this._lastCommunity === community) return
    
    this._lastCommunity = community
    this._loadSubscribedTags()
    this._loadCommonTags()
    this._updateCommunitySelection(community)
    this._populateCommunityDetails()
  }

  async _populateCommunityDetails() {
    let community = this.currentCommunity
    let container = this.select('#community-description')
    let adminLinks = this.select('#admin-links')
    
    if(!community) {
        this._animateSection(container, false)
        adminLinks.style.display = 'none'
        return
    }

    try {
        let res = await this.getData(`/communities/${community}`, this.authToken)
        
        // Update admin links
        if(res?.isAdmin) {
            let prefix = `/@${community}/admin`
            let links = adminLinks.querySelectorAll('soci-link')
            links[0].href = prefix
            links[1].href = `${prefix}/users`
            links[2].href = `${prefix}/financials`
            adminLinks.style.display = 'block'
        } else {
            adminLinks.style.display = 'none'
        }
        
        // Update description
        let quillView = container.querySelector('soci-quill-view')
        if(res?.description || res?.isAdmin) {
            quillView.render(res?.description || '')
            this._animateSection(container, true, quillView.offsetHeight + adminLinks.offsetHeight + 8)
        } else {
            this._animateSection(container, false)
        }
    } catch(e) {
        console.error('SociSidebar: Error loading community details', e)
        this._animateSection(container, false)
        adminLinks.style.display = 'none'
    }
  }
  
  _animateSection(el, show, height = 0) {
    if(show) {
        el.style.height = el.style.minHeight = height + 'px'
        el.style.opacity = 1
        el.style.marginBottom = 0
    } else {
        el.style.height = el.style.minHeight = 0
        el.style.opacity = 0
        el.style.marginBottom = '-16px'
    }
  }
  
  _updateCommunitySelection(communityUrl) {
    let select = this.select('soci-select')
    
    // Remove any previously added temporary options
    let tempOptions = select.querySelectorAll('soci-option[temporary]')
    tempOptions.forEach(opt => opt.remove())

    let options = Array.from(select.querySelectorAll('soci-option'))
    
    // If the community is not in our list (not subscribed), we need to add a temp option
    let existingOption = options.find(opt => {
      if(communityUrl) return opt.getAttribute('value') == communityUrl
      return opt.getAttribute('value') == ""
    })
    
    // Clear previous selection
    options.forEach(o => o.removeAttribute('slot'))

    if(existingOption) {
      existingOption.setAttribute('slot', 'selected')
      // It's a subscribed community (or frontpage)
      this.select('#community-subscribe').hidden = true
    } else {
      // Not in list, so we are viewing a community we aren't subscribed to
      // Create a temporary option for it
      let tempOption = document.createElement('soci-option')
      tempOption.setAttribute('temporary', '')
      tempOption.setAttribute('value', communityUrl)
      tempOption.setAttribute('slot', 'selected')
      tempOption.innerHTML = this._communityAvatar(communityUrl) + (communityUrl.charAt(0).toUpperCase() + communityUrl.slice(1))
      select.insertBefore(tempOption, select.firstChild)
      
      // Also fetch the community details to get proper casing/name if possible, though route context might suffice
      // But more importantly, show the subscribe button
      // Only show subscribe button if communities have loaded. 
      // If they haven't loaded, we can't be sure if it's a new subscription or just not loaded yet.
      if (this._communitiesLoaded) {
        this.select('#community-subscribe').hidden = false
        this.select('#community-subscribe').innerText = "Subscribe"
        this.select('#community-subscribe').removeAttribute('subscribed')
      } else {
        this.select('#community-subscribe').hidden = true
      }
    }
  }

  _updateLinks() {
    let community = this.currentCommunity
    let prefix = community ? `/@${community}` : ''

    // Update submit link
    let submitLink = this.select('#user-actions soci-link')
    if(submitLink) {
      submitLink.href = `${prefix}/submit`
    }

    // Update static tag links
    let staticTags = ['all', 'images', 'videos', 'blogs']
    staticTags.forEach(tag => {
      let link = this.select(`soci-tag-li[href$="#${tag}"]`)
      if(link) {
        link.setAttribute('href', `${prefix}/#${tag}`)
      }
    })
  }

  // Logic for the tag lists
  _subscribedTags = [] 
  _commonTags = []
  _subscribedTagsLoaded = false
  _commonTagsLoaded = false

  async _loadSubscribedTags(){
    let url = '/subscriptions'
    if(this.currentCommunity) url += `?community=${this.currentCommunity}`
    let tags = await this.getData(url, this.authToken)
    if(tags) {
      this.select('#subscribed-tags').style.display = 'block'
    }
    this._subscribedTags = tags.subscriptions.map(t=>t.tag)
    this._subscribedTagsLoaded = true
    this._populateTags()
  }
  async _loadCommonTags(){
    let url = '/tags'
    if(this.currentCommunity) url += `?community=${this.currentCommunity}`
    let tags = await this.getData(url, this.authToken)
    this._commonTags = tags.tags.map(t=>t.tag)
    this._commonTagsLoaded = true
    this._populateTags()
  }

  async _loadCommunities(){
    try {
      const endpoint = window.soci?.accessToken ? 'communities/subscribed' : 'communities'
      const response = await window.soci.getData(endpoint)
      this._communities = response.communities || []
      this._populateCommunitySelect(this._communities)
    } catch (err) {
      console.error('Failed to load communities', err)
    }
  }

  _communityAvatar(url) {
    return url ? `<img src="${config.AVATAR_HOST}/community_${url}.webp" onerror="this.style.display='none'">` : ''
  }

  _populateCommunitySelect(communities){
    this._communitiesLoaded = true
    let select = this.select('soci-select')
    
    let html = `<soci-option id="nonio-community" value="">
      <svg style="margin-left: 4px;" width="94" height="16" viewBox="0 0 94 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.8" d="M13.5 0.999999V15H10.84L3.86 6.5V15H0.66V0.999999H3.34L10.3 9.5V0.999999H13.5ZM29.2564 15.24C27.8031 15.24 26.4897 14.9267 25.3164 14.3C24.1564 13.6733 23.2431 12.8133 22.5764 11.72C21.9231 10.6133 21.5964 9.37333 21.5964 8C21.5964 6.62667 21.9231 5.39333 22.5764 4.3C23.2431 3.19333 24.1564 2.32667 25.3164 1.7C26.4897 1.07333 27.8031 0.76 29.2564 0.76C30.7097 0.76 32.0164 1.07333 33.1764 1.7C34.3364 2.32667 35.2497 3.19333 35.9164 4.3C36.5831 5.39333 36.9164 6.62667 36.9164 8C36.9164 9.37333 36.5831 10.6133 35.9164 11.72C35.2497 12.8133 34.3364 13.6733 33.1764 14.3C32.0164 14.9267 30.7097 15.24 29.2564 15.24ZM29.2564 12.48C30.0831 12.48 30.8297 12.2933 31.4964 11.92C32.1631 11.5333 32.6831 11 33.0564 10.32C33.4431 9.64 33.6364 8.86667 33.6364 8C33.6364 7.13333 33.4431 6.36 33.0564 5.68C32.6831 5 32.1631 4.47333 31.4964 4.1C30.8297 3.71333 30.0831 3.52 29.2564 3.52C28.4297 3.52 27.6831 3.71333 27.0164 4.1C26.3497 4.47333 25.8231 5 25.4364 5.68C25.0631 6.36 24.8764 7.13333 24.8764 8C24.8764 8.86667 25.0631 9.64 25.4364 10.32C25.8231 11 26.3497 11.5333 27.0164 11.92C27.6831 12.2933 28.4297 12.48 29.2564 12.48ZM57.8555 0.999999V15H55.1955L48.2155 6.5V15H45.0155V0.999999H47.6955L54.6555 9.5V0.999999H57.8555ZM66.8319 0.999999H70.0719V15H66.8319V0.999999ZM85.8384 15.24C84.3851 15.24 83.0718 14.9267 81.8984 14.3C80.7384 13.6733 79.8251 12.8133 79.1584 11.72C78.5051 10.6133 78.1784 9.37333 78.1784 8C78.1784 6.62667 78.5051 5.39333 79.1584 4.3C79.8251 3.19333 80.7384 2.32667 81.8984 1.7C83.0718 1.07333 84.3851 0.76 85.8384 0.76C87.2918 0.76 88.5984 1.07333 89.7584 1.7C90.9184 2.32667 91.8318 3.19333 92.4984 4.3C93.1651 5.39333 93.4984 6.62667 93.4984 8C93.4984 9.37333 93.1651 10.6133 92.4984 11.72C91.8318 12.8133 90.9184 13.6733 89.7584 14.3C88.5984 14.9267 87.2918 15.24 85.8384 15.24ZM85.8384 12.48C86.6651 12.48 87.4118 12.2933 88.0784 11.92C88.7451 11.5333 89.2651 11 89.6384 10.32C90.0251 9.64 90.2184 8.86667 90.2184 8C90.2184 7.13333 90.0251 6.36 89.6384 5.68C89.2651 5 88.7451 4.47333 88.0784 4.1C87.4118 3.71333 86.6651 3.52 85.8384 3.52C85.0118 3.52 84.2651 3.71333 83.5984 4.1C82.9318 4.47333 82.4051 5 82.0184 5.68C81.6451 6.36 81.4584 7.13333 81.4584 8C81.4584 8.86667 81.6451 9.64 82.0184 10.32C82.4051 11 82.9318 11.5333 83.5984 11.92C84.2651 12.2933 85.0118 12.48 85.8384 12.48Z" fill="currentColor"></path>
      </svg>
      <img src="/lib/favicon.svg">
      <span>Nonio</span>
    </soci-option>`
    
    communities.forEach(c => {
        html += `<soci-option value="${c.url}">${this._communityAvatar(c.url)}${c.name}</soci-option>`
    })
    
    html += `<soci-option value="__create__" style="border-top: 1px solid var(--bg-secondary); color: var(--text-brand);">+ Create Community</soci-option>`
    
    // Prevent flickering by pre-calculating the state based on current community
    // BEFORE setting innerHTML
    const currentCommunity = this.currentCommunity
    const subscribed = !currentCommunity || communities.some(c => c.url == currentCommunity)

    const communitySubscribe = this.select('#community-subscribe')
    if(!subscribed && currentCommunity){
        html = `<soci-option value="${currentCommunity}" slot="selected" temporary>${this._communityAvatar(currentCommunity)}${currentCommunity.charAt(0).toUpperCase() + currentCommunity.slice(1)}</soci-option>` + html
        communitySubscribe.hidden = false
        communitySubscribe.innerText = "Subscribe"
        communitySubscribe.removeAttribute('subscribed')
        communitySubscribe.style.display = ''
    } else {
        communitySubscribe.hidden = true
        communitySubscribe.style.display = 'none'
    }

    select.innerHTML = html
    
    // Restore selection if it is subscribed
    if(subscribed) {
        let value = currentCommunity || ""
        let option = select.querySelector(`soci-option[value="${value}"]`)
        if(option) option.setAttribute('slot', 'selected')
    }
  }
  
  _onCommunitySelect(e) {
    let val = e.target.getAttribute('value')
    if(val === '__create__') {
        this.openCreateCommunity()
        // Reset select to previous value
        this._updateCommunitySelection(this.currentCommunity)
    } else {
        let href = val ? `/@${val}` : '/'
        window.history.pushState(null, null, href)
        window.dispatchEvent(new CustomEvent('link'))
    }
  }
  
  async toggleSubscribe() {
    if(!this.currentCommunity) return
    
    let button = this.select('#community-subscribe')
    button.wait()
    
    try {
      let response = await window.soci.postData('community/subscribe', {
        community: this.currentCommunity
      })
      
      if(response.success) {
        button.success()
        button.innerText = "Subscribed"
        button.setAttribute('subscribed', '')
        setTimeout(() => {
             this._loadCommunities() // Reload list which will include the new subscription
             button.hidden = true // Hide button after successful subscription
        }, 1000)
      } else {
        button.error()
      }
    } catch(e) {
      button.error()
      console.error(e)
    }
  }

  _populateTags(){
    if(this._subscribedTagsLoaded && this._commonTagsLoaded){
      if(this._subscribedTags.length){
        this._createTags(this._subscribedTags, this.select('#subscribed-tags tags'), true)
      }
      this._toggleSubscribedList(this._subscribedTags.length != 0)
      this._commonTags = this._commonTags.filter(t=>{
        return this._subscribedTags.indexOf(t) == -1
      })
      this._createTags(this._commonTags, this.select('#tags tags'))
    }
  }

  _createTags(data, dom, subscribed=false){
    let prefix = this.currentCommunity ? `/@${this.currentCommunity}` : ''
    let tags = ` 
      ${data.map((tag) => `
        <soci-tag-li tag=${tag} href="${prefix}/#${tag}" ${subscribed ? 'subscribed' : ''} ${this._activeTag == tag ? 'active' : ''}></soci-tag-li>
      `).join('')}
    `
    dom.innerHTML = tags
  }

  activateTag(tag){
    this.toggleAttribute('overlay', false)
    this.select('soci-tag-li[active]')?.toggleAttribute('active', false)
    if(tag.match(/all|images|videos|blogs/)){
      this.select(`soci-tag-li[href="/#${tag}"]`)?.toggleAttribute('active', true)
    }
    else 
      this.select(`soci-tag-li[tag="${tag}"]`)?.toggleAttribute('active', true)
    this._activeTag = tag
  }

  _createSubscribedTag(e){
    if(this._subscribedTags.indexOf(e.detail.tag) == -1){
      let tag = document.createElement('soci-tag-li')
      tag.setAttribute('tag', e.detail.tag)
      tag.toggleAttribute('load-in', true)
      tag.toggleAttribute('subscribed', true)
      this._subscribedTags.push(e.detail.tag)
      this._commonTags.splice(this._commonTags.indexOf(e.detail.tag), 1)
      this.select('#subscribed-tags tags').appendChild(tag)
    }

    if(this._subscribedTags.length == 1){
      this._toggleSubscribedList(true)
    }

    e.detail.dom.toggleAttribute('load-out', true)
    setTimeout(()=>{
      e.detail.dom.remove()
    }, 200)
  }

  _removeSubscribedTag(e){
    console.log(this._subscribedTags)
    this._subscribedTags.splice(this._subscribedTags.indexOf(e.detail.tag), 1)
    console.log(this._subscribedTags)

    if(this._commonTags.indexOf(e.detail.tag) == -1){
      let tag = document.createElement('soci-tag-li')
      tag.setAttribute('tag', e.detail.tag)
      tag.toggleAttribute('load-in', true)
      this._commonTags.push(e.detail.tag)
      this.select('#tags tags').prepend(tag)
    }
    e.detail.dom.toggleAttribute('load-out', true)
    if(this._subscribedTags.length == 0){
      this._toggleSubscribedList(false)
    }
    setTimeout(()=>{
      e.detail.dom.remove()
    }, 200)
  }

  _toggleSubscribedList(revealed){
    let list = this.select('#subscribed-tags')
    list.style.height = list.style.minHeight = revealed ? 0 : list.offsetHeight
    list.style.opacity = revealed ? 0 : 1;
    list.style.overflow = 'hidden'
    setTimeout(()=>{
      list.style.height = list.style.minHeight = revealed ? 48 + (this._subscribedTags.length * 32) : 0
      list.style.opacity = revealed ? 1 : 0;
      if(revealed){
        setTimeout(()=>{
          list.style.overflow = list.style.height = list.style.minHeight = list.style.opacity = ''
        }, 200)
      }
    }, 1)
  }

  // Account control actions
  async login(){
    let form = this.querySelector('[slot="login"] form')
    let button = form.querySelector('soci-button')

    this.querySelector('[slot="login"] soci-password')?.checkValidity()
    let loginData = soci.getJSONFromForm(form)

    if(!form.reportValidity()) {
      console.log('form invalid')
      setTimeout(()=>{
        button?.error()
      }, 1)
      return
    }

    window.api.user.login(loginData).then(response => {
      if(response.accessToken){
        soci.log('Login Successful! Token:', response.accessToken)
        soci.accessToken = response.accessToken
        soci.refreshToken = response.refreshToken
        soci.username = response.username
        soci.roles = response.roles
        this.fire('login')
        button?.success()
        setTimeout(()=>{
          this.toggleAttribute('noauth')
        }, 400)
        this._loadSubscribedTags()
        this._loadCommonTags()
        this._populateTags()
        this._loadCommunities()
        soci.loadVotes()
        this.select('#logout').innerHTML = "Logout"
        return
      }
      soci.log('Invalid login', response.error, 'error')
      button?.error()
    })
  }

  logout(){
    soci.clearToken()
    this.removeAttribute('create')
    this.removeAttribute('create-community')
    this.setAttribute('noauth', '')
    this.select('#logout').innerHTML = "Login"
  }

  async register(){
    let form = this.querySelector('[slot="create"] form')
    let button = form.querySelector('soci-button')
    if(!form.reportValidity()) {
      setTimeout(()=>{
        button.error()
      },1)
      return
    }

    let formData = soci.getJSONFromForm(form)
    let response = await window.api.user.register(formData)

    if(response.accessToken){
      button.success()
      soci.log('Login Successful! Token:', response.accessToken)
      soci.accessToken = response.accessToken
      soci.username = response.username
      this._loadSubscribedTags()
      this._loadCommonTags()
      this._loadCommunities()
      setTimeout(()=>{
        window.history.pushState(null, null, '/admin/subscribe')
        window.dispatchEvent(new CustomEvent('link'))
        this._populateTags()
        this.select('#logout').innerHTML = "Logout"
        this.toggleAttribute('create')
      }, 400)
    }
    else {
      button.error()
    }
  }

  _loginOnEnter(e){
    if(e.key == "Enter"){
      window.blur()
      this.querySelector('soci-button')?.wait()
      this.login()
    }
  }

  async _createAccount(){
    this.removeAttribute('noauth')
    this.setAttribute('create', '')
    this.select('#logout').innerHTML = "Login"
  }
  
  // Create Community Logic
  
  openCreateCommunity() {
    if(!window.soci.accessToken) {
      window.soci.showLogin()
      return
    }
    this.setAttribute('create-community', '')
    this.select('#create-community input[name="name"]').focus()
  }

  closeCreateCommunity() {
    this.removeAttribute('create-community')
    const form = this.select('#create-community form')
    form.reset()
    this.toggleError()
  }

  toggleError(message) {
    const error = this.select('#create-community .error')
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

  async submitCreateCommunity(e) {
    if(!window.soci.accessToken) {
      window.soci.showLogin()
      return
    }
    const form = this.select('#create-community form')
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
        this.closeCreateCommunity()
        await this._loadCommunities()
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
