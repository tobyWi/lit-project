import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import "../../components/ui/section-card";
import { skillGroups } from "../../data/sections/skills-data";

@customElement("skills-section")
export class SkillsSection extends LitElement {
  static styles = css`
    .group + .group {
      margin-top: var(--space-4);
    }

    h3 {
      margin: 0;
      font-size: 1rem;
    }

    .chips {
      margin-top: 0.6rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .chip {
      border: 1px solid var(--border);
      background: var(--surface-2);
      border-radius: 999px;
      padding: 0.3rem 0.62rem;
      font-size: 0.9rem;
    }
  `;

  render() {
    return html`
      <section-card id="skills" title="Tech Skills">
        ${skillGroups.map(
          (group) => html`
            <section class="group">
              <h3>${group.title}</h3>
              <div class="chips">
                ${group.items.map((item) => html`<span class="chip">${item}</span>`)}
              </div>
            </section>
          `,
        )}
      </section-card>
    `;
  }
}
