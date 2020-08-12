import SociComponent from './soci-component.js'

export default class SociSidebar extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        width: 280px;
        min-width: 280px;
        display: block;
        height: 100vh;
        overflow: auto;
        overflow-x: hidden;
        position: fixed;
        padding-bottom: 90px;
        box-sizing: border-box;
        transition: opacity 0.2s var(--soci-ease);
        opacity: 1;
      }

      :host([noauth]) #noauth {
        left: 0;
      }

      :host([noauth]) #auth {
        left: 280px;
      }

      :host([create]) #create {
        left: 0;
      }

      :host([create]) #auth,
      :host([create]) #noauth {
        left: 280px;
      }

      :host([dragging]) {
        user-select: none;
      }

      #auth input::placeholder, h2 {
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: normal;
        color: var(--n3);
      }

      #auth input {
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

      content section {
        overflow: auto;
      }

      #tags {
        flex: 1;
      }

      soci-icon {
        position: absolute;
        left: 20px;
        top: 20px;
      }

      #search soci-icon{
        top: 6px;
      }

      #user {
        position: sticky;
        top: 0;
        background: #fff;
        z-index: 10;
        height: 40px;
      }

      #user soci-link:first-child {
        display: flex;
        align-items: center;
        padding-left: 22px;
        width: 100%;
        height: 100%;
        margin: 0;
      }

      #user soci-icon {
        color: var(--n3);
        right: 8px;
        top: 8px;
        left: auto;
        width: 24px;
        height: 24px;
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

      #user soci-user {
        --spacing: 12px;
        --font-weight: 500;
        --font-size: 14px;
        --avatar-size: 20px;
        --line-height: 20px;
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
        border-top: 2px solid transparent;
        transition: border-top 0.3s var(--soci-ease);
      }

      #footer links {
        justify-content: flex-start;
        display: flex;
        font-size: 14px;
      }

      #footer soci-link {
        margin-right: 28px;
      }

      :host([#noauth]) #footer soci-link#logout {
        display: none;
      }

      #footer svg {
        margin-bottom: 12px;
      }

      panel {
        position: absolute;
        height: calc(100% - 90px);
        overflow-y: auto;
        overflow-x: hidden;
        display: block;
        top: 0;
        left: 0;
        width: 280px;
        box-sizing: border-box;
        transition: left 0.2s ease-in-out;
      }

      #create,
      #noauth {
        padding: 24px 22px 20px;
        left: -280px;
      }

      #noauth svg {
        margin-bottom: 24px;
      }

      #noauth h2 {
        padding-left: 0;
      }

      #noauth div {
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

      #noauth soci-link {
        display: block;
        margin-top: 28px;
        font-size: 13px;
        color: var(--b2);
        font-weight: 700;
        letter-spacing: 0.5px;
        opacity: 0.7;
        cursor: pointer;
        text-align: center;
      }

      #auth content {
        display: flex;
        flex-direction: column;
        height: calc(100% - 66px);
        overflow-x: hidden;
      }

      #auth h2 {
        padding-left: 54px;
      }

      #create h2:not(:first-child) {
        margin-top: 50px;
      }

      #create button {
        margin-top: 16px;
      }

      input {
        margin: 0 0 8px;
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

      cc-details {
        display: flex;
      }

      cc-details input:first-child {
        min-width: 160px;
        margin-right: 12px;
      }

      @media(max-height: 780px){
        #footer {
          border-top: 2px solid var(--n1);
        }
      }
    `
  }

  html(){
    return `
      <panel id="auth">
        <section id="user">
          <soci-link href="/user">
            <soci-user self></soci-user>
          </soci-link>
          <soci-link href="/submit" fresh>
            <soci-icon glyph="create"></soci-icon>
          </soci-link>
        </section>
        <content>
          <section id="subscribed-tags">
            <soci-icon glyph="tags"></soci-icon>
            <h2>Subscribed Tags</h2>
            <tags></tags>
          </section>
          <section id="tags">
            <soci-icon glyph="tags"></soci-icon>
            <h2>Tags</h2>
            <tags></tags>
          </section>
        </content>
      </panel>
      <panel id="noauth">
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
        <soci-link #create href="/user/create" @click=_createAccount>create account</soci-link>
      </panel>
      <panel id="create">
        <h2>Essentials</h2>
        <soci-username-input></soci-username-input>
        <input type="email" placeholder="Email address"/>
        <input type="password" placeholder="Password"/>
        <input type="password" placeholder="Confirm Password"/>
        <h2>Contribution</h2>
        <soci-contribution-slider></soci-contribution-slider>
        <h2>Billing</h2>
        <input type="text" placeholder="Credit Card Name"/>
        <input type="text" placeholder="Credit Card Number"/>
        <cc-details>
          <input type="text" placeholder="Exp. Date"/>
          <input type="text" placeholder="CCV"/>
        </cc-details>
        <button type="submit" @click=register>Create Account</button>
      </panel>
      <section id="footer">
        <svg width="94" height="16" viewBox="0 0 94 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.4" d="M13.5 0.999999V15H10.84L3.86 6.5V15H0.66V0.999999H3.34L10.3 9.5V0.999999H13.5ZM29.2564 15.24C27.8031 15.24 26.4897 14.9267 25.3164 14.3C24.1564 13.6733 23.2431 12.8133 22.5764 11.72C21.9231 10.6133 21.5964 9.37333 21.5964 8C21.5964 6.62667 21.9231 5.39333 22.5764 4.3C23.2431 3.19333 24.1564 2.32667 25.3164 1.7C26.4897 1.07333 27.8031 0.76 29.2564 0.76C30.7097 0.76 32.0164 1.07333 33.1764 1.7C34.3364 2.32667 35.2497 3.19333 35.9164 4.3C36.5831 5.39333 36.9164 6.62667 36.9164 8C36.9164 9.37333 36.5831 10.6133 35.9164 11.72C35.2497 12.8133 34.3364 13.6733 33.1764 14.3C32.0164 14.9267 30.7097 15.24 29.2564 15.24ZM29.2564 12.48C30.0831 12.48 30.8297 12.2933 31.4964 11.92C32.1631 11.5333 32.6831 11 33.0564 10.32C33.4431 9.64 33.6364 8.86667 33.6364 8C33.6364 7.13333 33.4431 6.36 33.0564 5.68C32.6831 5 32.1631 4.47333 31.4964 4.1C30.8297 3.71333 30.0831 3.52 29.2564 3.52C28.4297 3.52 27.6831 3.71333 27.0164 4.1C26.3497 4.47333 25.8231 5 25.4364 5.68C25.0631 6.36 24.8764 7.13333 24.8764 8C24.8764 8.86667 25.0631 9.64 25.4364 10.32C25.8231 11 26.3497 11.5333 27.0164 11.92C27.6831 12.2933 28.4297 12.48 29.2564 12.48ZM57.8555 0.999999V15H55.1955L48.2155 6.5V15H45.0155V0.999999H47.6955L54.6555 9.5V0.999999H57.8555ZM66.8319 0.999999H70.0719V15H66.8319V0.999999ZM85.8384 15.24C84.3851 15.24 83.0718 14.9267 81.8984 14.3C80.7384 13.6733 79.8251 12.8133 79.1584 11.72C78.5051 10.6133 78.1784 9.37333 78.1784 8C78.1784 6.62667 78.5051 5.39333 79.1584 4.3C79.8251 3.19333 80.7384 2.32667 81.8984 1.7C83.0718 1.07333 84.3851 0.76 85.8384 0.76C87.2918 0.76 88.5984 1.07333 89.7584 1.7C90.9184 2.32667 91.8318 3.19333 92.4984 4.3C93.1651 5.39333 93.4984 6.62667 93.4984 8C93.4984 9.37333 93.1651 10.6133 92.4984 11.72C91.8318 12.8133 90.9184 13.6733 89.7584 14.3C88.5984 14.9267 87.2918 15.24 85.8384 15.24ZM85.8384 12.48C86.6651 12.48 87.4118 12.2933 88.0784 11.92C88.7451 11.5333 89.2651 11 89.6384 10.32C90.0251 9.64 90.2184 8.86667 90.2184 8C90.2184 7.13333 90.0251 6.36 89.6384 5.68C89.2651 5 88.7451 4.47333 88.0784 4.1C87.4118 3.71333 86.6651 3.52 85.8384 3.52C85.0118 3.52 84.2651 3.71333 83.5984 4.1C82.9318 4.47333 82.4051 5 82.0184 5.68C81.6451 6.36 81.4584 7.13333 81.4584 8C81.4584 8.86667 81.6451 9.64 82.0184 10.32C82.4051 11 82.9318 11.5333 83.5984 11.92C84.2651 12.2933 85.0118 12.48 85.8384 12.48Z" fill="currentColor"/>
        </svg>
        <links>
          <soci-link href="#">About</soci-link>
          <soci-link href="#">Feedback</soci-link>
          <soci-link id="logout" @click=logout href="/">Logout</soci-link>
        </links>
      </section>
    `
  }

  async connectedCallback(){
    this.toggleAttribute('loading', false)
    if(!this.authToken) this.setAttribute('noauth', '')
    else {
      this._loadSubscribedTags()
      this._loadCommonTags()
    }

    this.select('#noauth').addEventListener('keydown', this._loginOnEnter.bind(this))
    this.select('content').addEventListener('subscribe', this._createSubscribedTag.bind(this))
    this.select('content').addEventListener('unsubscribe', this._removeSubscribedTag.bind(this))
  }

  // Logic for the tag lists
  _subscribedTags = [] 
  _commonTags = []
  _subscribedTagsLoaded = false
  _commonTagsLoaded = false

  async _loadSubscribedTags(){
    let tags = await this.getData('/subscriptions', this.authToken)
    this._subscribedTags = tags.subscriptions.map(t=>t.tag)
    this._subscribedTagsLoaded = true
    this._populateTags()
  }
  async _loadCommonTags(){
    let tags = await this.getData('/tags', this.authToken)
    this._commonTags = tags.tags.map(t=>t.tag)
    this._commonTagsLoaded = true
    this._populateTags()
  }

  _populateTags(){
    if(this._subscribedTagsLoaded && this._commonTagsLoaded){
      this._createTags(this._subscribedTags, this.select('#subscribed-tags tags'), true)
      let filteredTags = this._commonTags.filter(t=>{
        return this._subscribedTags.indexOf(t) == -1
      })
      this._createTags(filteredTags, this.select('#tags tags'))
    }
  }

  _createTags(data, dom, subscribed=false){
    let tags = ` 
      ${data.map((tag) => `
        <soci-tag-li tag=${tag} ${subscribed ? 'subscribed' : ''} ${this._activeTag == tag ? 'active' : ''}></soci-tag-li>
      `).join('')}
    `
    dom.innerHTML = tags
  }

  activateTag(tag){
    this.select('soci-tag-li[active]')?.toggleAttribute('active', false)
    this.select(`soci-tag-li[tag="${tag}"]`)?.toggleAttribute('active', true)
    this._activeTag = tag
  }

  _createSubscribedTag(e){
    if(this._subscribedTags.indexOf(e.detail.tag) == -1){
      let tag = document.createElement('soci-tag-li')
      tag.setAttribute('tag', e.detail.tag)
      tag.toggleAttribute('load-in', true)
      tag.toggleAttribute('subscribed', true)
      this._subscribedTags.push(e.detail.tag)
      this._commonTags.splice(this._commonTags.indexOf(e.detail.tag), 1)
      this.select('#subscribed-tags tags').appendChild(tag)
    }

    e.detail.dom.toggleAttribute('load-out', true)
    setTimeout(()=>{
      e.detail.dom.remove()
    }, 200)
  }

  _removeSubscribedTag(e){
    console.log('remove')
    if(this._commonTags.indexOf(e.detail.tag) == -1){
      let tag = document.createElement('soci-tag-li')
      tag.setAttribute('tag', e.detail.tag)
      tag.toggleAttribute('load-in', true)
      this._commonTags.push(e.detail.tag)
      this._subscribedTags.splice(this._subscribedTags.indexOf(e.detail.tag), 1)
      this.select('#tags tags').prepend(tag)
    }
    e.detail.dom.toggleAttribute('load-out', true)
    setTimeout(()=>{
      e.detail.dom.remove()
    }, 200)
  }

  // Account control actions
  async login(){
    let creds = {
      email: this.querySelector('input[type="email"]'),
      password: this.querySelector('input[type="password"]')
    }

    if(!creds.email.checkValidity()){
      creds.email.focus()
      return 0
    }

    if(!creds.password.checkValidity()){
      creds.password.focus()
      return 0
    }

    creds.email = creds.email.value
    creds.password = creds.password.value

    let response = await soci.postData('login', creds)
    if(response.token){
      soci.log('Login Successful! Token:', response.token)
      soci.storeToken(response.token)
      soci.username = response.username
      this.querySelector('soci-button').success()
      setTimeout(()=>{
        this.toggleAttribute('noauth')
      }, 400)
      this._loadSubscribedTags()
      this._loadCommonTags()
      this._populateTags()
      soci.loadVotes()

    }
    else {
      console.log('invalid token')
      this.querySelector('soci-button').error()
    }
  }

  logout(){
    soci.clearToken()
    this.removeAttribute('create')
    this.setAttribute('noauth', '')
    this.select('#logout').innerHTML = "Logout"
  }

  async register(){
    let fields = {
      username: this.select('#create soci-username-input'),
      email: this.select('#create input[type="email"]'),
      password: this.select('#create input[type="password"]'),
      //eventually this will be the rest of the stuff - i.e. payment deets
    }

    let response = await soci.postData('register', {
      username: fields.username.value,
      email: fields.email.value,
      password: fields.password.value
    })

    if(response.token){
      soci.log('Login Successful! Token:', response.token)
      soci.storeToken(response.token)
      soci.username = response.username
      this.toggleAttribute('create')
    }

  }

  _loginOnEnter(e){
    if(e.key == "Enter"){
      window.focus()
      this.login()
    }
  }

  _createAccount(){
    this.removeAttribute('noauth')
    this.setAttribute('create', '')
    this.select('#logout').innerHTML = "Login"
  }
}
