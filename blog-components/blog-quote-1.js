import SociComponent from '../components/soci-component.js'
import DS from '../lib/soci-design-system.js'

export default class BlogQuote1 extends SociComponent {

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
        padding: var(--soci-blog-padding);
        background: linear-gradient(0deg, var(--n2) 0px, var(--n1) 1px, hsl(120, 17%, 98%) 4px, transparent 30px), linear-gradient(180deg, var(--n2) 0px, var(--n1) 1px, hsl(120, 17%, 98%) 4px, transparent 30px), hsl(120,17%,98%);
      }
      #title {
        ${DS.header2}
        font-weight: 100;
        font-style: italic;
        line-height: 1.4;
        margin-bottom: 0.75em;
      }
      #title:before,
      #title:after {
        display: inline-block;
        font-size: 60px;
        line-height: 20px;
        transform: translateY(16px);
        font-family: serif;
        font-weight: 100;
        color: var(--n2);
      }
      #title:before {
        content: "“";
        margin-right: 4px;
      }
      #title:after {
        content: "”";
      }
      #attribution {
        display: block;
        padding-bottom: 0.2em;
        font-weight: 100;
      }
      #attribution:before {
        content: "—";
      }
      div {
        max-width: 920px;
      }
    `
  }

  html(){
    return `
      <div id="title"></div>
      <div id="attribution"></div>
    `
  }

  connectedCallback(){
    this.select('#title').innerHTML = "With software there are only two possibilites: either the users control the programme or the programme controls the users. If the programme controls the users, and the developer controls the programme, then the programme is an instrument of unjust power."
    this.select('#attribution').innerHTML = "Richard Stallman"
  }
}