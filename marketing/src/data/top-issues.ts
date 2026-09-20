export type IssueCategory = "ai" | "llm" | "cloud";

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
    description: "Application, agent, and system risks.",
  },
  {
    id: "llm",
    label: "LLM Top 10",
    description: "Model-specific risks and controls.",
  },
  {
    id: "cloud",
    label: "Cloud Security Top 10",
    description: "Cloud configuration, identity, and exposure risks.",
  },
];

// Research-owned title/source pairs and detail fields are added here only after
// their primary sources are verified. An empty list avoids publishing invented
// risk names or remediation claims during the structural revision.
export const topIssues: TopIssue[] = [];
