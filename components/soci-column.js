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
      @container { * { color: red; } }
      separator {
        height: 100%;
        right: 0; 
        width: 2px;
        position: absolute;
        display: block;
        color: #f00;
      }
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
        padding: 0 8px;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 1px 2px var(--shadow);
      }
      soci-select {
        position: absolute;
        z-index: 2;
        left: 6px;
        --height: 30px;
        --color: var(--text-secondary);
        &#filter-select { right: 6px; left: auto; }
      }
      soci-option[slot="selected"] {
        border-radius: 3px;
      }
      #tag-container {
        display: inline-flex;
        margin: 0 auto;
        align-items: center;
        opacity: 0;
        animation: load-in 0.3s var(--soci-ease) forwards;
      }
      svg {
        background: var(--bg-brand);
        color: var(--text-inverse);
        border-radius: 3px;
        margin-right: 4px;
      }
      #tag-title {
        font-size: 16px;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
      soci-radio-button-group {
        display: none;
        position: absolute;
      }
      soci-radio-button-group#sort-buttons { left: 12px; }
      soci-radio-button-group#filter-buttons { right: 12px; }
      soci-radio-button-group#sort-buttons soci-radio-button[selected]::after,
      soci-radio-button-group#filter-buttons soci-radio-button[selected]::after {
        content:'';
        display: block;
        position: absolute;
        top: 29px;
        left: calc(50% - 8px);
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
        &:hover { background-color: var(--bg-secondary); }
      }
      @media (max-width: 768px) {
        header {
          #menu { display: block; }
          soci-select { left: 36px; }
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
            <div id="tag-container">
              <svg id="hash" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(1,1.5)">
                <path d="M9.28 7.346H11.17V8.62H9.126L8.832 11H7.558L7.852 8.62H5.486L5.192 11H3.918L4.212 8.62H2.322V7.346H4.366L4.688 4.854H2.798V3.58H4.842L5.136 1.2H6.41L6.116 3.58H8.468L8.762 1.2H10.036L9.742 3.58H11.618L11.632 4.854H9.588L9.28 7.346ZM8.006 7.346L8.314 4.854H5.962L5.64 7.346H8.006Z" fill="currentColor"></path>
                </g>
              </svg>
              <div id="tag-title">funny</div>
            </div>
            <soci-select id="filter-select" dropdown-horizontal-position="right">
              <soci-option slot="selected">All</soci-option>
              <soci-option value="images">Images</soci-option>
              <soci-option value="videos">Videos</soci-option>
              <soci-option value="blogs">Blogs</soci-option>
            </soci-select>
            <soci-radio-button-group id="filter-buttons">
              <soci-radio-button value="all" selected>all</soci-radio-button>
              <soci-radio-button value="images">images</soci-radio-button>
              <soci-radio-button value="videos">videos</soci-radio-button>
              <soci-radio-button value="blogs">blogs</soci-radio-button>
            </soci-radio-button-group>
          </header>
          <slot name="posts"></slot>
        </content>
      </scroll-container>
      <separator></separator>
    `
  }

  connectedCallback() {
    this.select('#sort-select').addEventListener('selected', this._sortChanged.bind(this))
    this.select('#filter-select').addEventListener('selected', this._filterChanged.bind(this))
    this.select('#sort-buttons').addEventListener('change', this._sortGroupChanged.bind(this))
    this.select('#filter-buttons').addEventListener('change', this._filterGroupChanged.bind(this))

    this._ro = new ResizeObserver(observable => {
      this.toggleAttribute('large', this.offsetWidth > 800)
    })

    this._ro.observe(this)

    let posts = document.createElement('soci-post-list')
    posts.setAttribute('slot', 'posts')
    posts.setAttribute('filter', this.getAttribute('filter'))
    this.appendChild(posts)
    this._initializeControls()
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
        this.select('#tag-title').innerHTML = newValue
        this.updateTitle()
        document.querySelector('soci-sidebar')?.activateTag(newValue)
        if(newValue.match(/all|images|videos|blogs/)) this.setAttribute('filter', newValue)
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
    if(this.tag == 'all') document.title = 'All posts'
    else if(this.tag?.match(/images|videos|blogs|audio|html/)) document.title = 'All ' + this.tag
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
  }

  _applyFilter(filter = 'all', force = false){
    const value = filter || 'all'
    if(!force && this._currentFilter === value) return
    this._currentFilter = value
    this._updateFilterTagUI(value)
    this.filterPosts(value)
    this._updateFilterUI(value)
    this.updateTitle()
  }

  _initializeControls(){
    const sort = this.getAttribute('sort') || 'popular'
    const filter = this.getAttribute('filter') || 'all'
    this._applySort(sort, true)
    this._applyFilter(filter, true)
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

  _updateFilterTagUI(filter){
    const special = this.getAttribute('tag')?.match(/all|images|videos|blogs/)
    if(!special) return
    this.select('#tag-title').innerHTML = filter
    document.querySelector('soci-sidebar')?.activateTag(filter)
  }

  _menuClick(){
    document.querySelector('soci-sidebar').toggleAttribute('overlay', true)
  }
}