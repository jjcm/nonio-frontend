import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociSidebar extends SociComponent {
  constructor() {
    super()
    this._onAvatarUpdate = this._onAvatarUpdate.bind(this)
    this._onCommunityUpdate = this._onCommunityUpdate.bind(this)
    this._onToggleAuth = this._toggleAuth.bind(this)
    this._onRouteChange = this._onRouteChange.bind(this)
  }

  css(){
    // Styling is now sourced from soci-frontend/soci.css (light-DOM sidebar markup)
    return ''
  }

  html(){
    return `
      <slot name="user"></slot>
      <slot></slot>
      <slot name="footer"></slot>
    `
  }

  // This component is now primarily light-DOM; query from the host instead of shadowRoot.
  select(s){
    return this.querySelector(s)
  }

  selectAll(s){
    return this.querySelectorAll(s)
  }

  get currentCommunity() {
    return window.soci.routeContext.community
  }

  static get observedAttributes() {
    return ['view']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(name === 'view' && oldValue !== newValue) this._syncPanels()
  }

  _setView(view) {
    if(view) this.setAttribute('view', view)
    else this.removeAttribute('view')
  }

  setView(view) {
    this._setView(view)
  }

  showLogin() {
    // Explicitly show the login panel (no longer the default for logged-out users)
    this._setView('login')
  }

  needsLogin() {
    // Visual nudge: user stays on community view; footer "Login" is the explicit entry point.
    this.removeAttribute('needs-login')
    this.setAttribute('needs-login', '')
    setTimeout(() => this.removeAttribute('needs-login'), 900)
  }

  showCommunity() {
    this._setView('community')
  }

  _syncPanels() {
    const view = this.getAttribute('view') || 'community'
    this.querySelectorAll('[panel]').forEach(p => {
      p.toggleAttribute('active', p.getAttribute('panel') === view)
    })
  }

  _onLoggedIn(response) {
    if(!response?.accessToken) return
    window.soci.accessToken = response.accessToken
    if(response.refreshToken) window.soci.refreshToken = response.refreshToken
    if(response.username) window.soci.username = response.username
    if(response.roles) window.soci.roles = response.roles

    this._loadCommunities()
    this._loadCommonTags()
    this._loadSubscribedTags()
    window.soci.loadVotes?.()
    this._syncAuthUI()

    this.showCommunity()
  }

  async connectedCallback(){
    this.toggleAttribute('loading', false)

    // Default view is always "community" (even when logged out).
    // Login panel is only shown via footer "Login" action or explicit showLogin().
    if(!this.hasAttribute('view')) this.showCommunity()
    this._syncPanels()

    // Always load public data
    this._loadCommunities()

    // Tags: common tags are public; subscribed tags require auth.
    if(this.authToken) {
      this._loadSubscribedTags()
    } else {
      this._subscribedTags = []
      this._subscribedTagsLoaded = true
      this._toggleSubscribedTagsVisible(false)
    }
    this._loadCommonTags()

    this._syncAuthUI()

    if(!this._eventsBound) {
      this.select('#logout')?.addEventListener('click', this._onToggleAuth)
      this._eventsBound = true
    }
    
    // Update submit button href based on current route
    window.addEventListener('hashchange', this._onRouteChange)
    window.addEventListener('popstate', this._onRouteChange)
    window.addEventListener('link', this._onRouteChange)
    document.addEventListener('avatar-updated', this._onAvatarUpdate)
    document.addEventListener('community-updated', this._onCommunityUpdate)

    // Set initial routes and community details
    setTimeout(() => this._onRouteChange(), 0)
  }

  disconnectedCallback(){
    window.removeEventListener('hashchange', this._onRouteChange)
    window.removeEventListener('popstate', this._onRouteChange)
    window.removeEventListener('link', this._onRouteChange)
    document.removeEventListener('avatar-updated', this._onAvatarUpdate)
    document.removeEventListener('community-updated', this._onCommunityUpdate)
  }

  _nextFrame(){
    return new Promise(resolve => requestAnimationFrame(resolve))
  }

  _computeCommunityDescriptionHeight(mdView, adminLinks){
    const mdHidden = !mdView || mdView.style.display === 'none'
    const adminHidden = !adminLinks || adminLinks.style.display === 'none'
    const mdH = mdHidden ? 0 : mdView.getBoundingClientRect().height
    const adminH = adminHidden ? 0 : adminLinks.getBoundingClientRect().height
    return Math.ceil(mdH + adminH + 8)
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
    if(this.authToken) this._loadSubscribedTags()
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
        let quillView = container.querySelector('soci-markdown-view')
        if(res?.description || res?.isAdmin) {
            await quillView.render(res?.description || '')
            await this._nextFrame()
            this._animateSection(container, true, this._computeCommunityDescriptionHeight(quillView, adminLinks))
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
        el.style.marginBottom = '-12px'
    }
  }
  
  _updateCommunitySelection(communityUrl) {
    let select = this.select('soci-select')
    if(!select) return
    
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
    if(!this.authToken) {
      this._subscribedTags = []
      this._subscribedTagsLoaded = true
      this._toggleSubscribedTagsVisible(false)
      this._populateTags()
      return
    }
    let url = '/subscriptions'
    if(this.currentCommunity) url += `?community=${this.currentCommunity}`
    let tags = await this.getData(url, this.authToken)
    this._subscribedTags = tags?.subscriptions?.map(t=>t.tag) || []
    this._subscribedTagsLoaded = true
    this._toggleSubscribedTagsVisible(this._subscribedTags.length > 0)
    this._populateTags()
  }
  async _loadCommonTags(){
    let url = '/tags'
    if(this.currentCommunity) url += `?community=${this.currentCommunity}`
    let tags = await this.getData(url, this.authToken)
    this._commonTags = tags?.tags?.map(t=>t.tag) || []
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
    return url ? `<img src="${config.AVATAR_HOST}/@${url}.webp" onerror="this.style.display='none'">` : ''
  }

  _populateCommunitySelect(communities){
    this._communitiesLoaded = true
    let select = this.select('soci-select')
    if(!select) return
    
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
      if(!this.select('#tags tags')) return
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

  _toggleSubscribedTagsVisible(visible) {
    const section = this.select('#subscribed-tags')
    if(!section) return
    section.style.display = visible ? 'block' : 'none'
    if(!visible) {
      // reset any prior animation remnants
      section.style.height = section.style.minHeight = '0px'
      section.style.opacity = '0'
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

  _onAvatarUpdate(e){
    const community = e.detail?.community
    if(!community) return
    const value = community.replace('@', '')
    const select = this.select('soci-select')
    if(!select) return
    const url = `${config.AVATAR_HOST}/@${value}.webp?${Date.now()}`
    select.querySelectorAll(`soci-option[value="${value}"] img`).forEach(img => {
      img.src = url
      img.style.display = ''
    })
  }

  _onCommunityUpdate(e){
    const detail = e.detail || {}
    const community = detail.community
    if(!community) return
    const value = community.replace('@', '')
    const select = this.select('soci-select')
    if(select){
      select.querySelectorAll(`soci-option[value="${value}"]`).forEach(opt => {
        const imgHtml = opt.querySelector('img')?.outerHTML || this._communityAvatar(value)
        const name = detail.name || opt.textContent || value
        opt.innerHTML = `${imgHtml}${name}`
      })
    }

    if(this.currentCommunity === value){
      const container = this.select('#community-description')
      const adminLinks = this.select('#admin-links')
      const quillView = container?.querySelector('soci-markdown-view')
      if(quillView){
        Promise.resolve(quillView.render(detail.description || '')).then(() => {
          requestAnimationFrame(() => {
            const show = !!detail.description || adminLinks.offsetHeight > 0
            this._animateSection(container, show, this._computeCommunityDescriptionHeight(quillView, adminLinks))
          })
        })
      }
    }
  }

  _toggleSubscribedList(revealed){
    let list = this.select('#subscribed-tags')
    if(!list) return
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

  _toggleAuth(e){
    e?.preventDefault?.()
    if(this.authToken) return this.logout()
    return this.showLogin()
  }

  _syncAuthUI(){
    const link = this.select('#logout')
    if(link) link.innerHTML = this.authToken ? "Logout" : "Login"

    // Hide user-only affordances when logged out
    const userActions = this.select('#user-actions')
    if(userActions) userActions.style.display = this.authToken ? '' : 'none'

    // Subscribe-to-community requires auth
    const subscribe = this.select('#community-subscribe')
    if(subscribe) {
      if(!this.authToken) {
        subscribe.hidden = true
        subscribe.style.display = 'none'
      } else {
        // let existing selection logic decide hidden vs shown; just restore display if applicable
        subscribe.style.display = subscribe.hidden ? 'none' : ''
      }
    }
  }

  logout(){
    soci.clearToken()
    this.showCommunity()

    // Logged-out: keep community + common tags visible, hide subscribed section.
    this._subscribedTags = []
    this._subscribedTagsLoaded = true
    this._toggleSubscribedTagsVisible(false)

    this._syncAuthUI()

    // Refresh public data (and clear any stale auth-only data)
    this._loadCommunities()
    this._loadCommonTags()
  }
}
