import SociComponent from './soci-component.js'

export default class SociPostLi extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: block;
        width: 100%;
        padding: 2px 8px 28px;
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

      :host([filter="images"]) ::slotted(soci-post-li:not([type="image"])){
        display:none;
      }

      :host([filter="videos"]) ::slotted(soci-post-li:not([type="video"])){
        display:none;
      }

      :host([filter="audio"]) ::slotted(soci-post-li:not([type="audio"])){
        display:none;
      }

      :host([filter="blogs"]) ::slotted(soci-post-li:not([type="blog"])){
        display:none;
      }
    `
  }

  static get observedAttributes() {
    return ['data', 'order', 'timespan', 'filter']
  }

  async attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case 'data':
        this.toggleAttribute('loaded', false)
        let data = await this.getData(newValue, this.authToken)
        if(data.posts) this.createPosts(data.posts)
        this.toggleAttribute('loaded', true)
        break
      case 'filter':
        // should put an infinite scroll here
        
        break
    }
  }

  async createPosts(data){
    this.renderPostLi = this.renderPostLi.bind(this)
    let numberToRender = Math.ceil(window.innerHeight / 104) // the height of a post li
    // render only the amount visible on the screen first, and animate them in
    this.innerHTML = data.splice(0, numberToRender).map(this.renderPostLi).join('')
    // then once the main batch is done, load in the rest. 
    const renderNextPost = (remainingPosts) => {
      if (remainingPosts.length === 0) return

      requestIdleCallback(() => {
        let tempDom = document.createElement('div')
        tempDom.innerHTML = this.renderPostLi(remainingPosts[0])
        this.appendChild(tempDom.firstElementChild)
        renderNextPost(remainingPosts.slice(1))
      })
    }

    renderNextPost(data)
  }

  renderPostLi(post){
    return`
      <soci-post-li post-title="${post.title.replaceAll('"', '&quot;')}" url="${post.url}" post-id="${post.ID}" score=${post.score || 0} comments=${post.commentCount || 0} type=${post.type || 'image'} time=${post.time} ${post.link ? `link=${post.link}` : ''}>
        <soci-user name="${post.user}" slot="user"></soci-user>
        <soci-tag-group slot="tags">
          ${this.sortTags(post.tags).map(tag => `<soci-tag tag="${tag.tag}" score="${tag.score}" tag-id="${tag.tagID}" ${soci.votes[post.ID]?.includes(tag.tagID) ? 'upvoted':''}></soci-tag>`).join('')}
        </soci-tag-group>
      </soci-post-li>
    `
  }
}
