import SociComponent from './soci-component.js'

export default class SociQuillView extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: block;
      }

      pre {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
        white-space: normal;
        width: 100%;
      }

      h1 {
        font-size: 2em;
      }
      h2 {
        font-size: 1.5em;
      }
      h3 {
        font-size: 1.17em;
      }
    `
  }
  
  html(){
    return `
      <h1>QuillView</h1>
      <pre>
      </pre>
    `
  }

  connectedCallback() {
    this.render({"ops":[{"insert":"Here's a few more points to consider:\nApples are far better than oranges, but you wouldn't know you vitamin c deprived 18th century sailor."},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"Society thanks you for being a keyboard warrior - your face among the masses would be a loss for humanity."},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"fuck you."},{"attributes":{"list":"ordered"},"insert":"\n"}]})
  }

  _tagMapping = {
    underline: 'u',
    bold: 'strong',
    italic: 'em'
  }

  render(ops){
    ops = ops.ops
    let html = ''
    let currentTag = ''
    ops.forEach(op => {
      console.log(op)
      if(op.attributes) {
        Object.keys(op.attributes).forEach(key => {
          switch(key){
            case "header":
              console.log("HEADER")
              let headerLevel = `h${op.attributes[key]}`
              html += `<${headerLevel}>${currentTag}</${headerLevel}>`
              currentTag = ''
              break
            case "list":
              console.log("LIST")
              console.log(op)
              html += `<li>${currentTag}</li>`
              currentTag = ''
            default:
              let tag = this._tagMapping[key] || key
              currentTag += `<${tag}>${op.insert}</${tag}>`
              break
          }
        })
      }
      else {
        currentTag += op.insert
      }
    })
    console.log(currentTag)
    html += currentTag
    console.log(html)
    this.select('pre').innerHTML = html
  }
}
