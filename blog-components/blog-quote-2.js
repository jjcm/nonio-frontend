import SociComponent from '../components/soci-component.js'
import DS from '../lib/soci-design-system.js'
import config from '../config.js'

export default class BlogQuote2 extends SociComponent {

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
        position: relative;
        margin: var(--soci-blog-padding) 0;
      }
      :host([image]) {
        background: #ffffff80;
        box-shadow: 0 0 4px #000 inset;
        text-shadow: 0 2px 15px #ffffff80;
        margin: 0;
        padding: var(--soci-blog-padding) 0;
      }
      #container {
        padding: 0 var(--soci-blog-padding);
        max-width: var(--soci-blog-width);
      }
      #title {
        ${DS.header2}
        font-weight: 100;
        font-style: italic;
        line-height: 1.4;
        margin-bottom: 0.75em;
      }
      :host([image]) #title {
        font-weight: 500;
      }
      #title:before,
      #title:after {
        display: inline-block;
        font-size: 60px;
        line-height: 20px;
        transform: translateY(16px);
        font-family: serif;
        opacity: 0.2;
      }
      #title:before {
        content: "“";
        margin-right: 4px;
      }
      #title:after {
        content: "”";
      }
      #attribution {
        padding-bottom: 0.2em;
        font-weight: 300;
        display: block;
        text-align: center;
        padding: 0 var(--soci-padding);
        opacity: 0.3;
      }
      :host([image]) #attribution {
        opacity: 1;
      }
      #attribution:before {
        content: "—";
      }
      div {
        max-width: 920px;
      }
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        object-fit: cover;
      }

      :host([align="left"]) #title,
      :host([align="left"]) #attribution {
        padding-right: 30%;
        text-align: left;
      }

      :host([align="right"]) #title,
      :host([align="right"]) #attribution {
        padding-left: 30%;
        text-align: right;
      }

      :host([invert]) {
        background: #00000060;
        color: #fff;
        text-shadow: 0 2px 15px #00000080;
      }

    `
  }

  html(){
    return `
      <div id="container">
        <div id="title"></div>
        <div id="attribution"></div>
      </div>
      <picture>
      </picture>
    `
  }

  connectedCallback(){
    this.select('#title').innerHTML = "With software there are only two possibilites: either the users control the programme or the programme controls the users. If the programme controls the users, and the developer controls the programme, then the programme is an instrument of unjust power."
    this.select('#attribution').innerHTML = "Richard Stallman"
  }

  static get observedAttributes() {
    return ['image']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'image'){
      let formats = ['webp', 'heic'].map(format=>`<source srcset="${config.IMAGE_HOST}/${newValue}.${format}" />`).join('')
      this.select('picture').innerHTML = `${formats}<img src="${config.IMAGE_HOST}/${newValue}.webp"/>`

    }
  }
}