import {SociComponent, html, render} from './soci-component.js'

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
    `
  }

  static get observedAttributes() {
    return ['data', 'order', 'timespan']
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
      ${data.map((post) => html`
        <soci-post-li score="${post.score || 0}" comments="${post.comments || 0}" title="${post.title}" type="${post.type}" time="${post.time}">
          <soci-user name="${post.user}" slot="user"></soci-user>
          <div slot="tags" style="white-space: nowrap;">
            ${post.tags.map(tag => html`<soci-tag score="${tag.score}">${tag.name}</soci-tag>`)}
          </div>
        </soci-post-li>
      `)}
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
