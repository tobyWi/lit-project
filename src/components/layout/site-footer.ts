import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { cvData } from "../../data/cv-data";
import {
  footerBuiltWithText,
  footerRepoLabel,
  footerRepoUrl,
  footerSuffix,
} from "../../data/sections/footer-data";

@customElement("site-footer")
export class SiteFooter extends LitElement {
  static styles = css`
    :host {
      display: block;
      text-align: center;
      padding: var(--space-4);
      background: var(--surface);
      border-top: 1px solid var(--border);
    }

    p {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    a {
      color: var(--accent);
    }
  `;

  render() {
    return html`
      <p>
        &copy; ${new Date().getFullYear()} ${cvData.name}. ${footerSuffix}
        ${footerBuiltWithText}
        <a href=${footerRepoUrl} target="_blank" rel="noopener noreferrer"
          >${footerRepoLabel}</a
        >
      </p>
    `;
  }
}
