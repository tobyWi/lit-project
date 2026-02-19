import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { cvData } from "../../data/cv-data";
import {
  contactLabels,
  contactLockedMeta,
  contactPlaceholderChecks,
  contactTitle,
  referencesText,
  unlockContactMessage,
} from "../../data/sections/contact-data";
import "../../components/ui/section-card";
import { appStore, type AppState } from "../../state/app-store";
import { playConnectClickSound } from "../../utils/sound-effects";

@customElement("contact-section")
export class ContactSection extends LitElement {
  @state() private contactLocked = true;
  @state() private modalOpen = false;
  @state() private connectFlash = false;
  private unsubscribeStore?: () => void;
  private flashTimer?: number;

  static styles = css`
    .connect-btn {
      margin: 0.2rem 0 0;
      border: 2px solid var(--border);
      border-radius: 0;
      background: var(--surface-dark);
      color: var(--ink-on-dark);
      padding: 0.42rem 0.78rem;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font: inherit;
      font-weight: 700;
      letter-spacing: 0.01em;
      cursor: pointer;
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        color 120ms ease,
        filter 120ms ease;
    }

    .connect-btn:hover {
      background: var(--surface-dark-hover);
    }

    .connect-btn:focus-visible {
      outline: 3px solid var(--accent);
      outline-offset: 2px;
    }

    .connect-btn.flash {
      filter: brightness(1.32) saturate(1.2);
    }

    .overlay {
      position: fixed;
      inset: 0;
      background: var(--overlay-dark);
      display: grid;
      place-items: center;
      z-index: 80;
      padding: var(--space-4);
      box-sizing: border-box;
    }

    .dialog {
      width: min(calc(100vw - (var(--space-4) * 2) - 28px), 820px);
      max-height: calc(100dvh - (var(--space-4) * 2));
      overflow: auto;
      box-sizing: border-box;
      background: var(--surface);
      border: 3px solid var(--border);
      box-shadow: 6px 6px 0 0 var(--border);
      padding: var(--space-5);
      display: grid;
      gap: 0.55rem;
    }

    .dialog-title {
      margin: 0;
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .close-btn {
      margin-top: 0.4rem;
      border: 2px solid var(--accent);
      background: var(--accent-soft);
      color: var(--text-main);
      font: inherit;
      font-weight: 600;
      border-radius: 0;
      padding: 0.42rem 0.78rem;
      cursor: pointer;
      justify-self: start;
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        color 120ms ease;
    }

    .close-btn:hover {
      background: color-mix(in oklab, var(--accent-soft), white 26%);
    }

    .close-btn:focus-visible {
      background: color-mix(in oklab, var(--accent-soft), white 26%);
      outline: 3px solid var(--accent);
      outline-offset: 2px;
    }

    .row {
      margin: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .field {
      display: grid;
      gap: 0.12rem;
    }

    .field-label {
      margin: 0;
      font-weight: 800;
      color: var(--text-main);
    }

    .field-value {
      margin: 0;
      color: var(--text-muted);
    }

    @media (max-width: 520px) {
      .dialog {
        width: calc(100vw - (var(--space-4) * 2));
        padding: var(--space-4);
      }
    }

    a {
      color: var(--accent);
    }

    a:hover,
    a:focus-visible {
      color: color-mix(in oklab, var(--accent), black 16%);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribeStore = appStore.subscribe(this.syncFromStore);
  }

  disconnectedCallback() {
    this.unsubscribeStore?.();
    if (this.flashTimer) {
      window.clearTimeout(this.flashTimer);
    }
    super.disconnectedCallback();
  }

  private syncFromStore = (state: AppState) => {
    this.contactLocked = !state.contactUnlocked;
  };

  private openModal = () => {
    playConnectClickSound();
    this.connectFlash = true;
    if (this.flashTimer) {
      window.clearTimeout(this.flashTimer);
    }
    this.flashTimer = window.setTimeout(() => {
      this.connectFlash = false;
      this.flashTimer = undefined;
    }, 150);
    this.modalOpen = true;
  };

  private closeModal = () => {
    this.modalOpen = false;
  };

  render() {
    const titleMeta = this.contactLocked ? contactLockedMeta : "";
    const hasRealEmail = cvData.contact.email !== contactPlaceholderChecks.email;
    const hasRealLinkedIn = !cvData.contact.linkedin.includes(
      contactPlaceholderChecks.profileFragment,
    );
    const hasRealGitHub = !cvData.contact.github.includes(
      contactPlaceholderChecks.profileFragment,
    );

    return html`
      <section-card
        id="contact"
        .cardId=${"contact"}
        .title=${contactTitle}
        .titleMeta=${titleMeta}
        ?locked=${this.contactLocked}
        .showActions=${false}
      >
        ${this.contactLocked
          ? html`<p>${unlockContactMessage}</p>`
          : html`<button
              class="connect-btn ${this.connectFlash ? "flash" : ""}"
              type="button"
              @click=${this.openModal}
            >
              Let’s connect ☎️ ✉️
            </button>`}
      </section-card>
      ${this.modalOpen
        ? html`
            <div class="overlay" @click=${this.closeModal}>
              <div
                class="dialog"
                role="dialog"
                aria-modal="true"
                aria-label="Contact details"
                @click=${(e: Event) => e.stopPropagation()}
              >
                <h3 class="dialog-title">${contactTitle}</h3>
                <div class="row field">
                  <p class="field-label">${contactLabels.address}</p>
                  <p class="field-value">${cvData.contact.location}</p>
                </div>
                <div class="row field">
                  <p class="field-label">${contactLabels.phone}</p>
                  <p class="field-value">
                    <a href="tel:${cvData.contact.phone}">${cvData.contact.phone}</a>
                  </p>
                </div>
                ${hasRealEmail
                  ? html`<div class="row field">
                      <p class="field-label">${contactLabels.email}</p>
                      <p class="field-value">
                        <a href="mailto:${cvData.contact.email}"
                          >${cvData.contact.email}</a
                        >
                      </p>
                    </div>`
                  : null}
                ${hasRealLinkedIn
                  ? html`<div class="row field">
                      <p class="field-label">${contactLabels.linkedin}</p>
                      <p class="field-value">
                        <a
                          href="${cvData.contact.linkedin}"
                          target="_blank"
                          rel="noopener noreferrer"
                          >${cvData.contact.linkedin}</a
                        >
                      </p>
                    </div>`
                  : null}
                ${hasRealGitHub
                  ? html`<div class="row field">
                      <p class="field-label">${contactLabels.github}</p>
                      <p class="field-value">
                        <a
                          href="${cvData.contact.github}"
                          target="_blank"
                          rel="noopener noreferrer"
                          >${cvData.contact.github}</a
                        >
                      </p>
                    </div>`
                  : null}
                <div class="row field">
                  <p class="field-label">References</p>
                  <p class="field-value">${referencesText}</p>
                </div>
                <button class="close-btn" type="button" @click=${this.closeModal}>
                  Got it!
                </button>
              </div>
            </div>
          `
        : null}
    `;
  }
}
