export const sources = {
  inventory: {
    name: "NIST AI Risk Management Framework",
    url: "https://www.nist.gov/itl/ai-risk-management-framework",
  },
  data: {
    name: "OWASP: Sensitive Information Disclosure",
    url: "https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/",
  },
  api: {
    name: "OWASP API Security Top 10 (2023)",
    url: "https://api-security.owasp.org/editions/2023/en/0x11-t10/",
  },
  agency: {
    name: "OWASP: Excessive Agency",
    url: "https://genai.owasp.org/llmrisk/llm062025-excessive-agency/",
  },
  injection: {
    name: "OWASP: Prompt Injection",
    url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/",
  },
  supply: {
    name: "OWASP: Supply Chain",
    url: "https://genai.owasp.org/llmrisk/llm032025-supply-chain/",
  },
  retrieval: {
    name: "OWASP: Vector and Embedding Weaknesses",
    url: "https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/",
  },
  governance: {
    name: "NIST Generative AI Profile (AI 600-1)",
    url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence",
  },
};
export const risks = [
  {
    id: "untracked-ai",
    title: "AI nobody owns",
    tag: "VISIBILITY",
    short: "Untracked AI use",
    source: sources.inventory,
    body: "A useful experiment can become critical before anyone owns it. Without a list of AI use cases, your team cannot reliably review the data, vendors, or permissions involved.",
    example:
      "A team uses a personal AI account to summarize internal documents. Procurement and security have no record of it.",
    actions: [
      "Record the owner, purpose, provider, data types, and connected systems for each AI use case.",
      "Give employees an approved option and a simple route to request new tools.",
    ],
    evidence: "An AI inventory with a named owner for every business use case.",
  },
  {
    id: "data-leakage",
    title: "Sensitive data going where it should not",
    tag: "DATA",
    short: "Data leakage",
    source: sources.data,
    body: "Sensitive information can appear in prompts, retrieved documents, outputs, and logs. Even a private setup needs access controls and clear rules for retention and deletion.",
    example:
      "A support assistant includes another customer’s account details in an otherwise helpful answer.",
    actions: [
      "Minimize and redact sensitive inputs; keep credentials out of model context.",
      "Review retention, training use, logging, and deletion settings for each provider and integration.",
    ],
    evidence:
      "A data-flow map showing what leaves each system and who can retrieve it.",
  },
  {
    id: "exposed-apis",
    title: "AI APIs with weak access controls",
    tag: "APPLICATIONS",
    short: "Exposed AI APIs",
    source: sources.api,
    body: "An AI feature needs the same protections as any other application. Weak login checks, tenant boundaries, or rate limits can expose private records or create unexpected costs.",
    example:
      "A logged-in user changes a document identifier and receives a summary of another tenant’s file.",
    actions: [
      "Enforce user, tenant, and object authorization in application code on every request.",
      "Disable unnecessary endpoints and set rate, token, and spend limits.",
    ],
    evidence:
      "Negative tests proving one tenant cannot access another tenant’s data.",
  },
  {
    id: "permissions",
    title: "Agents with too much access",
    tag: "IDENTITY",
    short: "Too much agent access",
    source: sources.agency,
    body: "An agent can cause only as much damage as its permissions allow. A research assistant rarely needs write access across the entire workspace.",
    example:
      "An assistant that finds invoices also has permission to change supplier payment details.",
    actions: [
      "Use a dedicated identity with narrowly scoped tools and credentials.",
      "Separate read and write capabilities, and recheck authorization at tool execution.",
    ],
    evidence:
      "A tool-permission list that ties each capability to a specific business need.",
  },
  {
    id: "prompt-injection",
    title: "Outside content telling AI what to do",
    tag: "INPUTS",
    short: "Prompt injection",
    source: sources.injection,
    body: "A webpage, email, or file can contain instructions that try to redirect an AI system. Treat outside content as data, never as permission to act.",
    example:
      "An assistant reads a document that tells it to send internal information to an external address.",
    actions: [
      "Test adversarial content at every input boundary, including retrieved documents.",
      "Constrain tools and destinations; require approval before sensitive actions.",
    ],
    evidence:
      "Test results showing that malicious document instructions cannot authorize tool actions.",
  },
  {
    id: "supply-chain",
    title: "Tools and models you have not checked",
    tag: "SUPPLY CHAIN",
    short: "Unchecked dependencies",
    source: sources.supply,
    body: "AI systems rely on packages, models, datasets, and external tools. Any of them can add unreviewed code or behavior. Popularity is not proof of safety.",
    example:
      "A team pulls a model helper from an unverified repository and runs its setup code in an environment with production credentials.",
    actions: [
      "Use approved sources, record versions and provenance, and verify artifact integrity where supported.",
      "Isolate evaluation environments and review dependencies before granting production access.",
    ],
    evidence:
      "A versioned dependency inventory with a review and update owner.",
  },
  {
    id: "retrieval",
    title: "Search that ignores document permissions",
    tag: "KNOWLEDGE",
    short: "Search access gaps",
    source: sources.retrieval,
    body: "Retrieval-augmented generation (RAG) adds company knowledge to a model’s context. If the retrieval layer ignores permissions, a helpful answer can expose information its user could never open directly.",
    example:
      "An employee asks about compensation and the assistant retrieves restricted HR documents from a shared index.",
    actions: [
      "Apply user and tenant permissions before retrieved content enters model context.",
      "Test cross-role access and how document permission changes propagate to the index.",
    ],
    evidence:
      "Retrieval tests using users with different roles and deliberately restricted documents.",
  },
  {
    id: "autonomy",
    title: "AI actions without human approval",
    tag: "ACTIONS",
    short: "Actions without approval",
    source: sources.agency,
    body: "Access limits are not enough. Even within approved permissions, an agent can take the wrong action. Decide when a person must review and approve what happens next.",
    example:
      "An agent sends a customer-facing commitment before a person has reviewed the recipient and exact wording.",
    actions: [
      "Require review of the actual action and payload for consequential sends, changes, and transactions.",
      "Bound execution with step limits, stop controls, and recovery procedures.",
    ],
    evidence:
      "A tested approval gate that cannot be satisfied by the model’s own output.",
  },
  {
    id: "monitoring",
    title: "Activity you cannot trace",
    tag: "OPERATIONS",
    short: "Missing activity records",
    source: sources.governance,
    body: "A successful request does not prove an AI workflow behaved safely. Keep enough context to see which model, identity, tools, and approvals were involved without creating a new store of sensitive data.",
    example:
      "A customer reports an unauthorized change, but the team cannot connect it to an agent run or tool call.",
    actions: [
      "Trace identities, model versions, retrieval references, tool calls, and approval events.",
      "Redact sensitive content, restrict log access, and test alerts for unexpected actions.",
    ],
    evidence:
      "A sample investigation that reconstructs a run from request to final action.",
  },
  {
    id: "governance",
    title: "Security reviews that end at launch",
    tag: "GOVERNANCE",
    short: "One-time reviews",
    source: sources.governance,
    body: "A new model, connector, prompt, or data source can change risk. Review needs an owner and clear triggers after launch, not just a document signed once.",
    example:
      "A previously read-only assistant gains an email-sending tool without a new risk review.",
    actions: [
      "Define which changes require reassessment and who can approve them.",
      "Keep evaluation results, exceptions, and remediation decisions with the release record.",
    ],
    evidence:
      "A change record connecting new capabilities to updated tests and accountable approval.",
  },
];
