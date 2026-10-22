export type ServiceDetail = {
  slug: string;
  title: string;
  description: string;
  category: string;
  heading: string;
  introduction: string;
  problem: string;
  outcome: string;
  fit: string[];
  review: string[];
  deliverables: string[];
  scopeNote: string;
  questions: { question: string; answer: string }[];
  references: { name: string; url: string }[];
  bookingSubject: string;
};

export const serviceDetails: ServiceDetail[] = [
  {
    slug: "soc-2-readiness",
    title: "SOC 2 Readiness & Gap Assessment for SaaS | Truva Solutions",
    description:
      "Get a scoped SOC 2 readiness assessment, prioritized control gaps, and an evidence plan before an independent CPA examination.",
    category: "SOC 2 READINESS",
    heading: "SOC 2 readiness: know what to fix before the examination.",
    introduction:
      "A customer has asked for a SOC 2 report, but your team still needs to define the scope, assign control owners, and collect reliable evidence. Truva helps you see what is ready, what is missing, and what to do next.",
    problem:
      "Unclear ownership and late evidence requests can slow enterprise deals and create expensive rework. A readiness review gives your team a practical starting point before the independent examination begins.",
    outcome:
      "You leave with a prioritized gap register, named owners, and an evidence plan your team can work through. The goal is a better-prepared security program and a clearer handoff to your CPA firm—not a promised audit result.",
    fit: [
      "B2B SaaS teams facing an enterprise customer’s SOC 2 request",
      "Companies preparing for a first Type I or Type II examination",
      "Teams with an auditor or compliance platform that still need hands-on remediation",
    ],
    review: [
      "System and service scope, trust-service categories, and existing audit plans",
      "Access, change management, logging, incident response, and vendor controls",
      "Policies, operating evidence, exceptions, and control ownership",
      "Security gaps in the application and cloud environment that affect readiness",
    ],
    deliverables: [
      "A scoped readiness and gap assessment with supporting observations",
      "A prioritized remediation plan with proposed owners and dependencies",
      "An evidence matrix and working session to agree the next phase",
    ],
    scopeNote:
      "The review scope, dates, fee, and any implementation or retesting are set in a written proposal. Truva provides readiness and remediation support. An independent licensed CPA firm performs the SOC 2 examination and issues the report.",
    questions: [
      {
        question: "Should we hire an auditor before a readiness assessment?",
        answer:
          "Either order can work. If you already have a CPA firm, we align the readiness scope with its requirements. If not, we help identify gaps before you commit to an examination plan.",
      },
      {
        question: "Does this include fixing the gaps?",
        answer:
          "The assessment identifies and prioritizes gaps. Implementation, evidence collection, and retesting can be scoped as follow-on work once the findings are clear.",
      },
    ],
    references: [
      {
        name: "AICPA SOC suite of services",
        url: "https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services",
      },
    ],
    bookingSubject: "SOC 2 readiness assessment",
  },
  {
    slug: "cloud-security-assessment",
    title: "Cloud Security Assessment & CSPM Review | Truva Solutions",
    description:
      "Review AWS, Azure, or Google Cloud exposure, access, and configuration. Get validated findings and a prioritized remediation plan.",
    category: "CLOUD SECURITY",
    heading: "Cloud security assessment: find the exposures worth fixing first.",
    introduction:
      "Cloud settings change quickly. A posture dashboard can surface alerts, but your team still needs to know which exposures are real, which assets matter, and who will fix them. Truva turns a scoped cloud review into a practical action plan.",
    problem:
      "Public storage, broad permissions, exposed services, and missing logs can remain unnoticed as environments grow. A focused assessment helps separate meaningful risk from alert volume.",
    outcome:
      "You receive validated findings, affected assets, and a prioritized backlog that engineers can act on. We discuss ownership and the next steps with your team.",
    fit: [
      "SaaS teams preparing for an enterprise security review",
      "Organizations that need a focused review of cloud configuration and access",
      "Teams with CSPM alerts that need validation and remediation priorities",
    ],
    review: [
      "Agreed AWS, Azure, or Google Cloud accounts and critical workloads",
      "Identity permissions, privileged access, and exposed services",
      "Storage access, encryption, secrets, logging, and monitoring",
      "Relevant configuration checks against applicable CIS Benchmarks and provider guidance",
    ],
    deliverables: [
      "Cloud posture report with validated, prioritized findings",
      "Asset-level remediation backlog and configuration guidance",
      "Technical readout to agree owners, sequence, and any follow-on validation",
    ],
    scopeNote:
      "We agree the accounts, access method, exclusions, dates, and fee before work begins. Tool output is reviewed in context; a scan alone is not the final assessment. Changes and retesting are scoped separately.",
    questions: [
      {
        question: "Is this the same as running a CSPM tool?",
        answer:
          "No. A CSPM tool can identify configuration signals. The assessment checks which findings apply to your environment, their business impact, and the order in which to address them.",
      },
      {
        question: "Can you review more than one cloud provider?",
        answer:
          "Yes, when the providers and accounts are named in the engagement scope. The review depth and schedule depend on that scope.",
      },
    ],
    references: [
      {
        name: "CIS Benchmarks",
        url: "https://www.cisecurity.org/cis-benchmarks",
      },
    ],
    bookingSubject: "Cloud security assessment",
  },
  {
    slug: "ai-security-assessment",
    title: "AI Security Assessment for LLM Apps & Agents | Truva Solutions",
    description:
      "Assess one AI application or agent workflow for prompt injection, data exposure, tool permissions, and unsafe integrations.",
    category: "AI SECURITY",
    heading: "AI security assessment: find the risks in your workflow.",
    introduction:
      "An AI feature can reach sensitive data, call tools, and act on untrusted input. Truva reviews one agreed application or agent workflow so your team can find the failure paths that matter before customers rely on it.",
    problem:
      "A working demo does not show whether a prompt can override instructions, a retrieval layer can expose another customer’s data, or an agent has more authority than it needs.",
    outcome:
      "You get evidence-backed findings, a risk-ranked hardening plan, and a walkthrough with the people who can make the fixes. The assessment documents limits and retest needs rather than claiming an AI system is risk-free.",
    fit: [
      "Product teams launching a customer-facing LLM feature",
      "Teams adding retrieval, external tools, or autonomous steps to an agent",
      "SaaS companies answering customer questions about AI security controls",
    ],
    review: [
      "Prompt injection and unsafe output handling in agreed workflows",
      "Sensitive-data exposure, retrieval boundaries, and access control",
      "Agent permissions, tool calls, and human approval points",
      "AI API access, third-party dependencies, logging, and usage limits",
    ],
    deliverables: [
      "Executive summary and prioritized technical findings with test evidence",
      "Mapping to relevant OWASP LLM risks and NIST AI RMF considerations",
      "Remediation walkthrough and a plan for targeted retesting",
    ],
    scopeNote:
      "We agree the application, model and tool boundaries, test access, exclusions, dates, and fee in writing. Results apply to the tested version and scope; later changes may need retesting.",
    questions: [
      {
        question: "Do you test the model or the whole application?",
        answer:
          "The agreed workflow is the unit of review. That can include prompts, retrieval, permissions, tool integrations, data flows, and human controls around the model.",
      },
      {
        question: "Does this replace AI governance work?",
        answer:
          "No. A focused technical assessment finds risks in a specific workflow. Governance addresses ownership, policies, lifecycle decisions, and ongoing oversight across the organization.",
      },
    ],
    references: [
      { name: "OWASP Top 10 for LLM Applications", url: "https://genai.owasp.org/llm-top-10/" },
      { name: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
    ],
    bookingSubject: "AI security assessment",
  },
];
