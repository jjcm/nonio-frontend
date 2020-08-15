import SociComponent from '../components/soci-component.js'

export default class BlogImage extends SociComponent {

  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: block;
        width: 100%;
      }
      picture {
        display: block;
        max-width: 920px;
        padding: 0 32px;
        margin: 0 auto;
      }
      img {
        border-radius: 3px;
        width: 100%;
      }
    `
  }

  html(){
    return `
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
  }
}