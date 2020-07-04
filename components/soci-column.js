import SociComponent from './soci-component.js'

export default class SociColumn extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      ${this.getColorSchemes()}
      :host {
        scroll-snap-align: start;
        position: relative;
        display: block;
        height: 100%;
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
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
        color: #fff;
        background-color: inherit;
        position: sticky;
        top: 0;
        height: 41px;
        width: 100%;
        z-index: 2;
        display: block;
        padding: 0 4px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      :host([large]) header {
        padding: 0 16px;
      }

      filters {
        display: flex;
      }

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
        position: relative;
        z-index: 2;
      }

      filter:hover {
        opacity: 0.7;
      }

      filter[selected] {
        opacity: 1;
      }

      filter[selected]::after {
        content:'';
        display: block;
        position: absolute;
        top: 32px;
        left: calc(50% - 8px);
        width: 16px;
        height: 4px;
        border-radius: 2px;
        background: #dcdef0;
      }

      #tag-title {
        font-weight: 600;
        font-size: 20px;
        line-height: 20px;
        letter-spacing: 0.7px;
        width: calc(100% - 32px);
        text-align: center;
        position: absolute;
        z-index: 1;
      }

      soci-post-list {
        min-height: calc(100% - 137px);
      }

      filters {
        display: none;
      }

      :host([large]) filters {
        display: flex;
      }

      :host([large]) soci-select {
        display: none;
      }
    `
  }

  html(){
    return `
      <scroll-container>
        <content>
          <header>
            <soci-select>
              <soci-option slot="selected">Popular</soci-option>
              <soci-option value="new">New</soci-option>
              <soci-option value="day">Top - Day</soci-option>
              <soci-option value="week">Top - Week</soci-option>
              <soci-option value="month">Top - Month</soci-option>
              <soci-option value="year">Top - Year</soci-option>
              <soci-option value="all">Top - All Time</soci-option>
            </soci-select>
            <filters @click=filterClick>
              <filter selected>Popular</filter>
              <filter>Week</filter>
              <filter>Month</filter>
              <filter>Year</filter>
              <filter>All</filter>
            </filters>
            <div id="tag-title">#funny</div>
            <soci-select>
              <soci-option slot="selected">All</soci-option>
              <soci-option value="images">Images</soci-option>
              <soci-option value="videos">Videos</soci-option>
              <soci-option value="audio">Audio</soci-option>
              <soci-option value="blogs">Blogs</soci-option>
            </soci-select>
            <filters @click=filterClick>
              <filter selected>all</filter>
              <filter>images</filter>
              <filter>videos</filter>
              <filter>audio</filter>
              <filter>blogs</filter>
            </filters>
          </header>
          <soci-post-list data='/posts'></soci-post-list>
        </content>
      </scroll-container>
      <separator></separator>
    `
  }

  connectedCallback() {
    this.select('soci-select').addEventListener('selected', this._sortChanged.bind(this))
    console.log('setting up resize listener for ' + this.getAttribute('tag'))

    this._ro = new ResizeObserver(observable => {
      this.toggleAttribute('large', this.offsetWidth > 800)
    })

    this._ro.observe(this)
  }

  disconnectedCallback(){
    console.log('removing resize listener')
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
        this.select('#tag-title').innerHTML = '#' + newValue
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

  get color(){
    return this.getAttribute('color')
  }
  set color(val){
    return this.setAttribute('color', val)
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

    this.select('soci-post-list').setAttribute('data', '/posts' + paramString)
  }

  filterPosts(filter){
    filter = filter || 'all'
    Array.from(this.select('filters').children).forEach(child => {
      if(child.innerHTML == filter) child.setAttribute('selected', '')
      else child.removeAttribute('selected')
    })

    this.select('soci-post-list').setAttribute('filter', filter)
  }

  filterClick(e){
    this.setAttribute('filter', e.target.innerHTML)
  }

  getColorSchemes(){
    let schemes = ''
    let colors = {
      'red': 'r1',
      'teal': 't2',
      'orange': 'o1',
      'purple': 'p2'
    }

    for(let color in colors){
      schemes += `:host([color="${color}"]) content{
        background: var(--${colors[color]})
      }`
    }
    return schemes
  }

  _sortChanged(){
    let sort = this.select('soci-select').value
    this.sortPosts(sort)
  }
}