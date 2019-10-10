import {SociComponent, html, render} from './soci-component.js'

export default class SociSidebar extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        border-right: 2px solid var(--n1);
        margin-right: 16px;
        width: 280px;
        min-width: 280px;
        display: block;
        height: 100vh;
        overflow: auto;
      }

      :host input {
        border: none;
        height: 38px;
        padding-left: 54px;
        font-size: 14px;
        width: 100%;
      }

      :host input:active, :host input:focus {
        outline: none;
        border: none;
        box-shadow: 0 0 0 2px var(--b1);
      }

      :host input::placeholder, h2 {
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: normal;
        color: var(--n3);
      }

      :host h2 {
        padding-left: 54px;
        line-height: 40px;
        margin: 12px 0 4px 0;
      }

      :host section {
        border-bottom: 2px solid var(--n1);
        position: relative;
      }

      :host section:last-child {
        border-bottom: none;
      }

      :host soci-icon {
        position: absolute;
        left: 20px;
        top: 7px;
      }

      :host #search soci-icon{
        top: 6px;
      }

      :host #user {
        position: sticky;
        top: 0;
        background: #fff;
        z-index: 10;
        height: 64px;
      }

      :host #user a {
        display: flex;
        align-items: center;
        padding-left: 20px;
        width: 100%;
        height: 100%;
        margin: 0;
      }

      :host #user a:hover {
        background: transparent;
      }

      :host #tags {
        padding-bottom: 20px;
      }

      :host a {
        display: block;
        text-decoration: none;
        color: var(--n4);
        line-height: 32px;
        padding-left: 22px;
        cursor: pointer;
      }

      :host a:hover {
        background: var(--n1);
      }

      :host a:last-child {
        margin-bottom: 20px;
      }

      ::slotted(a) {
        display: block;
        padding-left: 54px;
        text-decoration: none;
        line-height: 32px;
        position: relative;
        color: var(--n4);
      }

      ::slotted(a:hover) {
        background: var(--n1);
      }

      ::slotted(svg) {
        position: absolute;
        left: 20px;
      }
    `
  }


  static get observedAttributes() {
    return ['user']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case "user":
        break
    }
  }

  tagClick(e){
    let column = document.createElement('soci-column')
    column.filter = 'all'
    column.tag = e.currentTarget.textContent.trim()
    //column.color = e.currentTarget.getAttribute('color')
    column.color = 'purple'
    document.getElementById('tags').appendChild(column)
  }

  createSubscribedTags(data){
    let tags = html`
      ${data.map((tag) => html`
        <soci-link href="#${tag.name}" @click=${this.tagClick} color=${tag.color}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="background: var(--${tag.color}); position: absolute; left: 24px; top: 8px; width: 16px; height: 16px; border-radius: 3px;">
            <g transform="translate(1,1.5)">
            <path d="M9.28 7.346H11.17V8.62H9.126L8.832 11H7.558L7.852 8.62H5.486L5.192 11H3.918L4.212 8.62H2.322V7.346H4.366L4.688 4.854H2.798V3.58H4.842L5.136 1.2H6.41L6.116 3.58H8.468L8.762 1.2H10.036L9.742 3.58H11.618L11.632 4.854H9.588L9.28 7.346ZM8.006 7.346L8.314 4.854H5.962L5.64 7.346H8.006Z" fill="white"/>
            </g>
          </svg>
          ${tag.name}
        </soci-link>
      `)}
    `
    render(tags, this)
  }

  connectedCallback(){
    let tagsUrl = 'fake-routes/subscribed-tags.json'
    fetch(tagsUrl).then(
      response=>{
        if(response.ok) return response.json()
        else this.log('JSON not found')
      }
    ).then(
      json=>{
        if(json) this.createSubscribedTags(json)
      }
    ).catch(e=>{
      this.log(e)
    })
  }

  render(){
    return html`
      ${this.getCss()}
      <section id="user">
        <a href="user" @click=${this.localLink}>
          <soci-user size="large" name="pwnies"></soci-user>
        </a>
      </section>
      <section id="search">
        <input placeholder="search"></input>
        <soci-icon glyph="search"></soci-icon>
      </section>
      <section id="home">
        <soci-icon glyph="home"></soci-icon>
        <h2>Home</h2>

        <a href="#">Trending</a>
        <a href="#">New</a>
        <a href="#">Top</a>
      </section>
      <section id="tags">
        <soci-icon glyph="tags"></soci-icon>
        <h2>Tags</h2>
        <slot></slot>
      </section>
      <section id="comments">
        <soci-icon glyph="comments"></soci-icon>
        <h2>Comments</h2>

        <a href="#">Trending</a>
        <a href="#">New</a>
        <a href="#">Top</a>
      </section>
      <section id="soci">
        <a href="#">About</a>
        <a href="#">Feedback</a>
        <a href="#">Help</a>
      </section>
    `
  }
}
