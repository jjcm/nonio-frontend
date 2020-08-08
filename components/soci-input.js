import SociComponent from './soci-component.js'
import quillStyle from '../lib/quillStyle.js'

export default class SociInput extends SociComponent {
  static formAssociated = true

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  css(){

    let css = `
      :host {
        position: relative;
        display: flex;
        flex-direction: column;
        transition: min-height 0.1s ease-out, padding 0.1s ease-out;
        padding-bottom: 0px;
        overflow: hidden;
        box-sizing: border-box;
      }

      soci-user {
        margin-right: 14px;
        position: absolute;
        top: 6px;
        left: 10px;
      }

      soci-icon {
        position: absolute;
        right: 8px;
        top: 8px;
        cursor: pointer;
        color: var(--n3);
      }
      :host([show-user]) .ql-toolbar.ql-snow {
        padding-left: 40px;
      }
      .ql-toolbar {
        border-bottom: 1px solid var(--n2);
        max-height: 40px;
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
        height: 100%;
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
        flex: 1;
        box-sizing: border-box;
        line-height: 1.42;
        height: 100%;
        outline: none;
        overflow-y: auto;
        padding: 12px 15px;
        tab-size: 4;
        -moz-tab-size: 4;
        text-align: left;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      .ql-snow.ql-toolbar:after,
      .ql-snow .ql-toolbar:after {
        clear: both;
        content: '';
        display: table;
      }
      .ql-snow.ql-toolbar button,
      .ql-snow .ql-toolbar button {
        background: none;
        border: none;
        cursor: pointer;
        display: inline-block;
        float: left;
        height: 24px;
        padding: 3px 5px;
        width: 28px;
      }
      .ql-snow.ql-toolbar button svg,
      .ql-snow .ql-toolbar button svg {
        float: left;
        height: 100%;
      }
      .ql-snow.ql-toolbar button:active:hover,
      .ql-snow .ql-toolbar button:active:hover {
        outline: none;
      }
      .ql-snow.ql-toolbar input.ql-image[type=file],
      .ql-snow .ql-toolbar input.ql-image[type=file] {
        display: none;
      }
      .ql-snow.ql-toolbar button:hover,
      .ql-snow .ql-toolbar button:hover,
      .ql-snow.ql-toolbar button:focus,
      .ql-snow .ql-toolbar button:focus,
      .ql-snow.ql-toolbar button.ql-active,
      .ql-snow .ql-toolbar button.ql-active,
      .ql-snow.ql-toolbar .ql-picker-label:hover,
      .ql-snow .ql-toolbar .ql-picker-label:hover,
      .ql-snow.ql-toolbar .ql-picker-label.ql-active,
      .ql-snow .ql-toolbar .ql-picker-label.ql-active,
      .ql-snow.ql-toolbar .ql-picker-item:hover,
      .ql-snow .ql-toolbar .ql-picker-item:hover,
      .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
      .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
        color: var(--b2);
      }
      .ql-snow.ql-toolbar button:hover .ql-fill,
      .ql-snow .ql-toolbar button:hover .ql-fill,
      .ql-snow.ql-toolbar button:focus .ql-fill,
      .ql-snow .ql-toolbar button:focus .ql-fill,
      .ql-snow.ql-toolbar button.ql-active .ql-fill,
      .ql-snow .ql-toolbar button.ql-active .ql-fill,
      .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
      .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
      .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
      .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
      .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
      .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
      .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
      .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
      .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,
      .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,
      .ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill,
      .ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill,
      .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,
      .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
      .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
      .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
      .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
      .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
      .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
      .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
      .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
      .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
        fill: var(--b2);
      }
      .ql-snow.ql-toolbar button:hover .ql-stroke,
      .ql-snow .ql-toolbar button:hover .ql-stroke,
      .ql-snow.ql-toolbar button:focus .ql-stroke,
      .ql-snow .ql-toolbar button:focus .ql-stroke,
      .ql-snow.ql-toolbar button.ql-active .ql-stroke,
      .ql-snow .ql-toolbar button.ql-active .ql-stroke,
      .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
      .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
      .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
      .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
      .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
      .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
      .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
      .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
      .ql-snow.ql-toolbar button:hover .ql-stroke-miter,
      .ql-snow .ql-toolbar button:hover .ql-stroke-miter,
      .ql-snow.ql-toolbar button:focus .ql-stroke-miter,
      .ql-snow .ql-toolbar button:focus .ql-stroke-miter,
      .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
      .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
      .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
      .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
      .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
      .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
      .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
      .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
      .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
      .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
        stroke: var(--b2);
      }
      .ql-snow {
        box-sizing: border-box;
      }
      .ql-snow * {
        box-sizing: border-box;
      }
      .ql-snow .ql-hidden {
        display: none;
      }
      .ql-snow .ql-out-bottom,
      .ql-snow .ql-out-top {
        visibility: hidden;
      }
      .ql-snow .ql-tooltip {
        position: absolute;
        transform: translateY(10px);
      }
      .ql-snow .ql-tooltip a {
        cursor: pointer;
        text-decoration: none;
      }
      .ql-snow .ql-tooltip.ql-flip {
        transform: translateY(-10px);
      }
      .ql-snow .ql-formats {
        display: inline-block;
        vertical-align: middle;
      }
      .ql-snow .ql-formats:after {
        clear: both;
        content: '';
        display: table;
      }
      .ql-snow .ql-stroke {
        fill: none;
        stroke: #444;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
      }
      .ql-snow .ql-stroke-miter {
        fill: none;
        stroke: #444;
        stroke-miterlimit: 10;
        stroke-width: 2;
      }
      .ql-snow .ql-fill,
      .ql-snow .ql-stroke.ql-fill {
        fill: var(--n3);
      }
      .ql-snow .ql-empty {
        fill: none;
      }
      .ql-snow .ql-even {
        fill-rule: evenodd;
      }
      .ql-snow .ql-thin,
      .ql-snow .ql-stroke.ql-thin {
        stroke-width: 1;
      }
      .ql-snow .ql-transparent {
        opacity: 0.4;
      }
      .ql-snow .ql-direction svg:last-child {
        display: none;
      }
      .ql-snow .ql-direction.ql-active svg:last-child {
        display: inline;
      }
      .ql-snow .ql-direction.ql-active svg:first-child {
        display: none;
      }
      .ql-snow .ql-editor h1 {
        font-size: 2em;
      }
      .ql-snow .ql-editor h2 {
        font-size: 1.5em;
      }
      .ql-snow .ql-editor h3 {
        font-size: 1.17em;
      }
      .ql-snow .ql-editor a {
        text-decoration: underline;
      }
      .ql-snow .ql-editor blockquote {
        border-left: 4px solid var(--n2);
        margin-bottom: 5px;
        margin-top: 5px;
        padding-left: 16px;
      }
      .ql-snow .ql-editor code,
      .ql-snow .ql-editor pre {
        background-color: var(--n1);
        border-radius: 3px;
      }
      .ql-snow .ql-editor pre {
        white-space: pre-wrap;
        margin-bottom: 5px;
        margin-top: 5px;
        padding: 5px 10px;
      }
      .ql-snow .ql-editor code {
        font-size: 85%;
        padding: 2px 4px;
      }
      .ql-snow .ql-editor pre.ql-syntax {
        background-color: #23241f;
        color: #f8f8f2;
        overflow: visible;
      }
      .ql-snow .ql-editor img {
        max-width: 100%;
      }
      .ql-snow .ql-picker {
        color: #444;
        display: inline-block;
        float: left;
        font-size: 14px;
        font-weight: 500;
        height: 24px;
        position: relative;
        vertical-align: middle;
      }
      .ql-snow .ql-picker-label {
        cursor: pointer;
        display: inline-block;
        height: 100%;
        padding-left: 8px;
        padding-right: 2px;
        position: relative;
        width: 100%;
      }
      .ql-snow .ql-picker-label::before {
        display: inline-block;
        line-height: 22px;
      }
      .ql-snow .ql-picker-options {
        background-color: #fff;
        display: none;
        min-width: 100%;
        padding: 4px 8px;
        position: absolute;
        white-space: nowrap;
      }
      .ql-snow .ql-picker-options .ql-picker-item {
        cursor: pointer;
        display: block;
        padding-bottom: 5px;
        padding-top: 5px;
      }
      .ql-snow .ql-picker.ql-expanded .ql-picker-label {
        color: var(--n2);
        z-index: 2;
      }
      .ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-fill {
        fill: var(--n2);
      }
      .ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
        stroke: var(--n2);
      }
      .ql-snow .ql-picker.ql-expanded .ql-picker-options {
        display: block;
        margin-top: -1px;
        top: 100%;
        z-index: 1;
      }
      .ql-snow .ql-color-picker,
      .ql-snow .ql-icon-picker {
        width: 28px;
      }
      .ql-snow .ql-color-picker .ql-picker-label,
      .ql-snow .ql-icon-picker .ql-picker-label {
        padding: 2px 4px;
      }
      .ql-snow .ql-color-picker .ql-picker-label svg,
      .ql-snow .ql-icon-picker .ql-picker-label svg {
        right: 4px;
      }
      .ql-snow .ql-icon-picker .ql-picker-options {
        padding: 4px 0px;
      }
      .ql-snow .ql-icon-picker .ql-picker-item {
        height: 24px;
        width: 24px;
        padding: 2px 4px;
      }
      .ql-snow .ql-color-picker .ql-picker-options {
        padding: 3px 5px;
        width: 152px;
      }
      .ql-snow .ql-color-picker .ql-picker-item {
        border: 1px solid transparent;
        float: left;
        height: 16px;
        margin: 2px;
        padding: 0px;
        width: 16px;
      }
      .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
        position: absolute;
        margin-top: -9px;
        right: 0;
        top: 50%;
        width: 18px;
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before,
      .ql-snow .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before,
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before,
      .ql-snow .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {
        content: attr(data-label);
      }
      .ql-snow .ql-picker.ql-header {
        width: 98px;
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item::before {
        content: 'Normal';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
        content: 'Heading 1';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
        content: 'Heading 2';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
        content: 'Heading 3';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
        content: 'Heading 4';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
        content: 'Heading 5';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
        content: 'Heading 6';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
        font-size: 2em;
      }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
        font-size: 1.5em;
      }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
        font-size: 1.17em;
      }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
        font-size: 1em;
      }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
        font-size: 0.83em;
      }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
        font-size: 0.67em;
      }
      .ql-snow .ql-picker.ql-font {
        width: 108px;
      }
      .ql-snow .ql-picker.ql-font .ql-picker-label::before,
      .ql-snow .ql-picker.ql-font .ql-picker-item::before {
        content: 'Sans Serif';
      }
      .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
      .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
        content: 'Serif';
      }
      .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
      .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
        content: 'Monospace';
      }
      .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
        font-family: Georgia, Times New Roman, serif;
      }
      .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
        font-family: Monaco, Courier New, monospace;
      }
      .ql-snow .ql-picker.ql-size {
        width: 98px;
      }
      .ql-snow .ql-picker.ql-size .ql-picker-label::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item::before {
        content: 'Normal';
      }
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
        content: 'Small';
      }
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
        content: 'Large';
      }
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
        content: 'Huge';
      }
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
        font-size: 10px;
      }
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
        font-size: 18px;
      }
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
        font-size: 32px;
      }
      .ql-snow .ql-color-picker.ql-background .ql-picker-item {
        background-color: #fff;
      }
      .ql-snow .ql-color-picker.ql-color .ql-picker-item {
        background-color: #000;
      }
      .ql-toolbar.ql-snow {
        box-sizing: border-box;
        font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
        padding: 4px;
      }
      .ql-toolbar.ql-snow .ql-formats {
        margin-right: 15px;
      }
      .ql-toolbar.ql-snow .ql-picker-label {
        border: 1px solid transparent;
      }
      .ql-toolbar.ql-snow .ql-picker-options {
        border: 1px solid transparent;
        box-shadow: rgba(0,0,0,0.2) 0 2px 8px;
      }
      .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {
        border-color: var(--n2);
      }
      .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
        border-color: var(--n2);
      }
      .ql-toolbar.ql-snow .ql-color-picker .ql-picker-item.ql-selected,
      .ql-toolbar.ql-snow .ql-color-picker .ql-picker-item:hover {
        border-color: #000;
      }
      .ql-toolbar.ql-snow + .ql-container.ql-snow {
        border-top: 0px;
      }
      .ql-snow .ql-tooltip {
        background-color: #fff;
        border: 1px solid var(--n2);
        box-shadow: 0px 0px 5px #ddd;
        color: #444;
        padding: 5px 12px;
        white-space: nowrap;
      }
      .ql-snow .ql-tooltip::before {
        content: "Visit URL:";
        line-height: 26px;
        margin-right: 8px;
      }
      .ql-snow .ql-tooltip input[type=text] {
        display: none;
        border: 1px solid var(--n2);
        font-size: 13px;
        height: 26px;
        margin: 0px;
        padding: 3px 5px;
        width: 170px;
      }
      .ql-snow .ql-tooltip a.ql-preview {
        display: inline-block;
        max-width: 200px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
      }
      .ql-snow .ql-tooltip a.ql-action::after {
        border-right: 1px solid var(--n2);
        content: 'Edit';
        margin-left: 16px;
        padding-right: 8px;
      }
      .ql-snow .ql-tooltip a.ql-remove::before {
        content: 'Remove';
        margin-left: 8px;
      }
      .ql-snow .ql-tooltip a {
        line-height: 26px;
      }
      .ql-snow .ql-tooltip.ql-editing a.ql-preview,
      .ql-snow .ql-tooltip.ql-editing a.ql-remove {
        display: none;
      }
      .ql-snow .ql-tooltip.ql-editing input[type=text] {
        display: inline-block;
      }
      .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
        border-right: 0px;
        content: 'Save';
        padding-right: 0px;
      }
      .ql-snow .ql-tooltip[data-mode=link]::before {
        content: "Enter link:";
      }
      .ql-snow .ql-tooltip[data-mode=formula]::before {
        content: "Enter formula:";
      }
      .ql-snow .ql-tooltip[data-mode=video]::before {
        content: "Enter video:";
      }
      .ql-snow a {
        color: #06c;
      }
      .ql-editor > * {
        cursor: text;
      }
      ${quillStyle}
    `
    return css
  }

  html(){
    let user = this.hasAttribute('show-user') ? `<soci-user self size="small" avatar-only></soci-user>` : ''
    return `
      ${user}
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
        theme: 'snow',
        readOnly: true 
      } : 
      {
        modules: { toolbar: true },
        formats: ['link', 'code', 'strike', 'underline', 'script', 'bold', 'blockquote', 'list', 'indent', 'code-block'],
        theme: 'snow',
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