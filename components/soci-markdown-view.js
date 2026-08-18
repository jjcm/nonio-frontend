export default class SociMarkdownView extends HTMLElement {
  constructor() {
    super()
  }

  static get observedAttributes() {
    return ['markdown']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // If someone sets attribute value directly, treat it as markdown content.
    // (Bindings that set via property `el.value = ...` will hit the setter below.)
    if (name === 'markdown') this.render(newValue)
  }

  async _getMarkdown() {
    // Load markdown-wasm on demand: routes without markdown (e.g. the feed
    // list view) never pay for the loader script + 56KB wasm.
    if (!window.markdown || !window.markdown.ready) {
      window.__markdownLoading ??= new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = '/lib/markdown-wasm/markdown.js'
        s.onload = resolve
        s.onerror = () => reject(new Error('markdown-wasm failed to load'))
        document.head.appendChild(s)
      })
      await window.__markdownLoading
    }
    return await window.markdown.ready
  }

  async render(markdownText) {
    this._raw = markdownText ?? ''
    this.innerHTML = ''

    if (!this._raw) {
      this.style.display = 'none'
      return
    }
    this.style.display = ''

    try {
      let md = this._raw
      if (typeof md !== 'string') md = String(md)

      const markdown = await this._getMarkdown()
      const html = markdown.parse(md, {
        // Security: do not allow raw HTML blocks/spans.
        parseFlags: markdown.ParseFlags.DEFAULT | markdown.ParseFlags.NO_HTML,
        allowJSURIs: false,
      })
      this.innerHTML = html
    } catch (e) {
      soci?.log?.('Error: Malformed markdown', e, 'error')
      this.innerHTML = "<error style='color: var(--text-danger);'>Error: Malformed content</error>"
    }
  }

  set value(val) {
    this.render(val)
  }

  get value() {
    return this._raw || ''
  }
}


