const aws = (service: string) =>
  `https://docs.aws.amazon.com/securityhub/latest/userguide/${service}-controls.html`;
const llm = (slug: string) => `https://genai.owasp.org/llmrisk/${slug}/`;
export const series = [
  {
    slug: "top-10-cspm-issues",
    category: "CLOUD SECURITY",
    title: "Top 10 CSPM issues to check in your cloud",
    shortTitle: "10 CSPM issues",
    description:
      "A practical cloud security posture checklist covering identity, exposure, data protection, visibility, and recovery.",
    scope:
      "CSPM means cloud security posture management. This is Truva’s practical checklist, not a vendor ranking or a universal severity order. The examples use AWS controls; equivalent checks and service behavior vary across Azure and Google Cloud.",
    intro:
      "A long findings list is not a remediation plan. Start with assets that are exposed, hold sensitive data, or can grant access to other systems. Confirm business context before changing a production control.",
    items: [
      {
        title: "Public storage",
        action: "Restrict unintended public access.",
        why: "Bucket policies and legacy access rules can expose information beyond its intended audience.",
        check:
          "Review both account-level protections and resource policies. Preserve intentionally public content only through an approved design.",
        source: aws("s3"),
      },
      {
        title: "Open management ports",
        action: "Close unnecessary internet access.",
        why: "Public administrative interfaces create avoidable paths into cloud workloads.",
        check:
          "Review inbound rules for SSH, remote desktop, and management services. Prefer controlled private access paths.",
        source: aws("ec2"),
      },
      {
        title: "Excessive permissions",
        action: "Replace broad grants with needed access.",
        why: "Wildcard permissions can give a compromised identity control far beyond its task.",
        check:
          "Inspect effective permissions, including resource policies and role trusts, before narrowing access and testing the workflow.",
        source: aws("iam"),
      },
      {
        title: "Unprotected privileged accounts",
        action: "Protect privileged sign-in with MFA.",
        why: "Powerful accounts need stronger protection and limited routine use.",
        check:
          "Review root or equivalent administrator protections, recovery procedures, and emergency access ownership.",
        source: aws("iam"),
      },
      {
        title: "Unused credentials",
        action: "Remove stale access safely.",
        why: "Credentials that outlive their purpose leave access available without a current business need.",
        check:
          "Find inactive keys and accounts, confirm dependencies with owners, and remove or replace them through a controlled change.",
        source: aws("iam"),
      },
      {
        title: "Missing audit trails",
        action: "Record and protect cloud activity.",
        why: "Without a reliable activity record, investigations may not establish who changed what.",
        check:
          "Verify trail coverage, delivery, retention, access restrictions, and integrity controls. Test that an event reaches your monitoring workflow.",
        source: aws("cloudtrail"),
      },
      {
        title: "Encryption gaps",
        action: "Review encryption and key access.",
        why: "Encryption depends on configuration and who can use the key, not just an enabled setting.",
        check:
          "Check encryption for sensitive storage and databases; review key policies, rotation requirements, and recovery implications.",
        source: aws("kms"),
      },
      {
        title: "Public databases",
        action: "Restrict database network exposure.",
        why: "A database should not be reachable from the internet simply because a default made it convenient.",
        check:
          "Inspect public-access settings, network routes, security rules, authentication, and the application’s intended connection path.",
        source: aws("rds"),
      },
      {
        title: "Unprotected recovery data",
        action: "Protect backups and test restores.",
        why: "A configured backup job does not establish that recovery will work when needed.",
        check:
          "Check backup coverage and access controls, then test restoration against agreed recovery requirements.",
        source: aws("backup"),
      },
      {
        title: "Findings without owners",
        action: "Assign, remediate, and verify.",
        why: "Posture improves when findings result in verified changes, rather than accumulating in a dashboard.",
        check:
          "Give each significant finding an owner and due date. Document justified exceptions and verify fixes on the next assessment.",
        source:
          "https://learn.microsoft.com/en-us/azure/defender-for-cloud/security-recommendations",
      },
    ],
  },
  {
    slug: "top-10-llm-security-issues",
    category: "LLM SECURITY",
    title: "Top 10 LLM security issues: a practical guide",
    shortTitle: "10 LLM security issues",
    description:
      "The OWASP 2025 LLM risk categories explained with practical checks for applications, retrieval, agents, and model operations.",
    scope:
      "This guide follows the names and order of the OWASP Top 10 for LLM Applications, 2025 edition. The short explanations and implementation checks are Truva’s editorial guidance. Numbering is not a prediction of risk in your environment.",
    intro:
      "A model is only one part of an LLM application. Evaluate how inputs enter, which information retrieval exposes, how outputs are used, and what connected tools can do. Controls belong at those boundaries as well as in model evaluation.",
    items: [
      {
        title: "Prompt Injection",
        action: "Keep untrusted input from authorizing actions.",
        why: "Instructions in prompts or external content can steer the model away from the intended task.",
        check:
          "Test malicious retrieved content. Enforce tool permissions and sensitive-action approvals outside the model.",
        source: llm("llm01-prompt-injection"),
      },
      {
        title: "Sensitive Information Disclosure",
        action: "Limit sensitive information in context.",
        why: "An answer can expose information the recipient should not receive.",
        check:
          "Minimize sensitive inputs, apply retrieval permissions, and review provider retention and logging settings.",
        source: llm("llm022025-sensitive-information-disclosure"),
      },
      {
        title: "Supply Chain",
        action: "Verify models, packages, and providers.",
        why: "Third-party code, model artifacts, and data introduce dependencies that require review.",
        check:
          "Record versions and provenance. Isolate evaluation and prevent unreviewed dependencies from reaching production credentials.",
        source: llm("llm032025-supply-chain"),
      },
      {
        title: "Data and Model Poisoning",
        action: "Validate changes to training and data sources.",
        why: "Manipulated data or model components can introduce unwanted behavior that ordinary use may not reveal.",
        check:
          "Control ingestion and update permissions; track provenance and compare evaluation results after changes.",
        source: llm("llm042025-data-and-model-poisoning"),
      },
      {
        title: "Improper Output Handling",
        action: "Treat generated output as untrusted.",
        why: "Model output becomes dangerous when downstream software treats it as safe code, markup, or commands.",
        check:
          "Validate output types and apply context-appropriate escaping. Never execute generated commands merely because the model produced them.",
        source: llm("llm052025-improper-output-handling"),
      },
      {
        title: "Excessive Agency",
        action: "Limit tools, permissions, and autonomy.",
        why: "An agent can cause larger harm when it has unnecessary capabilities or can act without appropriate review.",
        check:
          "Prefer narrowly scoped tools and identities. Require approval for consequential actions and bound execution.",
        source: llm("llm062025-excessive-agency"),
      },
      {
        title: "System Prompt Leakage",
        action: "Keep secrets and authorization outside prompts.",
        why: "Hidden instructions may be disclosed. Their secrecy should not be the control protecting sensitive systems.",
        check:
          "Remove credentials and sensitive policy details from prompts. Enforce access rules in application code.",
        source: llm("llm072025-system-prompt-leakage"),
      },
      {
        title: "Vector and Embedding Weaknesses",
        action: "Make retrieval permission-aware.",
        why: "Shared indexes can retrieve documents across access boundaries or surface manipulated material.",
        check:
          "Partition and filter by authorized identity; test cross-tenant retrieval and changes to document permissions.",
        source: llm("llm082025-vector-and-embedding-weaknesses"),
      },
      {
        title: "Misinformation",
        action: "Verify important answers against evidence.",
        why: "A fluent answer can still be inaccurate, incomplete, or unsupported.",
        check:
          "Evaluate on representative tasks, verify references, and require human review where incorrect answers could cause significant harm.",
        source: llm("llm092025-misinformation"),
      },
      {
        title: "Unbounded Consumption",
        action: "Bound requests, runtime, and spend.",
        why: "Expensive inputs or repeated model and tool calls can exhaust capacity and increase cost.",
        check:
          "Set quotas, token and step limits, timeouts, and budget alerts. Test behavior when limits are reached.",
        source: llm("llm102025-unbounded-consumption"),
      },
    ],
  },
];
