import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  notClickedStatusText,
  soundsGoodLabel,
} from "../../data/ui/section-card-text";
import { appStore, type AppState } from "../../state/app-store";
import { playAccordionPop } from "../../utils/sound-effects";

@customElement("section-card")
export class SectionCard extends LitElement {
  @property({ type: String }) title = "";
  @property({ type: String }) cardId = "";
  @property({ type: String }) titleMeta = "";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) locked = false;
  @property({ type: Boolean }) showActions = true;
  @property({ type: Number }) soundsGoodCount = 0;
  @property({ type: String }) selectedChoice: typeof soundsGoodLabel | "" = "";
  private unsubscribeStore?: () => void;

  static styles = css`
    :host {
      display: block;
      background: var(--section-bg, var(--surface));
      border: 3px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      box-shadow: 6px 6px 0 0 var(--border);
      position: relative;
      overflow: visible;
      transition:
        transform 90ms linear,
        box-shadow 90ms linear;
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

    :host(:not([locked])):hover {
      transform: translate(-2px, -2px);
      box-shadow: 8px 8px 0 0 var(--border);
    }

    :host([open]) {
      transform: translate(-2px, -2px);
      box-shadow: 8px 8px 0 0 var(--border);
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

    .header:focus-visible {
      outline: 3px solid var(--accent);
      outline-offset: 2px;
    }

    h2 {
      margin: 0;
      font-size: 1.6rem;
      letter-spacing: 0.01em;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }

    .choice {
      font-size: 0.92rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .pending-hint {
      position: absolute;
      top: -2px;
      right: -2px;
      margin: 0;
      font-size: 0.78rem;
      color: #ffffff;
      background: #4a4a4a;
      border: 2px solid var(--border);
      border-bottom: 0;
      padding: 0.22rem 0.55rem;
      line-height: 1.1;
      z-index: 2;
    }

    .status-icon {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.86rem;
      line-height: 1;
      background: var(--surface-2);
      border: 2px solid var(--border);
      filter: grayscale(1);
      opacity: 0.65;
    }

    .status-icon.done {
      background: var(--accent-soft);
      border-color: var(--accent);
      filter: none;
      opacity: 1;
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
      padding-top: var(--space-5);
    }

    .actions {
      margin-top: var(--space-6);
      display: flex;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .feedback-btn {
      border: 2px solid var(--border);
      border-radius: 0;
      padding: 0.42rem 0.78rem;
      font: inherit;
      cursor: pointer;
      background: var(--surface-2);
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
      border-radius: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      line-height: 1;
      font-weight: 700;
      color: #fff;
    }

    .feedback-btn:hover {
      background: color-mix(in oklab, var(--surface-2), white 30%);
    }

    .feedback-btn:focus-visible {
      background: color-mix(in oklab, var(--surface-2), white 30%);
      outline: 3px solid var(--accent);
      outline-offset: 2px;
    }

    .feedback-btn.good .icon {
      background: var(--accent);
    }

    .feedback-btn.good:not(:disabled) {
      border-color: var(--accent);
      background: var(--accent-soft);
      color: var(--text-main);
    }

    .feedback-btn.is-selected.good {
      border-color: var(--accent);
      background: var(--accent-soft);
      color: var(--text-main);
      font-weight: 600;
    }

    .feedback-btn:disabled {
      cursor: not-allowed;
      opacity: 1;
      border-color: #9a9a9a;
      background: #d7d7d7;
      color: #5a5a5a;
    }

    .feedback-btn:disabled .icon {
      background: #8a8a8a;
    }

    .feedback-btn.is-selected.good:disabled {
      border-color: #9a9a9a;
      background: #d7d7d7;
      color: #5a5a5a;
      font-weight: 600;
    }

    .feedback-btn.is-selected.good:disabled .icon {
      background: #8a8a8a;
    }

    @media (max-width: 640px) {
      h2 {
        font-size: 1.2rem;
      }

      .choice {
        font-size: 0.8rem;
      }

      .status-icon {
        width: 1.05rem;
        height: 1.05rem;
        font-size: 0.76rem;
      }

      .title-row {
        gap: 0.6rem;
      }

      .chevron {
        font-size: 1.6rem;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribeStore = appStore.subscribe(this.syncFromStore);
  }

  disconnectedCallback() {
    this.unsubscribeStore?.();
    super.disconnectedCallback();
  }

  private get effectiveCardId() {
    return this.cardId || this.id || "";
  }

  private syncFromStore = (state: AppState) => {
    const id = this.effectiveCardId;
    if (!id) return;

    const isCompleted = state.markedSectionIds.has(id);
    this.selectedChoice = isCompleted ? soundsGoodLabel : "";
    this.soundsGoodCount = isCompleted ? 1 : 0;
    this.open = state.openCardId === id;
  };

  openCard() {
    if (this.locked) return;
    appStore.setOpenCard(this.effectiveCardId);
  }

  private toggleOpen() {
    if (this.locked) return;
    const willOpen = !this.open;
    appStore.setOpenCard(willOpen ? this.effectiveCardId : null);
    this.vibrateOnToggle(willOpen);
    if (willOpen) {
      playAccordionPop();
    }
  }

  private vibrateOnToggle(willOpen: boolean) {
    if (typeof navigator === "undefined" || !("vibrate" in navigator)) {
      return;
    }

    navigator.vibrate(willOpen ? 18 : 10);
  }

  private handleSoundsGoodClick() {
    if (this.selectedChoice === soundsGoodLabel) {
      appStore.setOpenCard(null);
      return;
    }

    const wasContactUnlocked = appStore.getState().contactUnlocked;
    const wasMarked = appStore.markSectionSoundsGood(this.effectiveCardId);
    if (wasMarked) {
      const isContactUnlocked = appStore.getState().contactUnlocked;
      const unlockedNow = !wasContactUnlocked && isContactUnlocked;
      if (!unlockedNow) {
        appStore.setOpenCard(null);
      }
    }
  }

  render() {
    const statusText = this.titleMeta
      ? this.titleMeta
      : this.showActions
        ? this.selectedChoice
        : "";

    const isCompleted = this.selectedChoice === soundsGoodLabel;
    const soundsGoodDisabled = isCompleted || this.locked;

    return html`
      <button
        class="header"
        type="button"
        aria-disabled=${String(this.locked)}
        aria-expanded=${String(this.open)}
        @click=${this.toggleOpen}
      >
        <div class="title-row">
          ${this.showActions
            ? html`<span
                class="status-icon ${isCompleted ? "done" : ""}"
                aria-hidden="true"
                >👍</span
              >`
            : null}
          <h2>${this.title}</h2>
          ${statusText
            ? html`<span class="choice">${statusText}</span>`
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
                      class="feedback-btn good ${this.selectedChoice === soundsGoodLabel
                        ? "is-selected"
                        : ""}"
                      type="button"
                      ?disabled=${soundsGoodDisabled}
                      aria-pressed=${String(this.selectedChoice === soundsGoodLabel)}
                      @click=${this.handleSoundsGoodClick}
                    >
                      <span class="icon" aria-hidden="true">+</span>
                      <span>${soundsGoodLabel}</span>
                    </button>
                  </div>
                `
              : null}
          </div>
        </div>
      </div>
      ${this.showActions && !this.selectedChoice && !this.titleMeta
        ? html`<p class="pending-hint">${notClickedStatusText}</p>`
        : null}
    `;
  }
}
