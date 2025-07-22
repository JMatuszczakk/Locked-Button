class LockedButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._code = "";
    this._dialogOpen = false;
    this._shuffledDigits = [];  // Neue Property für gemischte Zahlen
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  setConfig(config) {
    if (!config.code) {
      throw new Error("Code is required");
    }
    this.config = config;
  }

  getCardSize() {
    return 1;
  }

  _shuffleDigits() {
    const digits = [...Array(10).keys()];
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    return digits;
  }

  _handleInput(num) {
    if (this._code.length < this.config.code.length) {
      this._code += num;
      this.render();
    }

    if (this._code === this.config.code) {
      this._hass.callService(
        this.config.action.service.split(".")[0],
        this.config.action.service.split(".")[1],
        this.config.action.data
      );
      this._code = "";
      this._dialogOpen = false;
      alert(this.config.success_message || "Code accepted");
    }
  }

  _clearCode() {
    this._code = "";
    this.render();
  }

  render() {
    if (!this.shadowRoot || !this.config || !this._hass) return;

    const style = `
      <style>
        .button-container {
          text-align: center;
        }
        .action-button {
          padding: 10px 16px;
          font-size: 1.2em;
          background-color: var(--primary-color, #03a9f4);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .keypad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          padding: 20px;
        }
        .key {
          padding: 20px;
          background: #eee;
          font-size: 1.5em;
          text-align: center;
          border-radius: 6px;
          cursor: pointer;
        }
        .code-display {
          font-size: 1.4em;
          margin-bottom: 10px;
          letter-spacing: 8px;
        }
        .overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .dialog {
          background: white;
          padding: 20px;
          border-radius: 10px;
          max-width: 300px;
          width: 90%;
        }
      </style>
    `;

    const html = `
      ${style}
      <div class="button-container">
        <button class="action-button" id="open-dialog">
          ${this.config.button_label || "Code eingeben"}
        </button>
      </div>
      ${this._dialogOpen ? `
        <div class="overlay" id="overlay">
          <div class="dialog">
            <div class="code-display">${"*".repeat(this._code.length)}</div>
            <div class="keypad">
              ${this._shuffledDigits.map(num => `
                <div class="key" data-num="${num}">${num}</div>
              `).join('')}
              <div class="key" id="clear">⟲</div>
              <div class="key" data-num="0">0</div>
              <div class="key" id="close">✕</div>
            </div>
          </div>
        </div>
      ` : ""}
    `;

    this.shadowRoot.innerHTML = html;

    // Event Handler
    const openBtn = this.shadowRoot.getElementById("open-dialog");
    if (openBtn) {
      openBtn.addEventListener("click", () => {
        this._shuffledDigits = this._shuffleDigits();  // Nur hier mischen
        this._dialogOpen = true;
        this._code = "";
        this.render();
      });
    }

    const overlay = this.shadowRoot.getElementById("overlay");
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          this._dialogOpen = false;
          this._code = "";
          this.render();
        }
      });
    }

    const keys = this.shadowRoot.querySelectorAll(".key");
    keys.forEach(key => {
      const num = key.dataset.num;
      if (num !== undefined) {
        key.addEventListener("click", () => this._handleInput(num));
      }
    });

    const clearBtn = this.shadowRoot.getElementById("clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this._clearCode());
    }

    const closeBtn = this.shadowRoot.getElementById("close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this._dialogOpen = false;
        this._code = "";
        this.render();
      });
    }
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("lock-numpad-card-custom", LockedButton);
