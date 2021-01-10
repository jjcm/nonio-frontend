import SociComponent from './soci-component.js'

export default class SociRadialProgress extends SociComponent {
  constructor() {
    super()
  }

  css() { return `
    :host {
      --percent: 0;
      --filled-color: var(--brand-background);
      --transition-speed: 0.5s;
      position: relative;
      display: block;
      width: 24px;
      height: 24px;
      transform: rotate(0deg);
      transition: transform 0.3s ease-out;
      border-radius: 50%;
      box-shadow: 0 0 0 2px var(--base-background-subtle) inset;
    }

    svg {
      fill: none;
      stroke: var(--filled-color);
      stroke-width: 2px;
      /* 22 * 3.1415 */
      stroke-dasharray: 69.1;
      stroke-dashoffset: calc(.691 * (100 - var(--percent)));
      transition: stroke-dashoffset var(--transition-speed) linear, stroke 0.3s var(--soci-ease-out) calc(var(--transition-speed) - 0.1s);
      height: 24px;
      width: 24px;
    }

    path { 
      stroke: var(--success-background);
      stroke-dashoffset: 69.1;
      transition: stroke-dashoffset 0.3s var(--soci-ease-out);
    }

    :host([percent="100"]) svg {
      stroke: var(--success-text);
    }

    :host([percent="100"]) path {
      stroke-dashoffset: 50;
      transition: stroke-dashoffset 0.3s var(--soci-ease-out) calc(var(--transition-speed) - 0.1s);
    }

    #waiting {
      transform-origin: 50%;
      stroke: var(--base-text-subtle);
    }

    @keyframes waiting {
      from {
        transform: rotate(215deg);
      }
      to {
        transform: rotate(575deg);
      }
    }
  `}

  html() { return `
    <svg>
      <circle cx="12" cy="12" r="11" style="postion: relative; z-index: 1;"></circle>
      <path d="M17.33 8.66998L11 15L7.5 11.5" stroke-width="2"/>
    </svg>
  `}

  connectedCallback() {
  }

  static get observedAttributes() {
    return ['percent', 'waiting']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'percent'){
      if(parseFloat(newValue) > 100) this.setAttribute('percent', 100)
      if(parseFloat(newValue) < 0) this.setAttribute('percent', 0)
      this.select('svg').style = `--percent: ${Math.min(Math.max(parseFloat(newValue), 0), 100)}`
    }
    if(name == 'waiting'){
      if(newValue != null){
        let template = document.createElement('template')
        template.innerHTML = `<svg id="waiting-container" style="opacity: 0.2">
          <circle id="waiting" cx="12" cy="12" r="11"></circle>
          <animate 
            xlink:href="#waiting"
            attributeName="stroke-dashoffset"
            from="69.1"
            to="50"
            dur="1s"
            fill="freeze"
            id="load-in"
          />
          <animate 
            xlink:href="#waiting"
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.5s"
            fill="freeze"
          />
          <animateTransform 
            id="spin"
            xlink:href="#waiting"
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate 
            id="load-out"
            xlink:href="#waiting"
            attributeName="stroke-dashoffset"
            from="50"
            to="69.1"
            dur="0.5s"
            fill="freeze"
            begin="indefinite"
          />
          <animate 
            id="fade-out"
            xlink:href="#waiting"
            attributeName="opacity"
            from="1"
            to="0"
            dur="0.5s"
            fill="freeze"
            begin="indefinite"
          />
        </svg>`.trim()
        console.log(template.innerHTML)
        this.select('svg').appendChild(template.content.firstChild)
      }
      else {
        this.select('#fade-out').beginElement()
        setTimeout(()=>{
          this.select('svg svg')?.remove()
        }, 500)
      }
    }
  }

  get percent() {
    return this.getAttribute('percent')
  }

  set percent(val) {
    this.setAttribute('percent', val)
  }
}