import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { cvData } from "../../data/cv-data";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Work Experience" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Tech Skills" },
  { href: "#contact", label: "Contact" },
];

@customElement("site-header")
export class SiteHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 20;
      backdrop-filter: blur(14px);
      background: color-mix(in oklab, var(--surface), transparent 24%);
      border-bottom: 1px solid var(--border);
    }

    .inner {
      max-width: var(--content-max-width);
      margin: 0 auto;
      padding: 0.8rem var(--space-4);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
    }

    .brand {
      display: inline-flex;
      flex-direction: column;
      color: inherit;
      text-decoration: none;
      min-width: fit-content;
    }

    .name {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .role {
      color: var(--text-muted);
      font-size: 0.78rem;
    }

    nav {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    nav a {
      text-decoration: none;
      color: var(--text-muted);
      padding: 0.4rem 0.7rem;
      border-radius: 999px;
      font-size: 0.86rem;
      transition:
        color 140ms ease,
        background-color 140ms ease;
    }

    nav a:hover,
    nav a:focus-visible {
      color: var(--text-main);
      background: var(--surface-2);
      outline: none;
    }

    @media (max-width: 820px) {
      .inner {
        flex-direction: column;
        align-items: flex-start;
      }

      nav {
        width: 100%;
        justify-content: flex-start;
      }
    }
  `;

  render() {
    return html`
      <header>
        <div class="inner">
          <a class="brand" href="#top" aria-label="Jump to top">
            <span class="name">${cvData.name}</span>
            <span class="role">Frontend Developer</span>
          </a>
          <nav aria-label="Primary">
            ${navItems.map(
              (item) => html`<a href=${item.href}>${item.label}</a>`,
            )}
          </nav>
        </div>
      </header>
    `;
  }
}
