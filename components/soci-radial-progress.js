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

    :host([waiting]) {
      animation: waiting 0.9s cubic-bezier(.41,.25,.64,.85) infinite;
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
      <circle cx="12" cy="12" r="11"></circle>
      <path d="M17.33 8.66998L11 15L7.5 11.5" stroke-width="2"/>
    </svg>
  `}

  connectedCallback() {
  }

  static get observedAttributes() {
    return ['percent']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'percent'){
      if(parseFloat(newValue) > 100) this.setAttribute('percent', 100)
      if(parseFloat(newValue) < 0) this.setAttribute('percent', 0)
      this.select('svg').style = `--percent: ${Math.min(Math.max(parseFloat(newValue), 0), 100)}`
    }
  }

  get percent() {
    return this.getAttribute('percent')
  }

  set percent(val) {
    this.setAttribute('percent', val)
  }
}