import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  contactUnlockedHint,
  getMeterRemainingHint,
  soundsGoodieMeterProgressAriaLabel,
  soundsGoodieMeterTitle,
} from "../../data/ui/feedback-counter-text";

const SECTION_CARD_FEEDBACK_EVENT = "section-card-feedback";

@customElement("feedback-counter")
export class FeedbackCounter extends LitElement {
  @state() private soundsGoodTotal = 0;
  private readonly unlockTarget = 4;

  static styles = css`
    :host {
      display: block;
    }

    .panel {
      background: var(--section-bg, var(--surface-2));
      border-radius: 0;
      padding: 1rem;
      display: grid;
      gap: 0.55rem;
      width: 100%;
      box-sizing: border-box;
    }

    .title {
      margin: 0;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 0.6rem;
      color: var(--text-main);
      font-size: 1.02rem;
      font-weight: 700;
    }

    .value {
      font-variant-numeric: tabular-nums;
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--accent);
    }

    .track {
      height: 0.7rem;
      border-radius: 0;
      background: #cfcfcf;
      overflow: hidden;
    }

    .fill {
      height: 100%;
      border-radius: inherit;
      background: var(--accent);
      transition: width 220ms ease;
    }

    .hint {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.92rem;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      SECTION_CARD_FEEDBACK_EVENT,
      this.handleFeedback as EventListener,
    );
  }

  disconnectedCallback() {
    window.removeEventListener(
      SECTION_CARD_FEEDBACK_EVENT,
      this.handleFeedback as EventListener,
    );
    super.disconnectedCallback();
  }

  private handleFeedback = (
    event: CustomEvent<{ soundsGoodDelta: number; nahDelta: number }>,
  ) => {
    this.soundsGoodTotal = Math.max(
      0,
      this.soundsGoodTotal + event.detail.soundsGoodDelta,
    );
  };

  render() {
    const clampedTotal = Math.max(0, this.soundsGoodTotal);
    const progress = Math.min(clampedTotal / this.unlockTarget, 1);
    const remaining = Math.max(this.unlockTarget - clampedTotal, 0);

    return html`
      <div class="panel" aria-live="polite">
        <p class="title">
          <span>${soundsGoodieMeterTitle}</span>
          <span class="value">${clampedTotal}/${this.unlockTarget}</span>
        </p>
        <div
          class="track"
          role="progressbar"
          aria-label=${soundsGoodieMeterProgressAriaLabel}
          aria-valuemin="0"
          aria-valuemax=${String(this.unlockTarget)}
          aria-valuenow=${String(Math.min(clampedTotal, this.unlockTarget))}
        >
          <div class="fill" style=${`width:${progress * 100}%`}></div>
        </div>
        <p class="hint">
          ${remaining > 0
            ? getMeterRemainingHint(remaining)
            : contactUnlockedHint}
        </p>
      </div>
    `;
  }
}
