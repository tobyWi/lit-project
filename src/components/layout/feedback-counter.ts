import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

const SECTION_CARD_FEEDBACK_EVENT = "section-card-feedback";

@customElement("feedback-counter")
export class FeedbackCounter extends LitElement {
  @state() private soundsGoodTotal = 0;

  static styles = css`
    :host {
      display: block;
    }

    .panel {
      border: 1px solid color-mix(in oklab, var(--accent), white 72%);
      background: color-mix(in oklab, var(--accent-soft), white 28%);
      color: color-mix(in oklab, var(--accent), black 20%);
      border-radius: var(--radius-lg);
      padding: 1rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 1.08rem;
      width: 100%;
      box-sizing: border-box;
      justify-content: center;
      white-space: nowrap;
    }

    .icon {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.08rem;
      line-height: 1;
      font-weight: 700;
      color: #fff;
      background: var(--accent);
    }

    .value {
      font-variant-numeric: tabular-nums;
      font-weight: 800;
      font-size: 1.2rem;
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
    return html`
      <div class="panel" aria-live="polite">
        <span class="icon" aria-hidden="true">+</span>
        Sounds Goodie-Meter <span class="value">${this.soundsGoodTotal}</span>
      </div>
    `;
  }
}
