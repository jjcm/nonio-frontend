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
    // markdown-wasm browser usage (UMD):
    // window["markdown"].ready.then(markdown => markdown.parse(...))
    if (window.markdown && window.markdown.ready) {
      return await window.markdown.ready
    }
    throw new Error('markdown-wasm not loaded')
  }

  _looksLikeQuillDelta(s) {
    if (!s || typeof s !== 'string') return false
    const t = s.trim()
    return t.startsWith('{') && t.includes('"ops"')
  }

  _escapeMdText(text) {
    // Minimal escaping to prevent accidental markdown control characters from
    // breaking structure when converting from delta.
    return String(text).replace(/([\\`*_{}[\]()#+\-.!>])/g, '\\$1')
  }

  _deltaToMarkdown(delta) {
    // Very small subset converter (matches what the old soci-quill-view rendered).
    // Supports: headers, lists(+indent), bold/italic/strike/link, code-block.
    let ops = delta?.ops || []
    let out = []
    let line = ''
    let inCodeBlock = false

    let flushLine = (attrs = null) => {
      const text = line
      line = ''

      const header = attrs?.header
      const list = attrs?.list
      const indent = parseInt(attrs?.indent || 0, 10) || 0
      const codeBlock = !!attrs?.['code-block']

      if (inCodeBlock && !codeBlock) {
        out.push('```')
        inCodeBlock = false
      }

      if (codeBlock) {
        if (!inCodeBlock) {
          out.push('```')
          inCodeBlock = true
        }
        out.push(text)
        return
      }

      if (header) {
        const h = Math.min(Math.max(parseInt(header, 10) || 1, 1), 6)
        out.push(`${'#'.repeat(h)} ${text}`)
        out.push('') // blank line after headers
        return
      }

      if (list) {
        const pad = '  '.repeat(indent)
        const bullet = list === 'ordered' ? '1. ' : '- '
        out.push(`${pad}${bullet}${text}`)
        return
      }

      // Paragraph / blank
      out.push(text)
      out.push('')
    }

    for (const op of ops) {
      const attrs = op?.attributes || null
      const ins = op?.insert

      if (ins === '\n') {
        flushLine(attrs)
        continue
      }

      if (typeof ins === 'object' && ins) {
        if (typeof ins.image === 'string') {
          line += `![](${ins.image})`
          continue
        }
        continue
      }

      if (typeof ins !== 'string') continue

      // Quill can include newlines inside string inserts; treat them as plain breaks.
      const parts = ins.split('\n')
      for (let i = 0; i < parts.length; i++) {
        let chunk = this._escapeMdText(parts[i])

        if (attrs) {
          if (attrs.link) chunk = `[${chunk}](${attrs.link})`
          if (attrs.code) chunk = '`' + chunk.replace(/`/g, '\\`') + '`'
          if (attrs.strike) chunk = '~~' + chunk + '~~'
          if (attrs.italic) chunk = '*' + chunk + '*'
          if (attrs.bold) chunk = '**' + chunk + '**'
          // underline has no CommonMark syntax; skip (old view rendered it as <u>)
        }

        line += chunk
        if (i < parts.length - 1) flushLine(null)
      }
    }

    if (inCodeBlock) {
      out.push('```')
      inCodeBlock = false
    }

    return out.join('\n').trim() + '\n'
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

      if (this._looksLikeQuillDelta(md)) {
        try {
          md = this._deltaToMarkdown(JSON.parse(md))
        } catch (_) {
          // fall through and attempt to render as-is
        }
      }

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


