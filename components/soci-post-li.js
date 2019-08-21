import {SociComponent, html} from './soci-component.js'

export default class SociPostLi extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        background: var(--n0);
        margin-bottom: 8px;
        display: block;
        padding: 12px;
      }
      :host #top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      :host #time {
        font-size: 12px;
        color: var(--n3);
        letter-spacing: -0.16px;
        text-align: right;
        line-height: 16px;
      }
      :host #mid {
        display: flex;
        font-size: 14px;
        color: var(--n4);
        letter-spacing: -0.08px;
        line-height: 18px;
        width: 100%;
        max-height: 72px;
        overflow: hidden;
        font-weight: 600;
        margin-bottom: 8px;
        cursor: pointer;
      }
      :host img {
        display: none;
        width: 96px;
        min-width: 96px;
        height: 72px;
        min-height: 72px;
        border-radius: 3px;
        object-fit: cover;
        margin-right: 8px;
      }
      :host img[src] {
        display: block;
      }
      :host #bot {
        display: flex;
        line-height: 20px;
        align-items: center;
        position: relative;
        padding-right: 100px;
      }
      :host #tags {
        margin-left: 8px;
        overflow: hidden;
        overflow-x: auto;
        height: 20px;
        line-height: 16px;
        border-radius: 10px;
      }
      :host #score {
        white-space: nowrap;
        display: block;
        margin-right: 8px;
      }
      :host #add-tag {
        background: var(--n1);
        height: 20px;
        width: 32px;
        min-width: 32px;
        border-radius: 10px;
        text-align: center;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--n4);
        margin-left: 8px;
        cursor: pointer;
      }
      :host #add-tag:hover {
        background: var(--n2);
      }
      :host #comments {
        font-size: 12px;
        color: var(--n3);
        letter-spacing: -0.16px;
        text-align: right;
        line-height: 16px;
        white-space: nowrap;
        margin-left: 24px;
        position: absolute;
        bottom: 2px;
        right: 0px;
      }
    `
  }

  static get observedAttributes() {
    return ['title', 'score', 'time', 'thumbnail', 'type', 'comments']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'title':
        this.select('#title').innerHTML = newValue
        break
      case 'type':
        if(newValue.match(/video|image/)) this.select('#thumbnail').src = 'example-data/cat.jpg'
        break
      case 'time':
        this._updateTime = this._updateTime.bind(this)
        this._updateTime()
        break
      case 'score':
        this.select('#score').innerHTML = '▲ ' + newValue
        break;
      case 'comments':
        this.select('#comments').innerHTML = newValue + (newValue == 1 ? ' comment' : ' comments')
        break;

    }
  }

  _openPost() {
    let url = this.getAttribute('url')
    console.log(`Post opened. Url: ${url}`)
  }

  _updateTime() {
    function setTimeAgo(time, interval, unit){
      setTimeout(this._updateTime, interval * 1000)
      this.select('#time').innerHTML = Math.floor(time / interval) + unit + ' ago'
    }
    setTimeAgo = setTimeAgo.bind(this)
    let time = this.getAttribute('time')
    time = Math.floor((Date.now() - parseInt(time)) / 1000)
    if(time < 60) setTimeAgo(time, 1, 's')
    else if(time < 3600) setTimeAgo(time, 60, 'm')
    else if(time < 86400) setTimeAgo(time, 3600, 'h')
    else if(time < 604800) setTimeAgo(time, 86400, 'd')
    else if(time < 2629746) setTimeAgo(time, 604800, 'w')
    else if(time < 31556952) setTimeAgo(time, 2629746, 'm')
    else setTimeAgo(time, 31556952, 'y')
  }


  render(){
    return html`
      ${this.getCss()}
      <div id="top">
        <slot name="user"></slot>
        <div id="time"></div>
      </div>
      <div id="mid" @click=${this._openPost}>
        <img id="thumbnail"></img>
        <div id="title"></div>
      </div>
      <div id="bot">
        <div id="score"></div>
        →
        <div id="tags"><slot name="tags"></slot></div>
        <div id="add-tag">+</div>
        <div id="comments"></div>
      </div>
    `
  }
}
