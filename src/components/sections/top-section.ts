import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { cvData } from "../../data/cv-data";
import { topSectionInstructionText } from "../../data/sections/top-section-data";
import { playHelloChime } from "../../utils/sound-effects";

const profileImageUrl = `${import.meta.env.BASE_URL}img/profile-pic-2.jpg`;

@customElement("top-section")
export class TopSection extends LitElement {
  @state() private showHello = false;
  private helloTimer?: number;

  static styles = css`
    :host {
      display: block;
      background: var(--section-bg, var(--surface));
      border: 2px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
    }

    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 220px;
      gap: var(--space-5);
      align-items: start;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.7rem, 2.6vw, 2.2rem);
      line-height: 1.15;
    }

    p {
      margin: 0.6rem 0 0;
      color: var(--text-muted);
    }

    .photo {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      border-radius: 0;
      border: 2px solid var(--border);
      box-shadow: none;
      cursor: pointer;
    }

    .photo-wrap {
      position: relative;
    }

    .hello {
      position: absolute;
      bottom: 0.55rem;
      left: 0.55rem;
      margin: 0;
      background: var(--surface-dark);
      color: var(--ink-on-dark);
      border: 2px solid var(--border);
      padding: 0.18rem 0.45rem;
      font-size: 0.82rem;
      font-weight: 700;
    }

    @media (max-width: 760px) {
      .hero-grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `;

  disconnectedCallback() {
    if (this.helloTimer) {
      window.clearTimeout(this.helloTimer);
    }
    super.disconnectedCallback();
  }

  private handlePhotoClick = () => {
    playHelloChime();
    this.showHello = true;
    if (this.helloTimer) {
      window.clearTimeout(this.helloTimer);
    }
    this.helloTimer = window.setTimeout(() => {
      this.showHello = false;
      this.helloTimer = undefined;
    }, 1200);
  };

  render() {
    return html`
      <section id="hero">
        <div class="hero-grid">
          <div>
            <h1>${cvData.name}</h1>
            <p>${cvData.title}</p>
            <p>${cvData.summary}</p>
            <p>${topSectionInstructionText}</p>
          </div>
          <div class="photo-wrap">
            <img
              class="photo"
              src=${profileImageUrl}
              alt="${cvData.name} profile photo"
              @click=${this.handlePhotoClick}
            />
            ${this.showHello ? html`<p class="hello">Hello 👋</p>` : null}
          </div>
        </div>
      </section>
    `;
  }
}
