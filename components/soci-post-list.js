import SociComponent from './soci-component.js'

export default class SociPostLi extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        background: rgba(255,255,255,0.8);
        display: block;
        width: 100%;
        padding: 2px 8px 28px;
        box-sizing: border-box;
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
        let data = await this.getData(newValue, this.authToken)
        if(data.posts) this.createPosts(data.posts)
        break
      case 'filter':
        // should put an infinite scroll here
        
        break
    }
  }

  async createPosts(data){
    let posts = `
      ${data.map((post) => `
        <soci-post-li score=${post.score || 0} comments=${post.comments || 0} title="${post.title}" type=${post.type || 'image'} time=${post.time} url="${post.url}">
          <soci-user name="${post.user}" slot="user"></soci-user>
          <div slot="tags" style="white-space: nowrap;">
            ${post.tags.map(tag => `<soci-tag ${post.url} score=${tag.score} ${soci.votes[post.ID]?.includes(tag.tagID) ? 'upvoted':''}>${tag.tag}</soci-tag>`).join('')}
          </div>
        </soci-post-li>
      `).join('')}
    `

    this.innerHTML = posts
  }
}
