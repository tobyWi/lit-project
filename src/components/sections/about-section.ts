import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "../../components/ui/section-card";
import { aboutParagraphs, aboutTitle } from "../../data/sections/about-data";

@customElement("about-section")
export class AboutSection extends LitElement {
  render() {
    return html`
      <section-card id="about" .cardId=${"about"} .title=${aboutTitle}>
        ${aboutParagraphs.map((paragraph) => html`<p>${paragraph}</p>`)}
      </section-card>
    `;
  }
}
