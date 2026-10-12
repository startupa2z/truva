import { risks } from "./ai-security-article";
import { series } from "./security-series";

export type IssueCategory = "ai" | "llm" | "cloud";

// Reuse the existing field guide rather than maintaining a competing AI list.
// These are Truva's selections, not an official OWASP ranking.
export const aiTopIssueLinks = risks.map((risk) => ({
  title: risk.short,
  url: risk.source.url,
  sourceName: risk.source.name,
}));

export const issueLinks = {
  ai: aiTopIssueLinks,
  llm: series.find((guide) => guide.slug === "top-10-llm-security-issues")!.items.map((item) => ({
    title: item.title,
    url: item.source,
    sourceName: "OWASP · 2025",
  })),
  cloud: series.find((guide) => guide.slug === "top-10-cspm-issues")!.items.map((item) => ({
    title: item.title,
    url: item.source,
    sourceName: item.source.includes("docs.aws.amazon.com") ? "AWS guidance" : "Microsoft guidance",
  })),
};

export type TopIssue = {
  slug: string;
  title: string;
  category: IssueCategory;
  whatItIs: string;
  whyItMatters: string;
  affected: string;
  checkNow: string;
  remediation: string;
  source: { name: string; url: string };
  lastUpdated: string;
};

export const issueCategories: Array<{
  id: IssueCategory;
  label: string;
  description: string;
}> = [
  {
    id: "ai",
    label: "AI Top 10",
    description: "",
  },
  {
    id: "llm",
    label: "LLM Top 10",
    description: "OWASP Top 10 for LLM Applications · 2025 edition. Select an issue for official guidance.",
  },
  {
    id: "cloud",
    label: "Cloud Security Top 10",
    description: "Truva’s cloud checklist, not a universal ranking. Links use AWS and Microsoft examples; controls vary by provider.",
  },
];

// Research-owned title/source pairs and detail fields are added here only after
// their primary sources are verified. An empty list avoids publishing invented
// risk names or remediation claims during the structural revision.
export const topIssues: TopIssue[] = [];
