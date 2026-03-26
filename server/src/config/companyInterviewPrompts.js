const LOGO_DEV_TOKEN = process.env.LOGO_DEV_TOKEN || "";

function buildLogoUrl(domain) {
  if (!domain) return "";
  const baseUrl = `https://img.logo.dev/${domain}`;
  return LOGO_DEV_TOKEN
    ? `${baseUrl}?token=${encodeURIComponent(LOGO_DEV_TOKEN)}`
    : baseUrl;
}

const COMPANY_PROMPT_MAP = {
  general: {
    key: "general",
    name: "General",
    title: "Balanced Interview Loop",
    logoUrl: "",
    prompt: `Interview style:
- Run a balanced loop across role-fit, technical depth, behavior, and communication.
- Use practical scenarios and measurable outcomes.
- Keep questions job-relevant and progressively deeper.
- Favor signal over trick questions.`,
  },
  google: {
    key: "google",
    name: "Google",
    title: "Google Interview Style",
    logoUrl: buildLogoUrl("google.com"),
    prompt: `Interview style inspired by Google:
- Emphasize structured problem solving, clarity of thought, and strong fundamentals.
- Ask for trade-offs, scalability, and correctness checks.
- Include behavioral probes for collaboration and ownership.
- Expect concise reasoning and iterative refinement.`,
  },
  microsoft: {
    key: "microsoft",
    name: "Microsoft",
    title: "Microsoft Interview Style",
    logoUrl: buildLogoUrl("microsoft.com"),
    prompt: `Interview style inspired by Microsoft:
- Evaluate customer impact, pragmatic engineering decisions, and system reliability.
- Combine coding/design depth with scenario-based collaboration questions.
- Probe debugging approach, maintainability, and communication in teams.
- Reward clear, actionable reasoning over theoretical perfection.`,
  },
  amazon: {
    key: "amazon",
    name: "Amazon",
    title: "Amazon Interview Style",
    logoUrl: buildLogoUrl("amazon.com"),
    prompt: `Interview style inspired by Amazon:
- Blend technical depth with leadership-principle-aligned behavioral questions.
- Push for metrics, ownership, and difficult decision trade-offs.
- Ask follow-ups that test bias for action and long-term thinking.
- Prefer concrete examples and measurable outcomes.`,
  },
  meta: {
    key: "meta",
    name: "Meta",
    title: "Meta Interview Style",
    logoUrl: buildLogoUrl("meta.com"),
    prompt: `Interview style inspired by Meta:
- Focus on speed-quality balance, product sense, and execution under ambiguity.
- Include coding or design follow-ups that require fast prioritization.
- Probe collaboration, feedback loops, and impact shipping.
- Keep conversation dynamic and direct.`,
  },
  apple: {
    key: "apple",
    name: "Apple",
    title: "Apple Interview Style",
    logoUrl: buildLogoUrl("apple.com"),
    prompt: `Interview style inspired by Apple:
- Emphasize craftsmanship, attention to detail, and end-to-end product quality.
- Ask about reliability, privacy/security thinking, and edge-case discipline.
- Probe cross-functional collaboration with design and product stakeholders.
- Expect precise, polished explanations.`,
  },
  netflix: {
    key: "netflix",
    name: "Netflix",
    title: "Netflix Interview Style",
    logoUrl: buildLogoUrl("netflix.com"),
    prompt: `Interview style inspired by Netflix:
- Stress high-ownership engineering, strong judgment, and context-aware autonomy.
- Ask about observability, resilience, and operating large-scale systems.
- Probe candid decision-making and accountability under pressure.
- Favor direct, high-signal questions.`,
  },
  uber: {
    key: "uber",
    name: "Uber",
    title: "Uber Interview Style",
    logoUrl: buildLogoUrl("uber.com"),
    prompt: `Interview style inspired by Uber:
- Focus on distributed systems, reliability at scale, and latency-sensitive design.
- Ask for production incident handling and rollback strategy.
- Probe execution speed while preserving correctness and safety.
- Expect practical trade-off reasoning.`,
  },
  atlassian: {
    key: "atlassian",
    name: "Atlassian",
    title: "Atlassian Interview Style",
    logoUrl: buildLogoUrl("atlassian.com"),
    prompt: `Interview style inspired by Atlassian:
- Evaluate product-minded engineering and collaboration in cross-functional teams.
- Ask about maintainable architecture, developer experience, and documentation discipline.
- Probe communication clarity and feedback culture.
- Keep a practical, team-oriented tone.`,
  },
  adobe: {
    key: "adobe",
    name: "Adobe",
    title: "Adobe Interview Style",
    logoUrl: buildLogoUrl("adobe.com"),
    prompt: `Interview style inspired by Adobe:
- Blend deep technical questions with product quality and user experience focus.
- Ask about performance optimization, accessibility, and robust engineering practices.
- Probe ownership over complex feature delivery.
- Reward clarity and technical rigor.`,
  },
  salesforce: {
    key: "salesforce",
    name: "Salesforce",
    title: "Salesforce Interview Style",
    logoUrl: buildLogoUrl("salesforce.com"),
    prompt: `Interview style inspired by Salesforce:
- Emphasize enterprise-grade reliability, security, and multi-tenant thinking.
- Ask about API design, integration strategy, and long-term maintainability.
- Probe communication with enterprise stakeholders.
- Focus on pragmatic architecture decisions.`,
  },
  tcs: {
    key: "tcs",
    name: "TCS",
    title: "TCS Interview Style",
    logoUrl: buildLogoUrl("tcs.com"),
    prompt: `Interview style inspired by TCS:
- Mix core CS fundamentals with enterprise project execution scenarios.
- Ask practical implementation and client-facing communication questions.
- Probe SDLC discipline, quality processes, and teamwork.
- Keep questions clear, structured, and role-relevant.`,
  },
  infosys: {
    key: "infosys",
    name: "Infosys",
    title: "Infosys Interview Style",
    logoUrl: buildLogoUrl("infosys.com"),
    prompt: `Interview style inspired by Infosys:
- Cover fundamentals, project delivery, and production support readiness.
- Ask scenario questions on issue resolution, optimization, and collaboration.
- Probe consistency, professionalism, and delivery ownership.
- Prefer practical examples from real work.`,
  },
  wipro: {
    key: "wipro",
    name: "Wipro",
    title: "Wipro Interview Style",
    logoUrl: buildLogoUrl("wipro.com"),
    prompt: `Interview style inspired by Wipro:
- Evaluate fundamentals, implementation quality, and client outcome thinking.
- Ask about debugging, testability, and process-aware execution.
- Probe adaptability across technologies and domains.
- Keep follow-ups focused and concise.`,
  },
  accenture: {
    key: "accenture",
    name: "Accenture",
    title: "Accenture Interview Style",
    logoUrl: buildLogoUrl("accenture.com"),
    prompt: `Interview style inspired by Accenture:
- Blend technical depth with consulting-style stakeholder communication.
- Ask about architecture trade-offs, delivery planning, and risk handling.
- Probe structured thinking and measurable business impact.
- Focus on clear prioritization under constraints.`,
  },
};

function normalizeKey(value) {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCompanyName(value) {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findByName(name) {
  const normalized = normalizeCompanyName(name);
  if (!normalized) return null;

  const exact = Object.values(COMPANY_PROMPT_MAP).find(
    (entry) => normalizeCompanyName(entry.name) === normalized,
  );
  if (exact) return exact;

  return (
    Object.values(COMPANY_PROMPT_MAP).find((entry) => {
      const entryName = normalizeCompanyName(entry.name);
      return entryName.includes(normalized) || normalized.includes(entryName);
    }) || null
  );
}

export function getCompanyPromptByKey(key) {
  const resolvedKey = normalizeKey(key) || "general";
  return COMPANY_PROMPT_MAP[resolvedKey] || COMPANY_PROMPT_MAP.general;
}

export function getCompanyPromptByName(name) {
  return findByName(name) || COMPANY_PROMPT_MAP.general;
}

export function resolveCompanyInterviewPrompt(companyProfile = {}) {
  const type = (companyProfile?.type || "preset").toString().toLowerCase();

  if (type === "custom") {
    const rawName = (companyProfile?.name || "Custom Company")
      .toString()
      .trim();
    const rawWebsite = (companyProfile?.website || "").toString().trim();
    const rawTitle = (companyProfile?.title || `${rawName} Interview Style`)
      .toString()
      .trim();
    const rawDescription = (companyProfile?.description || "")
      .toString()
      .trim();

    const customPrompt = rawDescription
      ? `Interview style designed for ${rawName}:\n- ${rawDescription}`
      : `Interview style designed for ${rawName}:\n- Keep interview questions tightly aligned with the company and role context.`;

    return {
      companyKey: "custom",
      companyName: rawName,
      companyWebsite: rawWebsite.slice(0, 300),
      logoUrl: "",
      promptTitle: rawTitle.slice(0, 150),
      promptText: customPrompt,
    };
  }

  const byKey = getCompanyPromptByKey(companyProfile?.key);

  // If key resolves to general but caller sent a name, try matching by name.
  const resolvedPreset =
    byKey.key === "general" && companyProfile?.name
      ? getCompanyPromptByName(companyProfile.name)
      : byKey;

  return {
    companyKey: resolvedPreset.key,
    companyName: resolvedPreset.name,
    companyWebsite: "",
    logoUrl: resolvedPreset.logoUrl || "",
    promptTitle: resolvedPreset.title,
    promptText: resolvedPreset.prompt,
  };
}

export const COMPANY_INTERVIEW_PROFILES = Object.values(COMPANY_PROMPT_MAP);
