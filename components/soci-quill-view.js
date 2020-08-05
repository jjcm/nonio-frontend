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

      h1, h2, h3 {
        margin: 0;
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
      p {
        margin: 0;
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
    this.render({"ops":[{"insert":"asdf\ntest"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"test2"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"heyo"},{"attributes":{"indent":1,"list":"ordered"},"insert":"\n"},{"insert":"waka"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"\nneat\nbullets!"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"heyo"},{"attributes":{"indent":1,"list":"bullet"},"insert":"\n"},{"insert":"wow"},{"attributes":{"indent":2,"list":"bullet"},"insert":"\n"}]})
  }

  _tagMapping = {
    underline: 'u',
    bold: 'strong',
    italic: 'em'
  }

  render(ops){
    ops = ops.ops
    let html = document.createElement('div')
    let currentTag = ''
    let dom = null
    let parent = null
    ops.forEach(op => {
      while(op.insert.length > 1 && op.insert.indexOf('\n') != -1){
        let substring = op.insert.slice(0, op.insert.indexOf('\n'))
        op.insert = op.insert.slice(op.insert.indexOf('\n') + 1)
        dom = document.createElement('p')
        dom.innerHTML = currentTag + substring
        html.appendChild(dom)
        currentTag = ''
      }
      if(op.attributes) {
        parent = html
        Object.keys(op.attributes).forEach(key => {
          switch(key){
            case "header":
              dom = document.createElement(`h${op.attributes[key]}`)
              dom.innerHTML = currentTag
              break
            case "list":
              let listType = op.attributes.list == 'ordered' ? 'OL' : 'UL'
              let indent = op.attributes.indent || 0
              console.log(`parent indent: ${parent.dataset.indent}, indent: ${indent}`)
              if(html.lastElementChild.tagName == listType && indent == html.lastElementChild.dataset.indent){
                parent = html.lastElementChild
                // HERE BE DRAGONS
              }
              else {
                let container = document.createElement(listType)
                container.setAttribute('data-indent', indent || 0)
                html.appendChild(container)
                parent = container
              }
              dom = document.createElement('li')
              dom.setAttribute('data-indent', indent)
              dom.innerHTML = currentTag
              break
            default:
              dom = document.createElement(this._tagMapping[key] || key)
              dom.innerHTML = op.insert
              break
          }
        })
        parent.appendChild(dom)
        currentTag = ''
      }
      else {
        currentTag += op.insert
      }
    })
    this.select('pre').appendChild(html)
  }
}
