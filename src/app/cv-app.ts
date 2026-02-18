import "../components/layout/site-footer";
import "../components/layout/feedback-counter";
import "../components/ui/unlock-celebration";
import "../components/sections/hero-section";
import "../components/sections/about-section";
import "../components/sections/experience-section";
import "../components/sections/skills-section";
import "../components/sections/education-section";
import "../components/sections/contact-section";

import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("cv-app")
export class CvApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100dvh;
    }

    main {
      max-width: var(--content-max-width);
      margin: 0 auto;
      padding: var(--space-8) var(--space-4) var(--space-12);
      display: grid;
      gap: var(--space-6);
      grid-template-columns: minmax(0, 1fr);
    }

    section {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      scroll-margin-top: 6.4rem;
    }

    h2 {
      margin: 0;
      font-size: 1.1rem;
    }

    p {
      margin: 0.5rem 0 0;
      color: var(--text-muted);
    }

    .sections {
      display: grid;
      gap: var(--space-5);
      max-width: 860px;
      width: 100%;
      margin: 0 auto;
    }

  `;

  render() {
    return html`
      <a id="top"></a>
      <main>
        <div class="sections">
          <hero-section></hero-section>
          <feedback-counter></feedback-counter>
          <about-section></about-section>
          <experience-section></experience-section>
          <education-section></education-section>
          <skills-section></skills-section>
          <contact-section></contact-section>
        </div>
      </main>
      <unlock-celebration></unlock-celebration>
      <site-footer></site-footer>
    `;
  }
}
