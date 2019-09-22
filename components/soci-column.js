import {SociComponent, html, render} from './soci-component.js'

export default class SociColumn extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        position: relative;
        display: block;
        height: calc(100vh - 16px);
        box-sizing: border-box;
        width: 100%;
        max-width: 1200px;
        margin: 16px 16px 0 0;
        border-radius: 8px 8px 0 0;
        overflow: hidden;
      }
      :host(:first-child){
        margin-left: 16px;
      }
      :host scroll-container {
        overflow: auto;
        width: 100%;
        height: 100%;
        display: block;
        scrollbar-width: none;
      }
      :host scroll-container::-webkit-scrollbar {
        display: none;
      }
      :host content {
        display: block;
      }
      :host sub-header {
        height: 88px;
        width: 100%;
        color: #fff;
        z-index: 2;
        box-sizing: border-box;
        background-color: inherit;
      }
      :host sticky-header {
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
      :host sticky-header soci-icon {
        width: 32px;
        height: 32px;
        cursor: pointer;
        border-radius: 8px;
      }
      :host sticky-header soci-icon:hover {
        background: rgba(255,255,255,0.2);
      }
      :host cover-photo {
        height: 160px;
        z-index: 1;
        display: block;
        width: 100%;
        top: 0;
        background-image: url('example-data/cover-example.jpg');
        background-repeat: no-repeat;
        background-size: cover;
      }
      :host info {
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      :host info button {
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
      :host info button:hover {
        background: rgba(255,255,255,0.2);
      }
      :host info button:active {
        background: rgba(255,255,255,1);
      }
      :host subscribers {
        font-size: 16px;
      }
      :host filters {
        display: flex;
        flex-direction: flex-end;
        padding: 0 12px;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      :host filter {
        opacity: 0.5;
        text-transform: capitalize;
        position: relative;
        padding: 6px 12px;
        cursor: pointer;
        font-weight: 500;
        font-size: 12px;
        line-height: 18px;
      }
      :host filter:first-child {
        margin-right: auto;
      }
      :host filter:hover {
        opacity: 0.7;
      }
      :host filter[selected] {
        opacity: 1;
      }
      :host filter[selected]::after {
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

      :host #tag-title {
        font-weight: 600;
        font-size: 24px;
        line-height: 24px;
        letter-spacing: 0.7px;
      }
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

  filterPosts(filter){
    //
    // Visuals
    //

    filter = filter || "all"
    Array.from(this.select("filters").children).forEach(child => {
      if(child.innerHTML == filter) child.setAttribute('selected', '')
      else child.removeAttribute('selected')
    })
  }

  filterClick(e){
    this.setAttribute('filter', e.currentTarget.innerHTML)
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

  render(){
    let data = 'fake-routes/posts.json'
    this.filterClick = this.filterClick.bind(this)
    return html`
      ${this.getCss()}
      <style>
        ${this.getColorSchemes()}
      </style>
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
            <filters>
              <filter selected @click=${this.filterClick}>all</filter>
              <filter @click=${this.filterClick}>images</filter>
              <filter @click=${this.filterClick}>videos</filter>
              <filter @click=${this.filterClick}>audio</filter>
              <filter @click=${this.filterClick}>blogs</filter>
            </filters>
          </sub-header>
          <soci-post-list data=${data}></soci-post-list>
        </content>
      </scroll-container>
    `
  }
}
