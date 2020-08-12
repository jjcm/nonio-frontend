import SociComponent from '../components/soci-component.js'
import DS from '../lib/soci-design-system.js'

export default class BlogHero3 extends SociComponent {

  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: grid;
        grid-template-columns: 1fr 444px 32px 444px 1fr;
        flex-direction: column;
        justify-content: center;
        font-size: 20px;
        min-height: 800px;
        background: linear-gradient(160deg, #448fe4, var(--b3));
        color: #fff;
      }
      #title {
        ${DS.header1}
        width: 100%;
        text-shadow: 0 1px 5px var(--b3);
      }
      #subtitle {
        ${DS.paragraph}
        margin-bottom: 0.5em;
        opacity: 0.7;
        font-weight: 300;
      }
      #image-container {
        grid-column-start: span 2;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      #container {
        grid-column-start: 4;
        padding-left: 32px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      #details {
        display: flex;
        align-items: center;
        margin-bottom: 0.5em;
      }
      soci-user {
        --font-size: 1em;
        --avatar-size: 1.5em;
        --spacing: 0.5em;
        --line-height: 1.5em;
        --font-weight: 400;
        color: #fff;
      }
      span,
      #time {
        display: inline-block;
        line-height: 1.5em;
        font-weight: 400;
      }
      
      span {
        margin: 0 0.25em;
      }

      soci-tag-group [slot="score"] {
        min-width: 18px;
      }

      #controls {
        background: #fff;
        border-radius: 3px;
        padding: 0.5em;
        display: inline-block;
        color: var(--n4);
      }
    `
  }

  html(){
    return `
      <div id="image-container">
        <picture>
          <source>
          <source>
          <img src="../example-data/infographic.svg">
        </picture>
      </div>
      <div id="container">
        <div id="title"></div>
        <div id="subtitle"></div>
        <div id="details">
          <soci-user self></soci-user><span>|</span><div id="time">9 Aug 2020</div>
        </div>
        <div id="controls">
          <soci-tag-group size="large" format="blog"><soci-tag>technology</soci-tag><soci-tag>javascript</soci-tag></soci-tag-group>
        </div>
      </div>
    `
  }

  connectedCallback(){
    this.select('#title').innerHTML = "hello lorem ipsum magic time waka waka"
    this.select('#subtitle').innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget magna ex. Cras in dolor nisl. Vivamus fermentum neque nulla, vel pulvinar tortor egestas ut. Morbi vel nisi ut elit ornare tristique vitae in elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec vitae semper neque."
  }
}