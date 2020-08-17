import SociComponent from '../components/soci-component.js'
import DS from '../lib/soci-design-system.js'

export default class BlogHero2 extends SociComponent {

  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 20px;
        min-height: 600px;
        background: var(--n1);
        background: linear-gradient(0deg, var(--n2) 0px, var(--n1) 1px, hsl(120, 17%, 98%) 4px, hsl(120, 17% ,99%) 30px);
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
        grid-column-start: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: 856px;
        padding: 0 32px;
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
    `
  }

  connectedCallback(){
    this.select('#title').innerHTML = "hello lorem ipsum magic time waka waka"
    this.select('#subtitle').innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget magna ex. Cras in dolor nisl. Vivamus fermentum neque nulla, vel pulvinar tortor egestas ut. Morbi vel nisi ut elit ornare tristique vitae in elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec vitae semper neque."
  }
}