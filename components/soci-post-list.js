import {SociComponent, html, render} from './soci-component.js'

export default class SociPostLi extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        background: var(--n1);
        display: block;
        width: 100%;
        overflow: auto;
      }
      ::slotted(soci-post-li){
        margin-top: 8px;
      }
    `
  }

  static get observedAttributes() {
    return ['data']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == "data"){
      fetch(newValue).then(
        response=>{
          if(response.ok) return response.json()
          else this.log('JSON not found')
        }
      ).then(
        json=>{
          if(json) this.createPosts(json)
        }
      ).catch(e=>{
        this.log(e)
      })
    }
  }

  createPosts(data){
    let posts = html`
      ${data.map(post => html`<soci-post-li title="${post.title}" score="${post.score || 0}" type="${post.type}">
        <soci-user name="${post.user}" slot="user"></soci-user>
        <div slot="tags">
          ${post.tags.map(tag => html`<soci-tag score="${tag.score}">${tag.name}</soci-tag>`)}
        </div>
      </soci-post-li>`)}
    `
    render(posts, this)
  }

  render(){
    return html`
      ${this.getCss()}
      <slot></slot>
    `
  }
}
