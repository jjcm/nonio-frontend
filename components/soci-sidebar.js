import SociComponent from './soci-component.js'

export default class SociSidebar extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        box-shadow: 2px 0 0 0 rgba(0,0,0,0.08);
        width: 280px;
        min-width: 280px;
        display: block;
        height: 100vh;
        overflow: auto;
        overflow-x: hidden;
        position: relative;
        z-index: 1000;
        padding-bottom: 90px;
        box-sizing: border-box;
      }

      :host([noauth]) noauth {
        left: 0;
      }

      :host([noauth]) auth {
        left: 280px;
      }

      :host([create]) create {
        left: 0;
      }

      :host([create]) auth,
      :host([create]) noauth {
        left: 280px;
      }

      :host([dragging]) {
        user-select: none;
      }

      auth input::placeholder, h2 {
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: normal;
        color: var(--n3);
      }

      auth input {
        margin-bottom: 0;
        border-bottom: 0 !important;
        padding-left: 54px;
      }

      h2 {
        line-height: 40px;
        margin: 12px 0 4px 0;
      }

      h2:first-child {
        margin-top: 0;
      }

      section {
        border-bottom: 2px solid var(--n1);
        position: relative;
      }

      section:last-child {
        border-bottom: none;
      }

      soci-icon {
        position: absolute;
        left: 20px;
        top: 7px;
      }

      #search soci-icon{
        top: 6px;
      }

      #user {
        position: sticky;
        top: 0;
        background: #fff;
        z-index: 10;
        height: 64px;
      }

      #user soci-link:first-child {
        display: flex;
        align-items: center;
        padding-left: 20px;
        width: 100%;
        height: 100%;
        margin: 0;
      }

      #user soci-icon {
        color: var(--n3);
        right: 12px;
        top: 16px;
        left: auto;
        width: 32px;
        height: 32px;
        --hover-color: transparent;
        cursor: pointer;
      }
      #user soci-icon:hover {
        --hover-color: var(--n1);
        color: var(--n4);
      }
      #user soci-icon:active {
        --hover-color: var(--n2);
      }

      a {
        display: block;
        text-decoration: none;
        color: var(--n4);
        line-height: 32px;
        padding-left: 22px;
        cursor: pointer;
        box-sizing: border-box;
      }

      a:hover {
        background: var(--n1);
      }

      a:last-child {
        margin-bottom: 20px;
      }

      tags a {
        padding-left: 54px;
        position: relative;
      }

      tags a:hover {
        background: var(--n1);
      }

      tags svg {
        position: absolute;
        left: 20px;
      }
      
      #comments {
        border-bottom: 0;
      }

      #footer {
        font-size: 12px;
        padding: 18px 22px;
        line-height: 24px;
        position: fixed;
        bottom: 0;
        box-sizing: border-box;
        width: 280px;
        color: var(--n3);
        background: #fff;
      }

      #footer links {
        justify-content: flex-start;
        display: flex;
        font-size: 14px;
      }

      #footer soci-link {
        margin-right: 28px;
      }

      #footer svg {
        margin-bottom: 12px;
      }

      auth,
      noauth,
      create {
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        width: 280px;
        box-sizing: border-box;
        transition: left 0.2s ease-in-out;
      }

      create,
      noauth {
        padding: 24px 22px 0;
        left: -280px;
      }

      noauth svg {
        margin-bottom: 24px;
      }

      noauth h2 {
        padding-left: 0;
      }

      noauth div {
        text-align: center;
        color: var(--n3);
        margin: 20px 0;
      }

      button {
        border-radius: 16px;
        height: 32px;
        outline: 0;
        border: 0;
        width: 100%;
        text-align: center;
        font-weight: 600;
        border: 1px solid var(--n2);
        background: #fff;
        cursor: pointer;
        position: relative;
        margin: 0 0 8px;
      }

      button svg {
        position: absolute;
        width: 24px;
        left: 6px;
        top: 3px;
      }

      button:hover {
        background: var(--n1);
      }

      #facebook {
        border: 0;
        background: var(--b3);
        color: #fff;
      }

      #facebook:hover {
        opacity: 0.94;
      }

      noauth soci-link {
        display: block;
        margin-top: 24px;
        font-size: 13px;
        color: var(--b2);
        text-decoration: underline;
        cursor: pointer;
        text-align: center;
      }

      auth h2 {
        padding-left: 54px;
      }

      create h2:not(:first-child) {
        margin-top: 50px;
      }

      input {
        margin: 0 0 8px;
        padding: 0 10px;
        border: 0;
        border-bottom: 2px solid var(--n2);
        height: 38px;
        font-size: 14px;
        width: 100%;
      }

      input:focus {
        outline: 0;
        border-bottom: 2px solid var(--b1);
      }

      input[type="email"] {
        margin-bottom: 24px;
      }

      slider {
        position: relative;
        display: block;
        margin-top: 8px;
      }

      slider-track {
        height: 4px;
        width: 100%;
        background: var(--b1);
        display: block;
        opacity: 0.4;
        position: relative;
      }

      slider-track::before {
        content: '';
        width: 40px;
        height: 4px;
        background: var(--n3);
        border-right: 2px solid #fff;
        display: block;
      }

      slider-handle {
        width: 16px;
        height: 16px;
        background: var(--b2);
        display: block;
        position: absolute;
        top: -6px;
        left: 110px;
        border-radius: 8px;
      }
    `
  }

  html(){
    return `
      <auth>
        <section id="user">
          <soci-link href="user">
            <soci-user size="large" name="pwnies"></soci-user>
          </soci-link>
          <soci-link href="submit">
            <soci-icon glyph="create"></soci-icon>
          </soci-link>
        </section>
        <section id="search">
          <input placeholder="search"></input>
          <soci-icon glyph="search"></soci-icon>
        </section>
        <section id="home">
          <soci-icon glyph="home"></soci-icon>
          <h2>Home</h2>

          <a href="#">Trending</a>
          <a href="#">New</a>
          <a href="#">Top</a>
        </section>
        <section id="tags" @click=_tagClick>
          <soci-icon glyph="tags"></soci-icon>
          <h2>Tags</h2>
          <tags></tags>
        </section>
        <section id="comments">
          <soci-icon glyph="comments"></soci-icon>
          <h2>Comments</h2>

          <a href="#">Trending</a>
          <a href="#">New</a>
          <a href="#">Top</a>
        </section>
      </auth>
      <noauth>
        <h2>Login to your account</h2>
        <slot name="login">
        </slot>
        <!--
        <div>OR</div>
        <button id="google">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#4285f4" d="M386 400c45-42 65-112 53-179H260v74h102c-4 24-18 44-38 57z"/><path fill="#34a853" d="M90 341a192 192 0 0 0 296 59l-62-48c-53 35-141 22-171-60z"/><path fill="#fbbc02" d="M153 292c-8-25-8-48 0-73l-63-49c-23 46-30 111 0 171z"/><path fill="#ea4335" d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55z"/></svg>
          Login with Google
        </button>
        <button id="facebook">
          Login with Facebook
          <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 0 512 512"><path d="M355.6 330l11.4-74h-71v-48c0-20.2 9.9-40 41.7-40H370v-63s-29.3-5-57.3-5c-58.5 0-96.7 35.4-96.7 99.6V256h-65v74h65v182h80V330h59.6z" fill="#fff"/></svg>
        </button>
        -->
        <soci-link href="/user/create" @click=_createAccount>Create account</soci-link>
      </noauth>
      <create>
        <h2>Essentials</h2>
        <input placeholder="Username"/>
        <input type="email" placeholder="Email address"/>
        <input type="password" placeholder="Password"/>
        <input type="password" placeholder="Confirm Password"/>
        <h2>Contribution</h2>
        <slider>
          <slider-track></slider-track>
          <slider-handle @mousedown=_mouseDown></slider-handle>
        </slider>
      </create>
      <section id="footer">
        <svg width="94" height="16" viewBox="0 0 94 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.4" d="M13.5 0.999999V15H10.84L3.86 6.5V15H0.66V0.999999H3.34L10.3 9.5V0.999999H13.5ZM29.2564 15.24C27.8031 15.24 26.4897 14.9267 25.3164 14.3C24.1564 13.6733 23.2431 12.8133 22.5764 11.72C21.9231 10.6133 21.5964 9.37333 21.5964 8C21.5964 6.62667 21.9231 5.39333 22.5764 4.3C23.2431 3.19333 24.1564 2.32667 25.3164 1.7C26.4897 1.07333 27.8031 0.76 29.2564 0.76C30.7097 0.76 32.0164 1.07333 33.1764 1.7C34.3364 2.32667 35.2497 3.19333 35.9164 4.3C36.5831 5.39333 36.9164 6.62667 36.9164 8C36.9164 9.37333 36.5831 10.6133 35.9164 11.72C35.2497 12.8133 34.3364 13.6733 33.1764 14.3C32.0164 14.9267 30.7097 15.24 29.2564 15.24ZM29.2564 12.48C30.0831 12.48 30.8297 12.2933 31.4964 11.92C32.1631 11.5333 32.6831 11 33.0564 10.32C33.4431 9.64 33.6364 8.86667 33.6364 8C33.6364 7.13333 33.4431 6.36 33.0564 5.68C32.6831 5 32.1631 4.47333 31.4964 4.1C30.8297 3.71333 30.0831 3.52 29.2564 3.52C28.4297 3.52 27.6831 3.71333 27.0164 4.1C26.3497 4.47333 25.8231 5 25.4364 5.68C25.0631 6.36 24.8764 7.13333 24.8764 8C24.8764 8.86667 25.0631 9.64 25.4364 10.32C25.8231 11 26.3497 11.5333 27.0164 11.92C27.6831 12.2933 28.4297 12.48 29.2564 12.48ZM57.8555 0.999999V15H55.1955L48.2155 6.5V15H45.0155V0.999999H47.6955L54.6555 9.5V0.999999H57.8555ZM66.8319 0.999999H70.0719V15H66.8319V0.999999ZM85.8384 15.24C84.3851 15.24 83.0718 14.9267 81.8984 14.3C80.7384 13.6733 79.8251 12.8133 79.1584 11.72C78.5051 10.6133 78.1784 9.37333 78.1784 8C78.1784 6.62667 78.5051 5.39333 79.1584 4.3C79.8251 3.19333 80.7384 2.32667 81.8984 1.7C83.0718 1.07333 84.3851 0.76 85.8384 0.76C87.2918 0.76 88.5984 1.07333 89.7584 1.7C90.9184 2.32667 91.8318 3.19333 92.4984 4.3C93.1651 5.39333 93.4984 6.62667 93.4984 8C93.4984 9.37333 93.1651 10.6133 92.4984 11.72C91.8318 12.8133 90.9184 13.6733 89.7584 14.3C88.5984 14.9267 87.2918 15.24 85.8384 15.24ZM85.8384 12.48C86.6651 12.48 87.4118 12.2933 88.0784 11.92C88.7451 11.5333 89.2651 11 89.6384 10.32C90.0251 9.64 90.2184 8.86667 90.2184 8C90.2184 7.13333 90.0251 6.36 89.6384 5.68C89.2651 5 88.7451 4.47333 88.0784 4.1C87.4118 3.71333 86.6651 3.52 85.8384 3.52C85.0118 3.52 84.2651 3.71333 83.5984 4.1C82.9318 4.47333 82.4051 5 82.0184 5.68C81.6451 6.36 81.4584 7.13333 81.4584 8C81.4584 8.86667 81.6451 9.64 82.0184 10.32C82.4051 11 82.9318 11.5333 83.5984 11.92C84.2651 12.2933 85.0118 12.48 85.8384 12.48Z" fill="currentColor"/>
        </svg>
        <links>
          <soci-link href="#">About</soci-link>
          <soci-link href="#">Feedback</soci-link>
          <soci-link @click=logout href="/">Logout</soci-link>
        </links>
      </section>
    `
  }

  connectedCallback(){
    if(!this.authToken) this.setAttribute('noauth', '')
    let tagsUrl = '/fake-routes/subscribed-tags.json'
    fetch(tagsUrl).then(
      response=>{
        if(response.ok) return response.json()
        else this.log('JSON not found')
      }
    ).then(
      json=>{
        if(json) this._createSubscribedTags(json)
      }
    ).catch(e=>{
      this.log(e)
    })

    this.state = {}
    this.state.x = 110
    this._contributionHandle = this.select('slider-handle')
  }

  static get observedAttributes() {
    return ['user']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case "user":
        break
    }
  }

  async login(){
    this.querySelector('button[type="submit"]').toggleAttribute('waiting')
    let creds = {
      email: this.querySelector('input[type="email"]').value,
      password: this.querySelector('input[type="password"]').value
    }

    let response = await soci.postData('login', creds)
    if(response.token){
      console.log('heyp')
      soci.log('Login Successful! Token:', response.token)
      soci.storeToken(response.token)
      this.toggleAttribute('noauth')
      console.log(this)
    }
    else {
      console.log('invalid token')
    }
    this.querySelector('button[type="submit"]').toggleAttribute('waiting')
  }

  logout(){
    soci.clearToken()
    this.removeAttribute('create')
    this.setAttribute('noauth', '')
  }

  _tagClick(e){
    e.preventDefault()
    let tag = e.target.closest('a')
    let href = tag.href.match(/#.*$/)[0]
    if(document.getElementById('tags').active){
      href = `${window.location.hash}+${href}`
    }
    else {
      href = '/' + href
    }
    let column = document.createElement('soci-column')
    column.filter = 'all'
    column.tag = tag.textContent.trim()
    //column.color = e.currentTarget.getAttribute('color')
    column.color = 'purple'
    column.classList.add('inserting')
    let tags = document.getElementById('tags')
    tags.insertBefore(column, tags.children[0])

    setTimeout(()=>{
      column.classList.remove('inserting')
    },20)

    window.history.pushState(null, null, href)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  _createSubscribedTags(data){
    let tags = `
      ${data.map((tag) => `
        <a href="/#${tag.name}" color=${tag.color}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="background: var(--${tag.color}); position: absolute; left: 24px; top: 8px; width: 16px; height: 16px; border-radius: 3px;">
            <g transform="translate(1,1.5)">
            <path d="M9.28 7.346H11.17V8.62H9.126L8.832 11H7.558L7.852 8.62H5.486L5.192 11H3.918L4.212 8.62H2.322V7.346H4.366L4.688 4.854H2.798V3.58H4.842L5.136 1.2H6.41L6.116 3.58H8.468L8.762 1.2H10.036L9.742 3.58H11.618L11.632 4.854H9.588L9.28 7.346ZM8.006 7.346L8.314 4.854H5.962L5.64 7.346H8.006Z" fill="white"/>
            </g>
          </svg>
          ${tag.name}
        </a>
      `).join('')}
    `
    this.select('tags').innerHTML = tags
  }

  _createAccount(){
    this.removeAttribute('noauth')
    this.setAttribute('create', '')
  }

  _mouseDown(e){
    this.state.xDown = e.clientX
    document.addEventListener('mousemove', this._mouseMove)
    document.addEventListener('mouseup', this._mouseUp)
  }

  _mouseMove(e){
    let sidebar = document.querySelector('soci-sidebar')
    sidebar.setAttribute('dragging', '')
    sidebar.state.delta = sidebar.state.xDown - e.clientX
    sidebar._contributionHandle.style.left = (sidebar.state.x - sidebar.state.delta) + 'px'
  }

  _mouseUp(){
    let sidebar = document.querySelector('soci-sidebar')
    sidebar.removeAttribute('dragging')
    document.removeEventListener('mousemove', sidebar._mouseMove)
    document.removeEventListener('mouseup', sidebar._mouseUp)
    sidebar.state.x = sidebar.state.x - sidebar.state.delta
    sidebar._contributionHandle.style.left = sidebar.state.x + 'px'
  }
}
