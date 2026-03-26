const LOGO_DEV_TOKEN = import.meta.env.VITE_LOGO_DEV_TOKEN || "";

function buildLogoUrl(domain) {
  if (!domain) return "";
  const baseUrl = `https://img.logo.dev/${domain}`;
  return LOGO_DEV_TOKEN
    ? `${baseUrl}?token=${encodeURIComponent(LOGO_DEV_TOKEN)}`
    : baseUrl;
}

export const COMPANY_INTERVIEW_PROFILES = [
  {
    key: "general",
    name: "Software Developer @ General",
    logoUrl: "",
    website: "",
    styleSummary:
      "Balanced mix of technical, behavioral, and role-fit questions.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Standard software engineering role focusing on writing clean, maintainable code, implementing software design patterns, and demonstrating strong logical and problem-solving abilities across the stack.",
  },
  {
    key: "google",
    name: "Software Developer @ Google",
    logoUrl: buildLogoUrl("google.com"),
    website: "https://careers.google.com",
    styleSummary:
      "Structured problem solving, fundamentals, and scalability trade-offs.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Design, develop, test, deploy, maintain, and enhance software solutions to manage our massive search and cloud infrastructure. You will write server-side code for web-based applications, construct robust logic for high-volume data processing, and develop prototypes quickly to answer critical business and engineering questions. A solid foundation in algorithms, data structures, and system design is essential, alongside a passion for solving complex, ambiguous problems at a global scale.",
  },
  {
    key: "microsoft",
    name: "Software Developer @ Microsoft",
    logoUrl: buildLogoUrl("microsoft.com"),
    website: "https://careers.microsoft.com",
    styleSummary: "Customer impact, pragmatic engineering, and collaboration.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Collaborate with cross-functional teams to design, build, and deliver high-quality features for enterprise software and cloud services like Azure. You will participate in all stages of our engineering lifecycle, from initial research and discovery to deployment and post-release support. We value pragmatic problem-solving, an inclusive team culture, a growth mindset, and a strong dedication to customer impact and accessibility.",
  },
  {
    key: "amazon",
    name: "Software Developer @ Amazon",
    logoUrl: buildLogoUrl("amazon.com"),
    website: "https://www.amazon.jobs",
    styleSummary:
      "Leadership-principle behavior with deep technical follow-ups.",
    defaultRole: "Software Development Engineer (SDE)",
    defaultJobDescription:
      "Design and build scalable, highly available, and highly performant distributed systems used by millions of customers globally. You will take full ownership of the technical design, development, and operational excellence of core services. Exhibiting our Leadership Principles, you will dive deep into complex technical challenges, invent and simplify, and demonstrate an unrelenting customer obsession while delivering high-quality, maintainable code.",
  },
  {
    key: "jpmorgan",
    name: "Software Developer @ JPMorgan",
    logoUrl: buildLogoUrl("jpmorganchase.com"),
    website: "https://careers.jpmorgan.com",
    styleSummary:
      "Financial-systems reliability, risk-aware design, and secure engineering.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Build secure, resilient software platforms powering global payments, markets, and digital banking products. You will design and maintain high-availability services, optimize system performance under strict compliance constraints, and deliver production-grade code with strong testing and observability. The role emphasizes risk-aware engineering, incident readiness, and clear communication with cross-functional business and control partners.",
  },
  {
    key: "meta",
    name: "Software Developer @ Meta",
    logoUrl: buildLogoUrl("meta.com"),
    website: "https://www.metacareers.com",
    styleSummary: "Fast execution, product thinking, and ambiguity handling.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Build scalable products and infrastructure that connect billions of people worldwide. You will dive into a fast-paced, highly collaborative environment, driving end-to-end implementation of new features and optimizing complex backend services. We prioritize hackers with a strong product-mindset who can navigate ambiguity, move fast, and tackle challenges across the stack ranging from mobile and web interfaces to distributed infrastructure.",
  },
  {
    key: "apple",
    name: "Software Developer @ Apple",
    logoUrl: buildLogoUrl("apple.com"),
    website: "https://jobs.apple.com",
    styleSummary: "Craftsmanship, detail orientation, and quality ownership.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Create extraordinary software with an unwavering focus on flawless user experiences. You will collaborate closely with hardware, design, and product teams to integrate software directly into the Apple ecosystem. Expect to engage in rigorous code reviews, adhere to the highest standards of craftsmanship, and demonstrate a meticulous attention to detail while ensuring performance, privacy, and long-term architectural stability.",
  },
  {
    key: "netflix",
    name: "Software Developer @ Netflix",
    logoUrl: buildLogoUrl("netflix.com"),
    website: "https://jobs.netflix.com",
    styleSummary: "High ownership, judgment, and production resiliency.",
    defaultRole: "Senior Software Engineer",
    defaultJobDescription:
      "Operate at an unparalleled scale within a culture of Freedom and Responsibility. You will architect, implement, and operate highly resilient, fault-tolerant distributed microservices that power the global streaming experience. We look for seasoned engineers who exercise exceptional judgment, embrace extreme autonomy, and possess a track record of driving production reliability and shaping broad architectural strategies.",
  },
  {
    key: "uber",
    name: "Software Developer @ Uber",
    logoUrl: buildLogoUrl("uber.com"),
    website: "https://www.uber.com/careers",
    styleSummary: "Scale-heavy distributed systems and operational excellence.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Architect and build complex, real-time dispatch and routing platforms that bridge the physical and digital worlds. You will engineer ultra-low latency, highly concurrent systems capable of handling geospatial data and dynamic pricing logic at scale. Strong focus on robust telemetry, rapid incident mitigation, and pushing the boundaries of algorithmic optimization is expected.",
  },
  {
    key: "atlassian",
    name: "Software Developer @ Atlassian",
    logoUrl: buildLogoUrl("atlassian.com"),
    website: "https://www.atlassian.com/company/careers",
    styleSummary:
      "Team-first engineering, maintainability, and product execution.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Design, build, and scale world-class collaboration tools (like Jira and Confluence) that empower millions of teams globally. You will write maintainable, well-tested code, drive architectural modernization, and focus heavily on developer productivity. We value open collaboration, an 'open company, no bullshit' mindset, and a passion for removing friction from the end-user experience.",
  },
  {
    key: "adobe",
    name: "Software Developer @ Adobe",
    logoUrl: buildLogoUrl("adobe.com"),
    website: "https://careers.adobe.com",
    styleSummary: "Deep technical quality plus user experience excellence.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Develop sophisticated applications that blend world-class creative tools with robust document cloud services. You will build highly responsive interfaces, optimize complex core algorithms (often involving geometry, media processing, or machine learning), and ensure seamless cross-platform performance. A deep appreciation for technical quality coupled with design excellence is vital.",
  },
  {
    key: "salesforce",
    name: "Software Developer @ Salesforce",
    logoUrl: buildLogoUrl("salesforce.com"),
    website: "https://careers.salesforce.com",
    styleSummary: "Enterprise reliability, security, and integration mindset.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Develop multi-tenant cloud architectures that prioritize data security, massive scalability, and uncompromising enterprise reliability. You will work on building scalable microservices, robust API ecosystems, and advanced data integrations. Trust is our #1 value; we expect you to deliver code that is secure by design and capable of powering mission-critical applications for global enterprises.",
  },
  {
    key: "tcs",
    name: "Software Developer @ TCS",
    logoUrl: buildLogoUrl("tcs.com"),
    website: "https://www.tcs.com/careers",
    styleSummary: "Fundamentals plus enterprise project delivery scenarios.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Design, develop, and support comprehensive IT solutions for multi-national enterprise clients. You will adapt to varied technical stacks, ensuring strict adherence to software engineering fundamentals, project milestones, and rigorous client specifications. Effective communication, business domain context, and the ability to ensure uninterrupted service delivery are paramount.",
  },
  {
    key: "infosys",
    name: "Software Developer @ Infosys",
    logoUrl: buildLogoUrl("infosys.com"),
    website: "https://www.infosys.com/careers",
    styleSummary: "Strong fundamentals, delivery ownership, and consistency.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Contribute to large-scale digital transformation initiatives across global markets. You will execute well-defined software lifecycle phases—including requirement analysis, implementation, and rigorous testing. Maintaining structural code quality, establishing robust CI/CD pipelines, and showcasing unwavering delivery ownership and consistency are essential requirements.",
  },
  {
    key: "wipro",
    name: "Software Developer @ Wipro",
    logoUrl: buildLogoUrl("wipro.com"),
    website: "https://careers.wipro.com",
    styleSummary:
      "Implementation quality, support readiness, and adaptability.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Implement robust software components in strict compliance with macro system architectures. You will engage deeply with requirement gathering, module development, advanced debugging, and continuous optimization. We seek adaptable engineers who can readily pivot across technologies and prioritize long-term scalable maintenance and enterprise-grade support readiness.",
  },
  {
    key: "accenture",
    name: "Software Developer @ Accenture",
    logoUrl: buildLogoUrl("accenture.com"),
    website: "https://www.accenture.com/us-en/careers",
    styleSummary:
      "Technical depth with stakeholder communication and planning.",
    defaultRole: "Software Engineer",
    defaultJobDescription:
      "Deliver innovative technology solutions and strategies bridging the gap between business processes and technical execution. You will balance hands-on coding skills with agile methodologies, spearheading complex system modernization efforts. The role demands stellar stakeholder communication, meticulous project planning, and technical versatility.",
  },
];

const profileMap = new Map(
  COMPANY_INTERVIEW_PROFILES.map((item) => [item.key, item]),
);

export function getCompanyProfileByKey(key) {
  return profileMap.get(key) || profileMap.get("general");
}

export function findCompanyKeyByName(name) {
  const normalized = (name || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return null;

  const exact = COMPANY_INTERVIEW_PROFILES.find((profile) => {
    const n = profile.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return n === normalized;
  });

  if (exact) return exact.key;

  const fuzzy = COMPANY_INTERVIEW_PROFILES.find((profile) => {
    const n = profile.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return n.includes(normalized) || normalized.includes(n);
  });

  return fuzzy?.key || null;
}

export function buildVoiceCompanyStylePrompt(companyProfile) {
  const type = (companyProfile?.type || "preset").toLowerCase();
  if (type === "custom") {
    const companyName = (companyProfile?.name || "Custom Company").trim();
    const title = (
      companyProfile?.title || `${companyName} Interview Style`
    ).trim();
    const description = (companyProfile?.description || "").trim();
    const website = (companyProfile?.website || "").trim();

    return `Company Interview Focus:\n${title}\n${description}${website ? `\nReference company page: ${website}` : ""}`;
  }

  const selected = getCompanyProfileByKey(companyProfile?.key || "general");
  return `Company Interview Focus:\n${selected.name} style\n${selected.styleSummary}`;
}
