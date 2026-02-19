export interface SkillGroup {
  title: string;
  items: string[];
}

export const skillsTitle = "Tech Skills";

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML",
      "CSS",
      "Responsive Design",
      "Component Design Systems",
    ],
  },
  {
    title: "CMS & Platforms",
    items: ["Sanity", "WordPress", "PHP", "E-commerce Frontends"],
  },
  {
    title: "Tooling & Workflow",
    items: [
      "Git",
      "npm / pnpm",
      "Figma",
      "REST APIs",
      "Agile Collaboration",
      "Code Reviews",
      "Troubleshooting",
    ],
  },
  {
    title: "Quality Focus",
    items: [
      "Core Web Vitals",
      "Accessibility",
      "WCAG",
      "SEO",
      "Performance Optimization",
      "Structured Root-Cause Analysis",
    ],
  },
  {
    title: "Familiar With",
    items: ["Photoshop", "AWS", "Cloudflare"],
  },
];
