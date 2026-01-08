import SociComponent from './soci-component.js'
import config from '../config.js'
import { polyfill, unpolyfill, relayout } from '../lib/grid-lanes-polyfill.js'
import { filterToType } from '../lib/post-filter.js'

export default class SociPostList extends SociComponent {
  constructor() {
    super()
    this._postsData = null
    this._fetchController = null
    this._renderGeneration = 0
    this._onCardLoaded = () => {
      if(this.getAttribute('view') === 'lanes') relayout(this)
    }
  }

  css(){
    return `
      :host {
        display: block;
        width: 100%;
        padding: 12px 12px 28px;
        box-sizing: border-box;
        opacity: 0;
        transform: translateY(12px);
      }
      :host([loaded]) {
        transform: translateY(0);
        opacity: 1;
        transition: transform 0.35s cubic-bezier(0.15, 0, 0.2, 1), opacity 0.35s var(--soci-ease);
      }
      ::slotted(soci-post-li){
        margin-top: 8px;
      }
      ::slotted(soci-post-li:first-child){
        margin-top: 0;
      }

      /* Grid lanes layout - future native CSS */
      :host([view="lanes"]) {
        display: grid-lanes;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 12px;
      }
    `
  }

  static get observedAttributes() {
    return ['data', 'order', 'timespan', 'filter', 'view']
  }

  async attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case 'data':
        this.toggleAttribute('loaded', false)
        let data = await this.getData(newValue, this.authToken)
        if(data.posts) {
          this._postsData = data.posts
          this._dedupePostsData()
          this._applyFilter(this.getAttribute('filter'))
        }
        this.toggleAttribute('loaded', true)
        break
      case 'filter':
        this._applyFilter(newValue)
        break
      case 'view':
        this._updateView(newValue)
        break
    }
  }

  _applyFilter(filter){
    // Cancel any pending incremental renders
    this._renderGeneration++
    
    if(!this._postsData) return
    
    const type = filterToType(filter)
    
    if(!type){
      this.createPosts([...this._postsData])
      return
    }
    
    // Filter to matching posts from cache and re-render
    const matchingPosts = this._postsData.filter(p => p.type === type)
    this.createPosts([...matchingPosts])
  }

  _dedupePostsData(){
    if(!this._postsData?.length) return
    const seen = new Set()
    this._postsData = this._postsData.filter(p => {
      const id = String(p.ID)
      if(seen.has(id)) return false
      seen.add(id)
      return true
    })
  }

  async fetchAndMerge(url){
    // Cancel any existing fetch request
    if(this._fetchController) this._fetchController.abort()
    this._fetchController = new AbortController()
    
    const currentFilter = this.getAttribute('filter')
    
    try {
      const options = { signal: this._fetchController.signal }
      if(this.authToken) options.headers = { Authorization: 'Bearer ' + this.authToken }
      
      const response = await fetch(config.API_HOST + url, options)
      const data = await response.json()
      
      // Check if filter changed while fetching - discard if so
      if(this.getAttribute('filter') !== currentFilter) return
      if(!data.posts?.length) return
      
      // Get existing post IDs from both DOM and cache
      const domIds = new Set(
        Array.from(this.querySelectorAll('soci-post-li, soci-post-card'))
          .map(el => el.getAttribute('post-id'))
      )
      const cacheIds = new Set((this._postsData || []).map(p => String(p.ID)))
      const existingIds = new Set([...domIds, ...cacheIds])
      
      // Find new posts that aren't already in DOM or cache
      const newPosts = data.posts.filter(post => !existingIds.has(String(post.ID)))
      if(!newPosts.length) return
      
      // Add new posts to cached data
      this._postsData = [...(this._postsData || []), ...newPosts]
      this._dedupePostsData()
      
      // Render and animate new posts
      const isLanes = this.getAttribute('view') === 'lanes'
      const renderFn = isLanes ? this.renderPostCard.bind(this) : this.renderPostLi.bind(this)
      
      newPosts.forEach((post, i) => {
        const tempDom = document.createElement('div')
        tempDom.innerHTML = renderFn(post)
        const postEl = tempDom.firstElementChild
        
        postEl.style.opacity = '0'
        postEl.style.transform = 'translateY(12px)'
        this.appendChild(postEl)
        
        setTimeout(() => {
          postEl.style.transition = 'opacity 0.3s var(--soci-ease), transform 0.3s var(--soci-ease)'
          postEl.style.opacity = '1'
          postEl.style.transform = 'translateY(0)'
        }, i * 50)
      })
      
      if(isLanes) relayout(this)
    } catch(e) {
      if(e.name !== 'AbortError') throw e
    }
  }

  _updateView(view) {
    // Clean up previous polyfill state
    unpolyfill(this)
    
    // Re-render posts respecting current filter
    if (this._postsData) {
      this._applyFilter(this.getAttribute('filter'))
    }
  }

  connectedCallback() {
    this.addEventListener('card-loaded', this._onCardLoaded)
  }

  disconnectedCallback() {
    unpolyfill(this)
    this.removeEventListener('card-loaded', this._onCardLoaded)
    if(this._fetchController) this._fetchController.abort()
  }

  async createPosts(data){
    const generation = ++this._renderGeneration
    const isLanes = this.getAttribute('view') === 'lanes'
    const renderFn = isLanes ? this.renderPostCard.bind(this) : this.renderPostLi.bind(this)
    
    let numberToRender = Math.ceil(window.innerHeight / (isLanes ? 300 : 104))
    this.innerHTML = data.splice(0, numberToRender).map(renderFn).join('')
    
    if (isLanes) polyfill(this, true)
    
    const renderNextPost = (remainingPosts) => {
      if (remainingPosts.length === 0) return
      if (this._renderGeneration !== generation) return

      requestIdleCallback(() => {
        if (this._renderGeneration !== generation) return
        
        let tempDom = document.createElement('div')
        tempDom.innerHTML = renderFn(remainingPosts[0])
        this.appendChild(tempDom.firstElementChild)
        renderNextPost(remainingPosts.slice(1))
      })
    }

    renderNextPost(data)
  }

  renderPostLi(post){
    return`
      <soci-post-li post-title="${post.title.replaceAll('"', '&quot;')}" url="${post.url}" post-id="${post.ID}" score=${post.score || 0} comments=${post.commentCount || 0} type=${post.type || 'image'} time=${post.time} ${post.link ? `link=${post.link}` : ''} ${post.community ? `community="${post.community}"` : ''}>
        <soci-user name="${post.user}" slot="user"></soci-user>
        <soci-tag-group slot="tags">
          ${this.sortTags(post.tags).map(tag => `<soci-tag tag="${tag.tag}" score="${tag.score}" tag-id="${tag.tagID}" ${soci.votes[post.ID]?.includes(tag.tagID) ? 'upvoted':''}></soci-tag>`).join('')}
        </soci-tag-group>
      </soci-post-li>
    `
  }

  renderPostCard(post){
    const desc = post.content ? `<soci-markdown-view slot="description" markdown="${this._escapeAttr(post.content)}"></soci-markdown-view>` : ''
    return`
      <soci-post-card post-title="${post.title.replaceAll('"', '&quot;')}" url="${post.url}" post-id="${post.ID}" score=${post.score || 0} comments=${post.commentCount || 0} type=${post.type || 'image'} time=${post.time} ${post.link ? `link="${post.link}"` : ''} ${post.community ? `community="${post.community}"` : ''}>
        ${desc}
        <soci-user name="${post.user}" slot="user"></soci-user>
        <soci-tag-group slot="tags">
          ${this.sortTags(post.tags).map(tag => `<soci-tag tag="${tag.tag}" score="${tag.score}" tag-id="${tag.tagID}" ${soci.votes[post.ID]?.includes(tag.tagID) ? 'upvoted':''}></soci-tag>`).join('')}
        </soci-tag-group>
      </soci-post-card>
    `
  }

  _escapeAttr(s){
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('\n', '&#10;')
  }
}
