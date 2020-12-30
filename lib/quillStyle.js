let style = `
  /*!
  * Quill Editor v1.3.6
  * https://quilljs.com/
  * Copyright (c) 2014, Jason Chen
  * Copyright (c) 2013, salesforce.com
  */
  .ql-editor p,
  .ql-editor ol,
  .ql-editor ul,
  .ql-editor pre,
  .ql-editor blockquote,
  .ql-editor h1,
  .ql-editor h2,
  .ql-editor h3 {
    margin: 0;
    padding: 0;
  }
  .ql-editor ol {
    padding-left: 0;
  }
  .ql-editor ol:not(:first-child) {
    margin-top: 4px;
  }
  .ql-editor ol > li {
    list-style-type: none;
  }
  .ql-editor li::before {
    display: inline-block;
    white-space: nowrap;
    width: 1.2em;
  }
  .ql-editor li::before {
    margin-left: -1.5em;
    margin-right: 0.3em;
    text-align: right;
  }
  .ql-editor ol li {
    padding-left: 1.5em;
  }
  .ql-editor ol li {
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    counter-increment: list-0;
  }
  .ql-editor ol li[data-list="bullet"]:before {
    content: '•';
  }
  .ql-editor ol li[data-list="bullet"].ql-indent-1:before {
    content: '◦';
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
  .ql-editor .ql-indent-1 {
    padding-left: 3em;
  }
  .ql-editor .ql-indent-2 {
    padding-left: 4.5em;
  }
  .ql-editor .ql-indent-3 {
    padding-left: 6em;
  }
  .ql-editor .ql-indent-4 {
    padding-left: 7.5em;
  }
  .ql-editor .ql-indent-5 {
    padding-left: 9em;
  }
  .ql-editor .ql-indent-6 {
    padding-left: 10.5em;
  }
  .ql-editor .ql-indent-7 {
    padding-left: 12em;
  }
  .ql-editor .ql-indent-8 {
    padding-left: 13.5em;
  }
  .ql-editor .ql-indent-9 {
    padding-left: 15em;
  }
  .ql-editor.ql-blank::before {
    color: var(--base-text-subtle);
    content: attr(data-placeholder);
    font-style: italic;
    left: 15px;
    pointer-events: none;
    position: absolute;
    right: 15px;
  }
`

export default style

let tag = document.createElement('style')
tag.innerHTML = style.replace(/\.ql-editor/g, 'soci-comment')
document.head.appendChild(tag)