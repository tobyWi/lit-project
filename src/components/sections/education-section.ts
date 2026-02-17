import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import "../../components/ui/section-card";
import { educationItems } from "../../data/sections/education-data";

@customElement("education-section")
export class EducationSection extends LitElement {
  static styles = css`
    .item + .item {
      margin-top: var(--space-4);
      padding-top: var(--space-4);
      border-top: 1px solid var(--border);
    }

    .degree {
      margin: 0;
      font-weight: 700;
    }

    .meta {
      margin: 0.2rem 0 0;
      color: var(--text-muted);
      font-size: 0.95rem;
    }

  `;

  render() {
    return html`
      <section-card id="education" title="Education">
        ${educationItems.map(
          (item) => html`
            <article class="item">
              <p class="degree">${item.degree}</p>
              <p class="meta">${item.period}</p>
            </article>
          `,
        )}
      </section-card>
    `;
  }
}
