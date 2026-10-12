export interface WeekArticle {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  summary: string;
  eventDate?: string;
  eventDateLabel?: string;
  location?: string;
  session?: string;
  intro: string[];
  highlights: { title: string; body: string }[];
  takeaway: string;
  closing: string[];
  question: string;
  questions: { question: string; answer: string }[];
  links: { label: string; url: string }[];
  image?: { src: string; width: number; height: number; alt: string; caption: string };
}
// Local review drafts. Do not present the event date as a publication date.
export const reviewDate = "2026-10-11";
export const hubPath = "/blog/sf-tech-week-2026";
export const weekArticles: WeekArticle[] = [
  {
    "slug": "lessons",
    "image": {"src": "/images/sf-tech-week/week-overview.webp", "width": 1600, "height": 1205, "alt": "Attendees gathering at an SF Tech Week event", "caption": "Conversations during SF Tech Week."},
    "title": "SF Tech Week changed the questions I ask founders",
    "shortTitle": "What I learned at SF Tech Week",
    "description": "Satish reflects on SF Tech Week conversations about AI evals, sovereign AI, agent security, customers, branding and financial decisions.",
    "category": "FOUNDER PERSPECTIVE",
    "summary": "Meeting founders in person changed the questions I ask. My biggest takeaway was to spend more time listening before offering a solution.",
    "intro": [
      "Much of my outreach and learning has been through cold calls, emails, LinkedIn and YouTube. Meeting founders in person gave me a clearer picture of the challenges they are actually working through.",
      "A few things stood out:"
    ],
    "highlights": [
      {
        "title": "Evals",
        "body": "I met people working on how to test AI systems and understand whether their results are reliable. There is a lot happening here that I want to learn more about."
      },
      {
        "title": "Sovereign AI",
        "body": "At Open Source x Sovereign AI, Molly Mackinlay of FilOz gave a great presentation that brought questions of data ownership and infrastructure control into focus."
      },
      {
        "title": "Context and memory management",
        "body": "Conversations about what AI should remember, retain and carry between tools opened up new questions for me."
      },
      {
        "title": "Scaling agents securely",
        "body": "Build AI Agents with Auth0 at Okta explored agent security. The Google for Startups and Wiz session added perspectives on AI and cloud security."
      },
      {
        "title": "Understanding customers and building a brand",
        "body": "The session at Reddit headquarters explored how Reddit can be useful for founders. Tonik’s brand session and Sell & Scale at Okta added perspectives on positioning and reaching customers."
      },
      {
        "title": "Preparing for growth",
        "body": "The Series A panel at Expensify reinforced getting important commitments in writing and signed. Financial Systems for Founders with East Bay Founders brought practical lessons on cash, runway and financial decisions."
      }
    ],
    "takeaway": "Spend more time listening before offering a solution. Ask what the team is struggling with, what they have already tried and what is still getting in the way.",
    "closing": [
      "Thank you to the founders, speakers and organizers who shared their experience throughout the week."
    ],
    "question": "What has an in person conversation taught you that you hadn’t picked up online?",
    "questions": [
      {
        "question": "What stood out at SF Tech Week?",
        "answer": "Evals, sovereign AI, context and memory management, scaling agents securely, understanding customers, building a brand and preparing for growth were the themes that stayed with me."
      },
      {
        "question": "What will I do differently after these conversations?",
        "answer": "I want to listen longer before offering a solution and ask founders what they are struggling with, what they have tried and what still gets in the way."
      }
    ],
    "links": [
      {
        "label": "Financial Systems for Founders",
        "url": "/blog/sf-tech-week-2026/financial-systems-for-founders"
      },
      {
        "label": "Preparing for a Series A",
        "url": "/blog/sf-tech-week-2026/preparing-for-series-a"
      },
      {
        "label": "Selling to government",
        "url": "/blog/sf-tech-week-2026/sell-and-scale-with-government"
      },
      {
        "label": "Sovereign AI and agent memory",
        "url": "/blog/sf-tech-week-2026/sovereign-ai-data-context-control"
      },
      {
        "label": "Google for Startups and Wiz",
        "url": "/blog/sf-tech-week-2026/google-for-startups-wiz"
      },
      {
        "label": "MeetStream and Prefactor Founders Night",
        "url": "/blog/sf-tech-week-2026/founders-night-meetstream-prefactor"
      },
      {
        "label": "Potato Meter and brand building",
        "url": "/blog/sf-tech-week-2026/potato-meter-brand-building"
      },
      {
        "label": "Built by Community at Reddit",
        "url": "/blog/sf-tech-week-2026/built-by-community-reddit"
      },
      {
        "label": "Build AI Agents with Auth0",
        "url": "/blog/sf-tech-week-2026/build-ai-agents-with-auth0"
      },
      {
        "label": "Agents and APIs",
        "url": "/blog/sf-tech-week-2026/agents-and-apis"
      },
      {
        "label": "The Auth0 buyer pitch",
        "url": "/blog/sf-tech-week-2026/auth0-buyer-pitch"
      },
      {
        "label": "Can your agents actually ship?",
        "url": "/blog/sf-tech-week-2026/can-your-agents-actually-ship"
      },
      {
        "label": "Explore Truva’s AI security assessment",
        "url": "/services/ai-security-assessment"
      }
    ]
  },
  {
    "slug": "financial-systems-for-founders",
    "title": "Financial Systems for Founders: cash, runway and the next milestone",
    "shortTitle": "Financial Systems for Founders",
    "description": "Satish’s recap of Harry Prabandham’s Financial Systems for Founders session in Pleasanton, with lessons on spending, cash timing, scenarios and equity.",
    "category": "STARTUP FINANCE",
    "eventDate": "2026-10-08",
    "eventDateLabel": "8 October 2026",
    "location": "Pleasanton",
    "session": "Session 2",
    "summary": "Before making a financial decision, ask how much runway it buys and whether your cash gets you to the next meaningful milestone.",
    "intro": [
      "How much runway does your next financial decision actually buy?",
      "At Financial Systems for Founders in Pleasanton during SF Tech Week, Joshua Meiri and Harry Prabandham explored practical decisions founders face as they manage cash and prepare for growth.",
      "Harry’s presentation stood out. His delivery was clear and engaging, his slides were top notch, and the interactive format made the financial concepts much easier to work through. It was an amazing session.",
      "Raj Badrinath’s questions added real value. The conversation between Harry and Raj helped us explore the ideas further and learn more from the session.",
      "The session used the framework Define, Manage, Report. A few highlights stayed with me:"
    ],
    "highlights": [
      {
        "title": "Understand your spending",
        "body": "Separate mandatory costs, revenue producing investments and discretionary expenses. Before making a cut, calculate how much runway it adds."
      },
      {
        "title": "Look at when cash arrives",
        "body": "Faster collections and annual prepayments can help, but account for the discounts you offer to bring payments forward."
      },
      {
        "title": "Plan for different outcomes",
        "body": "Model upside, base and downside scenarios, and check whether your cash gets you to the next meaningful milestone."
      },
      {
        "title": "Keep ownership records clear",
        "body": "Know the share count behind each equity percentage and keep your records current."
      }
    ],
    "takeaway": "Use your financial model to decide what to do next. Pick your next milestone, work out the cash needed to reach it, and identify what you can change if growth falls below plan.",
    "closing": [
      "Based on this session, I’d recommend connecting with Harry if you’re exploring financial support for your startup. He is the founder and CEO of StartupCFO, a service of Rubric Financial, offering bookkeeping, tax and fractional CFO support.",
      "Thank you to Harry Prabandham, Joshua Meiri, Raj Badrinath, Sugata Sanyal and the East Bay Founders community for the session."
    ],
    "question": "Founders, which financial decision has made the biggest difference to your runway?",
    "questions": [
      {
        "question": "What was the financial framework for the session?",
        "answer": "Define, Manage, Report. My takeaway was to connect the model to the next decision and the cash needed to reach a meaningful milestone."
      },
      {
        "question": "Why would I recommend connecting with Harry Prabandham?",
        "answer": "My recommendation is based on this session: his clear and engaging delivery, strong slides and interactive discussion made the concepts easier to work through."
      }
    ],
    "links": [
      {
        "label": "Financial Systems for Founders event listing",
        "url": "https://luma.com/8vr4srl4"
      },
      {
        "label": "StartupCFO workshops",
        "url": "https://www.startupcfo.ai/workshops"
      },
      {
        "label": "Explore StartupCFO",
        "url": "https://www.startupcfo.ai/"
      },
      {
        "label": "Rubric Financial",
        "url": "https://www.rubricfinancial.com/"
      },
      {
        "label": "Read my overall SF Tech Week lessons",
        "url": "/blog/sf-tech-week-2026/lessons"
      },
      {
        "label": "Explore Truva’s compliance support",
        "url": "/services"
      }
    ]
  },
  {
    "slug": "preparing-for-series-a",
    "image": {"src": "/images/sf-tech-week/series-a-panel.webp", "width": 1600, "height": 1205, "alt": "Panel discussion at the Expensify Lounge during SF Tech Week", "caption": "The Series A panel at Expensify Lounge."},
    "title": "Preparing for a Series A: write it down and get it signed",
    "shortTitle": "Preparing for a Series A",
    "eventDate": "2026-10-07",
    "eventDateLabel": "7 October 2026",
    "location": "Expensify Lounge, 88 Kearny St, 16th floor, San Francisco",
    "category": "FUNDRAISING",
    "description": "Satish’s Series A panel recap: written commitments, signed agreements, organized records and preparing security evidence for diligence.",
    "summary": "Satish’s Series A panel recap: written commitments, signed agreements, organized records and preparing security evidence for diligence.",
    "intro": [
      "Before your next fundraising conversation, can you show what was agreed and who signed it?",
      "At Top 5 Things to Know When Preparing to Raise a Series A during SF Tech Week, Ariana Shaffer of Mignano Law Group repeatedly emphasized a point that stayed with me: capture important terms and commitments in writing, and get the agreements signed.",
      "The session at Expensify Lounge brought together perspectives from venture capital, legal and financial professionals on preparing for a Series A."
    ],
    "highlights": [
      {
        "title": "Capture the agreement",
        "body": "Put important terms and commitments in writing and get them signed. Credit to Ariana Shaffer for reinforcing this throughout the discussion. My takeaway was that a useful conversation still needs a clear, completed record."
      },
      {
        "title": "Make the record usable",
        "body": "Make sure everyone agrees on what the document says and keep completed records organized. The questions I want to carry into future conversations are simple: what was agreed, who signed it and where is the final version?"
      },
      {
        "title": "Prepare evidence early",
        "body": "The panel also discussed SOC 2, ISO standards and the importance of well managed products and processes when preparing for fundraising diligence. That connects closely with our work at Truva. The scope of preparation should follow the company’s risks and actual diligence requests."
      },
      {
        "title": "Be precise about compliance",
        "body": "SOC 2 is an attestation report, not a certification. ISO/IEC 27001 addresses information security management, while ISO/IEC 42001 addresses AI management. Their relevance depends on the organization and the requirements it needs to meet; they are not universal conditions for raising capital."
      },
      {
        "title": "Learn from the whole panel",
        "body": "Pete Lopez of CliftonLarsonAllen LLP was very down to earth, and I really appreciated our conversation during the session. Nick Tooker of Expensify guided the discussion through each phase of the funding journey, asked thoughtful questions at every stage and brought it together with a clear summary."
      }
    ],
    "takeaway": "Treat the written record and the supporting evidence as part of fundraising preparation. Important commitments should be understandable, signed and easy to find.",
    "closing": [
      "Thank you to Pramod Gosavi of Blumberg Capital, Ariana Shaffer of Mignano Law Group, Stephen Estes and Pete Lopez of CliftonLarsonAllen LLP, and Graham Siegel of shuckerVC.",
      "Thank you to moderator Nick Tooker and to Expensify and CliftonLarsonAllen LLP for hosting."
    ],
    "question": "Can you find the final signed version of every important commitment your team is relying on?",
    "questions": [
      {
        "question": "What was my strongest takeaway from the Series A panel?",
        "answer": "Capture important terms and commitments in writing, make sure everyone understands them and get the agreements signed."
      },
      {
        "question": "Does every startup need the same compliance evidence before fundraising?",
        "answer": "No. Preparation should be based on the company, its risks and the actual requirements from investors and customers. A SOC 2 report and ISO management system standards serve different purposes."
      }
    ],
    "links": [
      {
        "label": "Series A event and panel information",
        "url": "https://partiful.com/e/vuUlWETKsuNNoNrMynaA"
      },
      {
        "label": "AICPA overview of SOC assurance reports",
        "url": "https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services"
      },
      {
        "label": "ISO/IEC 27001 information security management",
        "url": "https://www.iso.org/standard/27001"
      },
      {
        "label": "ISO/IEC 42001 AI management",
        "url": "https://www.iso.org/standard/42001"
      },
      {
        "label": "Truva SOC 2 readiness support",
        "url": "/services/soc-2-readiness"
      },
      {
        "label": "Financial Systems for Founders recap",
        "url": "/blog/sf-tech-week-2026/financial-systems-for-founders"
      },
      {
        "label": "Return to my overall SF Tech Week lessons",
        "url": "/blog/sf-tech-week-2026/lessons"
      }
    ]
  },
  {
    "slug": "sell-and-scale-with-government",
    "image": {"src": "/images/sf-tech-week/sell-and-scale-okta.webp", "width": 1600, "height": 1205, "alt": "Audience watching a presentation at Okta headquarters", "caption": "Sell and Scale at Okta headquarters."},
    "title": "Sell and Scale at Okta: start with the buyer’s requirements",
    "shortTitle": "Selling to government",
    "eventDate": "2026-10-06",
    "eventDateLabel": "6 October 2026",
    "location": "Okta HQ, 100 First St, fifth floor, San Francisco",
    "category": "GOVERNMENT SALES",
    "description": "A conversation with Amy Johanek and Greg Hall at Okta about a first government contract and preparing for the requirements of the actual buyer.",
    "summary": "A conversation with Amy Johanek and Greg Hall at Okta about a first government contract and preparing for the requirements of the actual buyer.",
    "intro": [
      "Sell & Scale at Okta was a highlight of Day 2 at SF Tech Week. I had the opportunity to speak with Amy Johanek and Greg Hall about selling to government and working toward that first contract.",
      "Greg discussed SOC 2, ISO 27001 and ISO 42001, highlighting the importance of understanding compliance when pursuing federal and government projects."
    ],
    "highlights": [
      {
        "title": "Understand the buying context",
        "body": "My starting question is what the buyer actually needs in order to evaluate the product. A conversation about government opportunities is a reason to learn the procurement context before deciding which evidence to prepare."
      },
      {
        "title": "Scope compliance to the opportunity",
        "body": "The relevant requirements depend on the buyer, contract, data and intended use. Mentioning SOC 2 or an ISO standard in a discussion does not establish that every government contract requires it. Founders should check the actual opportunity and its requirements."
      },
      {
        "title": "Use the terms accurately",
        "body": "SOC 2 refers to an attestation report about controls. ISO/IEC 27001 concerns an information security management system, and ISO/IEC 42001 concerns an AI management system. These are distinct forms of assurance and management, rather than interchangeable badges."
      },
      {
        "title": "Prepare early enough to answer well",
        "body": "The discussion connects with our work at Truva helping startups with SOC 2 readiness and audit preparation. My takeaway is to identify the relevant requirement early, understand the work behind it and prepare evidence that addresses the buyer’s questions."
      }
    ],
    "takeaway": "Start with the actual buyer and contract. Build a preparation plan around their requirements instead of assuming that the same list applies to every opportunity.",
    "closing": [
      "Thank you, Amy and Greg, for a great discussion."
    ],
    "question": "Which buyer requirement would be hardest for your startup to demonstrate today?",
    "questions": [
      {
        "question": "Are SOC 2 and ISO standards required for every government contract?",
        "answer": "No universal requirement is established by this discussion. The actual buyer and contract determine which requirements apply."
      },
      {
        "question": "What did I take from Sell and Scale?",
        "answer": "Understand the relevant requirements early when pursuing that first government contract, and connect compliance preparation to the real opportunity."
      }
    ],
    "links": [
      {
        "label": "Sell and Scale official event listing",
        "url": "https://www.tech-week.com/calendar/sf/events/how-startups-can-sell-and-scale-with-the-government-b2b-cybersecurity-enterprise-411d5f06-87b9-40e6-8c0f-5b5a49601cef"
      },
      {
        "label": "AICPA SOC reporting overview",
        "url": "https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services"
      },
      {
        "label": "ISO/IEC 27001",
        "url": "https://www.iso.org/standard/27001"
      },
      {
        "label": "ISO/IEC 42001",
        "url": "https://www.iso.org/standard/42001"
      },
      {
        "label": "Truva SOC 2 readiness support",
        "url": "/services/soc-2-readiness"
      },
      {
        "label": "Return to my overall SF Tech Week lessons",
        "url": "/blog/sf-tech-week-2026/lessons"
      }
    ]
  },
  {
    "slug": "sovereign-ai-data-context-control",
    "image": {"src": "/images/sf-tech-week/sovereign-ai.webp", "width": 1600, "height": 1205, "alt": "Speaker presenting about portable AI data at Open Source x Sovereign AI", "caption": "A presentation at Open Source x Sovereign AI."},
    "title": "Sovereign AI: who owns your data, context and agent work?",
    "shortTitle": "Sovereign AI and agent memory",
    "eventDate": "2026-10-07",
    "eventDateLabel": "7 October 2026",
    "location": "The Fold, San Francisco",
    "category": "SOVEREIGN AI",
    "description": "Lessons from Open Source x Sovereign AI on data ownership, portable agent assets, memory and questions to ask about infrastructure protections.",
    "summary": "Lessons from Open Source x Sovereign AI on data ownership, portable agent assets, memory and questions to ask about infrastructure protections.",
    "intro": [
      "If you switch AI providers tomorrow, what happens to your data, your context and the work your agents have already done?",
      "That question stood out at the Sovereign AI sessions during SF Tech Week. Molly Mackinlay of FilOz gave a great presentation on Sovereign AI Needs a Sovereign Cloud.",
      "The event also included separate talks and demonstrations on agent assets, infrastructure verification and Private by Design. These were different contributions to the broader conversation."
    ],
    "highlights": [
      {
        "title": "Ask what you can take with you",
        "body": "Ownership of AI memory brought a practical set of questions into focus: where does the data live, who can access it, what is retained and can we take our context with us? For me, the important point was to ask about the usable work left behind when a team changes tools."
      },
      {
        "title": "Distinguish files from full agent memory",
        "body": "A demonstration showed one AI creating a file, storing it through Filecoin and IPFS and another retrieving it to continue the work. Moving files is a useful step. It does not, by itself, transfer an agent’s full memory, identity or permissions."
      },
      {
        "title": "Ask what infrastructure evidence establishes",
        "body": "A presentation explored signed evidence that an AI system meets an approved security policy as new servers join. The questions I took away were what the evidence covers, who checks it and what happens when a server fails the check or access must be revoked."
      },
      {
        "title": "Look at protection during processing",
        "body": "The Private by Design discussion explored confidential computing and encrypted AI. I want to understand who can access sensitive information during processing and how the claimed protections can be verified. The name of a technology alone is not a complete answer to those questions."
      }
    ],
    "takeaway": "Evaluate AI tools beyond the quality of their answers. Ask whether you can export data, context and work in a usable format, what remains behind when you change providers, and how access and infrastructure protections can be verified.",
    "closing": [
      "Thank you to Molly Mackinlay for a great presentation and to the speakers and organizers for the talks and demonstrations."
    ],
    "question": "If you changed providers tomorrow, which parts of your team’s AI work could you actually carry forward?",
    "questions": [
      {
        "question": "Does portable file storage transfer an agent’s full memory?",
        "answer": "No. The demonstration showed a file being created, stored and retrieved. That is useful portability, but full memory, identity and permissions are separate questions."
      },
      {
        "question": "What should founders ask about sovereign AI?",
        "answer": "Ask where data lives, who can access it, what is retained, whether context can be exported and what evidence supports the infrastructure’s protections."
      }
    ],
    "links": [
      {
        "label": "Open Source x Sovereign AI program",
        "url": "https://luma.com/opensourcesf"
      },
      {
        "label": "IPFS documentation",
        "url": "https://docs.ipfs.tech/concepts/what-is-ipfs/"
      },
      {
        "label": "Truva AI security assessment",
        "url": "/services/ai-security-assessment"
      },
      {
        "label": "Build AI Agents with Auth0 recap",
        "url": "/blog/sf-tech-week-2026/build-ai-agents-with-auth0"
      },
      {
        "label": "Return to my overall SF Tech Week lessons",
        "url": "/blog/sf-tech-week-2026/lessons"
      }
    ]
  },
  {
    "slug": "google-for-startups-wiz",
    "image": {"src": "/images/sf-tech-week/google-for-startups.webp", "width": 1600, "height": 1205, "alt": "Attendees at the Google for Startups event venue", "caption": "At the Google for Startups event during SF Tech Week."},
    "title": "Google for Startups and Wiz: bringing security into the growth conversation",
    "shortTitle": "Google for Startups and Wiz",
    "eventDate": "2026-10-06",
    "eventDateLabel": "6 October 2026",
    "location": "The Aviary at Metreon, 135 Fourth St, fourth floor, San Francisco",
    "category": "AI AND CLOUD SECURITY",
    "description": "Satish’s reflection on meeting Wiz at Google for Startups during SF Tech Week and connecting AI and cloud security with founders’ growth questions.",
    "summary": "Satish’s reflection on meeting Wiz at Google for Startups during SF Tech Week and connecting AI and cloud security with founders’ growth questions.",
    "intro": [
      "The Google for Startups and Wiz session was one of the places where meeting people in person added something different to my usual online learning.",
      "I met the Wiz team and had a great discussion with Nadia Malik. The session added perspectives on AI and cloud security to the questions I was hearing from founders throughout the week."
    ],
    "highlights": [
      {
        "title": "Bring the founder’s problem into the conversation",
        "body": "My broader lesson from the week was to listen before offering a solution. In an AI and cloud security conversation, I want to start with what a team is building, what is getting in its way and what it has already tried."
      },
      {
        "title": "Connect security with production questions",
        "body": "The official program included security, trust and scaling into production as themes. Those themes are useful prompts for thinking about how a startup grows. They describe the program, rather than a claim that I attended every talk on its agenda."
      },
      {
        "title": "Keep learning through direct discussion",
        "body": "Meeting Wiz and speaking with Nadia gave me another perspective to carry into future conversations. The value of the week was not just collecting topics; it was finding better questions to ask the next founder I meet."
      }
    ],
    "takeaway": "Make room for direct conversations about AI and cloud security. Start with the team’s actual situation and use that context to understand what support would be useful.",
    "closing": [
      "Thank you to Nadia Malik, the Wiz team and the Google for Startups organizers."
    ],
    "question": "What changes in your security conversation when you begin with the founder’s immediate challenge?",
    "questions": [
      {
        "question": "What did I take from Google for Startups and Wiz?",
        "answer": "I valued meeting Wiz and discussing AI and cloud security with Nadia Malik. It added to my broader lesson about listening to founders before proposing solutions."
      },
      {
        "question": "Which themes were in the official program?",
        "answer": "Security, trust and scaling into production were program themes. This recap does not imply that I attended every scheduled talk."
      }
    ],
    "links": [
      {
        "label": "Google for Startups official SF Tech Week program",
        "url": "https://cloud.google.com/startup/sf-techweek-26"
      },
      {
        "label": "Nadia Malik on LinkedIn",
        "url": "https://www.linkedin.com/in/nadia-a-malik/"
      },
      {
        "label": "Truva cloud security assessment",
        "url": "/services/cloud-security-assessment"
      },
      {
        "label": "Return to my overall SF Tech Week lessons",
        "url": "/blog/sf-tech-week-2026/lessons"
      }
    ]
  },
  {
    "slug": "founders-night-meetstream-prefactor",
    "title": "Founders Night: making room for conversations",
    "shortTitle": "MeetStream and Prefactor Founders Night",
    "eventDate": "2026-10-07",
    "eventDateLabel": "7 October 2026",
    "location": "WeWork, 650 California St, San Francisco",
    "category": "FOUNDER COMMUNITY",
    "description": "A short reflection on attending MeetStream and Prefactor Founders Night and making space for direct founder conversations during SF Tech Week.",
    "summary": "A short reflection on attending MeetStream and Prefactor Founders Night and making space for direct founder conversations during SF Tech Week.",
    "intro": [
      "I attended MeetStream and Prefactor Founders Night during SF Tech Week. It was another opportunity to be in the room with founders instead of relying entirely on online outreach."
    ],
    "highlights": [
      {
        "title": "Make space for the conversation",
        "body": "Much of my outreach has been through cold calls, emails and LinkedIn. Showing up in person was part of changing that pattern during the week."
      },
      {
        "title": "Carry a better question into the room",
        "body": "The question I am taking forward is what a founder is actually struggling with, what they have already tried and what still gets in the way. That is a lesson from the week as a whole, rather than a quote from this event."
      }
    ],
    "takeaway": "There is value in making time for the conversation itself. The next step is to listen carefully enough to understand the problem before deciding whether I can help.",
    "closing": [
      "Thank you to MeetStream, Prefactor and the founders who made time for the evening."
    ],
    "question": "What do you learn from meeting founders that you do not get from online outreach?",
    "questions": [
      {
        "question": "What did attending in person add to the week?",
        "answer": "It created another opportunity for direct founder conversations alongside my usual online outreach. My broader lesson was to listen before offering a solution."
      }
    ],
    "links": [
      {
        "label": "MeetStream and Prefactor Founders Night listing",
        "url": "https://partiful.com/e/LjKDM6n7Dt6d3RRw5Nqs"
      },
      {
        "label": "Return to my overall SF Tech Week lessons",
        "url": "/blog/sf-tech-week-2026/lessons"
      }
    ]
  },
  {
    "slug": "potato-meter-brand-building",
    "image": {"src": "/images/sf-tech-week/potato-meter.webp", "width": 1600, "height": 1205, "alt": "Audience watching a Potato Meter brand discussion", "caption": "The Potato Meter brand discussion."},
    "title": "Potato Meter: paying closer attention to brand building",
    "shortTitle": "Potato Meter and brand building",
    "eventDate": "2026-10-08",
    "eventDateLabel": "8 October 2026",
    "location": "San Francisco",
    "category": "BRAND BUILDING",
    "description": "Satish’s reflection on tonik’s Potato Meter event and why understanding brand building belongs alongside product and customer conversations.",
    "summary": "Satish’s reflection on tonik’s Potato Meter event and why understanding brand building belongs alongside product and customer conversations.",
    "intro": [
      "I enjoyed the advanced brand building discussion at tonik’s Potato Meter event during SF Tech Week. It added another perspective to a week full of product, security and founder conversations.",
      "The event program named Lester Chen of a16z, Morgane Palomares of Braintrust, Malthe Sigurdsson of Stripe and Maya Spivak of marketing.fan."
    ],
    "highlights": [
      {
        "title": "Pay attention to how the business is understood",
        "body": "The brand session added perspective on positioning and reaching customers. Alongside the week’s other conversations, it reminded me to think about how clearly a founder can explain the business to someone hearing about it for the first time."
      },
      {
        "title": "Connect brand with listening",
        "body": "My broader takeaway was to understand the customer’s challenge before offering a solution. For me, that applies to how we describe our work as well as the services we deliver."
      }
    ],
    "takeaway": "Keep learning about brand building while listening to customers. I want the way we describe our work to reflect the problems founders actually care about.",
    "closing": [
      "Thank you to tonik and the speakers for the brand building discussion."
    ],
    "question": "Can a new customer quickly understand what your company does and why it matters to them?",
    "questions": [
      {
        "question": "What was Potato Meter about?",
        "answer": "The tonik event explored brand building. It added perspective on positioning and reaching customers to my SF Tech Week learning."
      }
    ],
    "links": [
      {
        "label": "Potato Meter event and speaker program",
        "url": "https://partiful.com/e/Ho7ram64t8T4HCvzZceM"
      },
      {
        "label": "The Auth0 buyer pitch recap",
        "url": "/blog/sf-tech-week-2026/auth0-buyer-pitch"
      },
      {
        "label": "Return to my overall SF Tech Week lessons",
        "url": "/blog/sf-tech-week-2026/lessons"
      }
    ]
  },
  {
    "slug": "built-by-community-reddit",
    "image": {"src": "/images/sf-tech-week/reddit-community.webp", "width": 1600, "height": 1205, "alt": "Opening remarks at Reddit's SF Tech Week community event", "caption": "Built by Community at Reddit headquarters."},
    "title": "Built by Community at Reddit: listening where founders’ customers gather",
    "shortTitle": "Built by Community at Reddit",
    "eventDate": "2026-10-08",
    "eventDateLabel": "8 October 2026",
    "location": "Reddit headquarters, San Francisco",
    "category": "CUSTOMER UNDERSTANDING",
    "description": "A reflection on Built by Community at Reddit headquarters with Chris Slowe and learning how Reddit can be useful for founders.",
    "summary": "A reflection on Built by Community at Reddit headquarters with Chris Slowe and learning how Reddit can be useful for founders.",
    "intro": [
      "The Built by Community session at Reddit headquarters explored how Reddit can be useful for founders. It was another reminder that understanding customers belongs alongside building the product.",
      "The event featured Chris Slowe, Reddit cofounder and former CTO."
    ],
    "highlights": [
      {
        "title": "Make customer understanding part of the work",
        "body": "The session added a different perspective to my usual outreach and learning. It made me think about the places founders can learn what people are asking, discussing and struggling with."
      },
      {
        "title": "Listen before offering a solution",
        "body": "My takeaway across the week applies here too: spend more time listening, understand what people have already tried and ask what is still getting in the way. That is the question I want to carry into future customer conversations."
      }
    ],
    "takeaway": "Treat customer understanding as ongoing work. The session broadened the places I want to learn from, without replacing direct conversations with founders.",
    "closing": [
      "Thank you to Chris Slowe, Reddit and the organizers for the session."
    ],
    "question": "Where do your customers discuss the problems they do not mention in a sales call?",
    "questions": [
      {
        "question": "What did I learn at Built by Community?",
        "answer": "The session explored Reddit’s usefulness for founders and added to my interest in understanding customers before offering a solution."
      },
      {
        "question": "What was Chris Slowe’s role?",
        "answer": "Chris Slowe is a Reddit cofounder and former CTO. This recap does not describe him as the current CTO."
      }
    ],
    "links": [
      {
        "label": "Built by Community event listing",
        "url": "https://partiful.com/e/g7T5GSDUlro0XwbsaGFI"
      },
      {
        "label": "The Potato Meter brand building recap",
        "url": "/blog/sf-tech-week-2026/potato-meter-brand-building"
      },
      {
        "label": "Return to my overall SF Tech Week lessons",
        "url": "/blog/sf-tech-week-2026/lessons"
      }
    ]
  },
  {
    "slug": "build-ai-agents-with-auth0",
    "title": "Build AI Agents with Auth0: bring identity and permissions into the design",
    "shortTitle": "Build AI Agents with Auth0",
    "eventDate": "2026-10-08",
    "eventDateLabel": "8 October 2026",
    "location": "Okta headquarters, San Francisco",
    "category": "AGENT SECURITY",
    "description": "Satish’s reflection on the Auth0 event at Okta and the questions agent security raises about identity, permissions and connected tools.",
    "summary": "Satish’s reflection on the Auth0 event at Okta and the questions agent security raises about identity, permissions and connected tools.",
    "intro": [
      "Build AI Agents with Auth0 at Okta explored agent security during SF Tech Week. It connected with the conversations I was having about context, memory and scaling agents.",
      "The advertised program included Token Vault, asynchronous authorization, fine grained permissions and MCP authentication."
    ],
    "highlights": [
      {
        "title": "Ask what the agent is allowed to do",
        "body": "The event put agent security alongside the work of building agents. The design question I want to take forward is what an agent should be able to access or change in a real workflow."
      },
      {
        "title": "Consider connected tools explicitly",
        "body": "The program’s identity and authorization topics point to questions about how an agent connects to other systems. My follow up questions are whose identity is being used, which permissions apply and how access can be removed."
      },
      {
        "title": "Connect permissions with context and memory",
        "body": "Across the week, I learned about what AI should remember and carry between tools. Those conversations make the permission question more concrete: being able to retrieve context is different from being authorized to use it for every action."
      }
    ],
    "takeaway": "Include identity and permissions in the early conversation about an agent. A useful demonstration should lead to more precise questions about the workflow it may eventually support.",
    "closing": [
      "Thank you to Auth0, Okta and the organizers for the session."
    ],
    "question": "Can your team explain which identity and permissions each agent uses when it reaches a tool?",
    "questions": [
      {
        "question": "What topics were advertised for the Auth0 event?",
        "answer": "Token Vault, asynchronous authorization, fine grained permissions and MCP authentication were listed in the program."
      },
      {
        "question": "What questions am I taking forward about agent permissions?",
        "answer": "Whose identity does the agent use, what can it access or change, and how can access be removed? These are questions to work through for the actual workflow."
      }
    ],
    "links": [
      {
        "label": "Build AI Agents with Auth0 event program",
        "url": "https://partiful.com/e/zlmTqYKeEARu8g53wE9a"
      },
      {
        "label": "Truva AI security assessment",
        "url": "/services/ai-security-assessment"
      },
      {
        "label": "Sovereign AI and agent memory recap",
        "url": "/blog/sf-tech-week-2026/sovereign-ai-data-context-control"
      },
      {
        "label": "Return to my overall SF Tech Week lessons",
        "url": "/blog/sf-tech-week-2026/lessons"
      }
    ]
  },
  {
    "slug": "agents-and-apis",
    "image": {"src": "/images/sf-tech-week/agents-and-apis.webp", "width": 1600, "height": 1205, "alt": "Agents and APIs Developer Meetup event screen", "caption": "The Agents and APIs Developer Meetup."},
    "title": "Agents and APIs: opening the week with builders",
    "shortTitle": "Agents and APIs",
    "eventDate": "2026-10-05",
    "eventDateLabel": "5 October 2026",
    "location": "CANOPY Jackson Square, 595 Pacific Ave, fourth floor, San Francisco",
    "category": "BUILDING AI",
    "description": "A brief recap of the Agents and APIs event at CANOPY Jackson Square and how it fits into Satish’s wider SF Tech Week learning.",
    "summary": "A brief recap of the Agents and APIs event at CANOPY Jackson Square and how it fits into Satish’s wider SF Tech Week learning.",
    "intro": [
      "Agents & APIs was part of my first day at SF Tech Week. I attended the event at CANOPY Jackson Square as the week’s conversations about building and scaling AI were getting started.",
      "The program named Michelle Marcelline of PromptingCompany, Nihar Nandan of Postman, Quentin Rousseau of Rootly, Chatan Konda of Baseten and Tomas Pozo of Supabase."
    ],
    "highlights": [
      {
        "title": "Put online learning in a wider context",
        "body": "YouTube and online resources have been a significant part of my learning. Being in the room with builders was part of a different way of learning during this week."
      },
      {
        "title": "Follow the questions across events",
        "body": "Evals, context, memory and scaling agents were themes I explored throughout SF Tech Week. I am keeping those as overall lessons rather than presenting them as a detailed account of this event’s agenda."
      }
    ],
    "takeaway": "Keep combining online learning with direct conversations. The week gave me more questions to investigate, rather than a finished view of how every agent system should be built.",
    "closing": [
      "Thank you to the speakers and organizers of Agents & APIs."
    ],
    "question": "Which question becomes clearer when you discuss it with someone building the system?",
    "questions": [
      {
        "question": "Where and when was Agents and APIs?",
        "answer": "The event was on 5 October 2026 at CANOPY Jackson Square, 595 Pacific Ave, fourth floor, San Francisco."
      }
    ],
    "links": [
      {
        "label": "Agents and APIs event and speakers",
        "url": "https://partiful.com/e/bkdCMLAO0Y2rJQjxJMoq"
      },
      {
        "label": "Can your agents actually ship recap",
        "url": "/blog/sf-tech-week-2026/can-your-agents-actually-ship"
      },
      {
        "label": "Return to my overall SF Tech Week lessons",
        "url": "/blog/sf-tech-week-2026/lessons"
      }
    ]
  },
  {
    "slug": "auth0-buyer-pitch",
    "image": {"src": "/images/sf-tech-week/auth0-buyer-pitch.webp", "width": 1600, "height": 1205, "alt": "Audience at the Auth0 AI Devtool Buyer Pitch event", "caption": "The Auth0 AI Devtool Buyer Pitch event."},
    "title": "The Auth0 buyer pitch: clarity, timing and credibility",
    "shortTitle": "The Auth0 buyer pitch",
    "eventDate": "2026-10-05",
    "eventDateLabel": "5 October 2026",
    "location": "San Francisco",
    "category": "FOUNDER PITCHES",
    "description": "Lessons from eight pitches at the Auth0 buyer event: explain the value clearly, understand timing and treat credibility separately from a buying commitment.",
    "summary": "Lessons from eight pitches at the Auth0 buyer event: explain the value clearly, understand timing and treat credibility separately from a buying commitment.",
    "intro": [
      "At the Auth0 buyer pitch event during the first day of SF Tech Week, I saw eight pitches. Two points stayed with me: explaining the value clearly and understanding the credibility a buyer needs.",
      "Javier Lopez of Clutch stood out for a clear one sentence explanation of value and the importance of timing. Manoj Pahuja of Handshake brought attention to SOC 2 as a credibility signal."
    ],
    "highlights": [
      {
        "title": "Make the value understandable",
        "body": "A clear explanation gives a listener a starting point. Javier’s one sentence description stayed with me because it connected the pitch to something a buyer could understand quickly."
      },
      {
        "title": "Pay attention to timing",
        "body": "Value and timing belong in the same conversation. My takeaway is to ask whether the problem matters to the buyer now, rather than assume that a clear pitch alone makes an opportunity ready."
      },
      {
        "title": "Understand what supports credibility",
        "body": "The discussion of SOC 2 highlighted the role of evidence in a buyer’s evaluation. SOC 2 is an attestation report, not a certification. What evidence a buyer needs depends on the organization and the opportunity."
      },
      {
        "title": "Keep interest separate from commitment",
        "body": "The buyers did not say they would buy. Feedback, interest and a useful conversation are different from a purchasing commitment. I want to preserve that distinction when I describe what happened or decide what to do next."
      }
    ],
    "takeaway": "Explain the value simply, ask about timing and understand the buyer’s evidence needs. Then follow the actual conversation rather than treating interest as a sale.",
    "closing": [
      "Thank you to the founders, buyers and organizers for the discussion."
    ],
    "question": "Can you explain your value in one sentence and still distinguish positive feedback from an actual commitment?",
    "questions": [
      {
        "question": "Did buyers commit to purchasing at this event?",
        "answer": "No buying commitment is claimed. The buyers did not say they would buy."
      },
      {
        "question": "What stood out from the eight pitches?",
        "answer": "Javier Lopez’s clear explanation of value and timing, and Manoj Pahuja’s discussion of SOC 2 credibility, were the points that stayed with me."
      }
    ],
    "links": [
      {
        "label": "Auth0 buyer pitch event listing",
        "url": "https://partiful.com/e/rtaNxMHufDNSg4ZVDGDT"
      },
      {
        "label": "Satish’s original reflection on LinkedIn",
        "url": "https://www.linkedin.com/feed/update/urn:li:activity:7513288659475779584/"
      },
      {
        "label": "AICPA SOC reporting overview",
        "url": "https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services"
      },
      {
        "label": "Truva SOC 2 readiness support",
        "url": "/services/soc-2-readiness"
      },
      {
        "label": "Return to my overall SF Tech Week lessons",
        "url": "/blog/sf-tech-week-2026/lessons"
      }
    ]
  },
  {
    "slug": "can-your-agents-actually-ship",
    "title": "Can your agents actually ship? Look beyond generated code",
    "shortTitle": "Can your agents actually ship?",
    "eventDate": "2026-10-05",
    "eventDateLabel": "5 October 2026",
    "location": "VirtusLab, 3 Embarcadero Center, Codi street level, San Francisco",
    "category": "AGENT DELIVERY",
    "description": "A reflection on an SF Tech Week program about moving from agent generated code to delivery, validation, review and governance.",
    "summary": "A reflection on an SF Tech Week program about moving from agent generated code to delivery, validation, review and governance.",
    "intro": [
      "Can your agents actually ship? was part of my first day at SF Tech Week. Its focus on delivery beyond code generation connected with the questions I was beginning to ask about scaling agents.",
      "The program covered pipelines, CI, review and security gates, context, validation and governance."
    ],
    "highlights": [
      {
        "title": "Look at the delivery path",
        "body": "The program framed shipping as more than generating code. The question I want to carry forward is what happens between an agent’s output and a change being accepted into a real product."
      },
      {
        "title": "Ask how a result is checked",
        "body": "Review, validation and security gates were part of the advertised discussion. For me, those topics connect with learning about evals across the week: a result needs a way to be examined before a team relies on it."
      },
      {
        "title": "Keep context and governance in view",
        "body": "Context and governance were also program themes. My follow up questions are what information an agent has, which decisions it can make and who is responsible for accepting the work."
      }
    ],
    "takeaway": "When evaluating an agent workflow, ask about the path to delivery as well as the generated output. The program gave me a useful set of questions to explore further.",
    "closing": [
      "Thank you to the hosts and organizers for a conversation about what it takes for agents to ship."
    ],
    "question": "What must happen before your team accepts an agent’s output as a finished change?",
    "questions": [
      {
        "question": "What was the event’s focus?",
        "answer": "The advertised program focused on delivery beyond code generation, including pipelines, CI, review, security gates, context, validation and governance."
      },
      {
        "question": "What should I ask about an agent’s path to delivery?",
        "answer": "What happens after output is generated, how it is reviewed and validated, which security gates apply and who accepts the finished work?"
      }
    ],
    "links": [
      {
        "label": "Can your agents actually ship official listing",
        "url": "https://www.tech-week.com/calendar/sf/events/can-your-agents-actually-ship-7b81ad16-6b52-494b-927f-3121472482bc"
      },
      {
        "label": "Build AI Agents with Auth0 recap",
        "url": "/blog/sf-tech-week-2026/build-ai-agents-with-auth0"
      },
      {
        "label": "Truva AI security assessment",
        "url": "/services/ai-security-assessment"
      },
      {
        "label": "Return to my overall SF Tech Week lessons",
        "url": "/blog/sf-tech-week-2026/lessons"
      }
    ]
  }
];
