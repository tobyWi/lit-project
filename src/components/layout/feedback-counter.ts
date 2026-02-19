import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  contactUnlockedHint,
  getMeterRemainingHint,
  soundsGoodieMeterProgressAriaLabel,
  soundsGoodieMeterTitle,
} from "../../data/ui/feedback-counter-text";
import { appStore, type AppState } from "../../state/app-store";
import { playMeterRiseTick } from "../../utils/sound-effects";

@customElement("feedback-counter")
export class FeedbackCounter extends LitElement {
  @state() private soundsGoodTotal = 0;
  private readonly unlockTarget = appStore.unlockTarget;
  private unsubscribeStore?: () => void;
  private prevSoundsGoodTotal = 0;

  static styles = css`
    :host {
      display: block;
    }

    .panel {
      background: var(--section-bg, var(--surface-2));
      border: 3px solid var(--border);
      border-radius: 0;
      padding: 1rem;
      display: grid;
      gap: 0.55rem;
      width: 100%;
      box-sizing: border-box;
      box-shadow: 6px 6px 0 0 var(--border);
      position: relative;
    }

    .title {
      margin: 0;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 0.6rem;
      color: var(--text-main);
      font-size: 1.08rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .value {
      font-variant-numeric: tabular-nums;
      font-weight: 800;
      font-size: 1.3rem;
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
    this.unsubscribeStore = appStore.subscribe(this.syncFromStore);
  }

  disconnectedCallback() {
    this.unsubscribeStore?.();
    super.disconnectedCallback();
  }

  private syncFromStore = (state: AppState) => {
    if (
      state.soundsGoodTotal > this.prevSoundsGoodTotal &&
      state.soundsGoodTotal < this.unlockTarget
    ) {
      playMeterRiseTick(state.soundsGoodTotal);
    }
    this.prevSoundsGoodTotal = state.soundsGoodTotal;
    this.soundsGoodTotal = state.soundsGoodTotal;
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
