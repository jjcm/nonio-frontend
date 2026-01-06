/**
 * CSS Grid Lanes Layout Polyfill
 * 
 * A true polyfill for CSS Grid Level 3 "grid-lanes" layout.
 * https://drafts.csswg.org/css-grid-3/#grid-lanes-layout
 * 
 * Usage in CSS:
 *   .container {
 *     display: grid-lanes;
 *     grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
 *     gap: 12px;
 *     --grid-lanes: true; // Detection flag for polyfill
 *   }
 * 
 * When browsers support grid-lanes natively, just remove this script.
 */

const SUPPORTS_GRID_LANES = CSS.supports?.('display', 'grid-lanes') ?? false

class GridLanesPolyfill {
  constructor(container) {
    this.container = container
    this._columnHeights = []
    this._layoutFrame = null
    this._debounceTimer = null
    this._resizeObserver = null
    this._mutationObserver = null
    this._initialized = false
    
    this._init()
  }

  _init() {
    // Parse grid-template-columns to get column sizing
    this._parseGridTemplate()
    
    // Set up container for absolute positioning
    const style = this.container.style
    style.position = 'relative'
    
    // Hide children until positioned (prevents flicker)
    this._injectStyles()
    
    // Observe resize
    this._resizeObserver = new ResizeObserver(() => this._scheduleLayout())
    this._resizeObserver.observe(this.container)
    
    // Observe mutations
    this._mutationObserver = new MutationObserver(mutations => {
      const hasChanges = mutations.some(m => m.type === 'childList')
      if (hasChanges) this._scheduleLayout()
    })
    this._mutationObserver.observe(this.container, { childList: true })
    
    // Initial layout
    this._scheduleLayout()
    this._initialized = true
  }

  _injectStyles() {
    // Add styles to hide unpositioned children
    if (!this.container._gridLanesStyle) {
      const style = document.createElement('style')
      style.textContent = `
        [data-grid-lanes-container] > * {
          visibility: hidden;
        }
        [data-grid-lanes-container] > [data-grid-lanes-positioned] {
          visibility: visible;
        }
      `
      document.head.appendChild(style)
      this.container._gridLanesStyle = style
    }
    this.container.setAttribute('data-grid-lanes-container', '')
  }

  _parseGridTemplate() {
    const computed = getComputedStyle(this.container)
    const gap = computed.gap || computed.gridGap || '0px'
    this._gap = parseInt(gap) || 0
    
    // Store padding (read once on init)
    this._paddingTop = parseInt(computed.paddingTop) || 0
    this._paddingRight = parseInt(computed.paddingRight) || 0
    this._paddingBottom = parseInt(computed.paddingBottom) || 0
    this._paddingLeft = parseInt(computed.paddingLeft) || 0
    
    // Try to parse grid-template-columns for minmax values
    // Default to 300px min width if not specified or unparseable
    const template = computed.gridTemplateColumns
    const minmaxMatch = template?.match(/minmax\(\s*(\d+)px/)
    this._minColumnWidth = minmaxMatch ? parseInt(minmaxMatch[1]) : 300
  }

  _getContentWidth() {
    // clientWidth includes padding, so subtract it to get content area
    return this.container.clientWidth - this._paddingLeft - this._paddingRight
  }

  _getColumnCount() {
    const contentWidth = this._getContentWidth()
    const gap = this._gap
    const minWidth = this._minColumnWidth
    return Math.max(1, Math.floor((contentWidth + gap) / (minWidth + gap)))
  }

  _getColumnWidth(columnCount) {
    const contentWidth = this._getContentWidth()
    const gap = this._gap
    return (contentWidth - gap * (columnCount - 1)) / columnCount
  }

  _getVisibleItems() {
    return Array.from(this.container.children).filter(child => 
      child.offsetParent !== null || child.style.position === 'absolute'
    )
  }

  _getShortestColumnIndex() {
    let min = Infinity, idx = 0
    for (let i = 0; i < this._columnHeights.length; i++) {
      if (this._columnHeights[i] < min) {
        min = this._columnHeights[i]
        idx = i
      }
    }
    return idx
  }

  _scheduleLayout() {
    clearTimeout(this._debounceTimer)
    this._debounceTimer = setTimeout(() => {
      if (this._layoutFrame) return
      this._layoutFrame = requestAnimationFrame(() => {
        this._layoutFrame = null
        this._layout()
      })
    }, 16)
  }

  _layout() {
    const columnCount = this._getColumnCount()
    const columnWidth = this._getColumnWidth(columnCount)
    const gap = this._gap
    const padLeft = this._paddingLeft
    const padTop = this._paddingTop
    
    this._columnHeights = new Array(columnCount).fill(0)
    
    const items = this._getVisibleItems()
    if (!items.length) {
      this.container.style.height = `${this._paddingTop + this._paddingBottom}px`
      return
    }
    
    // Batch read: set width, measure heights
    items.forEach(item => {
      item.style.position = 'absolute'
      item.style.width = `${columnWidth}px`
      item.style.margin = '0'
    })
    
    // Force reflow, read all heights
    const heights = items.map(item => item.offsetHeight)
    
    // Batch write: position all items (offset by padding)
    items.forEach((item, i) => {
      const colIdx = this._getShortestColumnIndex()
      const x = padLeft + colIdx * (columnWidth + gap)
      const y = padTop + this._columnHeights[colIdx]
      
      item.style.left = `${x}px`
      item.style.top = `${y}px`
      item.setAttribute('data-grid-lanes-positioned', '')
      
      this._columnHeights[colIdx] += heights[i] + gap
    })
    
    const contentHeight = Math.max(...this._columnHeights, 0)
    this.container.style.height = `${this._paddingTop + contentHeight + this._paddingBottom}px`
  }

  destroy() {
    clearTimeout(this._debounceTimer)
    cancelAnimationFrame(this._layoutFrame)
    this._resizeObserver?.disconnect()
    this._mutationObserver?.disconnect()
    
    this.container.style.position = ''
    this.container.style.height = ''
    this.container.removeAttribute('data-grid-lanes-container')
    
    Array.from(this.container.children).forEach(item => {
      item.style.position = ''
      item.style.width = ''
      item.style.left = ''
      item.style.top = ''
      item.style.margin = ''
      item.removeAttribute('data-grid-lanes-positioned')
    })
  }
}

// Registry of polyfilled containers
const polyfillInstances = new WeakMap()

/**
 * Check if an element needs the grid-lanes polyfill
 */
function needsPolyfill(el) {
  if (SUPPORTS_GRID_LANES) return false
  const computed = getComputedStyle(el)
  return computed.getPropertyValue('--grid-lanes').trim() === 'true'
}

/**
 * Apply polyfill to an element (force = true skips needsPolyfill check)
 */
function polyfill(el, force = false) {
  if (SUPPORTS_GRID_LANES) return null
  if (polyfillInstances.has(el)) return polyfillInstances.get(el)
  if (!force && !needsPolyfill(el)) return null
  
  const instance = new GridLanesPolyfill(el)
  polyfillInstances.set(el, instance)
  return instance
}

/**
 * Remove polyfill from an element
 */
function unpolyfill(el) {
  const instance = polyfillInstances.get(el)
  if (instance) {
    instance.destroy()
    polyfillInstances.delete(el)
  }
}

/**
 * Trigger relayout on a polyfilled element
 */
function relayout(el) {
  polyfillInstances.get(el)?._scheduleLayout()
}

/**
 * Scan document for elements needing polyfill
 */
function scanAndPolyfill() {
  if (SUPPORTS_GRID_LANES) return
  
  document.querySelectorAll('*').forEach(el => {
    if (needsPolyfill(el) && !polyfillInstances.has(el)) {
      polyfill(el)
    }
  })
}

/**
 * Auto-initialize on load
 */
function autoInit() {
  if (SUPPORTS_GRID_LANES) return
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAndPolyfill)
  } else {
    scanAndPolyfill()
  }
}

autoInit()

// Export for manual control (useful for web components with shadow DOM)
export { polyfill, unpolyfill, relayout, needsPolyfill, SUPPORTS_GRID_LANES }
export default GridLanesPolyfill
