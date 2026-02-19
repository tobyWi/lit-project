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
      color: var(--text-main);
      font-size: 0.9rem;
      line-height: 1.45;
    }

    .copyright {
      font-weight: 800;
      letter-spacing: 0.01em;
      text-transform: uppercase;
    }

    .meta {
      color: var(--text-muted);
    }

    a {
      color: var(--accent);
    }
  `;

  render() {
    return html`
      <p>
        <span class="copyright"
          >&copy; ${new Date().getFullYear()} ${cvData.name}</span
        >
        <span class="meta"> ${footerSuffix} ${footerBuiltWithText} </span>
        <a href=${footerRepoUrl} target="_blank" rel="noopener noreferrer"
          >${footerRepoLabel}</a
        >
      </p>
    `;
  }
}
