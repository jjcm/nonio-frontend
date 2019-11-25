import SociComponent from './soci-component.js'

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
        border-radius: 8px;
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        max-height: 160px;
        transition: all 0.3s;
        opacity: 1;
      }
      #top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      #time {
        font-size: 12px;
        color: var(--n3);
        letter-spacing: -0.16px;
        text-align: right;
        line-height: 16px;
      }
      #mid {
        display: flex;
        font-size: 14px;
        text-decoration: none;
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
      img {
        display: none;
        width: 96px;
        min-width: 96px;
        height: 72px;
        min-height: 72px;
        border-radius: 3px;
        object-fit: cover;
        margin-right: 8px;
      }
      img[src] {
        display: block;
      }
      #bot {
        display: flex;
        line-height: 20px;
        align-items: center;
        position: relative;
        padding-right: 100px;
      }
      #tags {
        margin-left: 8px;
        overflow: hidden;
        overflow-x: auto;
        height: 20px;
        line-height: 16px;
        border-radius: 10px;
        scrollbar-width: none;
      }
      #tags::-webkit-scrollbar {
        display: none;
      }
      #score {
        white-space: nowrap;
        display: block;
      }
      #score span {
        margin-left: 4px;
      }
      #add-tag {
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
        margin-left: 4px;
        cursor: pointer;
      }
      #add-tag:hover {
        background: var(--n2);
      }
      #comments {
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
      :host([score="0"]) #score {
        color: var(--n2);
      }
    `
  }

  html(){ return `
    <div id="top">
      <slot name="user"></slot>
      <div id="time"></div>
    </div>
    <a id="mid" @click=localLink>
      <img id="thumbnail"></img>
      <div id="title"></div>
    </a>
    <div id="bot">
      <div id="score"></div>
      <div id="tags"><slot name="tags"></slot></div>
      <div id="add-tag">
        <svg width="16px" height="17px" viewBox="0 0 24 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="icon/tags" transform="translate(-4.000000, -5.000000)">
                <g>
                    <path d="M11.557416,6.29956503 C11.1595912,6.29956503 10.7780604,6.45760029 10.4967558,6.73890486 L6.49675579,10.7389049 C5.91096935,11.3246913 5.91096935,12.2744388 6.49675579,12.8602252 L10.4967558,16.8602252 C10.7780604,17.1415298 11.1595912,17.299565 11.557416,17.299565 L21.2959045,17.299565 C22.1243317,17.299565 22.7959045,16.6279922 22.7959045,15.799565 L22.7959045,7.79956503 C22.7959045,6.9711379 22.1243317,6.29956503 21.2959045,6.29956503 L11.557416,6.29956503 Z" id="Rectangle" stroke="#7B9089" transform="translate(14.012447, 11.799565) rotate(135.000000) translate(-14.012447, -11.799565) "></path>
                    <path d="M15.9239992,8.86037916 L17.5218753,11.416981 C17.6682305,11.6511493 17.5970439,11.9596245 17.3628756,12.1059797 C17.2834098,12.1556458 17.191586,12.1819805 17.0978762,12.1819805 L13.9021238,12.1819805 C13.6259814,12.1819805 13.4021238,11.9581229 13.4021238,11.6819805 C13.4021238,11.5882707 13.4284585,11.4964468 13.4781247,11.416981 L15.0760008,8.86037916 C15.222356,8.62621089 15.5308312,8.55502431 15.7649995,8.70137948 C15.829384,8.74161983 15.8837588,8.79599459 15.9239992,8.86037916 Z" id="Triangle" stroke="#7B9089" transform="translate(15.500000, 10.181981) rotate(45.000000) translate(-15.500000, -10.181981) "></path>
                    <rect id="Rectangle" fill="#7B9089" x="23" y="13" width="5" height="1" rx="0.5"></rect>
                    <rect id="Rectangle" fill="#7B9089" transform="translate(25.500000, 13.500000) rotate(-270.000000) translate(-25.500000, -13.500000) " x="23" y="13" width="5" height="1" rx="0.5"></rect>
                </g>
            </g>
        </g>
        </svg>
      </div>
      <div id="comments"></div>
    </div>
  `}

  connectedCallback(){
    this.addEventListener('vote', this._tagVoted)
  }

  static get observedAttributes() {
    return ['title', 'score', 'time', 'thumbnail', 'type', 'comments', 'url']
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
        this.select('#score').innerHTML = `▲ ${newValue} <span>→</span>`
        break;
      case 'comments':
        this.select('#comments').innerHTML = newValue + (newValue == 1 ? ' comment' : ' comments')
        break;
      case 'url':
        this.select('#mid').href = newValue
        break;

    }
  }

  _updateTime() {
    function setTimeAgo(time, interval, unit){
      setTimeout(this._updateTime, Math.min(interval * 1000, 2147483647))
      this.select('#time').innerHTML = Math.floor(time / interval) + unit + ' ago'
    }
    setTimeAgo = setTimeAgo.bind(this)
    let time = this.getAttribute('time')
    time = Math.floor((Date.now() - parseInt(time)) / 1000)
    if(time < 60) setTimeAgo(time, 1, 's')
    else if(time < 3600) setTimeAgo(time, 60, 'min')
    else if(time < 86400) setTimeAgo(time, 3600, 'h')
    else if(time < 604800) setTimeAgo(time, 86400, ' days')
    else if(time < 2629746) setTimeAgo(time, 604800, ' weeks')
    else if(time < 31556952) setTimeAgo(time, 2629746, ' months')
    else setTimeAgo(time, 31556952, 'y')
  }

  get score(){
    let score = this.getAttribute('score') || 0
    return parseInt(score)
  }

  set score(val){
    this.setAttribute('score', val)
  }

  _tagVoted(e){
    let tag = e.target.closest('soci-tag')
    if(tag.hasAttribute('upvoted')){
      if(this.querySelectorAll('soci-tag[upvoted]').length == 1){
        this.score++
      }
    }
    else {
      if(this.querySelectorAll('soci-tag[upvoted]').length == 0){
        this.score--
      }
    }
  }

}
