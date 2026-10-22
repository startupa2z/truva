import { hubPath, weekArticles } from "./sf-tech-week";

export type ResourceType = "Blog" | "White Paper" | "Case Study" | "Events";
export type ResourceTopic =
  | "AI Security"
  | "Cloud Security"
  | "Application Security"
  | "Compliance"
  | "Founder & Industry";

export interface ResourceItem {
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  topic: ResourceTopic;
  image?: string;
  imageAlt?: string;
  mark: string;
}

export const resourceTypes: ResourceType[] = [
  "Blog",
  "White Paper",
  "Case Study",
  "Events",
];
export const resourceTopics: ResourceTopic[] = [
  "AI Security",
  "Cloud Security",
  "Application Security",
  "Compliance",
  "Founder & Industry",
];

const aiWeekSlugs = new Set([
  "sovereign-ai-data-context-control",
  "google-for-startups-wiz",
  "build-ai-agents-with-auth0",
  "agents-and-apis",
  "auth0-buyer-pitch",
  "can-your-agents-actually-ship",
]);

const complianceWeekSlugs = new Set([
  "preparing-for-series-a",
  "sell-and-scale-with-government",
]);

const weekResources: ResourceItem[] = weekArticles.map((article) => ({
  title: article.title,
  description: article.summary,
  url: `/blog/sf-tech-week-2026/${article.slug}`,
  type: "Events",
  topic: aiWeekSlugs.has(article.slug)
    ? "AI Security"
    : complianceWeekSlugs.has(article.slug)
      ? "Compliance"
      : "Founder & Industry",
  image: article.image?.src,
  imageAlt: article.image?.alt,
  mark: article.category,
}));

const weekLead = weekArticles.find((article) => article.slug === "lessons");
const weekCollection: ResourceItem = {
  title: "SF Tech Week 2026: field notes from the room",
  description:
    "Explore the complete collection of firsthand reports from SF Tech Week on founders, AI, security, finance, buyers, community, and brand building.",
  url: hubPath,
  type: "Events",
  topic: "Founder & Industry",
  image: weekLead?.image?.src,
  imageAlt: weekLead?.image?.alt,
  mark: "SF TECH WEEK · 13 REPORTS",
};

export const resources: ResourceItem[] = [
  {
    title: "Review AI Security Architecture Before It Hardens",
    description:
      "A practical architecture review for AI systems before security decisions become expensive to change.",
    url: "/security-hub/ai-security-architecture-review",
    type: "Blog",
    topic: "AI Security",
    mark: "ARCHITECTURE REVIEW",
  },
  {
    title: "10 AI security issues your business should address",
    description:
      "Practical examples, first actions, and evidence to keep, from shadow AI to agent permissions.",
    url: "/blog/top-10-ai-security-risks-2026.html",
    type: "Blog",
    topic: "AI Security",
    image: "/infographics/top-10-ai-security-issues.webp",
    imageAlt: "Top 10 AI security issues infographic",
    mark: "PRACTICAL GUIDE",
  },
  {
    title: "Top 10 LLM security issues: a practical guide",
    description:
      "The OWASP 2025 categories with implementation checks and primary source guidance.",
    url: "/blog/top-10-llm-security-issues",
    type: "Blog",
    topic: "Application Security",
    image: "/infographics/top-10-llm-security-issues.webp",
    imageAlt: "Top 10 LLM security issues infographic",
    mark: "LLM SECURITY",
  },
  {
    title: "Top 10 CSPM issues to check in your cloud",
    description:
      "A visual checklist for cloud exposure, identity, data protection, recovery, and ownership.",
    url: "/blog/top-10-cspm-issues",
    type: "Blog",
    topic: "Cloud Security",
    image: "/infographics/top-10-cspm-issues.webp",
    imageAlt: "Top 10 CSPM issues infographic",
    mark: "CLOUD SECURITY",
  },
  weekCollection,
  ...weekResources,
];
