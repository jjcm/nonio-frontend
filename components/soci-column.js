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
        background: var(--n2);
        /* heh */
        min-width: 420px; 
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
        background-color: inherit;
        position: sticky;
        top: 0;
        height: 41px;
        width: 100%;
        z-index: 2;
        display: block;
        padding: 0 8px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        box-shadow: 0 1px 2px rgba(0,0,0,0.18);
      }

      sort,
      filter {
        opacity: 0.5;
        text-transform: capitalize;
        position: relative;
        padding: 6px 12px;
        cursor: pointer;
        font-weight: 500;
        font-size: 12px;
        line-height: 18px;
        position: relative;
        z-index: 2;
      }

      soci-select {
        position: absolute;
        z-index: 2;
        left: 6px;
        --height: 24px;
        --color: var(--n3);
      }

      soci-select#filter-select {
        right: 6px;
        left: auto;
      }

      sort:hover,
      filter:hover {
        opacity: 0.7;
      }

      sort[selected],
      filter[selected] {
        opacity: 1;
        color: var(--b3);
      }

      sort[selected]::after,
      filter[selected]::after {
        content:'';
        display: block;
        position: absolute;
        top: 34px;
        left: calc(50% - 8px);
        width: 16px;
        height: 3px;
        border-radius: 0 0 2px 2px;
        background: #fff;
        box-shadow: 0 1px 2px rgba(0,0,0,0.18);
      }

      #tag-container {
        display: inline-flex;
        margin: 0 auto;
        align-items: center;
        opacity: 0;
        animation: load-in 0.3s var(--soci-ease) forwards;
      }
      svg {
        background: var(--b3);
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
    `
  }

  html(){
    return `
      <scroll-container>
        <content>
          <header>
            <soci-select id="sort-select">
              <soci-option slot="selected">Popular</soci-option>
              <soci-option value="new">New</soci-option>
              <soci-option value="day">Top - Day</soci-option>
              <soci-option value="week">Top - Week</soci-option>
              <soci-option value="month">Top - Month</soci-option>
              <soci-option value="year">Top - Year</soci-option>
              <soci-option value="all">Top - All Time</soci-option>
            </soci-select>
            <sorts @click=_sortBarClick>
              <sort selected>popular</sort>
              <sort>week</sort>
              <sort>month</sort>
              <sort>year</sort>
              <sort>all</sort>
            </sorts>
            <div id="tag-container">
              <svg id="hash" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(1,1.5)">
                <path d="M9.28 7.346H11.17V8.62H9.126L8.832 11H7.558L7.852 8.62H5.486L5.192 11H3.918L4.212 8.62H2.322V7.346H4.366L4.688 4.854H2.798V3.58H4.842L5.136 1.2H6.41L6.116 3.58H8.468L8.762 1.2H10.036L9.742 3.58H11.618L11.632 4.854H9.588L9.28 7.346ZM8.006 7.346L8.314 4.854H5.962L5.64 7.346H8.006Z" fill="white"></path>
                </g>
              </svg>
              <div id="tag-title">funny</div>
            </div>
            <soci-select id="filter-select" dropdown-position="right">
              <soci-option slot="selected">All</soci-option>
              <soci-option value="images">Images</soci-option>
              <soci-option value="videos">Videos</soci-option>
              <soci-option value="audio">Audio</soci-option>
              <soci-option value="blogs">Blogs</soci-option>
            </soci-select>
            <filters @click=_filterBarClick>
              <filter selected>all</filter>
              <filter>images</filter>
              <filter>videos</filter>
              <filter>audio</filter>
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
    this.select('soci-select').addEventListener('selected', this._sortChanged.bind(this))

    this._ro = new ResizeObserver(observable => {
      this.toggleAttribute('large', this.offsetWidth > 800)
    })

    this._ro.observe(this)

    let posts = document.createElement('soci-post-list')
    posts.setAttribute('data', '/posts')
    posts.setAttribute('slot', 'posts')
    posts.setAttribute('filter', this.getAttribute('filter'))
    this.appendChild(posts)
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
        break
      case 'tag':
        this.select('#tag-title').innerHTML = newValue
        document.querySelector('soci-sidebar').activateTag(newValue)
        this.querySelector('soci-post-list')?.setAttribute('data', `/posts?tag=${newValue}`)
        break
      case 'subscribers':
        let subs = newValue || 0
        this.select('subscribers').innerHTML = subs + ' subscribers'
        break
    }
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

    this._updateBar(this.select('sorts'), filter)
    this.querySelector('soci-post-list').setAttribute('data', '/posts' + paramString)
  }

  filterPosts(filter){
    filter = filter || 'all'
    this.querySelector('soci-post-list')?.setAttribute('filter', filter)
    this._updateBar(this.select('filters'), filter)
  }

  _sortBarClick(e){
    this.setAttribute('sort', e.target.innerHTML)
    this._updateBar(e.currentTarget, e.target.innerHTML)
  }

  _filterBarClick(e){
    this.setAttribute('filter', e.target.innerHTML)
    this._updateBar(e.currentTarget, e.target.innerHTML)
  }

  _updateBar(bar, value) {
    Array.from(bar.children).forEach(child => {
      if(child.innerHTML == value) child.setAttribute('selected', '')
      else child.removeAttribute('selected')
    })
  }

  _sortChanged(){
    let sort = this.select('soci-select').value
    this.sortPosts(sort)
  }
}