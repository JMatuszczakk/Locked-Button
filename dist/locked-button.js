import {
    LitElement,
    html,
    css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class LockNumpadCard extends LitElement {
    static get properties() {
        return {
            hass: { type: Object },
            config: { type: Object },
            _code: { type: String, state: true },
            _dialogOpen: { type: Boolean, state: true },
            _success: { type: Boolean, state: true },
        };
    }

    constructor() {
        super();
        this._code = "";
        this._dialogOpen = false;
        this._success = false;
    }

    static getStubConfig() {
        return {
            code: "1234",
            button_label: "Enter Code",
            success_message: "Code Accepted ✓",
            action: {
                service: "light.turn_on"
            }
        };
    }

    setConfig(config) {
        if (!config.code) {
            throw new Error("Please define a code");
        }
        if (!config.action || !config.action.service) {
            throw new Error("Please define an action service");
        }
        if (typeof config.code !== "string") {
            throw new Error("Code must be a string");
        }
        if (config.action.service.split(".").length !== 2) {
            throw new Error("Service should be in format: domain.service");
        }

        // Set default configuration values
        this.config = {
            button_label: "Enter Code",
            success_message: "Code Accepted ✓",
            ...config
        };
    }

    // Handle button press
    _handlePress(input) {
        // Handle special buttons
        if (input === 'X') {
            // Close the modal
            this._code = "";
            this._dialogOpen = false;
            return;
        }
        if (input === '✓') {
            // Submit current code (like enter)
            if (this._code === this.config.code) {
                // Execute configured action
                const [domain, service] = this.config.action.service.split(".");
                this.hass.callService(domain, service, this.config.action.data || {});
                // Show success message and close dialog after a delay
                this._success = true;
                setTimeout(() => {
                    this._success = false;
                    this._dialogOpen = false;
                }, 1500);
            }
            // Reset code regardless of match
            this._code = "";
            return;
        }

        // Handle numeric input
        this._code += input;

        // Check if code matches when it reaches the same length
        if (this._code.length === this.config.code.length) {
            if (this._code === this.config.code) {
                // Execute configured action
                const [domain, service] = this.config.action.service.split(".");
                this.hass.callService(domain, service, this.config.action.data || {});
                // Show success message and close dialog after a delay
                this._success = true;
                setTimeout(() => {
                    this._success = false;
                    this._dialogOpen = false;
                }, 1500);
            }
            // Reset code regardless of match
            this._code = "";
        }
    }

    // Generate dots for code display
    _generateDots() {
        const totalDots = this.config.code.length;
        const filledDots = this._code.length;

        return html`
        <div class="dots">
          ${[...Array(totalDots)].map((_, i) =>
            html`<div class="dot ${i < filledDots ? 'filled' : ''}"></div>`
        )}
        </div>
      `;
    }

    render() {
        if (!this.config) return html``;

        return html`
        <ha-card>
          <button class="action-button" @click=${() => this._dialogOpen = true}>
            ${this.config.button_label || "Enter Code"}
          </button>
  
          ${this._dialogOpen ? html`
            <ha-dialog
              open
              @closed=${() => this._dialogOpen = false}
              hideActions
            >
              <div slot="heading">
                Enter Code
                ${this._generateDots()}
              </div>
              <div class="content">
                ${this._success ? html`
                  <div class="success-message">
                    ${this.config.success_message}
                  </div>
                ` : html`
                  <div class="pad">
                  ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => html`
                    <button @click=${() => this._handlePress(num)}>${num}</button>
                  `)}
                    <button class="special-button close-button" @click=${() => this._handlePress('X')}>✕</button>
                    <button @click=${() => this._handlePress('0')}>0</button>
                    <button class="special-button confirm-button" @click=${() => this._handlePress('✓')}>✓</button>
                  </div>
                `}
              </div>
            </ha-dialog>
          ` : ''}
        </ha-card>
      `;
    }

    static get styles() {
        return css`
        :host {
          --button-size: 60px;
        }
        .action-button {
          width: 100%;
          padding: 16px;
          background: var(--primary-color);
          border: none;
          border-radius: var(--ha-card-border-radius, 4px);
          color: var(--text-primary-color);
          font-size: 1.2em;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }
        .action-button:hover {
          background: var(--primary-color);
          filter: brightness(120%);
        }
        ha-dialog {
          --mdc-dialog-min-width: 300px;
          --mdc-dialog-max-width: 350px;
          --justify-action-buttons: space-between;
        }
        .content {
          padding: 0 16px 16px;
        }
        .dots {
          display: flex;
          justify-content: center;
          margin: 8px 0 16px;
          gap: 8px;
        }
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--disabled-text-color);
        }
        .dot.filled {
          background: var(--primary-color);
        }
        .pad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          max-width: 300px;
          margin: 0 auto;
        }
        .pad button {
          width: var(--button-size);
          height: var(--button-size);
          border-radius: 50%;
          border: none;
          background: var(--primary-color);
          color: var(--text-primary-color);
          font-size: 1.5em;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        .pad button:hover {
          background: var(--primary-color);
          filter: brightness(120%);
        }
        .pad button:active {
          transform: scale(0.95);
        }
        .special-button {
          background: var(--secondary-color, var(--primary-color)) !important;
          font-weight: bold;
        }
        .close-button {
          background: var(--error-color, #f44336) !important;
          color: white !important;
        }
        .confirm-button {
          background: var(--success-color, #4CAF50) !important;
          color: white !important;
        }
        .success-message {
          color: var(--success-color, #4CAF50);
          text-align: center;
          font-size: 1.5em;
          font-weight: bold;
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }
      `;
    }
}

customElements.define("lock-numpad-card", LockNumpadCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "lock-numpad-card",
    name: "Lock Numpad Card",
    description: "A card with numeric keypad for code entry",
    preview: true,
    configurable: true
});