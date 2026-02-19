import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { cvData } from "../../data/cv-data";
import {
  contactLabels,
  contactLockedMeta,
  contactPlaceholderChecks,
  contactTitle,
  referencesText,
  unlockContactMessage,
} from "../../data/sections/contact-data";
import "../../components/ui/section-card";
import { appStore, type AppState } from "../../state/app-store";

@customElement("contact-section")
export class ContactSection extends LitElement {
  @state() private contactLocked = true;
  private unsubscribeStore?: () => void;

  static styles = css`
    a {
      color: var(--accent);
    }

    a:hover,
    a:focus-visible {
      color: color-mix(in oklab, var(--accent), black 16%);
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
    this.contactLocked = !state.contactUnlocked;
  };

  render() {
    const titleMeta = this.contactLocked ? contactLockedMeta : "";
    const hasRealEmail = cvData.contact.email !== contactPlaceholderChecks.email;
    const hasRealLinkedIn = !cvData.contact.linkedin.includes(
      contactPlaceholderChecks.profileFragment,
    );
    const hasRealGitHub = !cvData.contact.github.includes(
      contactPlaceholderChecks.profileFragment,
    );

    return html`
      <section-card
        id="contact"
        .cardId=${"contact"}
        .title=${contactTitle}
        .titleMeta=${titleMeta}
        ?locked=${this.contactLocked}
        .showActions=${false}
      >
        ${this.contactLocked
          ? html`<p>${unlockContactMessage}</p>`
          : null}
        <p>${contactLabels.address}: ${cvData.contact.location}</p>
        <p>
          ${contactLabels.phone}:
          <a href="tel:${cvData.contact.phone}">${cvData.contact.phone}</a>
        </p>
        ${hasRealEmail
          ? html`<p>
              ${contactLabels.email}:
              <a href="mailto: ${cvData.contact.email}">${cvData.contact.email}</a>
            </p>`
          : null}
        ${hasRealLinkedIn
          ? html`<p>
              ${contactLabels.linkedin}:
              <a
                href="${cvData.contact.linkedin}"
                target="_blank"
                rel="noopener noreferrer"
                >${cvData.contact.linkedin}</a
              >
            </p>`
          : null}
        ${hasRealGitHub
          ? html`<p>
              ${contactLabels.github}:
              <a
                href="${cvData.contact.github}"
                target="_blank"
                rel="noopener noreferrer"
                >${cvData.contact.github}</a
              >
            </p>`
          : null}
        <p>${referencesText}</p>
      </section-card>
    `;
  }
}
