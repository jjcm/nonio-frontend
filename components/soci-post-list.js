import SociComponent from './soci-component.js'
import { polyfill, unpolyfill, relayout } from '../lib/grid-lanes-polyfill.js'

export default class SociPostList extends SociComponent {
  constructor() {
    super()
    this._postsData = null
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

      :host([filter="images"]) ::slotted(soci-post-li:not([type="image"])),
      :host([filter="images"]) ::slotted(soci-post-card:not([type="image"])){
        display:none;
      }

      :host([filter="videos"]) ::slotted(soci-post-li:not([type="video"])),
      :host([filter="videos"]) ::slotted(soci-post-card:not([type="video"])){
        display:none;
      }

      :host([filter="audio"]) ::slotted(soci-post-li:not([type="audio"])),
      :host([filter="audio"]) ::slotted(soci-post-card:not([type="audio"])){
        display:none;
      }

      :host([filter="blogs"]) ::slotted(soci-post-li:not([type="blog"])),
      :host([filter="blogs"]) ::slotted(soci-post-card:not([type="blog"])){
        display:none;
      }

      :host([filter="links"]) ::slotted(soci-post-li:not([type="link"])),
      :host([filter="links"]) ::slotted(soci-post-card:not([type="link"])){
        display:none;
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
          this.createPosts([...data.posts])
        }
        this.toggleAttribute('loaded', true)
        break
      case 'filter':
        relayout(this)
        break
      case 'view':
        this._updateView(newValue)
        break
    }
  }

  _updateView(view) {
    // Clean up previous polyfill state
    unpolyfill(this)
    
    // Re-render posts with different component
    if (this._postsData) {
      this.createPosts([...this._postsData])
    }
  }

  disconnectedCallback() {
    unpolyfill(this)
  }

  async createPosts(data){
    const isLanes = this.getAttribute('view') === 'lanes'
    const renderFn = isLanes ? this.renderPostCard.bind(this) : this.renderPostLi.bind(this)
    
    let numberToRender = Math.ceil(window.innerHeight / (isLanes ? 300 : 104))
    this.innerHTML = data.splice(0, numberToRender).map(renderFn).join('')
    
    // Enable grid-lanes polyfill for card view
    if (isLanes) {
      polyfill(this, true)
    }
    
    const renderNextPost = (remainingPosts) => {
      if (remainingPosts.length === 0) return

      requestIdleCallback(() => {
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
    return`
      <soci-post-card post-title="${post.title.replaceAll('"', '&quot;')}" url="${post.url}" post-id="${post.ID}" score=${post.score || 0} comments=${post.commentCount || 0} type=${post.type || 'image'} time=${post.time} ${post.link ? `link="${post.link}"` : ''} ${post.community ? `community="${post.community}"` : ''}>
        <soci-user name="${post.user}" slot="user"></soci-user>
        <soci-tag-group slot="tags">
          ${this.sortTags(post.tags).map(tag => `<soci-tag tag="${tag.tag}" score="${tag.score}" tag-id="${tag.tagID}" ${soci.votes[post.ID]?.includes(tag.tagID) ? 'upvoted':''}></soci-tag>`).join('')}
        </soci-tag-group>
      </soci-post-card>
    `
  }
}
