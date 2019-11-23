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
        max-width: 1200px;
        margin-right: 16px;
        border-radius: 8px 8px 0 0;
        overflow: hidden;
        min-width: 400px;
      }

      :host(:first-child){
        margin-left: 16px;
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

      sub-header {
        height: 88px;
        width: 100%;
        color: #fff;
        z-index: 2;
        box-sizing: border-box;
        background-color: inherit;
      }

      sticky-header {
        color: #fff;
        background-color: inherit;
        position: sticky;
        top: 0;
        height: 68px;
        width: 100%;
        z-index: 2;
        display: block;
        padding: 0 24px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px 8px 0 0;
      }

      sticky-header soci-icon {
        width: 32px;
        height: 32px;
        cursor: pointer;
        border-radius: 8px;
      }

      sticky-header soci-icon:hover {
        background: rgba(255,255,255,0.2);
      }

      cover-photo {
        height: 160px;
        z-index: 1;
        display: block;
        width: 100%;
        top: 0;
        background-image: url('example-data/cover-example.jpg');
        background-repeat: no-repeat;
        background-size: cover;
      }

      info {
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      info button {
        height: 24px;
        border-radius: 12px;
        background: transparent;
        outline: none;
        border: none;
        margin: 1px;
        box-shadow: 0 0 0 1px #fff;
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        margin-right: -2px;
        cursor: pointer;
      }

      info button:hover {
        background: rgba(255,255,255,0.2);
      }

      info button:active {
        background: rgba(255,255,255,1);
      }

      subscribers {
        font-size: 16px;
      }

      filters {
        display: flex;
        flex-direction: flex-end;
        padding: 0 12px;
        border-top: 1px solid rgba(255,255,255,0.1);
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
      }

      filter:first-child {
        margin-right: auto;
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
        top: -2px;
        left: calc(50% - 8px);
        width: 16px;
        height: 4px;
        border-radius: 2px;
        background: #fff;
      }

      #tag-title {
        font-weight: 600;
        font-size: 24px;
        line-height: 24px;
        letter-spacing: 0.7px;
      }

      soci-post-list {
        min-height: calc(100% - 297px);
      }
    `
  }

  html(){
    let data = 'fake-routes/posts.json'
    return `
      <scroll-container>
        <cover-photo></cover-photo>
        <content>
          <sticky-header>
            <div id="tag-title"></div>
            <soci-icon glyph="filter"></soci-icon>
          </sticky-header>
          <sub-header>
            <info>
              <subscribers>69 subscribers</subscribers>
              <button>Subscribe</button>
            </info>
            <filters @click=filterClick>
              <filter selected>all</filter>
              <filter>images</filter>
              <filter>videos</filter>
              <filter>audio</filter>
              <filter>blogs</filter>
            </filters>
          </sub-header>
          <soci-post-list data=${data}></soci-post-list>
        </content>
      </scroll-container>
    `
  }

  static get observedAttributes() {
    return ['tag', 'color', 'filter']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case "filter":
        this.filterPosts(newValue)
        break
      case "tag":
        this.select('#tag-title').innerHTML = '#' + newValue
        break
      case "subscribers":
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

  filterPosts(filter){
    filter = filter || "all"
    Array.from(this.select("filters").children).forEach(child => {
      if(child.innerHTML == filter) child.setAttribute('selected', '')
      else child.removeAttribute('selected')
    })

    this.select('soci-post-list').setAttribute('filter', filter)
  }

  filterClick(e){
    this.setAttribute('filter', e.target.innerHTML)
  }

  connectedCallback(){
    this.select('scroll-container').addEventListener('scroll', this._onScroll.bind(this))
  }

  _onScroll(){
    let scroll = Math.min(this.select('scroll-container').scrollTop, 160)
    this.select('cover-photo').style.backgroundPositionY = `${scroll >> 1}px`
  }

  getColorSchemes(){
    let schemes = ''
    let colors = {
      "red": 'r1',
      "teal": 't2',
      "orange": 'o1',
      "purple": 'p2'
    }

    for(let color in colors){
      schemes += `:host([color="${color}"]) content{
        background: var(--${colors[color]})
      }`
    }
    return schemes
  }
}