import SociComponent from '../components/soci-component.js'

export default class BlogImageFull extends SociComponent {

  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: block;
        width: 100%;
      }
      img {
        width: 100%;
        object-fit: cover;
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