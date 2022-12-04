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
        height: 100%;
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
        background: var(--bg-bold);
        /* heh */
        min-width: 420px; 
        container-type: inline-size;
      }

      @container {
        * {
          color: red;
        }
      }
      
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
      }

      scroll-container::-webkit-scrollbar {
        display: none;
      }

      content {
        display: block;
      }

      header {
        background-color: var(--bg);
        position: sticky;
        top: 0;
        height: 40px;
        width: 100%;
        z-index: 2;
        display: block;
        padding: 0 8px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 1px 2px var(--shadow);
      }

      sort,
      filter {
        text-transform: capitalize;
        position: relative;
        padding: 0 12px 2px;
        cursor: pointer;
        font-weight: 500;
        font-size: 12px;
        line-height: 18px;
        position: relative;
        z-index: 2;
        color: var(--text-secondary);
        border-radius: 3px;
      }

      sort:before,
      filter:before {
        position: absolute;
        content: ''; 
        left: 0;
        top: -10px;
        height: 40px;
        width: 100%;
        background: transparent;
      }

      soci-select {
        position: absolute;
        z-index: 2;
        left: 6px;
        --height: 24px;
        --color: var(--text-secondary);
      }

      soci-select#filter-select {
        right: 6px;
        left: auto;
      }

      sort:hover,
      filter:hover {
        color: var(--text-secondary-hover);
      }

      sort[selected],
      filter[selected] {
        opacity: 1;
        color: var(--text-brand-bold);
        background: var(--bg-secondary);
      }

      sort[selected]::after,
      filter[selected]::after {
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

      sorts,
      filters {
        display: none;
      }

      :host([large]) sorts,
      :host([large]) filters {
        display: flex;
      }

      :host([large]) soci-select {
        display: none;
      }

      sorts,
      filters,
      soci-select {
        position: absolute;
      }

      sorts {
        left: 8px;
      }

      filters {
        right: 8px;
      }

      @keyframes load-in {
        from {
          transform: translateY(4px);
          opacity: 0;
        }

        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      #menu {
        display: none;
        cursor: pointer;
        border-radius: 3px;
      }

      #menu:hover {
        background-color: var(--bg-secondary);
      }

      @media (max-width: 768px) {
        header #menu {
          display: block;
        }

        header soci-select {
          left: 36px;
        }

      }
    `
  }

  html(){
    return `
      <scroll-container>
        <content>
          <header>
            <soci-icon id="menu" glyph="menu"></soci-icon>
            <soci-select id="sort-select">
              <soci-option value="popular">Popular</soci-option>
              <soci-option slot="selected" value="new">New</soci-option>
              <soci-option value="day">Top - Day</soci-option>
              <soci-option value="week">Top - Week</soci-option>
              <soci-option value="month">Top - Month</soci-option>
              <soci-option value="year">Top - Year</soci-option>
              <soci-option value="all">Top - All Time</soci-option>
            </soci-select>
            <sorts @click=_sortBarClick>
              <sort>popular</sort>
              <sort selected>new</sort>
              <sort>week</sort>
              <sort>month</sort>
              <sort>year</sort>
              <sort>all</sort>
            </sorts>
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
            <filters @click=_filterBarClick>
              <filter selected>all</filter>
              <filter>images</filter>
              <filter>videos</filter>
              <filter>blogs</filter>
            </filters>
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

    this._ro = new ResizeObserver(observable => {
      this.toggleAttribute('large', this.offsetWidth > 800)
    })

    this._ro.observe(this)

    let posts = document.createElement('soci-post-list')
    posts.setAttribute('slot', 'posts')
    posts.setAttribute('filter', this.getAttribute('filter'))
    this.appendChild(posts)
    this.sortPosts('new')
  }

  disconnectedCallback(){
    this._ro.unobserve(this)
  }

  static get observedAttributes() {
    return ['tag', 'color', 'filter', 'sort']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case 'sort':
        this.sortPosts(newValue)
        break
      case 'filter':
        this.filterPosts(newValue)
        this.updateTitle()
        break
      case 'tag':
        newValue = decodeURIComponent(newValue)
        this.select('#tag-title').innerHTML = newValue
        this.updateTitle()
        document.querySelector('soci-sidebar').activateTag(newValue)
        if(newValue.match(/all|images|videos|blogs/)) this.setAttribute('filter', newValue)
        this.sortPosts('new')
        break
      case 'subscribers':
        let subs = newValue || 0
        this.select('subscribers').innerHTML = subs + ' subscribers'
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

    if(this.tag) params.push(`tag=${this.tag}`)
    let paramString = params.length > 0 ? `?${params.join('&')}` : ''

    this._updateBar(this.select('sorts'), sort)
    this.querySelector('soci-post-list')?.setAttribute('data', '/posts' + paramString)
  }

  filterPosts(filter){
    filter = filter || 'all'
    this.querySelector('soci-post-list')?.setAttribute('filter', filter)
    this._updateBar(this.select('filters'), filter)
  }

  _sortBarClick(e){
    let sort = e.target.innerHTML
    this.setAttribute('sort', sort)
    this._updateBar(e.currentTarget, sort)
  }

  _filterBarClick(e){
    let filter = e.target.innerHTML
    this._visuallyFilter(filter)
  }

  _visuallyFilter(filter){
    let special = this.getAttribute('tag')?.match(/all|images|videos|blogs/)
    if(special) {
      this.select('#tag-title').innerHTML = filter
      document.querySelector('soci-sidebar').activateTag(filter)
    }
    this.setAttribute('filter', filter)
    this._updateBar(this.select('filters'), filter)

    //TODO - make this update the dropdown as well, as the dropdown updates wont be mirrored
  }

  _updateBar(bar, value) {
    Array.from(bar.children).forEach(child => {
      if(child.innerHTML == value) child.setAttribute('selected', '')
      else child.removeAttribute('selected')
    })
  }

  _sortChanged(){
    let sort = this.select('#sort-select').value
    this.sortPosts(sort)
  }

  _filterChanged(){
    let filter = this.select('#filter-select').value
    this._visuallyFilter(filter)
  }
}