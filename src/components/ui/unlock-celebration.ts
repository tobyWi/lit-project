import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  unlockDialogAriaLabel,
  unlockDialogBody,
  unlockDialogButtonText,
  unlockDialogTitle,
} from "../../data/ui/unlock-celebration-text";

const CONTACT_UNLOCKED_EVENT = "contact-unlocked";

@customElement("unlock-celebration")
export class UnlockCelebration extends LitElement {
  @state() private open = false;

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 60;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(18, 28, 19, 0.48);
      display: grid;
      place-items: center;
      opacity: 0;
      transition: opacity 160ms ease;
      pointer-events: none;
    }

    :host([data-open]) .overlay {
      opacity: 1;
      pointer-events: auto;
    }

    .dialog {
      width: min(92vw, 520px);
      background: var(--surface);
      border: 1px solid color-mix(in oklab, var(--accent), white 62%);
      border-radius: 18px;
      padding: 1.2rem 1.1rem 1rem;
      box-shadow: 0 28px 60px -32px rgba(11, 19, 13, 0.6);
      position: relative;
      overflow: hidden;
      transform: translateY(10px) scale(0.98);
      transition: transform 180ms ease;
    }

    :host([data-open]) .dialog {
      transform: translateY(0) scale(1);
    }

    h3 {
      margin: 0;
      font-size: 1.3rem;
      line-height: 1.2;
    }

    p {
      margin: 0.6rem 0 0;
      color: var(--text-muted);
    }

    button {
      margin-top: 0.95rem;
      border: 2px solid var(--accent);
      border-radius: 0;
      padding: 0.42rem 0.78rem;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      background: var(--accent-soft);
      color: var(--text-main);
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        color 120ms ease;
    }

    button:hover {
      background: color-mix(in oklab, var(--accent-soft), white 26%);
    }

    button:focus-visible {
      background: color-mix(in oklab, var(--accent-soft), white 26%);
      outline: 3px solid var(--accent);
      outline-offset: 2px;
    }

    .confetti {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .piece {
      position: absolute;
      top: -12%;
      width: 0.42rem;
      height: 0.82rem;
      border-radius: 2px;
      opacity: 0;
      animation: fall 820ms ease-out forwards;
    }

    .piece:nth-child(odd) {
      background: var(--accent);
    }

    .piece:nth-child(even) {
      background: #ff8a65;
    }

    @keyframes fall {
      from {
        opacity: 0;
        transform: translateY(-14px) rotate(0deg);
      }
      20% {
        opacity: 1;
      }
      to {
        opacity: 0.95;
        transform: translateY(220px) rotate(300deg);
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      CONTACT_UNLOCKED_EVENT,
      this.handleUnlocked as EventListener,
    );
  }

  disconnectedCallback() {
    window.removeEventListener(
      CONTACT_UNLOCKED_EVENT,
      this.handleUnlocked as EventListener,
    );
    super.disconnectedCallback();
  }

  private handleUnlocked = () => {
    this.open = true;
    this.toggleAttribute("data-open", true);
  };

  private closeDialog = () => {
    this.open = false;
    this.removeAttribute("data-open");
  };

  render() {
    if (!this.open) {
      return html``;
    }

    const leftOffsets = [6, 12, 18, 24, 31, 38, 46, 54, 62, 70, 78, 86, 92];

    return html`
      <div class="overlay" @click=${this.closeDialog}>
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-label=${unlockDialogAriaLabel}
          @click=${(e: Event) => e.stopPropagation()}
        >
          <div class="confetti" aria-hidden="true">
            ${leftOffsets.map(
              (left, index) =>
                html`<span
                  class="piece"
                  style=${`left:${left}%; animation-delay:${index * 0.04}s;`}
                ></span>`,
            )}
          </div>
          <h3>${unlockDialogTitle}</h3>
          <p>${unlockDialogBody}</p>
          <button type="button" @click=${this.closeDialog}>
            ${unlockDialogButtonText}
          </button>
        </div>
      </div>
    `;
  }
}
