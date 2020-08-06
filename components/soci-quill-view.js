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
      <pre>
      </pre>
    `
  }

  connectedCallback() {
    this.ops = JSON.stringify({"ops":[{"insert":"Hey now this is a big test\n\nWe're gonna go "},{"attributes":{"underline":true,"bold":true},"insert":"HARD"},{"insert":"\n\nOk here's a header"},{"attributes":{"header":1},"insert":"\n"},{"insert":"heres a "},{"attributes":{"link":"google.com"},"insert":"link"},{"insert":" in the middle \n"},{"attributes":{"link":"non.io"},"insert":"heres one that's a whole line"},{"insert":"\n\nhow bout some...\nl"},{"attributes":{"italic":true},"insert":"ist"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"e"},{"attributes":{"bold":true},"insert":"lem"},{"insert":"ents"},{"attributes":{"indent":1,"list":"ordered"},"insert":"\n"},{"attributes":{"link":"reddit.com"},"insert":"with magic"},{"attributes":{"indent":2,"list":"ordered"},"insert":"\n"},{"insert":"Boom"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"pure happiness"},{"attributes":{"indent":1,"list":"bullet"},"insert":"\n"},{"insert":"hell yea"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"oh my what is this"},{"attributes":{"indent":1,"list":"ordered"},"insert":"\n"},{"insert":"\n"}]})
    this.ops = JSON.stringify({"ops":[{"insert":"we're gonna go "},{"attributes":{"italic":true,"bold":true},"insert":"hard"},{"insert":"\ntesting this "},{"attributes":{"underline":true},"insert":"shit"},{"attributes":{"header":1},"insert":"\n"}]})
    console.log(this.ops)
    setTimeout(()=> {
      this.previousElementSibling.value = this.ops
    }, 1000)
    this.render(JSON.parse(this.ops))
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
        console.log(`substring: ${substring}`)
        op.insert = op.insert.slice(op.insert.indexOf('\n') + 1)
        console.log(`insert: ${op.insert}`)
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
            case "link":
              dom = document.createElement('a')
              dom.href = op.attributes.link
              dom.innerHTML = currentText
              break
            case "list":
              let listType = op.attributes.list == 'ordered' ? 'OL' : 'UL'
              let indent = op.attributes.indent || 0
              // If we're at the root indentation level, then just attach the child to the last list
              if(html.lastElementChild.tagName == listType && indent == html.lastElementChild.dataset.indent){
                parent = html.lastElementChild
              }
              else {
                // Find the parent that we want to attach to
                let prevIndent = prevNode?.dataset?.indent
                if(indent == 0){
                  parent = html
                }
                else if(prevIndent >= indent){
                  console.log(`going shallower: ${prevIndent} ${indent}`)
                  parent = prevNode.closest(`${listType}[data-indent="${indent}"]`)
                } 
                else if(prevIndent < indent){
                  console.log('going deeper')
                  parent = prevNode
                } 
                else {
                  parent = prevNode || html
                  console.log('going same or root')
                }

                console.log(parent)
                console.log(html)

                // Once we know our parent, let's indent as much as we need
                while(parent?.dataset?.indent == undefined || indent > parseInt(parent.dataset.indent)){
                  let indentContainer = document.createElement(listType)
                  indentContainer.setAttribute('data-indent', parent?.dataset?.indent == undefined ? 0 : parseInt(parent.dataset.indent) + 1)
                  console.log(indent)
                  parent.appendChild(indentContainer)
                  parent = indentContainer
                }
              }

              // Finally, let's create an li and put in our content
              dom = document.createElement('li')
              dom.setAttribute('data-indent', indent)
              dom.innerHTML = currentText
              break
            // if none of the above, this is an inline attribute
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
