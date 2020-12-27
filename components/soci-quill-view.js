import SociComponent from './soci-component.js'

export default class SociQuillView extends HTMLElement {
  constructor() {
    super()
  }

  static get observedAttributes() {
    return ['ops']
  }

  async attributeChangedCallback(name, oldValue, newValue){
    if(name == 'ops') this.render(newValue)
  }

  _tagMapping = {
    underline: 'u',
    bold: 'strong',
    italic: 'em'
  }

  render(ops){
    this.innerHTML = ''
    try {
      if(typeof ops == 'string') ops = JSON.parse(ops)
      ops = ops.ops
      let currentBlockText = ''
      let parentContainer = this
      let prevLi = null
      let newLine = () => {
        if(currentBlockText == '') return document.createElement('br')
        let dom = document.createElement('p')
        dom.innerHTML = currentBlockText
        currentBlockText = ''
        return dom
      }
      ops.forEach(op => {
        // Check if this is a block element modifier
        if(op.insert == '\n'){
          if(op.attributes?.header){
            let dom = document.createElement(`h${op.attributes.header}`)
            dom.innerHTML = currentBlockText
            parentContainer.appendChild(dom)
            currentBlockText = ''
          }
          else if(op.attributes?.list){
            let listType = op.attributes.list == 'ordered' ? 'OL' : 'UL'
            let indent = op.attributes.indent || 0
            let parent = parentContainer
            // If we're at the root indentation level, then just attach the child to the last list
            if(parentContainer?.lastElementChild?.tagName == listType && indent == parentContainer.lastElementChild?.dataset?.indent){
              parent = parentContainer.lastElementChild
            }
            else {
              // Find the parent that we want to attach to
              let prevIndent = prevLi?.dataset?.indent
              if(indent == 0){
                parent = parentContainer
              }
              else if(prevIndent >= indent){
                parent = prevLi.closest(`${listType}[data-indent="${indent}"]`)
              } 
              else if(prevIndent < indent){
                parent = prevLi
              } 
              else {
                parent = prevLi || parentContainer
              }

              // Once we know our parent, let's indent as much as we need
              while(parent?.dataset?.indent == undefined || indent > parseInt(parent.dataset.indent)){
                let indentContainer = document.createElement(listType)
                indentContainer.setAttribute('data-indent', parent?.dataset?.indent == undefined ? 0 : parseInt(parent.dataset.indent) + 1)
                parent.appendChild(indentContainer)
                parent = indentContainer
              }
            }

            // Finally, let's create an li and put in our content
            let dom = document.createElement('li')
            dom.setAttribute('data-indent', indent)
            dom.innerHTML = currentBlockText
            parent.appendChild(dom)
            prevLi = dom
            currentBlockText = ''
          }
          else {
            parentContainer.appendChild(newLine())
          }
        }

        // Otherwise treat it as inline
        else {
          let inserts = op.insert
          while(inserts.length) {
            let newLinePos = inserts.indexOf('\n')
            if(newLinePos >= 0){
              currentBlockText += inserts.slice(0, newLinePos)
              inserts = inserts.slice(newLinePos + 1)
              parentContainer.appendChild(newLine())
            }
            else {
              if(op.attributes) Object.keys(op.attributes).forEach(key => {
                if(key == 'link'){
                  inserts = `<a href=${op.attributes.link}>${inserts}</a>`
                }
                else {
                  let tag = this._tagMapping[key]
                  if(tag) inserts = `<${tag}>${inserts}</${tag}>`
                }
              })
              currentBlockText += inserts
              inserts = ''
            }
          }
        }
      })

    }
    catch(e) {
      console.error(e)
      console.log(ops)
      this.innerHTML = "<error style='color: var(--r3);'>Error: Malformed content</error>"
    }
  }
}
