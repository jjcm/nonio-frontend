import SociComponent from '../components/soci-component.js'
import DS from '../lib/soci-design-system.js'

export default class BlogText extends SociComponent {

  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: block;
        width: 100%;
        margin: 2em 0;
        line-height: 1.5;
        font-size: 20px;
        margin: 2em auto;
        max-width: var(--soci-blog-width);
        padding: 0 var(--soci-blog-padding);
      }
    `
  }

  html(){
    return `
      <slot></slot>
    `
  }

  connectedCallback(){
    this.innerHTML = `
      <soci-quill-view></soci-quill-view>
    `
    let ops = "{\"ops\":[{\"insert\":\"We all love lorems. We all love ipsusms. Together they're great. Here's why: \"},{\"attributes\":{\"background\":\"#ffffff\",\"color\":\"#000000\"},\"insert\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tempus bibendum eros ut pretium. Sed nulla leo, accumsan id congue ac, vulputate id turpis. Sed finibus orci et magna bibendum viverra. Vivamus malesuada, magna eget faucibus tincidunt, nibh risus sodales sapien, non facilisis dolor purus quis tortor. \"},{\"attributes\":{\"align\":\"justify\"},\"insert\":\"\\n\"},{\"insert\":\"Lip service? More like lipsum service\"},{\"attributes\":{\"align\":\"justify\",\"header\":2},\"insert\":\"\\n\"},{\"attributes\":{\"background\":\"#ffffff\",\"color\":\"#000000\"},\"insert\":\"Fusce maximus mollis leo, ac sagittis enim semper vel. Pellentesque ac semper urna. Morbi tincidunt odio sed mi suscipit pellentesque.\"},{\"attributes\":{\"align\":\"justify\"},\"insert\":\"\\n\"},{\"attributes\":{\"background\":\"#ffffff\",\"color\":\"#000000\"},\"insert\":\"Quisque massa sem, laoreet sit amet nibh eget, venenatis ultricies ante. Fusce volutpat sagittis ullamcorper. Aliquam erat volutpat. Phasellus ut luctus ipsum, eu commodo dolor. Suspendisse porttitor consequat imperdiet. Quisque erat metus, auctor rhoncus laoreet vel, placerat auctor sem. Nulla quis mauris id est lacinia placerat id vitae ex. Donec nec purus neque. Pellentesque porttitor nunc sed suscipit viverra.\"},{\"attributes\":{\"align\":\"justify\"},\"insert\":\"\\n\"}]}"
    this.querySelector('soci-quill-view').render(ops)
  }
}