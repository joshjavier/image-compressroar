/**
 * Spinner custom element
 * Ported from code at https://loading.io/css
 */
class Spinner extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
      <style>
        :host,
        :host div,
        :host div:after {
          box-sizing: border-box;
        }
        :host {
          color: currentColor;
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
        }
        :host div {
          transform-origin: 40px 40px;
          animation: lds-spinner 1.2s linear infinite;
        }
        :host div:after {
          content: " ";
          display: block;
          position: absolute;
          top: 3.2px;
          left: 36.8px;
          width: 6.4px;
          height: 17.6px;
          border-radius: 20%;
          background: currentColor;
        }
        :host div:nth-child(1) {
          transform: rotate(0deg);
          animation-delay: -1.1s;
        }
        :host div:nth-child(2) {
          transform: rotate(30deg);
          animation-delay: -1s;
        }
        :host div:nth-child(3) {
          transform: rotate(60deg);
          animation-delay: -0.9s;
        }
        :host div:nth-child(4) {
          transform: rotate(90deg);
          animation-delay: -0.8s;
        }
        :host div:nth-child(5) {
          transform: rotate(120deg);
          animation-delay: -0.7s;
        }
        :host div:nth-child(6) {
          transform: rotate(150deg);
          animation-delay: -0.6s;
        }
        :host div:nth-child(7) {
          transform: rotate(180deg);
          animation-delay: -0.5s;
        }
        :host div:nth-child(8) {
          transform: rotate(210deg);
          animation-delay: -0.4s;
        }
        :host div:nth-child(9) {
          transform: rotate(240deg);
          animation-delay: -0.3s;
        }
        :host div:nth-child(10) {
          transform: rotate(270deg);
          animation-delay: -0.2s;
        }
        :host div:nth-child(11) {
          transform: rotate(300deg);
          animation-delay: -0.1s;
        }
        :host div:nth-child(12) {
          transform: rotate(330deg);
          animation-delay: 0s;
        }
        @keyframes lds-spinner {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      </style>

      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    `
  }
}

if (!customElements.get('lds-spinner')) {
  customElements.define('lds-spinner', Spinner)
}
