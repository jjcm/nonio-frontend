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
    this.render({"ops":[{"insert":"asdf"},{"attributes":{"link":"google.com"},"insert":"1234"},{"insert":"asdf\n1st level"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"3rd level"},{"attributes":{"indent":2,"list":"ordered"},"insert":"\n"},{"insert":"2nd level"},{"attributes":{"indent":1,"list":"ordered"},"insert":"\n"}]})
  }

  _tagMapping = {
    underline: 'u',
    bold: 'strong',
    italic: 'em'
  }

  render(ops){
    ops = ops.ops
    let html = document.createElement('div')
    let currentText = ''
    let dom = null
    let parent = null
    let prevNode = null
    ops.forEach(op => {
      while(op.insert.length > 1 && op.insert.indexOf('\n') != -1){
        let substring = op.insert.slice(0, op.insert.indexOf('\n'))
        op.insert = op.insert.slice(op.insert.indexOf('\n') + 1)
        dom = document.createElement('p')
        dom.innerHTML = currentText + substring
        html.appendChild(dom)
        currentText = ''
      }
      if(op.attributes) {
        parent = html
        Object.keys(op.attributes).forEach(key => {
          switch(key){
            case "header":
              dom = document.createElement(`h${op.attributes[key]}`)
              dom.innerHTML = currentText
              break
            case "list":
              let listType = op.attributes.list == 'ordered' ? 'OL' : 'UL'
              let indent = op.attributes.indent || 0
              console.log(`parent indent: ${parent.dataset.indent}, indent: ${indent}`)
              if(html.lastElementChild.tagName == listType && indent == html.lastElementChild.dataset.indent){
                parent = html.lastElementChild
              }
              else {
                let container = document.createElement(listType)
                container.setAttribute('data-indent', indent || 0)
                parent = container
                if(prevNode && indent > prevNode.dataset.indent){
                  //still need to make sure that this works if there are multiple indent levels suddenly
                  prevNode.appendChild(container)
                }
                else {
                  html.appendChild(container)
                }
              }
              dom = document.createElement('li')
              dom.setAttribute('data-indent', indent)
              dom.innerHTML = currentText
              break
            default:
              dom = document.createElement(this._tagMapping[key] || key)
              dom.innerHTML = op.insert
              break
          }
        })
        parent.appendChild(dom)
        prevNode = dom
        currentText = ''
      }
      else {
        currentText += op.insert
      }
    })
    this.select('pre').appendChild(html)
  }
}
