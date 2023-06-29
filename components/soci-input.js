export default class SociInput extends HTMLElement {
  static get formAssociated() {
    return true
  }

  constructor() {
    super()
    this._internals = this.attachInternals()

  }

  connectedCallback(){
    this.innerHTML = `<div class="quill-editor-container"></div>`
    if(typeof(Quill) == "undefined") 
      window.addEventListener('quillloaded', this.setUpQuill.bind(this))
    else this.setUpQuill()
  }

  checkValidity() {
    return this._internals.checkValidity()
  }

  setUpQuill(){
    let readOnly = this.hasAttribute('readonly')
    let opts = readOnly ? 
      { 
        modules: { toolbar: false },
        formats: ['link', 'code', 'strike', 'underline', 'script', 'bold', 'blockquote', 'list', 'indent', 'code-block'],
        theme: 'bubble',
        readOnly: true 
      } : 
      {
        modules: { toolbar: true },
        formats: ['link', 'code', 'strike', 'underline', 'script', 'bold', 'blockquote', 'list', 'indent', 'code-block'],
        theme: 'bubble',
        placeholder: this.getAttribute('placeholder') || "Enter comment"
      }
    if(this._quillInitialized) return 0
    this._quillInitialized = true
    this.editor = new Quill(this.querySelector('.quill-editor-container'), opts)

    this.editor.on('text-change', ()=>{
      this._internals.setFormValue(this.value)
    })
  }

  get value(){
    return JSON.stringify(this.editor.getContents())
  }

  focus() {
    this.querySelector('.ql-editor').focus()
  }

  setSelection(val) {
    this.editor.setSelection(val)
  }

  renderOpsToHTML(val){
    if(val) this.value = val
    return this.querySelector('.ql-editor').innerHTML
  }

  set value(val){
    this.editor.setContents(JSON.parse(val))
    this._internals.setFormValue(val)
  }

  clear(){
    this.value = '{"ops":[{"insert":"\\n"}]}'
  }
}