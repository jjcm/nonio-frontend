import SociComponent from '../components/soci-component.js'
import DS from '../lib/soci-design-system.js'

export default class BlogHero1 extends SociComponent {

  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: grid;
        grid-template-columns: 1fr 544px 32px 344px 1fr;
        font-size: 20px;
        min-height: 800px;
      }
      #title {
        ${DS.header1}
      }
      #subtitle {
        ${DS.paragraph}
        margin-bottom: 0.5em;
        line-height: 1.5;
      }
      #container {
        padding-left: 32px;
        grid-column-start: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      #image-container {
        grid-column-start: 4;
        grid-column-end: 6;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        clip-path: polygon(15% 0%, 0% 100%, 100% 100%, 100% 0%);
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
      }
      span,
      #time {
        display: inline-block;
        line-height: 1.5em;
        font-weight: 300;
      }
      
      span {
        margin: 0 0.25em;
      }

      soci-tag-group [slot="score"] {
        min-width: 18px;
      }
    `
  }

  html(){
    return `
      <div id="container">
        <div id="title"></div>
        <div id="subtitle"></div>
        <div id="details">
          <soci-user self></soci-user><span>|</span><div id="time">9 Aug 2020</div>
        </div>
        <soci-tag-group size="large" format="blog"><soci-tag>technology</soci-tag><soci-tag>javascript</soci-tag></soci-tag-group>
      </div>
      <div id="image-container">
        <picture>
          <source>
          <source>
          <img src="https://image.non.io/painting.webp">
        </picture>
      </div>
    `
  }

  connectedCallback(){
    this.select('#title').innerHTML = "hello lorem ipsum magic time waka waka"
    this.select('#subtitle').innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget magna ex. Cras in dolor nisl. Vivamus fermentum neque nulla, vel pulvinar tortor egestas ut. Morbi vel nisi ut elit ornare tristique vitae in elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec vitae semper neque."
  }
}