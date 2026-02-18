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
import "../../data/cv-data";

const SECTION_CARD_FEEDBACK_EVENT = "section-card-feedback";
const CONTACT_UNLOCKED_EVENT = "contact-unlocked";

// Assignment: contact section with email, LinkedIn, GitHub, and optional contact form trigger.
@customElement("contact-section")
export class ContactSection extends LitElement {
  @state() private soundsGoodTotal = 0;

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
    window.addEventListener(
      SECTION_CARD_FEEDBACK_EVENT,
      this.handleFeedback as EventListener,
    );
  }

  disconnectedCallback() {
    window.removeEventListener(
      SECTION_CARD_FEEDBACK_EVENT,
      this.handleFeedback as EventListener,
    );
    super.disconnectedCallback();
  }

  private handleFeedback = (
    event: CustomEvent<{ soundsGoodDelta: number; nahDelta: number }>,
  ) => {
    const previousTotal = this.soundsGoodTotal;
    this.soundsGoodTotal = Math.max(
      0,
      this.soundsGoodTotal + event.detail.soundsGoodDelta,
    );

    if (previousTotal < 4 && this.soundsGoodTotal >= 4) {
      window.dispatchEvent(new CustomEvent(CONTACT_UNLOCKED_EVENT));
    }
  };

  render() {
    const contactLocked = this.soundsGoodTotal < 4;
    const titleMeta = contactLocked ? contactLockedMeta : "";
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
        .title=${contactTitle}
        .titleMeta=${titleMeta}
        ?locked=${contactLocked}
        .showActions=${false}
      >
        ${contactLocked
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
              <a href="${cvData.contact.linkedin}" target="_blank"
                >${cvData.contact.linkedin}</a
              >
            </p>`
          : null}
        ${hasRealGitHub
          ? html`<p>
              ${contactLabels.github}:
              <a href="${cvData.contact.github}" target="_blank"
                >${cvData.contact.github}</a
              >
            </p>`
          : null}
        <p>${referencesText}</p>
      </section-card>
    `;
  }
}
