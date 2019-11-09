import {SociComponent, html, render} from './soci-component.js'

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

      :host input {
        border: none;
        height: 38px;
        padding-left: 54px;
        font-size: 14px;
        width: 100%;
      }

      :host input:active, :host input:focus {
        outline: none;
        border: none;
        box-shadow: 0 0 0 2px var(--b1);
      }

      :host input::placeholder, h2 {
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: normal;
        color: var(--n3);
      }

      :host h2 {
        padding-left: 54px;
        line-height: 40px;
        margin: 12px 0 4px 0;
      }

      :host section {
        border-bottom: 2px solid var(--n1);
        position: relative;
      }

      :host section:last-child {
        border-bottom: none;
      }

      :host soci-icon {
        position: absolute;
        left: 20px;
        top: 7px;
      }

      :host #search soci-icon{
        top: 6px;
      }

      :host #user {
        position: sticky;
        top: 0;
        background: #fff;
        z-index: 10;
        height: 64px;
      }

      :host #user a {
        display: flex;
        align-items: center;
        padding-left: 20px;
        width: 100%;
        height: 100%;
        margin: 0;
      }

      :host #user a:hover {
        background: transparent;
      }

      :host #user soci-icon {
        color: var(--n3);
        right: 12px;
        top: 16px;
        left: auto;
        width: 32px;
        height: 32px;
        --hover-color: transparent;
        cursor: pointer;
      }
      :host #user soci-icon:hover {
        --hover-color: var(--n1);
        color: var(--n4);
      }
      :host #user soci-icon:active {
        --hover-color: var(--n2);
      }

      :host a {
        display: block;
        text-decoration: none;
        color: var(--n4);
        line-height: 32px;
        padding-left: 22px;
        cursor: pointer;
        box-sizing: border-box;
      }

      :host a:hover {
        background: var(--n1);
      }

      :host a:last-child {
        margin-bottom: 20px;
      }

      :host tags a {
        padding-left: 54px;
        position: relative;
      }

      :host tags a:hover {
        background: var(--n1);
      }

      :host tags svg {
        position: absolute;
        left: 20px;
      }
      
      :host #comments {
        border-bottom: 0;
      }

      :host #footer {
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

      :host #footer links {
        justify-content: flex-start;
        display: flex;
        font-size: 14px;
      }

      :host #footer soci-link {
        margin-right: 28px;
      }

      :host #footer svg {
        margin-bottom: 12px;
      }

      :host auth,
      :host noauth {
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        width: 280px;
        box-sizing: border-box;
        transition: left 0.2s ease-in-out;
      }

      :host noauth {
        padding: 64px 22px 0;
        left: -280px;
      }

      :host noauth svg {
        margin-bottom: 24px;
      }
      :host noauth h2 {
        padding-left: 0;
      }


      :host noauth div {
        text-align: center;
        color: var(--n3);
        margin: 20px 0;
      }

      :host button {
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

      :host button svg {
        position: absolute;
        width: 24px;
        left: 6px;
        top: 3px;
      }

      :host button:hover {
        background: var(--n1);
      }

      :host #facebook {
        border: 0;
        background: #3A559F;
        color: #fff;
      }

      :host #facebook:hover {
        opacity: 0.94;
      }

      :host noauth soci-link {
        display: block;
        margin-top: 24px;
        font-size: 13px;
        color: var(--b2);
        text-decoration: underline;
        cursor: pointer;
        text-align: center;
      }

    `
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

  tagClick(e){
    e.preventDefault()
    let href = e.currentTarget.href.match(/#.*$/)[0]
    if(document.getElementById('tags').active){
      console.log('location: ' + window.location.hash)
      href = `${window.location.hash}+${href}`
    }
    else {
      href = '/' + href
    }
    let column = document.createElement('soci-column')
    column.filter = 'all'
    column.tag = e.currentTarget.textContent.trim()
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

  createSubscribedTags(data){
    let tags = html`
      ${data.map((tag) => html`
        <a href="/#${tag.name}" @click=${this.tagClick} color=${tag.color}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="background: var(--${tag.color}); position: absolute; left: 24px; top: 8px; width: 16px; height: 16px; border-radius: 3px;">
            <g transform="translate(1,1.5)">
            <path d="M9.28 7.346H11.17V8.62H9.126L8.832 11H7.558L7.852 8.62H5.486L5.192 11H3.918L4.212 8.62H2.322V7.346H4.366L4.688 4.854H2.798V3.58H4.842L5.136 1.2H6.41L6.116 3.58H8.468L8.762 1.2H10.036L9.742 3.58H11.618L11.632 4.854H9.588L9.28 7.346ZM8.006 7.346L8.314 4.854H5.962L5.64 7.346H8.006Z" fill="white"/>
            </g>
          </svg>
          ${tag.name}
        </a>
      `)}
    `
    render(tags, this.select('tags'))
  }

  connectedCallback(){
    if(!this.authenticated) this.setAttribute('noauth', '')
    let tagsUrl = 'fake-routes/subscribed-tags.json'
    fetch(tagsUrl).then(
      response=>{
        if(response.ok) return response.json()
        else this.log('JSON not found')
      }
    ).then(
      json=>{
        if(json) this.createSubscribedTags(json)
      }
    ).catch(e=>{
      this.log(e)
    })
  }

  render(){
    this.login = this.login.bind(this)
    return html`
      ${this.getCss()}
      <auth>
        <section id="user">
          <a href="user" @click=${this.localLink}>
            <soci-user size="large" name="pwnies"></soci-user>
          </a>
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
        <section id="tags">
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
        <svg width="150" height="24" viewBox="0 0 150 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.4813 0.599998V23H17.2253L6.05725 9.4V23H0.93725V0.599998H5.22525L16.3612 14.2V0.599998H21.4813ZM46.6915 23.384C44.3662 23.384 42.2648 22.8827 40.3875 21.88C38.5315 20.8773 37.0702 19.5013 36.0035 17.752C34.9582 15.9813 34.4355 13.9973 34.4355 11.8C34.4355 9.60267 34.9582 7.62933 36.0035 5.88C37.0702 4.10933 38.5315 2.72267 40.3875 1.72C42.2648 0.717333 44.3662 0.216 46.6915 0.216C49.0168 0.216 51.1075 0.717333 52.9635 1.72C54.8195 2.72267 56.2808 4.10933 57.3475 5.88C58.4142 7.62933 58.9475 9.60267 58.9475 11.8C58.9475 13.9973 58.4142 15.9813 57.3475 17.752C56.2808 19.5013 54.8195 20.8773 52.9635 21.88C51.1075 22.8827 49.0168 23.384 46.6915 23.384ZM46.6915 18.968C48.0142 18.968 49.2088 18.6693 50.2755 18.072C51.3422 17.4533 52.1742 16.6 52.7715 15.512C53.3902 14.424 53.6995 13.1867 53.6995 11.8C53.6995 10.4133 53.3902 9.176 52.7715 8.088C52.1742 7 51.3422 6.15733 50.2755 5.56C49.2088 4.94133 48.0142 4.632 46.6915 4.632C45.3688 4.632 44.1742 4.94133 43.1075 5.56C42.0408 6.15733 41.1982 7 40.5795 8.088C39.9822 9.176 39.6835 10.4133 39.6835 11.8C39.6835 13.1867 39.9822 14.424 40.5795 15.512C41.1982 16.6 42.0408 17.4533 43.1075 18.072C44.1742 18.6693 45.3688 18.968 46.6915 18.968ZM92.45 0.599998V23H88.194L77.026 9.4V23H71.906V0.599998H76.194L87.33 14.2V0.599998H92.45ZM106.812 0.599998H111.996V23H106.812V0.599998ZM137.223 23.384C134.897 23.384 132.796 22.8827 130.919 21.88C129.063 20.8773 127.601 19.5013 126.535 17.752C125.489 15.9813 124.967 13.9973 124.967 11.8C124.967 9.60267 125.489 7.62933 126.535 5.88C127.601 4.10933 129.063 2.72267 130.919 1.72C132.796 0.717333 134.897 0.216 137.223 0.216C139.548 0.216 141.639 0.717333 143.495 1.72C145.351 2.72267 146.812 4.10933 147.879 5.88C148.945 7.62933 149.479 9.60267 149.479 11.8C149.479 13.9973 148.945 15.9813 147.879 17.752C146.812 19.5013 145.351 20.8773 143.495 21.88C141.639 22.8827 139.548 23.384 137.223 23.384ZM137.223 18.968C138.545 18.968 139.74 18.6693 140.807 18.072C141.873 17.4533 142.705 16.6 143.303 15.512C143.921 14.424 144.231 13.1867 144.231 11.8C144.231 10.4133 143.921 9.176 143.303 8.088C142.705 7 141.873 6.15733 140.807 5.56C139.74 4.94133 138.545 4.632 137.223 4.632C135.9 4.632 134.705 4.94133 133.639 5.56C132.572 6.15733 131.729 7 131.111 8.088C130.513 9.176 130.215 10.4133 130.215 11.8C130.215 13.1867 130.513 14.424 131.111 15.512C131.729 16.6 132.572 17.4533 133.639 18.072C134.705 18.6693 135.9 18.968 137.223 18.968Z" fill="currentColor"/>
        </svg>
        <h2>Login to your account</h2>
        <slot name="login">
        </slot>
        <div>OR</div>
        <button id="google">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#4285f4" d="M386 400c45-42 65-112 53-179H260v74h102c-4 24-18 44-38 57z"/><path fill="#34a853" d="M90 341a192 192 0 0 0 296 59l-62-48c-53 35-141 22-171-60z"/><path fill="#fbbc02" d="M153 292c-8-25-8-48 0-73l-63-49c-23 46-30 111 0 171z"/><path fill="#ea4335" d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55z"/></svg>
          Login with Google
        </button>
        <button id="facebook">
          Login with Facebook
          <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 0 512 512"><path d="M355.6 330l11.4-74h-71v-48c0-20.2 9.9-40 41.7-40H370v-63s-29.3-5-57.3-5c-58.5 0-96.7 35.4-96.7 99.6V256h-65v74h65v182h80V330h59.6z" fill="#fff"/></svg>
        </button>
        <soci-link>Create account</soci-link>
      </noauth>
      <section id="footer">
        <svg width="94" height="16" viewBox="0 0 94 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.4" d="M13.5 0.999999V15H10.84L3.86 6.5V15H0.66V0.999999H3.34L10.3 9.5V0.999999H13.5ZM29.2564 15.24C27.8031 15.24 26.4897 14.9267 25.3164 14.3C24.1564 13.6733 23.2431 12.8133 22.5764 11.72C21.9231 10.6133 21.5964 9.37333 21.5964 8C21.5964 6.62667 21.9231 5.39333 22.5764 4.3C23.2431 3.19333 24.1564 2.32667 25.3164 1.7C26.4897 1.07333 27.8031 0.76 29.2564 0.76C30.7097 0.76 32.0164 1.07333 33.1764 1.7C34.3364 2.32667 35.2497 3.19333 35.9164 4.3C36.5831 5.39333 36.9164 6.62667 36.9164 8C36.9164 9.37333 36.5831 10.6133 35.9164 11.72C35.2497 12.8133 34.3364 13.6733 33.1764 14.3C32.0164 14.9267 30.7097 15.24 29.2564 15.24ZM29.2564 12.48C30.0831 12.48 30.8297 12.2933 31.4964 11.92C32.1631 11.5333 32.6831 11 33.0564 10.32C33.4431 9.64 33.6364 8.86667 33.6364 8C33.6364 7.13333 33.4431 6.36 33.0564 5.68C32.6831 5 32.1631 4.47333 31.4964 4.1C30.8297 3.71333 30.0831 3.52 29.2564 3.52C28.4297 3.52 27.6831 3.71333 27.0164 4.1C26.3497 4.47333 25.8231 5 25.4364 5.68C25.0631 6.36 24.8764 7.13333 24.8764 8C24.8764 8.86667 25.0631 9.64 25.4364 10.32C25.8231 11 26.3497 11.5333 27.0164 11.92C27.6831 12.2933 28.4297 12.48 29.2564 12.48ZM57.8555 0.999999V15H55.1955L48.2155 6.5V15H45.0155V0.999999H47.6955L54.6555 9.5V0.999999H57.8555ZM66.8319 0.999999H70.0719V15H66.8319V0.999999ZM85.8384 15.24C84.3851 15.24 83.0718 14.9267 81.8984 14.3C80.7384 13.6733 79.8251 12.8133 79.1584 11.72C78.5051 10.6133 78.1784 9.37333 78.1784 8C78.1784 6.62667 78.5051 5.39333 79.1584 4.3C79.8251 3.19333 80.7384 2.32667 81.8984 1.7C83.0718 1.07333 84.3851 0.76 85.8384 0.76C87.2918 0.76 88.5984 1.07333 89.7584 1.7C90.9184 2.32667 91.8318 3.19333 92.4984 4.3C93.1651 5.39333 93.4984 6.62667 93.4984 8C93.4984 9.37333 93.1651 10.6133 92.4984 11.72C91.8318 12.8133 90.9184 13.6733 89.7584 14.3C88.5984 14.9267 87.2918 15.24 85.8384 15.24ZM85.8384 12.48C86.6651 12.48 87.4118 12.2933 88.0784 11.92C88.7451 11.5333 89.2651 11 89.6384 10.32C90.0251 9.64 90.2184 8.86667 90.2184 8C90.2184 7.13333 90.0251 6.36 89.6384 5.68C89.2651 5 88.7451 4.47333 88.0784 4.1C87.4118 3.71333 86.6651 3.52 85.8384 3.52C85.0118 3.52 84.2651 3.71333 83.5984 4.1C82.9318 4.47333 82.4051 5 82.0184 5.68C81.6451 6.36 81.4584 7.13333 81.4584 8C81.4584 8.86667 81.6451 9.64 82.0184 10.32C82.4051 11 82.9318 11.5333 83.5984 11.92C84.2651 12.2933 85.0118 12.48 85.8384 12.48Z" fill="currentColor"/>
        </svg>
        <links>
          <soci-link href="#">About</soci-link>
          <soci-link href="#">Feedback</soci-link>
          <soci-link href="#">Help</soci-link>
        </links>
      </section>
    `
  }
}
