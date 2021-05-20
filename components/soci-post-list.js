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
        max-height: 0;
        opacity: 0;
        margin-bottom: -32px;
      }

      :host([filter="videos"]) ::slotted(soci-post-li:not([type="video"])){
        max-height: 0;
        opacity: 0;
        margin-bottom: -32px;
      }

      :host([filter="audio"]) ::slotted(soci-post-li:not([type="audio"])){
        max-height: 0;
        opacity: 0;
        margin-bottom: -32px;
      }

      :host([filter="blogs"]) ::slotted(soci-post-li:not([type="blog"])){
        max-height: 0;
        opacity: 0;
        margin-bottom: -32px;
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
        const LOOP_AMOUNT = 10
        let data = await this.getData(newValue, this.authToken)
        let ttotal = 0
        for(var i = 0; i < LOOP_AMOUNT; i++){
          const t0 = performance.now()
          if(data.posts) this.createPosts(data.posts)
          const t1 = performance.now()
          ttotal += t1 - t0
        }
        this.toggleAttribute('loaded', true)
        console.log(`time to generate: ${ttotal / LOOP_AMOUNT}`)
        console.log(`time per post: ${ttotal / LOOP_AMOUNT / data.posts.length}`)
        break
      case 'filter':
        // should put an infinite scroll here
        
        break
    }
  }

  async createPosts(data){
    console.log('creating posts')
    let posts = `
      ${data.map((post) => `
        <soci-post-li post-title="${post.title}" url="${post.url}" post-id="${post.ID}" type=${post.type || 'image'} time=${post.time}>
          <div slot="title">${post.title}</div>
          <div slot="comments">${post.commentCount || 0}</div>
          <soci-user name="${post.user}" slot="user"></soci-user>
          <soci-tag-group slot="tags" score=${post.score || 0}>
            ${this.sortTags(post.tags).map(tag => `<soci-tag tag="${tag.tag}" score="${tag.score}" tag-id="${tag.tagID}" ${soci.votes[post.ID]?.includes(tag.tagID) ? 'upvoted':''}></soci-tag>`).join('')}
          </soci-tag-group>
        </soci-post-li>
      `).join('')}
    `

    this.innerHTML = posts
  }
}
