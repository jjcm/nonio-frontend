import SociComponent from './soci-component.js'
import quillStyle from '../lib/quillStyle.js'

export default class SociInput extends SociComponent {
  static get formAssociated() {
    return true
  }

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  css(){

    let css = `
      :host {
        --min-height: 0;
        --padding: 12px 16px;
        min-height: var(--min-height);
        position: relative;
        display: flex;
        transition: padding 0.1s ease-out, border-color 0.5s ease;
        padding-bottom: 0px;
        box-sizing: border-box;
      }
      :host([subtle]){
        --padding: 0px;
        border-color: transparent !important;
      }

      #editor {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      :host([readonly]) .ql-editor {
        padding: 0;
      }
      .ql-container {
        box-sizing: border-box;
        margin: 0px;
        position: relative;
      }
      .ql-container.ql-disabled .ql-tooltip {
        visibility: hidden;
      }
      .ql-container.ql-disabled .ql-editor ul[data-checked] > li::before {
        pointer-events: none;
      }
      .ql-clipboard {
        left: -100000px;
        height: 1px;
        overflow-y: hidden;
        position: absolute;
        top: 50%;
      }
      .ql-clipboard p {
        margin: 0;
        padding: 0;
      }
      .ql-editor {
        box-sizing: border-box;
        line-height: 1.42;
        min-height: var(--min-height);
        transition: min-height 0.1s ease-out, padding 0.1s var(--soci-ease);
        outline: none;
        overflow-y: auto;
        padding: var(--padding);
        tab-size: 4;
        -moz-tab-size: 4;
        text-align: left;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      .ql-editor > * {
        cursor: text;
      }
      .ql-editor p,
      .ql-editor ol,
      .ql-editor ul,
      .ql-editor pre,
      .ql-editor blockquote,
      .ql-editor h1,
      .ql-editor h2,
      .ql-editor h3,
      .ql-editor h4,
      .ql-editor h5,
      .ql-editor h6 {
        margin: 0;
        padding: 0;
        counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
      }
      .ql-editor ol,
      .ql-editor ul {
        padding-left: 1.5em;
      }
      .ql-editor ol > li,
      .ql-editor ul > li {
        list-style-type: none;
      }
      .ql-editor ul > li::before {
        content: '*';
      }
      .ql-editor ul[data-checked=true],
      .ql-editor ul[data-checked=false] {
        pointer-events: none;
      }
      .ql-editor ul[data-checked=true] > li *,
      .ql-editor ul[data-checked=false] > li * {
        pointer-events: all;
      }
      .ql-editor ul[data-checked=true] > li::before,
      .ql-editor ul[data-checked=false] > li::before {
        color: var(--base-text-subtle);
        cursor: pointer;
        pointer-events: all;
      }
      .ql-editor li::before {
        display: inline-block;
        white-space: nowrap;
        width: 1.2em;
      }
      .ql-editor li:not(.ql-direction-rtl)::before {
        margin-left: -1.5em;
        margin-right: 0.3em;
        text-align: right;
      }
      .ql-editor li.ql-direction-rtl::before {
        margin-left: 0.3em;
        margin-right: -1.5em;
      }
      .ql-editor ol li:not(.ql-direction-rtl),
      .ql-editor ul li:not(.ql-direction-rtl) {
        padding-left: 1.5em;
      }
      .ql-editor ol li.ql-direction-rtl,
      .ql-editor ul li.ql-direction-rtl {
        padding-right: 1.5em;
      }
      .ql-editor ol li {
        counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
        counter-increment: list-0;
      }
      .ql-editor ol li:before {
        content: counter(list-0, decimal) '. ';
      }
      .ql-editor ol li.ql-indent-1 {
        counter-increment: list-1;
      }
      .ql-editor ol li.ql-indent-1:before {
        content: counter(list-1, lower-alpha) '. ';
      }
      .ql-editor ol li.ql-indent-1 {
        counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
      }
      .ql-editor ol li.ql-indent-2 {
        counter-increment: list-2;
      }
      .ql-editor ol li.ql-indent-2:before {
        content: counter(list-2, lower-roman) '. ';
      }
      .ql-editor ol li.ql-indent-2 {
        counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
      }
      .ql-editor ol li.ql-indent-3 {
        counter-increment: list-3;
      }
      .ql-editor ol li.ql-indent-3:before {
        content: counter(list-3, decimal) '. ';
      }
      .ql-editor ol li.ql-indent-3 {
        counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
      }
      .ql-editor ol li.ql-indent-4 {
        counter-increment: list-4;
      }
      .ql-editor ol li.ql-indent-4:before {
        content: counter(list-4, lower-alpha) '. ';
      }
      .ql-editor ol li.ql-indent-4 {
        counter-reset: list-5 list-6 list-7 list-8 list-9;
      }
      .ql-editor ol li.ql-indent-5 {
        counter-increment: list-5;
      }
      .ql-editor ol li.ql-indent-5:before {
        content: counter(list-5, lower-roman) '. ';
      }
      .ql-editor ol li.ql-indent-5 {
        counter-reset: list-6 list-7 list-8 list-9;
      }
      .ql-editor ol li.ql-indent-6 {
        counter-increment: list-6;
      }
      .ql-editor ol li.ql-indent-6:before {
        content: counter(list-6, decimal) '. ';
      }
      .ql-editor ol li.ql-indent-6 {
        counter-reset: list-7 list-8 list-9;
      }
      .ql-editor ol li.ql-indent-7 {
        counter-increment: list-7;
      }
      .ql-editor ol li.ql-indent-7:before {
        content: counter(list-7, lower-alpha) '. ';
      }
      .ql-editor ol li.ql-indent-7 {
        counter-reset: list-8 list-9;
      }
      .ql-editor ol li.ql-indent-8 {
        counter-increment: list-8;
      }
      .ql-editor ol li.ql-indent-8:before {
        content: counter(list-8, lower-roman) '. ';
      }
      .ql-editor ol li.ql-indent-8 {
        counter-reset: list-9;
      }
      .ql-editor ol li.ql-indent-9 {
        counter-increment: list-9;
      }
      .ql-editor ol li.ql-indent-9:before {
        content: counter(list-9, decimal) '. ';
      }
      .ql-editor .ql-indent-1:not(.ql-direction-rtl) {
        padding-left: 3em;
      }
      .ql-editor li.ql-indent-1:not(.ql-direction-rtl) {
        padding-left: 4.5em;
      }
      .ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {
        padding-right: 3em;
      }
      .ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {
        padding-right: 4.5em;
      }
      .ql-editor .ql-indent-2:not(.ql-direction-rtl) {
        padding-left: 6em;
      }
      .ql-editor li.ql-indent-2:not(.ql-direction-rtl) {
        padding-left: 7.5em;
      }
      .ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {
        padding-right: 6em;
      }
      .ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {
        padding-right: 7.5em;
      }
      .ql-editor .ql-indent-3:not(.ql-direction-rtl) {
        padding-left: 9em;
      }
      .ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
        padding-left: 10.5em;
      }
      .ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {
        padding-right: 9em;
      }
      .ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {
        padding-right: 10.5em;
      }
      .ql-editor .ql-indent-4:not(.ql-direction-rtl) {
        padding-left: 12em;
      }
      .ql-editor li.ql-indent-4:not(.ql-direction-rtl) {
        padding-left: 13.5em;
      }
      .ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {
        padding-right: 12em;
      }
      .ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {
        padding-right: 13.5em;
      }
      .ql-editor .ql-indent-5:not(.ql-direction-rtl) {
        padding-left: 15em;
      }
      .ql-editor li.ql-indent-5:not(.ql-direction-rtl) {
        padding-left: 16.5em;
      }
      .ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {
        padding-right: 15em;
      }
      .ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {
        padding-right: 16.5em;
      }
      .ql-editor .ql-indent-6:not(.ql-direction-rtl) {
        padding-left: 18em;
      }
      .ql-editor li.ql-indent-6:not(.ql-direction-rtl) {
        padding-left: 19.5em;
      }
      .ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {
        padding-right: 18em;
      }
      .ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {
        padding-right: 19.5em;
      }
      .ql-editor .ql-indent-7:not(.ql-direction-rtl) {
        padding-left: 21em;
      }
      .ql-editor li.ql-indent-7:not(.ql-direction-rtl) {
        padding-left: 22.5em;
      }
      .ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {
        padding-right: 21em;
      }
      .ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {
        padding-right: 22.5em;
      }
      .ql-editor .ql-indent-8:not(.ql-direction-rtl) {
        padding-left: 24em;
      }
      .ql-editor li.ql-indent-8:not(.ql-direction-rtl) {
        padding-left: 25.5em;
      }
      .ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {
        padding-right: 24em;
      }
      .ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {
        padding-right: 25.5em;
      }
      .ql-editor .ql-indent-9:not(.ql-direction-rtl) {
        padding-left: 27em;
      }
      .ql-editor li.ql-indent-9:not(.ql-direction-rtl) {
        padding-left: 28.5em;
      }
      .ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {
        padding-right: 27em;
      }
      .ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {
        padding-right: 28.5em;
      }
      .ql-editor .ql-video {
        display: block;
        max-width: 100%;
      }
      .ql-editor .ql-video.ql-align-center {
        margin: 0 auto;
      }
      .ql-editor .ql-video.ql-align-right {
        margin: 0 0 0 auto;
      }
      .ql-editor .ql-font-serif {
        font-family: Georgia, Times New Roman, serif;
      }
      .ql-editor .ql-font-monospace {
        font-family: Monaco, Courier New, monospace;
      }
      .ql-editor .ql-size-small {
        font-size: 0.75em;
      }
      .ql-editor .ql-size-large {
        font-size: 1.5em;
      }
      .ql-editor .ql-size-huge {
        font-size: 2.5em;
      }
      .ql-editor .ql-direction-rtl {
        direction: rtl;
        text-align: inherit;
      }
      .ql-editor .ql-align-center {
        text-align: center;
      }
      .ql-editor .ql-align-justify {
        text-align: justify;
      }
      .ql-editor .ql-align-right {
        text-align: right;
      }
      .ql-editor.ql-blank::before {
        color: rgba(0,0,0,0.6);
        content: attr(data-placeholder);
        font-style: italic;
        left: 15px;
        pointer-events: none;
        position: absolute;
        right: 15px;
      }
      .ql-bubble .ql-toolbar:after {
        clear: both;
        content: '';
        display: table;
      }
      .ql-bubble .ql-toolbar button {
        background: none;
        border: none;
        cursor: pointer;
        display: inline-block;
        float: left;
        height: 24px;
        padding: 3px 5px;
        width: 28px;
      }
      .ql-bubble .ql-toolbar button svg {
        float: left;
        height: 100%;
      }
      .ql-bubble .ql-toolbar button:active:hover {
        outline: none;
      }
      .ql-bubble .ql-toolbar input.ql-image[type=file] {
        display: none;
      }
      .ql-bubble .ql-toolbar button:hover,
      .ql-bubble .ql-toolbar button:focus,
      .ql-bubble .ql-toolbar button.ql-active {
        color: var(--base-text-subtle-hover);
      }

      .ql-bubble .ql-toolbar button:hover .ql-fill,
      .ql-bubble .ql-toolbar button:focus .ql-fill,
      .ql-bubble .ql-toolbar button:hover .ql-stroke.ql-fill,
      .ql-bubble .ql-toolbar button:focus .ql-stroke.ql-fill,
      .ql-bubble .ql-toolbar button.ql-active .ql-stroke.ql-fill {
        fill: var(--base-text-subtle-hover);
      }
      .ql-bubble .ql-toolbar button:hover .ql-stroke,
      .ql-bubble .ql-toolbar button:focus .ql-stroke,
      .ql-bubble .ql-toolbar button:hover .ql-stroke-miter,
      .ql-bubble .ql-toolbar button:focus .ql-stroke-miter,
      .ql-bubble .ql-toolbar button.ql-active .ql-stroke-miter {
        stroke: var(--base-text-subtle-hover);
      }
      .ql-bubble .ql-toolbar button.ql-active .ql-stroke {
        stroke: var(--brand-text);
      }
      .ql-bubble .ql-toolbar button.ql-active:hover .ql-stroke {
        stroke: var(--brand-text-hover);
      }
      .ql-bubble .ql-toolbar button.ql-active .ql-fill {
        fill: var(--brand-text);
      }
      .ql-bubble .ql-toolbar button.ql-active:hover .ql-fill {
        fill: var(--brand-text-hover);
      }
      .ql-bubble .ql-toolbar button.ql-active {
        color: var(--brand-text);
      }
      .ql-bubble .ql-toolbar button.ql-active:hover {
        color: var(--brand-text-hover);
      }
      .ql-bubble {
        box-sizing: border-box;
      }
      .ql-bubble * {
        box-sizing: border-box;
      }
      .ql-bubble .ql-hidden {
        display: none;
      }
      .ql-bubble .ql-out-bottom,
      .ql-bubble .ql-out-top {
        visibility: hidden;
      }
      .ql-bubble .ql-tooltip {
        position: absolute;
        transform: translateY(10px);
      }
      .ql-bubble .ql-tooltip a {
        cursor: pointer;
        text-decoration: none;
      }
      .ql-bubble .ql-tooltip.ql-flip {
        transform: translateY(-10px);
      }
      .ql-bubble .ql-formats {
        display: inline-block;
        vertical-align: middle;
      }
      .ql-bubble .ql-formats:after {
        clear: both;
        content: '';
        display: table;
      }
      .ql-bubble .ql-stroke {
        fill: none;
        stroke: var(--base-text-subtle);
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
      }
      .ql-bubble .ql-stroke-miter {
        fill: none;
        stroke: #ccc;
        stroke-miterlimit: 10;
        stroke-width: 2;
      }
      .ql-bubble .ql-fill,
      .ql-bubble .ql-stroke.ql-fill {
        fill: #ccc;
      }
      .ql-bubble .ql-empty {
        fill: none;
      }
      .ql-bubble .ql-even {
        fill-rule: evenodd;
      }
      .ql-bubble .ql-thin,
      .ql-bubble .ql-stroke.ql-thin {
        stroke-width: 1;
      }
      .ql-bubble .ql-transparent {
        opacity: 0.4;
      }
      .ql-bubble .ql-direction svg:last-child {
        display: none;
      }
      .ql-bubble .ql-direction.ql-active svg:last-child {
        display: inline;
      }
      .ql-bubble .ql-direction.ql-active svg:first-child {
        display: none;
      }
      .ql-bubble .ql-editor h1 {
        font-size: 2em;
      }
      .ql-bubble .ql-editor h2 {
        font-size: 1.5em;
      }
      .ql-bubble .ql-editor h3 {
        font-size: 1.17em;
      }
      .ql-bubble .ql-editor h4 {
        font-size: 1em;
      }
      .ql-bubble .ql-editor h5 {
        font-size: 0.83em;
      }
      .ql-bubble .ql-editor h6 {
        font-size: 0.67em;
      }
      .ql-bubble .ql-editor a {
        text-decoration: underline;
        color: var(--brand-text);
      }
      .ql-bubble .ql-editor blockquote {
        border-left: 4px solid #ccc;
        margin-bottom: 5px;
        margin-top: 5px;
        padding-left: 16px;
      }
      .ql-bubble .ql-editor code,
      .ql-bubble .ql-editor pre {
        background-color: var(--base-background-subtle);
        border-radius: 3px;
      }
      .ql-bubble .ql-editor pre {
        white-space: pre-wrap;
        margin-bottom: 5px;
        margin-top: 5px;
        padding: 5px 10px;
      }
      .ql-bubble .ql-editor code {
        font-size: 85%;
        padding: 2px 4px;
      }
      .ql-bubble .ql-editor pre.ql-syntax {
        background-color: #23241f;
        color: #f8f8f2;
        overflow: visible;
      }
      .ql-bubble .ql-editor img {
        max-width: 100%;
      }
      .ql-bubble .ql-toolbar .ql-formats {
        margin: 4px 8px 4px 0px;
      }
      .ql-bubble .ql-toolbar .ql-formats:first-child {
        margin-left: 8px;
      }
      .ql-bubble .ql-tooltip {
        background-color: var(--base-background-subtle);
        border-radius: 3px;
        color: var(--base-text);
        box-shadow: 0 1px 1px var(--shadow-light), 0 2px 8px var(--shadow-light);
      }
      .ql-bubble .ql-tooltip-arrow {
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        content: " ";
        display: block;
        left: 50%;
        margin-left: -6px;
        position: absolute;
      }
      .ql-bubble .ql-tooltip:not(.ql-flip) .ql-tooltip-arrow {
        border-bottom: 6px solid var(--base-background-subtle);
        top: -6px;
      }
      .ql-bubble .ql-tooltip.ql-flip .ql-tooltip-arrow {
        border-top: 6px solid var(--base-background-subtle);
        bottom: -6px;
      }
      .ql-bubble .ql-tooltip.ql-editing .ql-tooltip-editor {
        display: block;
      }
      .ql-bubble .ql-tooltip.ql-editing .ql-formats {
        visibility: hidden;
      }
      .ql-bubble .ql-tooltip-editor {
        display: none;
      }
      .ql-bubble .ql-tooltip-editor input[type=text] {
        background: transparent;
        border: none;
        color: var(--base-text);
        font-size: 13px;
        height: 100%;
        outline: none;
        padding: 10px 20px;
        position: absolute;
        width: 100%;
      }
      .ql-bubble .ql-tooltip-editor a {
        top: 10px;
        position: absolute;
        right: 20px;
      }
      .ql-bubble .ql-tooltip-editor a:before {
        color: var(--base-text-subtle);
        content: "\D7";
        font-size: 16px;
        font-weight: bold;
      }
      .ql-container.ql-bubble:not(.ql-disabled) a {
        position: relative;
        white-space: nowrap;
      }
      .ql-container.ql-bubble:not(.ql-disabled) a::before {
        background-color: var(--base-background);
        border-radius: 15px;
        top: -5px;
        font-size: 12px;
        color: var(--base-text-inverse);
        content: attr(href);
        font-weight: normal;
        overflow: hidden;
        padding: 5px 15px;
        text-decoration: none;
        z-index: 1;
      }
      .ql-container.ql-bubble:not(.ql-disabled) a::after {
        border-top: 6px solid var(--base-background);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        top: 0;
        content: " ";
        height: 0;
        width: 0;
      }
      .ql-container.ql-bubble:not(.ql-disabled) a::before,
      .ql-container.ql-bubble:not(.ql-disabled) a::after {
        left: 0;
        margin-left: 50%;
        position: absolute;
        transform: translate(-50%, -100%);
        transition: visibility 0s ease 200ms;
        visibility: hidden;
      }
      .ql-container.ql-bubble:not(.ql-disabled) a:hover::before,
      .ql-container.ql-bubble:not(.ql-disabled) a:hover::after {
        visibility: visible;
      }
      ${quillStyle}
    `
    return css
  }

  html(){
    return `
      <div id="editor"></div>
    `
  }

  connectedCallback(){
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
    this.editor = new Quill(this.select('#editor'), opts)

    this.editor.on('text-change', ()=>{
      this._internals.setFormValue(this.value)
    })
  }

  get value(){
    return JSON.stringify(this.editor.getContents())
  }

  focus() {
    this.select('.ql-editor').focus()
  }

  setSelection(val) {
    this.editor.setSelection(val)
  }

  renderOpsToHTML(val){
    if(val) this.value = val
    return this.select('.ql-editor').innerHTML
  }

  set value(val){
    this.editor.setContents(JSON.parse(val))
    this._internals.setFormValue(val)
  }

  clear(){
    this.value = '{"ops":[{"insert":"\\n"}]}'
  }
}