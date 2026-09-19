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
    url: "https://doi.org/10.6028/NIST.AI.600-1",
  },
};
export const risks = [
  {
    id: "untracked-ai",
    title: "AI nobody owns",
    tag: "VISIBILITY",
    short: "Untracked AI use",
    source: sources.inventory,
    body: "A useful experiment can become a business dependency before anyone assigns an owner. Without an inventory, your team cannot reliably review the data, vendors, and permissions involved.",
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
    title: "Sensitive data crossing the wrong boundary",
    tag: "DATA",
    short: "Data leakage",
    source: sources.data,
    body: "Sensitive information can travel through prompts, retrieved documents, outputs, and logs. A private deployment still needs access controls; a provider’s training policy alone does not settle every data-handling question.",
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
    title: "AI endpoints with weak access controls",
    tag: "APPLICATIONS",
    short: "Exposed AI APIs",
    source: sources.api,
    body: "An AI feature is still an application. Missing authentication, weak object-level authorization, exposed debugging, and unrestricted requests can turn it into a path to private records or unexpected spend.",
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
    title: "Agents with more access than they need",
    tag: "IDENTITY",
    short: "Overprivileged agents",
    source: sources.agency,
    body: "The permissions behind an agent determine how far a mistake can spread. A read-only research task rarely needs write access across the entire workspace.",
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
    title: "Untrusted content giving the AI instructions",
    tag: "INPUTS",
    short: "Prompt injection",
    source: sources.injection,
    body: "A webpage, email, or retrieved file can contain instructions designed to redirect an AI system. Retrieval and a stronger system prompt do not eliminate this risk. Treat external content as data, not permission to act.",
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
    title: "Dependencies you have not verified",
    tag: "SUPPLY CHAIN",
    short: "Untrusted dependencies",
    source: sources.supply,
    body: "AI depends on more than a model name. Packages, model files, adapters, datasets, and external tools can introduce compromised code or unreviewed behavior. Popularity is not a security review.",
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
    title: "Retrieval that ignores document permissions",
    tag: "KNOWLEDGE",
    short: "RAG access gaps",
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
    title: "Actions without a meaningful approval step",
    tag: "ACTIONS",
    short: "Unchecked autonomy",
    source: sources.agency,
    body: "Even a correctly scoped agent can make a harmful decision within its allowed permissions. Choosing when it may act is a separate control from choosing what it can access.",
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
    title: "Activity you cannot reconstruct",
    tag: "OPERATIONS",
    short: "Monitoring blind spots",
    source: sources.governance,
    body: "A successful HTTP response says little about whether an AI workflow behaved safely. Teams need enough context to investigate which model, identity, tools, and approvals were involved—without creating a new sensitive-data repository.",
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
    title: "Reviews that stop at launch",
    tag: "GOVERNANCE",
    short: "One-time governance",
    source: sources.governance,
    body: "Changing a model, connector, prompt, or data source can change the risk of an approved system. Review needs an owner and clear triggers, not just a document signed before launch.",
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
