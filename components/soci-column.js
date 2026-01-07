import SociComponent from './soci-component.js'

export default class SociColumn extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        scroll-snap-align: start;
        position: relative;
        display: block;
        height: 100dvh;
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
        background: var(--bg-bold);
        container-type: inline-size;
      }
      :host([large]) soci-radio-button-group { display: flex; }
      :host([large]) soci-select { display: none; }
      scroll-container {
        overflow: auto;
        width: 100%;
        height: 100%;
        display: block;
        scrollbar-width: none;
        &::-webkit-scrollbar { display: none; }
      }
      content { display: block; }
      header {
        background-color: var(--bg);
        position: sticky;
        top: 0;
        height: 40px;
        width: 100%;
        z-index: 2;
        display: flex;
        padding: 0 12px;
        box-sizing: border-box;
        gap: 8px;
        align-items: center;
        box-shadow: 0 1px 2px var(--shadow);
      }
      #tag-input-container {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 100px;
        max-width: 278px;
        width: 100%;
        margin-right: -8px;
      }
      #tag-input {
        height: 28px;
        box-sizing: border-box;
        padding: 0 10px 2px 28px;
        border: 1px solid color-mix(in srgb, var(--bg-bold) 50%, transparent);
        border-radius: 4px;
        background: color-mix(in srgb, var(--bg-bold) 50%, transparent);
        color: var(--text);
        font-size: 14px;
        font-family: inherit;
        outline: none;
        width: 100%;
        &::placeholder { color: var(--text-tertiary); }
        &:focus {
          border-color: var(--bg-secondary);
          background: color-mix(in srgb, var(--bg-bold) 70%, transparent);
        }
      }
      #hash {
        position: absolute;
        left: 18px;
        top: 12px;
        pointer-events: none;
        width: 16px;
        height: 16px;
        background: var(--bg-brand);
        color: var(--text-inverse);
        border-radius: 3px;
      }
      .divider {
        width: 1px;
        height: 20px;
        background: var(--bg-secondary);
        margin: 0 4px;
      }
      #tag-input-divider {
        opacity: 0;
        transition: opacity 0.4s var(--soci-ease);
      }
      #header-spacer {
        flex: 1;
      }
      #controls {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      soci-select {
        --height: 30px;
        --color: var(--text-secondary);
      }
      soci-option[slot="selected"] {
        border-radius: 3px;
      }
      soci-radio-button-group {
        display: none;
      }
      soci-radio-button-group soci-radio-button[selected]::after {
        content:'';
        display: block;
        position: fixed;
        top: 40px;
        width: 16px;
        height: 3px;
        border-radius: 0 0 2px 2px;
        background: var(--bg);
        box-shadow: 0 1px 1px var(--shadow);
      }
      @keyframes load-in {
        from { transform: translateY(4px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      #menu {
        display: none;
        cursor: pointer;
        border-radius: 3px;
        flex-shrink: 0;
        &:hover { background-color: var(--bg-secondary); }
      }
      #view-buttons, #filter-buttons {
        padding: 4px;
        soci-radio-button {
          width: 24px;
          height: 24px;
          padding: 0 2px;
          margin-right: 2px;
          &:last-child { margin-right: 0px; }
        }
        svg {
          width: 16px;
          height: 16px;
        }
      }
      @media (max-width: 768px) {
        #menu { display: block; }
        #view-buttons { display: none; }
        #tag-input { max-width: 120px; }
      }
      @media (max-width: 480px) {
        #tag-input { display: none; }
      }
      @media (max-width: 1128px) {
        #tag-input-divider {
          opacity: 1;
        }
      }
    `
  }

  html(){
    return `
      <scroll-container>
        <content>
          <header>
            <soci-icon id="menu" glyph="menu" @click=_menuClick></soci-icon>
            <div id="tag-input-container">
              <input id="tag-input" type="text" placeholder="#tag" @keydown=_tagKeydown @blur=_tagBlur>
              <svg id="hash" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(1,1.5)">
                <path d="M9.28 7.346H11.17V8.62H9.126L8.832 11H7.558L7.852 8.62H5.486L5.192 11H3.918L4.212 8.62H2.322V7.346H4.366L4.688 4.854H2.798V3.58H4.842L5.136 1.2H6.41L6.116 3.58H8.468L8.762 1.2H10.036L9.742 3.58H11.618L11.632 4.854H9.588L9.28 7.346ZM8.006 7.346L8.314 4.854H5.962L5.64 7.346H8.006Z" fill="currentColor"></path>
                </g>
              </svg>
            </div>
            <div id="header-spacer"></div>
            <div id="controls">
              <div class="divider" id="tag-input-divider"></div>
              <soci-radio-button-group id="view-buttons">
                <soci-radio-button value="list" title="List view" selected>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="1.5" width="15" height="3" rx="1.5" stroke="currentColor"/>
                    <rect x="0.5" y="6.5" width="15" height="3" rx="1.5" stroke="currentColor"/>
                    <rect x="0.5" y="11.5" width="15" height="3" rx="1.5" stroke="currentColor"/>
                  </svg>

                </soci-radio-button>
                <soci-radio-button value="lanes" title="Grid lanes view">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="1.5" width="6" height="4" rx="1.5" stroke="currentColor"/>
                    <rect x="9.5" y="10.5" width="6" height="4" rx="1.5" stroke="currentColor"/>
                    <rect x="9.5" y="1.5" width="6" height="7" rx="1.5" stroke="currentColor"/>
                    <rect x="0.5" y="7.5" width="6" height="7" rx="1.5" stroke="currentColor"/>
                  </svg>
                </soci-radio-button>
              </soci-radio-button-group>
              <div class="divider"></div>
              <soci-select id="sort-select">
                <soci-option slot="selected" value="popular">Popular</soci-option>
                <soci-option value="new">New</soci-option>
                <soci-option value="day">Top - Day</soci-option>
                <soci-option value="week">Top - Week</soci-option>
                <soci-option value="month">Top - Month</soci-option>
                <soci-option value="year">Top - Year</soci-option>
                <soci-option value="all">Top - All Time</soci-option>
              </soci-select>
              <soci-radio-button-group id="sort-buttons">
                <soci-radio-button value="popular" selected>popular</soci-radio-button>
                <soci-radio-button value="new">new</soci-radio-button>
                <soci-radio-button value="week">week</soci-radio-button>
                <soci-radio-button value="month">month</soci-radio-button>
                <soci-radio-button value="year">year</soci-radio-button>
                <soci-radio-button value="all">all</soci-radio-button>
              </soci-radio-button-group>
              <div class="divider"></div>
              <soci-select id="filter-select" dropdown-horizontal-position="right">
                <soci-option slot="selected">All</soci-option>
                <soci-option value="links">Links</soci-option>
                <soci-option value="images">Images</soci-option>
                <soci-option value="videos">Videos</soci-option>
                <soci-option value="blogs">Blogs</soci-option>
              </soci-select>
              <soci-radio-button-group id="filter-buttons">
                <soci-radio-button value="all" selected>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.6569 2 15 3.34315 15 5V8C15 9.60511 13.7394 10.9158 12.1543 10.9961L12 11V10C13.1046 10 14 9.10457 14 8V5C14 3.89543 13.1046 3 12 3H7C5.89543 3 5 3.89543 5 5H4C4 3.34315 5.34315 2 7 2H12Z" fill="currentColor"/>
                    <rect x="1.5" y="5.5" width="10" height="8" rx="2.5" stroke="currentColor"/>
                  </svg>
                </soci-radio-button>
                <soci-radio-button value="images">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-linejoin="round"/>
                    <path d="M1.5 9L4.5 7L9.5 10.5L12 9L14.5 11" stroke="currentColor"/>
                    <circle cx="11.5" cy="5.5" r="1.5" fill="currentColor"/>
                  </svg>
                </soci-radio-button>
                <soci-radio-button value="videos">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-linejoin="round"/>
                    <path d="M10.5 8L6 6V10L10.5 8Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                </soci-radio-button>
                <soci-radio-button value="blogs">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-linejoin="round"/>
                    <rect x="3" y="4" width="9" height="1" rx="0.5" fill="currentColor"/>
                    <path d="M3 6.5C3 6.22386 3.22386 6 3.5 6H8.5C8.77614 6 9 6.22386 9 6.5C9 6.77614 8.77614 7 8.5 7H3.5C3.22386 7 3 6.77614 3 6.5Z" fill="currentColor"/>
                    <path d="M3 10.5C3 10.2239 3.22386 10 3.5 10H8.5C8.77614 10 9 10.2239 9 10.5C9 10.7761 8.77614 11 8.5 11H3.5C3.22386 11 3 10.7761 3 10.5Z" fill="currentColor"/>
                    <rect x="3" y="8" width="7" height="1" rx="0.5" fill="currentColor"/>
                  </svg>
                </soci-radio-button>
                <soci-radio-button value="links">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7H3C2.48232 7 2.05621 7.39333 2.00488 7.89746L2 8V11C2 11.5523 2.44772 12 3 12H8C8.55228 12 9 11.5523 9 11V8C9 7.44772 8.55228 7 8 7V6C9.10457 6 10 6.89543 10 8V11C10 12.0357 9.21278 12.887 8.2041 12.9893L8 13H3L2.7959 12.9893C1.85435 12.8938 1.1062 12.1457 1.01074 11.2041L1 11V8C1 6.89543 1.89543 6 3 6H5V7ZM7 7H6V6H7V7Z" fill="currentColor"/>
                    <path d="M13 3C14.1046 3 15 3.89543 15 5V8C15 9.03565 14.2128 9.887 13.2041 9.98926L13 10H11V9H13C13.5523 9 14 8.55228 14 8V5C14 4.44772 13.5523 4 13 4H8C7.48232 4 7.05621 4.39333 7.00488 4.89746L7 5V8C7 8.55228 7.44772 9 8 9V10L7.7959 9.98926C6.85435 9.8938 6.1062 9.14565 6.01074 8.2041L6 8V5C6 3.89543 6.89543 3 8 3H13ZM10 10H9V9H10V10Z" fill="currentColor"/>
                  </svg>
                </soci-radio-button>
              </soci-radio-button-group>
            </div>
          </header>
          <slot name="posts"></slot>
        </content>
      </scroll-container>
    `
  }

  connectedCallback() {
    this.select('#sort-select').addEventListener('selected', this._sortChanged.bind(this))
    this.select('#filter-select').addEventListener('selected', this._filterChanged.bind(this))
    this.select('#sort-buttons').addEventListener('change', this._sortGroupChanged.bind(this))
    this.select('#filter-buttons').addEventListener('change', this._filterGroupChanged.bind(this))
    this.select('#view-buttons').addEventListener('change', this._viewGroupChanged.bind(this))

    this._ro = new ResizeObserver(observable => {
      this.toggleAttribute('large', this.offsetWidth > 800)
    })

    this._ro.observe(this)

    let posts = document.createElement('soci-post-list')
    posts.setAttribute('slot', 'posts')
    posts.setAttribute('filter', this.getAttribute('filter'))
    this.appendChild(posts)
    this._initializeControls()
    this._syncTagInput()
  }

  disconnectedCallback(){
    this._ro.unobserve(this)
  }

  static get observedAttributes() {
    return ['tag', 'filter', 'sort', 'community']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case 'sort':
        this._applySort(newValue)
        break
      case 'filter':
        this._applyFilter(newValue)
        break
      case 'tag':
        newValue = decodeURIComponent(newValue)
        this.updateTitle()
        this._syncTagInput()
        document.querySelector('soci-sidebar')?.activateTag(newValue)
        break
      case 'subscribers':
        this.select('subscribers').innerHTML = (newValue || 0) + ' subscribers'
        break
      case 'community':
        this._applySort(this._currentSort || this.getAttribute('sort') || 'popular', true)
        break
    }
  }

  updateTitle(){
    let filter = this.filter
    if(!filter || filter == 'all') filter = 'Posts'
    else filter = filter.charAt(0).toUpperCase() + filter.slice(1)
    if(this.tag == 'all') document.title = this.filter && this.filter !== 'all' ? `All ${this.filter}` : 'All posts'
    else document.title = filter + ' in #' + this.getAttribute('tag')
  }

  get tag(){
    return this.getAttribute('tag')
  }
  set tag(val){
    return this.setAttribute('tag', val)
  }

  get filter(){
    return this.getAttribute('filter')
  }
  set filter(val){
    return this.setAttribute('filter', val)
  }

  sortPosts(sort){
    let params = []
    sort = sort || 'popular'

    switch(sort){
      case 'new':
        params.push('sort=new')
        break
      case 'day':
        params.push('sort=top', 'time=day')
        break
      case 'week':
        params.push('sort=top', 'time=week')
        break
      case 'month':
        params.push('sort=top', 'time=month')
        break
      case 'year':
        params.push('sort=top', 'time=year')
        break
    }

    if(this.tag && this.tag != 'all') params.push(`tag=${this.tag}`)
    
    let community = this.getAttribute('community')
    if(community) params.push(`community=${community}`)

    let paramString = params.length > 0 ? `?${params.join('&')}` : ''

    let postList = this.querySelector('soci-post-list')
    if(postList?.getAttribute('data') == '/posts' + paramString) return
    postList?.setAttribute('data', '/posts' + paramString)
  }

  filterPosts(filter){
    filter = filter || 'all'
    this.querySelector('soci-post-list')?.setAttribute('filter', filter)
  }

  _sortChanged(){
    this.setAttribute('sort', this.select('#sort-select').value)
  }

  _filterChanged(){
    this.setAttribute('filter', this.select('#filter-select').value)
  }

  _sortGroupChanged(e){
    let sort = e.detail?.value
    if(sort) this.setAttribute('sort', sort)
  }

  _filterGroupChanged(e){
    let filter = e.detail?.value
    if(filter) this.setAttribute('filter', filter)
  }

  _applySort(sort = 'popular', force = false){
    const value = sort || 'popular'
    if(!force && this._currentSort === value) return
    this._currentSort = value
    this._updateSortUI(value)
    this.sortPosts(value)
    localStorage.setItem('soci-column-sort', value)
  }

  _applyFilter(filter = 'all', force = false){
    const value = filter || 'all'
    if(!force && this._currentFilter === value) return
    this._currentFilter = value
    this.filterPosts(value)
    this._updateFilterUI(value)
    this.updateTitle()
    localStorage.setItem('soci-column-filter', value)
  }

  _applyView(view = 'list'){
    const value = view || 'list'
    this._currentView = value
    
    // Update UI
    this.select('#view-buttons')?.setAttribute('value', value)
    
    // Update post list
    const postList = this.querySelector('soci-post-list')
    if (postList) postList.setAttribute('view', value)
    
    localStorage.setItem('soci-column-view', value)
  }

  _initializeControls(){
    // Load saved preferences from localStorage
    const savedSort = localStorage.getItem('soci-column-sort')
    const savedFilter = localStorage.getItem('soci-column-filter')
    const savedView = localStorage.getItem('soci-column-view')
    
    const sort = this.getAttribute('sort') || savedSort || 'popular'
    const filter = this.getAttribute('filter') || savedFilter || 'all'
    const view = savedView || 'list'
    
    this._applySort(sort, true)
    this._applyFilter(filter, true)
    this._applyView(view)
    
    this.setAttribute('sort', sort)
    this.setAttribute('filter', filter)
  }

  _updateSortUI(sort){
    this.select('#sort-buttons')?.setAttribute('value', sort)
    this._syncSelectValue(this.select('#sort-select'), sort)
  }

  _updateFilterUI(filter){
    this.select('#filter-buttons')?.setAttribute('value', filter)
    this._syncSelectValue(this.select('#filter-select'), filter)
  }

  _syncSelectValue(select, value){
    if(!select || !value) return
    const options = Array.from(select.querySelectorAll('soci-option'))
    const normalizedValue = value.toLowerCase()
    const target = options.find(option => {
      const optionValue = (option.getAttribute('value') || option.textContent.trim()).toLowerCase()
      return optionValue === normalizedValue
    })
    if(!target) return
    options.forEach(option => option.removeAttribute('slot'))
    target.setAttribute('slot', 'selected')
  }

  _menuClick(){
    document.querySelector('soci-sidebar').toggleAttribute('overlay', true)
  }

  _viewGroupChanged(e){
    const view = e.detail?.value
    if(view) this._applyView(view)
  }

  _syncTagInput(){
    const input = this.select('#tag-input')
    if (!input) return
    const tag = this.getAttribute('tag') || ''
    input.value = tag === 'all' ? '' : `${tag}`
  }

  _tagKeydown(e){
    if (e.key !== 'Enter') return
    e.preventDefault()
    this._navigateToTag()
  }

  _tagBlur(){
    // Optionally navigate on blur, or just sync back to current tag
    // For now, just sync back to current value if user didn't press Enter
    this._syncTagInput()
  }

  _navigateToTag(){
    const input = this.select('#tag-input')
    if (!input) return
    
    let tag = input.value.trim().replace(/^#/, '')
    if (!tag) tag = 'all'
    
    // Build the new URL with the community prefix if present
    const community = this.getAttribute('community')
    const basePath = community ? `/@${community}` : ''
    const hashPath = tag === 'all' ? '#all' : `#${encodeURIComponent(tag)}`
    
    window.history.pushState(null, null, basePath + '/' + hashPath)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }
}