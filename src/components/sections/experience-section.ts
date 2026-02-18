import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import "../../components/ui/section-card";
import {
  experienceItems,
  experienceTitle,
} from "../../data/sections/experience-data";

@customElement("experience-section")
export class ExperienceSection extends LitElement {
  static styles = css`
    .item + .item {
      margin-top: var(--space-4);
      padding-top: var(--space-4);
      border-top: 1px solid var(--border);
    }

    .role {
      margin: 0;
      font-weight: 700;
    }

    .meta {
      margin: 0.2rem 0 0;
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    .summary {
      margin: 0.7rem 0 0;
      color: var(--text-muted);
    }
  `;

  render() {
    return html`
      <section-card id="experience" .title=${experienceTitle}>
        ${experienceItems.map(
          (item) => html`
            <article class="item">
              <p class="role">${item.role}</p>
              <p class="meta">${item.period}</p>
              <p class="summary">${item.summary}</p>
            </article>
          `,
        )}
      </section-card>
    `;
  }
}
