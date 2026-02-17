import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { cvData } from "../../data/cv-data";
import {
  referencesText,
  unlockContactMessage,
} from "../../data/sections/contact-data";
import "../../components/ui/section-card";
import "../../data/cv-data";

const SECTION_CARD_FEEDBACK_EVENT = "section-card-feedback";

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
      window.alert("Yaaay! You unlocked the contact section!");
    }
  };

  render() {
    const contactLocked = this.soundsGoodTotal < 4;
    const titleMeta = contactLocked ? "Locked" : "";
    const hasRealEmail = cvData.contact.email !== "you@example.com";
    const hasRealLinkedIn = !cvData.contact.linkedin.includes("yourname");
    const hasRealGitHub = !cvData.contact.github.includes("yourname");

    return html`
      <section-card
        id="contact"
        title="Contact"
        .titleMeta=${titleMeta}
        ?locked=${contactLocked}
        .showActions=${false}
      >
        ${contactLocked
          ? html`<p>${unlockContactMessage}</p>`
          : null}
        <p>Address: ${cvData.contact.location}</p>
        <p>
          Phone:
          <a href="tel:${cvData.contact.phone}">${cvData.contact.phone}</a>
        </p>
        ${hasRealEmail
          ? html`<p>
              Email:
              <a href="mailto: ${cvData.contact.email}">${cvData.contact.email}</a>
            </p>`
          : null}
        ${hasRealLinkedIn
          ? html`<p>
              LinkedIn:
              <a href="${cvData.contact.linkedin}" target="_blank"
                >${cvData.contact.linkedin}</a
              >
            </p>`
          : null}
        ${hasRealGitHub
          ? html`<p>
              GitHub:
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
