import {SociComponent, html, render} from './soci-component.js'

export default class SociSidebar extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        border-right: 2px solid var(--n2);
        margin-right: 16px;
        width: 280px;
        min-width: 280px;
      }

      :host input {
        border: none;
        height: 38px;
        padding-left: 52px;
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
        padding-left: 52px;
        line-height: 40px;
        margin: 12px 0 4px 0;
      }

      :host section {
        border-bottom: 2px solid var(--n2);
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

      :host a {
        display: block;
        text-decoration: none;
        color: var(--n4);
        line-height: 32px;
        padding-left: 22px;
        cursor: pointer;
      }

      :host a:last-child {
        margin-bottom: 20px;
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

  render(){
    let data = 'my-tags.json'
    return html`
      ${this.getCss()}
      <section id="user">
        <soci-user size="large" name="pwnies"></soci-user>
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
