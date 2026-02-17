import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

const SECTION_CARD_OPEN_EVENT = "section-card-opened";

// Assignment: reusable UI wrapper for consistently styled CV sections with title and content slot.
@customElement("section-card")
export class SectionCard extends LitElement {
  @property({ type: String }) title = "";
  @property({ type: String }) titleMeta = "";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) locked = false;
  @property({ type: Boolean }) showActions = true;
  @property({ type: Number }) soundsGoodCount = 0;
  @property({ type: String }) selectedChoice: "Sounds Good" | "" = "";

  static styles = css`
    :host {
      display: block;
      background:
        linear-gradient(
          135deg,
          rgba(190, 255, 222, 0.65) 0%,
          rgba(160, 244, 206, 0.35) 48%,
          rgba(140, 236, 194, 0) 100%
        ),
        var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      box-shadow: 0 8px 18px -14px rgba(23, 32, 21, 0.28);
      position: relative;
      overflow: clip;
    }

    :host::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      border: 1px solid rgba(44, 122, 72, 0.18);
      opacity: 0;
      transition: opacity 0.22s ease;
    }

    :host([open])::before {
      opacity: 1;
    }

    :host([locked]) {
      opacity: 0.72;
      filter: saturate(0.85);
    }

    .header {
      all: unset;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      margin: 0;
    }

    h2 {
      margin: 0;
      font-size: 1.6rem;
    }

    .title-row {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .choice {
      font-size: 0.92rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .chevron {
      font-size: 2rem;
      color: var(--text-muted);
      transform: rotate(0deg);
      transition: transform 0.2s ease;
    }

    :host([open]) .chevron {
      transform: rotate(90deg);
    }

    .content {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition:
        grid-template-rows 0.25s ease,
        opacity 0.2s ease;
    }

    :host([open]) .content {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .content-inner {
      min-height: 0;
      overflow: hidden;
    }

    .content-slot {
      padding-top: var(--space-3);
    }

    .actions {
      margin-top: var(--space-6);
      display: flex;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .feedback-btn {
      border: 1px solid var(--border);
      border-radius: 999px;
      padding: 0.42rem 0.78rem;
      font: inherit;
      cursor: pointer;
      background: color-mix(in oklab, var(--surface), var(--surface-2) 28%);
      color: var(--text-muted);
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        color 120ms ease;
    }

    .feedback-btn .icon {
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      line-height: 1;
      font-weight: 700;
      color: #fff;
    }

    .feedback-btn:hover,
    .feedback-btn:focus-visible {
      background: color-mix(in oklab, var(--surface-2), white 30%);
      outline: none;
    }

    .feedback-btn.good .icon {
      background: var(--accent);
    }

    .feedback-btn.is-selected.good {
      border-color: color-mix(in oklab, var(--accent), white 56%);
      background: color-mix(in oklab, var(--accent-soft), white 14%);
      color: color-mix(in oklab, var(--accent), black 20%);
      font-weight: 600;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      SECTION_CARD_OPEN_EVENT,
      this.handleOtherCardOpened as EventListener,
    );
  }

  disconnectedCallback() {
    window.removeEventListener(
      SECTION_CARD_OPEN_EVENT,
      this.handleOtherCardOpened as EventListener,
    );
    super.disconnectedCallback();
  }

  private handleOtherCardOpened = (
    event: CustomEvent<{ source: SectionCard }>,
  ) => {
    if (event.detail.source !== this) {
      this.open = false;
    }
  };

  private toggleOpen() {
    if (this.locked) return;

    const nextOpen = !this.open;
    this.open = nextOpen;

    if (nextOpen) {
      window.dispatchEvent(
        new CustomEvent<{ source: SectionCard }>(SECTION_CARD_OPEN_EVENT, {
          detail: { source: this },
        }),
      );
    }
  }

  private handleSoundsGoodClick() {
    if (this.selectedChoice === "Sounds Good") {
      this.open = false;
      return;
    }

    const soundsGoodDelta = 1;
    this.soundsGoodCount = 1;
    this.selectedChoice = "Sounds Good";
    this.open = false;
    window.dispatchEvent(
      new CustomEvent<{ soundsGoodDelta: number; nahDelta: number }>(
        "section-card-feedback",
        {
          detail: { soundsGoodDelta, nahDelta: 0 },
        },
      ),
    );
  }

  render() {
    return html`
      <button
        class="header"
        type="button"
        aria-disabled=${String(this.locked)}
        aria-expanded=${String(this.open)}
        @click=${this.toggleOpen}
      >
        <div class="title-row">
          <h2>${this.title}</h2>
          ${this.titleMeta || this.selectedChoice
            ? html`<span class="choice"
                >${this.titleMeta || this.selectedChoice}</span
              >`
            : null}
        </div>
        <span class="chevron" aria-hidden="true">›</span>
      </button>
      <div class="content" aria-hidden=${String(!this.open)}>
        <div class="content-inner">
          <div class="content-slot">
            <slot></slot>
            ${this.showActions
              ? html`
                  <div class="actions">
                    <button
                      class="feedback-btn good ${this.selectedChoice === "Sounds Good"
                        ? "is-selected"
                        : ""}"
                      type="button"
                      aria-pressed=${String(this.selectedChoice === "Sounds Good")}
                      @click=${this.handleSoundsGoodClick}
                    >
                      <span class="icon" aria-hidden="true">+</span>
                      <span>Sounds Good</span>
                    </button>
                  </div>
                `
              : null}
          </div>
        </div>
      </div>
    `;
  }
}
