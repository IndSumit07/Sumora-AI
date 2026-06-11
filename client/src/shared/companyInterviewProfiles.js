const LOGO_DEV_TOKEN = import.meta.env.VITE_LOGO_DEV_TOKEN || "";

function buildLogoUrl(domain) {
  if (!domain) return "";
  const baseUrl = `https://img.logo.dev/${domain}`;
  return LOGO_DEV_TOKEN
    ? `${baseUrl}?token=${encodeURIComponent(LOGO_DEV_TOKEN)}`
    : baseUrl;
}

// ── All available job roles ───────────────────────────────────────────────────

export const JOB_ROLES = {
  software_engineer: {
    key: "software_engineer",
    name: "Software Engineer",
    jobDescription:
      "Designs, develops, tests, and maintains scalable software systems. Applies strong foundations in data structures, algorithms, and object-oriented programming to build efficient and reliable applications. Works on system design, debugging, performance optimization, and writing clean, maintainable code that follows best engineering practices.",
    tools: ["Java", "Python", "C++", "Git", "Spring Boot", "REST APIs"],
    skills: [
      "Data Structures",
      "Algorithms",
      "OOP",
      "System Design",
      "Problem Solving",
      "Debugging",
      "Version Control",
      "Code Optimization",
    ],
  },
  fullstack_dev: {
    key: "fullstack_dev",
    name: "Full Stack Developer",
    jobDescription:
      "Builds end-to-end web applications by developing both frontend and backend systems. Ensures seamless integration between user interfaces and server-side logic while maintaining scalability, performance, and security. Handles API design, database integration, authentication, and responsive UI development.",
    tools: ["React", "Node.js", "Express", "MongoDB", "MySQL"],
    skills: [
      "Frontend Development",
      "Backend Development",
      "API Design",
      "Database Management",
      "Authentication",
      "Web Architecture",
      "Performance Optimization",
    ],
  },
  backend_dev: {
    key: "backend_dev",
    name: "Backend Developer",
    jobDescription:
      "Designs and develops server-side applications, APIs, and database systems. Focuses on scalability, performance, and data integrity while ensuring secure and efficient communication between services.",
    tools: ["Java", "Spring Boot", "Node.js", "PostgreSQL", "Redis"],
    skills: [
      "API Development",
      "Database Design",
      "System Design",
      "Scalability",
      "Caching",
      "Security",
    ],
  },
  frontend_dev: {
    key: "frontend_dev",
    name: "Frontend Developer",
    jobDescription:
      "Builds interactive and responsive user interfaces that deliver a seamless user experience across devices. Focuses on UI performance, accessibility, and modern web standards.",
    tools: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
    skills: [
      "UI Development",
      "Responsive Design",
      "State Management",
      "Performance Optimization",
      "Accessibility",
    ],
  },
  mobile_dev: {
    key: "mobile_dev",
    name: "Mobile App Developer",
    jobDescription:
      "Develops high-performance mobile applications for Android and iOS platforms. Ensures responsiveness, usability, and smooth user interactions while integrating APIs and backend services.",
    tools: ["Flutter", "Kotlin", "Swift", "React Native"],
    skills: [
      "Mobile Development",
      "UI Design",
      "API Integration",
      "Performance Optimization",
      "App Lifecycle",
    ],
  },
  ai_engineer: {
    key: "ai_engineer",
    name: "AI Engineer",
    jobDescription:
      "Designs, builds, and deploys intelligent systems using machine learning and deep learning models. Works across the full AI lifecycle including data preprocessing, model training, evaluation, deployment, and monitoring. Focuses on integrating AI into production systems with scalability, reliability, and performance optimization.",
    tools: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "Keras",
      "OpenAI API",
      "LangChain",
      "Docker",
      "Kubernetes",
    ],
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Neural Networks",
      "NLP",
      "Computer Vision",
      "MLOps",
      "Model Deployment",
      "Feature Engineering",
      "Optimization",
    ],
  },
  ml_engineer: {
    key: "ml_engineer",
    name: "Machine Learning Engineer",
    jobDescription:
      "Builds scalable machine learning pipelines and production-ready models. Focuses on efficient data processing, model optimization, and deployment. Ensures reliability, performance, and maintainability of ML systems in real-world applications.",
    tools: [
      "Python",
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
      "MLflow",
      "Kubeflow",
    ],
    skills: [
      "ML Algorithms",
      "Feature Engineering",
      "Model Optimization",
      "Hyperparameter Tuning",
      "Distributed Systems",
      "MLOps",
    ],
  },
  genai_engineer: {
    key: "genai_engineer",
    name: "Generative AI Engineer",
    jobDescription:
      "Develops applications powered by large language models and generative AI systems. Designs prompt pipelines, retrieval-augmented generation (RAG) systems, and fine-tuned models for tasks such as content generation, summarization, and conversational AI.",
    tools: [
      "OpenAI API",
      "LangChain",
      "Hugging Face",
      "LlamaIndex",
      "Vector Databases",
    ],
    skills: [
      "LLMs",
      "Prompt Engineering",
      "RAG",
      "Embeddings",
      "Fine-tuning",
      "Transformer Models",
    ],
  },
  prompt_engineer: {
    key: "prompt_engineer",
    name: "Prompt Engineer",
    jobDescription:
      "Designs and optimizes prompts for AI models to improve output quality, accuracy, and consistency. Works on prompt strategies such as few-shot learning, chain-of-thought reasoning, and evaluation of model responses.",
    tools: ["ChatGPT", "Claude", "PromptLayer"],
    skills: [
      "Prompt Design",
      "Few-shot Learning",
      "Chain-of-Thought",
      "Evaluation",
      "NLP Basics",
    ],
  },
  data_scientist: {
    key: "data_scientist",
    name: "Data Scientist",
    jobDescription:
      "Analyzes large datasets to extract insights and build predictive models. Applies statistical techniques and machine learning algorithms to solve business problems and communicate findings effectively.",
    tools: ["Python", "R", "Pandas", "NumPy", "Scikit-learn", "Tableau"],
    skills: [
      "Statistics",
      "Machine Learning",
      "Data Analysis",
      "Data Visualization",
      "Hypothesis Testing",
      "Feature Engineering",
    ],
  },
  data_analyst: {
    key: "data_analyst",
    name: "Data Analyst",
    jobDescription:
      "Collects, cleans, and analyzes data to generate reports and dashboards. Helps organizations make data-driven decisions by identifying trends and patterns.",
    tools: ["SQL", "Excel", "Power BI", "Tableau"],
    skills: [
      "SQL",
      "Data Cleaning",
      "Visualization",
      "Reporting",
      "Business Analysis",
    ],
  },
  data_engineer: {
    key: "data_engineer",
    name: "Data Engineer",
    jobDescription:
      "Designs and maintains data pipelines and architectures for efficient data processing and storage. Ensures data quality, scalability, and reliability for analytics and machine learning systems.",
    tools: ["Apache Spark", "Kafka", "Airflow", "SQL", "BigQuery"],
    skills: [
      "ETL",
      "Data Warehousing",
      "Big Data",
      "Pipeline Design",
      "Distributed Systems",
    ],
  },
  cloud_engineer: {
    key: "cloud_engineer",
    name: "Cloud Engineer",
    jobDescription:
      "Designs, deploys, and manages cloud infrastructure ensuring scalability, availability, and security. Works on cloud architecture, cost optimization, and system reliability.",
    tools: ["AWS", "Azure", "GCP", "Terraform", "Docker"],
    skills: [
      "Cloud Computing",
      "Networking",
      "Security",
      "Infrastructure as Code",
      "Monitoring",
    ],
  },
  cloud_architect: {
    key: "cloud_architect",
    name: "Cloud Architect",
    jobDescription:
      "Designs high-level cloud architecture solutions for scalable, secure, and cost-efficient systems. Defines cloud strategies and ensures alignment with business and technical requirements.",
    tools: ["AWS", "Azure", "GCP", "Terraform"],
    skills: [
      "Cloud Architecture",
      "System Design",
      "Security",
      "Cost Optimization",
      "Scalability",
    ],
  },
  devops_engineer: {
    key: "devops_engineer",
    name: "DevOps Engineer",
    jobDescription:
      "Automates development and deployment workflows using CI/CD pipelines. Ensures system reliability, monitoring, and efficient infrastructure management.",
    tools: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform"],
    skills: [
      "CI/CD",
      "Automation",
      "Monitoring",
      "Infrastructure Management",
      "Scripting",
    ],
  },
  sre: {
    key: "sre",
    name: "Site Reliability Engineer",
    jobDescription:
      "Ensures reliability, scalability, and performance of systems through monitoring, automation, and incident management.",
    tools: ["Kubernetes", "Prometheus", "Grafana"],
    skills: [
      "System Reliability",
      "Monitoring",
      "Incident Response",
      "Performance Optimization",
    ],
  },
  cybersecurity: {
    key: "cybersecurity",
    name: "Cybersecurity Analyst",
    jobDescription:
      "Protects systems and networks from cyber threats by monitoring, detecting, and responding to security incidents.",
    tools: ["Wireshark", "Metasploit", "Nmap", "Burp Suite"],
    skills: [
      "Network Security",
      "Threat Analysis",
      "Vulnerability Assessment",
      "Incident Response",
    ],
  },
  ethical_hacker: {
    key: "ethical_hacker",
    name: "Ethical Hacker",
    jobDescription:
      "Performs penetration testing to identify vulnerabilities in systems and applications, ensuring security and compliance.",
    tools: ["Kali Linux", "Metasploit", "Burp Suite"],
    skills: ["Penetration Testing", "Exploitation", "Security Testing"],
  },
  product_manager: {
    key: "product_manager",
    name: "Product Manager",
    jobDescription:
      "Leads product strategy, defines requirements, and collaborates with teams to deliver products aligned with business goals.",
    tools: ["JIRA", "Confluence", "Notion"],
    skills: [
      "Product Strategy",
      "Roadmapping",
      "Stakeholder Management",
      "Agile",
    ],
  },
  technical_pm: {
    key: "technical_pm",
    name: "Technical Project Manager",
    jobDescription:
      "Manages technical projects, ensuring timely delivery, coordination between teams, and alignment with technical goals.",
    tools: ["JIRA", "MS Project"],
    skills: [
      "Project Management",
      "Agile",
      "Communication",
      "Technical Understanding",
    ],
  },
  uiux: {
    key: "uiux",
    name: "UI/UX Designer",
    jobDescription:
      "Designs intuitive user interfaces and experiences through research, prototyping, and usability testing.",
    tools: ["Figma", "Adobe XD", "Sketch"],
    skills: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Usability Testing",
      "Design Thinking",
    ],
  },
  blockchain_dev: {
    key: "blockchain_dev",
    name: "Blockchain Developer",
    jobDescription:
      "Develops decentralized applications and smart contracts on blockchain platforms, ensuring security and transparency.",
    tools: ["Solidity", "Ethereum", "Web3.js"],
    skills: [
      "Blockchain",
      "Smart Contracts",
      "Cryptography",
      "Distributed Systems",
    ],
  },
  automation_dev: {
    key: "automation_dev",
    name: "Automation Developer",
    jobDescription:
      "Builds automated workflows and systems to improve efficiency and reduce manual effort using scripting and RPA tools.",
    tools: ["UiPath", "Selenium", "Zapier"],
    skills: ["Automation", "Scripting", "RPA", "Process Optimization"],
  },
  ai_ethics: {
    key: "ai_ethics",
    name: "AI Ethics Specialist",
    jobDescription:
      "Ensures AI systems are fair, transparent, and compliant with ethical and regulatory standards. Identifies bias and ensures responsible AI deployment.",
    tools: ["AI Audit Tools"],
    skills: ["AI Ethics", "Bias Detection", "Governance", "Policy Design"],
  },
};

export function getRoleByKey(key) {
  return JOB_ROLES[key] || null;
}

// ── Companies with their available roles ─────────────────────────────────────

export const COMPANIES = [
  // ── INDIA ───────────────────────────────────────────────────────────────────
  {
    key: "tcs",
    name: "Tata Consultancy Services",
    region: "India",
    logoUrl: buildLogoUrl("tcs.com"),
    website: "https://www.tcs.com/careers",
    description:
      "India's largest IT services company and one of the world's biggest employers in tech. The interview process has three stages: an online aptitude and coding assessment (TCS NQT — Numerical Ability, Verbal, Reasoning, and 1–2 easy coding problems in C/Java/Python), followed by a Technical Interview covering core CS fundamentals (OOP, DBMS, OS, data structures, and at least one programming language in depth), and a final HR round focused on communication, adaptability, and willingness to be deployed across service lines. TCS strongly values consistency in fundamentals over competitive-programming depth. For lateral/experienced hires, additional rounds include technology-specific deep-dives and managerial interviews. Expect questions from your project work and academic background.",
    availableRoles: [
      "software_engineer",
      "data_engineer",
      "cloud_engineer",
      "devops_engineer",
      "ai_engineer",
      "ml_engineer",
    ],
  },
  {
    key: "infosys",
    name: "Infosys",
    region: "India",
    logoUrl: buildLogoUrl("infosys.com"),
    website: "https://www.infosys.com/careers",
    description:
      "Global IT consulting and services company that hires at massive scale through campus and off-campus drives. The process for freshers involves: an Online Aptitude Test (Logical, Quantitative, Verbal, and Pseudo-code sections), a Technical Interview probing core CS (OOP concepts, DBMS with SQL queries, OS basics, networking, and one programming language), and an HR round. Three tracks exist — Systems Engineer (general), Digital Specialist Engineer (AI/ML/Cloud), and Specialist Programmer (high-level coding requiring medium-difficulty DSA). Lateral hires face additional Managerial and Behavioral rounds assessing delivery experience. All selected freshers undergo training at Infosys's Global Education Center in Mysuru. Interviewers expect calm problem-solving under pressure and clear communication.",
    availableRoles: [
      "software_engineer",
      "data_scientist",
      "cloud_engineer",
      "ai_engineer",
    ],
  },
  {
    key: "wipro",
    name: "Wipro",
    region: "India",
    logoUrl: buildLogoUrl("wipro.com"),
    website: "https://careers.wipro.com",
    description:
      "Leading IT services and consulting company known for structured, communication-heavy interviews. The Wipro Elite NTH (National Talent Hunt) process for freshers includes: an Online Test (Aptitude, English, Domain, Coding), a Technical Interview covering fundamentals in your preferred language plus OS, DBMS, and networking concepts, and an HR/Communication Assessment with high emphasis on English fluency, presentation skills, and clarity of thought. Wipro recruiters are notably strict about communication quality — it can eliminate otherwise technically competent candidates. Security-conscious teams also probe cloud security and compliance topics. Experienced hires face 2–3 technical rounds plus a managerial discussion focused on past project delivery and problem-solving under constraints.",
    availableRoles: [
      "software_engineer",
      "cybersecurity",
      "cloud_engineer",
      "devops_engineer",
    ],
  },
  {
    key: "hcl",
    name: "HCL Technologies",
    region: "India",
    logoUrl: buildLogoUrl("hcltech.com"),
    website: "https://www.hcltech.com/careers",
    description:
      "Global technology company with strong cloud-native and DevOps culture. The recruitment process involves an Online Assessment (Aptitude, Core Technical MCQs on CS fundamentals, and Coding), a Technical Interview that goes deeper into engineering depth — expect hands-on cloud architecture questions, Docker/Kubernetes concepts for DevOps roles, and data structure fundamentals for software engineering tracks — and an HR round. HCL increasingly focuses on candidates with practical exposure to cloud platforms (AWS, Azure, GCP) and CI/CD pipelines for its infrastructure-heavy teams. Lateral rounds include a Technology Assessment by a senior architect and a Managerial Discussion. HCL values learning agility and cross-technology adaptability.",
    availableRoles: ["software_engineer", "cloud_engineer", "devops_engineer"],
  },
  {
    key: "techmahindra",
    name: "Tech Mahindra",
    region: "India",
    logoUrl: buildLogoUrl("techmahindra.com"),
    website: "https://careers.techmahindra.com",
    description:
      "Digital transformation company with major presence in telecom, enterprise, and government sectors. The interview process for freshers includes an Aptitude and Technical Online Test, a Technical Interview focused on CS fundamentals, your preferred programming language, SQL queries, and domain-specific knowledge relevant to telecom or enterprise tech stacks, and a final HR round. For experienced engineering roles, expect 2–3 technical rounds with growing emphasis on cloud data pipelines (Kafka, Spark, Azure/AWS) and software design. Telecom-domain candidates may face network protocol questions (TCP/IP, REST vs gRPC). Tech Mahindra looks for candidates who can adapt quickly across diverse client environments.",
    availableRoles: ["software_engineer", "data_engineer", "cloud_engineer"],
  },
  {
    key: "ltimindtree",
    name: "LTIMindtree",
    region: "India",
    logoUrl: buildLogoUrl("ltimindtree.com"),
    website: "https://www.ltimindtree.com/careers",
    description:
      "Technology consulting and digital solutions company formed by the merger of L&T Infotech and Mindtree. Known for a relatively strong engineering bar compared to typical IT services companies. The process typically includes an Online Coding Test (2–3 medium-difficulty DSA problems), a Technical Interview covering data structures, algorithms, system design basics, and hands-on coding in at least one language, and an HR round. AI and data engineering tracks have additional rounds testing ML fundamentals and data pipeline design. Interviewers appreciate structured thinking, clean code, and the ability to explain time/space complexity clearly. Lateral hires face deeper technical assessments and a managerial round.",
    availableRoles: ["software_engineer", "data_engineer", "ai_engineer"],
  },
  {
    key: "cognizant",
    name: "Cognizant",
    region: "India",
    logoUrl: buildLogoUrl("cognizant.com"),
    website: "https://careers.cognizant.com",
    description:
      "Professional services company delivering technology and business transformation globally. The GenC (fresher) interview process includes an Online Assessment with Aptitude, Automata Fix (code-debugging), and a Coding challenge, followed by a Technical Interview on OOP, DBMS, networking, and core programming knowledge. Communication skills are heavily weighted, especially for client-facing tracks. For cloud and data roles, interviewers probe migration strategy, ETL pipeline design, and SQL optimization. Cognizant runs GenC Pro and GenC Elevate tracks for candidates targeting accelerated digital technology roles requiring stronger coding skills and platform-specific knowledge (AWS, Azure).",
    availableRoles: ["software_engineer", "data_engineer", "cloud_engineer"],
  },
  {
    key: "zoho",
    name: "Zoho",
    region: "India",
    logoUrl: buildLogoUrl("zoho.com"),
    website: "https://careers.zoho.com",
    description:
      "Indian SaaS powerhouse building one of the world's most comprehensive business software suites entirely without external funding. Zoho runs one of the most distinctive and rigorous campus hiring processes in India. The process starts with a Written Test (logical reasoning, mathematics, and basic coding in pseudocode or C), followed by a Programming Test requiring pure algorithmic problem-solving in C or Java (no frameworks). Then comes a Technical Interview that probes deeply into how you think — expect puzzles, OS internals, networking, and database design from first principles. A final Managerial round assesses product thinking, ownership mindset, and long-term commitment. Zoho looks for self-taught problem-solvers and is explicitly skeptical of coaching-center candidates.",
    availableRoles: ["software_engineer", "fullstack_dev", "product_manager"],
  },
  {
    key: "paytm",
    name: "Paytm",
    region: "India",
    logoUrl: buildLogoUrl("paytm.com"),
    website: "https://careers.paytm.com",
    description:
      "India's leading digital payments and financial services platform processing billions of transactions. The engineering interview process consists of an Online Assessment on HackerRank with 2–3 DSA problems (easy-medium difficulty, arrays/strings/trees), a Technical Interview covering data structures, system design for high-throughput payment systems, and low-level design basics, and a final round with an engineering manager. Data Science roles additionally test statistical modeling, SQL, and machine learning for fraud detection use cases. Paytm interviewers expect familiarity with concurrent systems, consistency/availability trade-offs in distributed transactions, and thinking about failure scenarios. Product roles involve case studies on fintech user growth and monetization.",
    availableRoles: ["software_engineer", "data_scientist", "product_manager"],
  },
  {
    key: "flipkart",
    name: "Flipkart",
    region: "India",
    logoUrl: buildLogoUrl("flipkart.com"),
    website: "https://www.flipkartcareers.com",
    description:
      "India's largest e-commerce marketplace, backed by Walmart, operating at extreme scale. Flipkart has one of the highest engineering bars among Indian product companies. The process typically involves: an Online Assessment on HackerRank (2–3 medium-hard DSA problems — sliding window, two pointers, graph traversal), a Machine Coding Round (90–120 minutes to build a working, well-designed system like a parking lot, cab booking, or inventory manager in your preferred language), a Low-Level Design (LLD) interview testing object-oriented design and design patterns, a High-Level Design (HLD) interview covering distributed systems, CAP theorem, and scalable e-commerce architecture, and a Hiring Manager round. Expect hard DSA questions (trapping rain water, number of islands) and grilling on design trade-offs for scale.",
    availableRoles: ["software_engineer", "data_engineer", "product_manager"],
  },
  {
    key: "ola",
    name: "Ola",
    region: "India",
    logoUrl: buildLogoUrl("olacabs.com"),
    website: "https://careers.olacabs.com",
    description:
      "India's leading mobility and ride-hailing platform serving 250+ cities. The interview process reflects the real-time, geospatial nature of the product. Expect an Online Coding Assessment, a Technical DSA round with graph problems, shortest-path algorithms (Dijkstra, A*), and dynamic programming relevant to routing and logistics, an LLD round covering ride-matching and dispatch system design, an HLD round on real-time architecture (WebSockets, event streaming, geohashing), and a Hiring Manager round. AI and data science roles probe geospatial ML, demand forecasting, and dynamic pricing algorithms. Ola interviewers test how candidates handle ambiguity, real-time constraint trade-offs, and failure recovery in distributed systems.",
    availableRoles: ["software_engineer", "ai_engineer", "data_scientist"],
  },
  {
    key: "swiggy",
    name: "Swiggy",
    region: "India",
    logoUrl: buildLogoUrl("swiggy.com"),
    website: "https://careers.swiggy.com",
    description:
      "India's leading on-demand food delivery and quick commerce platform with deep real-time logistics infrastructure. The interview process for SDE roles includes an Online Assessment (2–3 DSA problems, medium-hard difficulty), a Technical DSA round focusing on graphs, dynamic programming, and algorithms relevant to logistics, a Machine Coding round (build a working component like a rate limiter or order tracking system), an LLD/HLD round testing system design for hyperlocal delivery networks, and a Bar Raiser or Senior Engineer round. Data Engineering roles test large-scale pipeline design with Kafka and Spark. Product roles involve hyperlocal market case studies. Interviewers specifically probe real-time data handling, consistency in distributed queues, and designing for partial failures.",
    availableRoles: ["software_engineer", "data_engineer", "product_manager"],
  },
  {
    key: "zomato",
    name: "Zomato",
    region: "India",
    logoUrl: buildLogoUrl("zomato.com"),
    website: "https://jobs.zomato.com",
    description:
      "India's leading food delivery and restaurant discovery platform with a strong culture of data-driven decision making. The SDE interview process involves an Online Assessment (HackerRank, 3 medium-hard coding problems), 2–3 Technical Interview rounds probing DSA depth (trees, graphs, DP), system design concepts for recommendation and personalization systems, and database optimization for large-scale catalogue queries. Data Science roles emphasize ML for restaurant ranking, delivery ETA prediction, and personalization. The Bar Raiser concept is applied — a senior engineer outside the team evaluates culture fit and overall technical bar in a final round. Zomato interviewers appreciate candidates who demonstrate user empathy and can tie engineering decisions back to business impact.",
    availableRoles: ["software_engineer", "data_scientist"],
  },
  {
    key: "razorpay",
    name: "Razorpay",
    region: "India",
    logoUrl: buildLogoUrl("razorpay.com"),
    website: "https://razorpay.com/jobs",
    description:
      "India's leading full-stack financial solutions company powering payments for 8M+ businesses. Known for a rigorous Machine Coding–first interview culture. The process for SDE roles consists of: a Machine Coding round (60–90 minutes to implement a working, well-architected feature — e.g., build an in-memory SQL-like database, a rate limiter, or a payment retry engine), an LLD round probing design patterns (Strategy, Observer, Factory) and extensible OOP design, an HLD round covering distributed payment infrastructure — idempotency, eventual consistency, 2PC, saga patterns — and a Hiring Manager round assessing culture fit and ownership mindset. Backend engineering roles may involve a backend-specific coding challenge. Razorpay's bar is among the highest for fintech in India — interviewers are unforgiving of sloppy code or shallow design.",
    availableRoles: ["software_engineer", "backend_dev", "product_manager"],
  },
  {
    key: "freshworks",
    name: "Freshworks",
    region: "India",
    logoUrl: buildLogoUrl("freshworks.com"),
    website: "https://careers.freshworks.com",
    description:
      "Global SaaS company building CRM, ITSM, and customer engagement software used by 60,000+ companies. The engineering interview process combines SaaS product sensibility with strong engineering fundamentals. Expect: an Online Coding Test (2–3 medium DSA problems), a Technical Interview covering full-stack or backend architecture depending on the role, clean code principles, and REST API design, an LLD round for senior roles testing multi-tenant SaaS architecture design (isolation, scalability, billing), and a Culture and Values round assessing customer obsession and collaborative working style. Freshworks interviewers value candidates who can reason about build-vs-buy decisions, API design ergonomics, and long-term maintainability over clever one-off solutions.",
    availableRoles: ["software_engineer", "product_manager"],
  },
  {
    key: "cred",
    name: "CRED",
    region: "India",
    logoUrl: buildLogoUrl("cred.club"),
    website: "https://careers.cred.club",
    description:
      "Premium fintech platform for India's creditworthy population, known for exceptionally high standards in both product and engineering. CRED's interview bar is widely considered among the top 5 in India. The process for SDE roles involves: a rigorous Online Coding Assessment (medium-hard problems, often with tight time limits), a Machine Coding round requiring production-quality code with tests (not just a working prototype), an LLD round expecting idiomatic, extensible design with design patterns applied naturally — not forced, an HLD round covering distributed systems for financial products (ledger systems, credit scoring, wallet transactions), and a Cultural Bar round with senior leadership assessing intellectual curiosity, ownership, and taste. Interviewers are highly opinionated about code quality — readable, testable code matters as much as correctness.",
    availableRoles: ["software_engineer", "product_manager"],
  },
  {
    key: "phonepe",
    name: "PhonePe",
    region: "India",
    logoUrl: buildLogoUrl("phonepe.com"),
    website: "https://www.phonepe.com/careers",
    description:
      "India's largest UPI-based digital payments platform with 500M+ registered users, processing billions of transactions monthly. Engineering interviews are heavily backend and infrastructure-focused given the platform's extreme reliability requirements. The process includes: an Online Assessment (HackerRank, 2–3 DSA problems — graphs, trees, and string processing), a Machine Coding round (implement a transactional system component like an idempotent payment processor or notification service), an LLD round testing database schema design and OOP architecture for financial systems, an HLD round focusing on ultra-reliable payment infrastructure — ACID guarantees, distributed locking, fault-tolerant ledger design — and a Hiring Manager round. PhonePe interviewers explicitly test failure-mode thinking: what happens when a payment deducts from one account but the downstream call times out.",
    availableRoles: ["software_engineer", "data_engineer"],
  },
  {
    key: "delhivery",
    name: "Delhivery",
    region: "India",
    logoUrl: buildLogoUrl("delhivery.com"),
    website: "https://www.delhivery.com/careers",
    description:
      "India's largest fully integrated logistics and supply chain platform, operating one of the country's most complex distributed networks. The engineering interview process reflects the algorithmic intensity of routing, sorting, and last-mile delivery optimization. Expect: an Online Assessment with graph and optimization-heavy coding problems (shortest paths, vehicle routing, bin-packing variants), a Technical DSA round testing algorithmic thinking for logistics scenarios, an HLD round covering geospatial data indexing, real-time tracking pipelines, and warehouse management system architecture, and a Hiring Manager round. Data Engineering roles probe large-scale ETL design with Spark and Airflow, and expertise in time-series and geospatial data. Candidates who can bridge algorithmic thinking with real-world logistics constraints stand out.",
    availableRoles: ["software_engineer", "data_engineer"],
  },
  {
    key: "byjus",
    name: "BYJU'S",
    region: "India",
    logoUrl: buildLogoUrl("byjus.com"),
    website: "https://byjus.com/careers",
    description:
      "World's largest edtech company serving 150M+ learners across 120 countries. The engineering interview process includes an Online Coding Test (2–3 medium-level DSA problems), a Technical Interview covering full-stack development concepts, system design for scalable learning platforms, and backend service design for content delivery, and an HR round assessing passion for the edtech mission. Product Management roles involve product sense interviews (designing features for personalized learning), metrics definition, and prioritization frameworks. Given BYJU's scale, interviewers often probe CDN strategies, video streaming architecture, and adaptive learning algorithm design. The company values fast learners who can work across a diverse, rapidly evolving tech stack.",
    availableRoles: ["software_engineer", "product_manager"],
  },
  {
    key: "meesho",
    name: "Meesho",
    region: "India",
    logoUrl: buildLogoUrl("meesho.com"),
    website: "https://meesho.io/careers",
    description:
      "India's leading social commerce platform connecting millions of small businesses and resellers. The interview process is known for combining strong algorithmic thinking with deep data science and seller-growth focus. Expect: an Online Assessment (3 medium-hard DSA problems covering graphs, DP, arrays), 2 Technical Interview rounds covering data structures, system design for social commerce (catalog recommendations, seller analytics), and optionally an ML round for data science roles, and a Bar Raiser round with a senior engineer or data scientist from outside the team. Data Science roles are particularly rigorous — expect statistical modeling, A/B test design, funnel analysis, and ML model deployment questions. Meesho interviewers value candidates with a strong first-principles mindset who can quantify impact.",
    availableRoles: ["software_engineer", "data_scientist"],
  },
  // ── GLOBAL ──────────────────────────────────────────────────────────────────
  {
    key: "google",
    name: "Google",
    region: "Global",
    logoUrl: buildLogoUrl("google.com"),
    website: "https://careers.google.com",
    description:
      "World's most influential technology company, engineering software used by billions daily. Google's interview process is among the most rigorous and distinctively structured in the industry. The pipeline: Recruiter Screen (background and culture fit), Technical Phone Screen (1–2 coding problems in a shared Google Doc — no IDE autocomplete, think aloud is mandatory), then an Onsite/Virtual Loop of 4–6 rounds (45 min each) covering Coding (medium-hard DSA, graphs, DP, recursion — 2 problems per session), System Design (scalable architecture for Google-scale products — L4+ only, increasingly senior as level rises), and Googleyness/Behavioral (assessing intellectual humility, collaborative instincts, and genuine curiosity). A unique Hiring Committee (HC) of independent reviewers — not the hiring manager — makes the final decision based on structured feedback packets. Google evaluates on four explicit dimensions: Coding, Problem Solving, System Design, and Googleyness. Rejection rate is ~99.8%.",
    availableRoles: [
      "ai_engineer",
      "ml_engineer",
      "software_engineer",
      "data_scientist",
      "cloud_engineer",
      "product_manager",
    ],
  },
  {
    key: "amazon",
    name: "Amazon",
    region: "Global",
    logoUrl: buildLogoUrl("amazon.com"),
    website: "https://www.amazon.jobs",
    description:
      "Global e-commerce and cloud computing giant (AWS, Prime, Alexa) with a uniquely culture-driven interview process. Amazon's defining interview feature is the 16 Leadership Principles (LPs) — Customer Obsession, Ownership, Invent and Simplify, Dive Deep, Bias for Action, and 11 others — that are woven into every single interview round, including technical ones. There is no separate behavioral round: expect LP questions in your coding and design interviews too. The pipeline: Online Assessment (2 medium-hard DSA problems + LP behavioral questions, 90 min), Technical Phone Screen (1 coding problem + LP questions, 60 min), and the Virtual Onsite Loop (5–7 rounds: Coding/DSA, System Design or OOD depending on level, and a dedicated Bar Raiser round — a senior Amazonian from outside the team with veto power on all hires). Use STAR method for every behavioral answer, quantify results, and prepare 2–3 distinct stories per LP. LP depth separates hired from not-hired more than technical skill at Amazon.",
    availableRoles: [
      "software_engineer",
      "devops_engineer",
      "cloud_engineer",
      "data_engineer",
    ],
  },
  {
    key: "microsoft",
    name: "Microsoft",
    region: "Global",
    logoUrl: buildLogoUrl("microsoft.com"),
    website: "https://careers.microsoft.com",
    description:
      "Global technology leader in cloud (Azure), productivity (Office 365), and enterprise software. Microsoft's interview process balances technical rigor with cultural alignment around Growth Mindset — Carol Dweck's framework is embedded in their hiring rubric. The pipeline: Recruiter Call (team matching often happens upfront, unlike Google/Meta), an Online Coding Assessment (Codility or HackerRank), and a Virtual Loop of 3–5 interviews (45 min each). Unlike Meta's two-problem format, Microsoft typically gives one well-scoped medium or medium-hard problem per round with deep follow-up — expect to discuss time/space complexity, edge cases, optimizations, and alternative approaches. One round is an As Appropriate (AA) interview with a senior engineer or director who probes weak spots flagged in earlier rounds — treat it with the same intensity as every other. Behavioral questions map to Microsoft's culture pillars: Growth Mindset, Customer Obsession, and Diversity & Inclusion. Language-agnostic — C#, Java, Python, C++ are all fine.",
    availableRoles: [
      "software_engineer",
      "ai_engineer",
      "cloud_engineer",
      "product_manager",
    ],
  },
  {
    key: "meta",
    name: "Meta",
    region: "Global",
    logoUrl: buildLogoUrl("meta.com"),
    website: "https://www.metacareers.com",
    description:
      "Social technology giant (Facebook, Instagram, WhatsApp, Threads) operating at multi-billion user scale with a fast-execution engineering culture. Meta's onsite loop is one of the most well-defined in FAANG: exactly 5 rounds — 2 Coding rounds, 1 System Design round (for E4+), 1 Behavioral round (assessing leadership, conflict resolution, and past impact), and 1 Product Sense round for certain roles. Coding is conducted in CoderPad; Meta's style is distinctive — getting the first correct solution is table stakes, the real differentiation happens in the follow-up conversation: can you optimize further, handle edge cases, think through memory constraints at Facebook scale? Expect medium-hard problems with a heavy emphasis on graphs and trees. The Behavioral round assesses Meta's four values: Move Fast, Be Bold, Be Open, Build Social Value. Meta added AI-assisted dynamic interview elements in 2025. Team matching happens after offer — you don't interview for a specific team.",
    availableRoles: [
      "software_engineer",
      "ai_engineer",
      "genai_engineer",
      "uiux",
    ],
  },
  {
    key: "apple",
    name: "Apple",
    region: "Global",
    logoUrl: buildLogoUrl("apple.com"),
    website: "https://jobs.apple.com",
    description:
      "Consumer technology company defining the intersection of hardware, software, and human experience. Apple's interview process is notably team-specific — you interview directly for a team with direct teammates, not a generic engineering pool. The process: Recruiter Screen, Technical Phone Screen (coding problem or architecture discussion depending on role), and an Onsite Loop of 4–6 rounds (each 45–60 min) with actual future coworkers. Coding rounds use medium-hard LeetCode-style problems but Apple interviewers often pivot quickly to domain-specific follow-ups — CoreData internals, memory management in Swift/Objective-C, GPU architecture for ML teams, etc. A strong emphasis on craftsmanship: interviewers probe whether you care deeply about the quality and polish of your work, not just whether it runs. Culture rounds test intellectual honesty, attention to detail, and genuine passion for user experience. Apple values depth over breadth — knowing your domain exceptionally well matters more than knowing everything broadly.",
    availableRoles: ["software_engineer", "uiux", "product_manager"],
  },
  {
    key: "netflix",
    name: "Netflix",
    region: "Global",
    logoUrl: buildLogoUrl("netflix.com"),
    website: "https://jobs.netflix.com",
    description:
      "World's leading streaming entertainment platform, famous for its radical culture of Freedom and Responsibility. Netflix's interview process is unusually culture-weighted — the Culture Deck is required reading before interviewing. The pipeline: Recruiter Screen, Technical/Role-Specific Phone Screen (real-world problem solving, not textbook LeetCode), an Onsite Loop of 4–5 rounds covering Coding (practical, system-grounded problems), System Design (resilient microservice and streaming infrastructure architecture), and multiple Behavioral rounds that explicitly test Netflix's culture values: Judgment, Communication, Curiosity, Courage, Passion, Selflessness, Innovation, Inclusion, and Integrity. Rejection rate is ~1–2%. Netflix does not have a Bar Raiser model — instead, every interviewer is expected to uphold an exceptionally high standard. Expect to be challenged on what you would do if given full ownership of a critical system with no oversight. The company is not looking for rule-followers.",
    availableRoles: ["software_engineer", "data_engineer"],
  },
  {
    key: "nvidia",
    name: "NVIDIA",
    region: "Global",
    logoUrl: buildLogoUrl("nvidia.com"),
    website: "https://www.nvidia.com/en-us/about-nvidia/careers",
    description:
      "World leader in accelerated computing, AI hardware (H100, A100 GPUs), and the dominant force in AI chip infrastructure controlling ~90% of the AI training chip market. NVIDIA's interview process reflects deep technical specialization. The pipeline: Recruiter Screen, Technical Phone Screen (role-specific coding or architecture), and an Onsite Loop of 3–6 rounds (45–60 min each, virtual or on-site). For AI/ML Engineering roles expect: GPU programming and parallel computing concepts (CUDA fundamentals), ML model architecture and optimization (quantization, pruning, inference latency), distributed training infrastructure, and system design for AI training pipelines at scale. For Software Engineering roles: operating systems internals, compiler design, memory management, and performance optimization are heavily tested. Interviewers probe very deep — surface-level answers are insufficient. Candidates who have worked with large-scale GPU clusters or contributed to open-source ML frameworks stand out significantly.",
    availableRoles: ["ai_engineer", "ml_engineer"],
  },
  {
    key: "uber",
    name: "Uber",
    region: "Global",
    logoUrl: buildLogoUrl("uber.com"),
    website: "https://www.uber.com/careers",
    description:
      "Global transportation, delivery, and logistics platform operating across 70+ countries, processing 3B+ trips quarterly. Uber's interview process is modeled similarly to Amazon's but with a real-time systems focus. The pipeline: Recruiter Screen, Online Assessment (CodeSignal, 4 problems, 70–90 min: easy-medium arrays/strings plus harder graph/DP), Technical Phone Screen (live coding on CodeSignal/Zoom), and a Virtual Onsite Loop of 4–6 rounds — General Coding (medium-hard DSA), Domain-Specific Coding (domain-relevant: parking lot data structures for backend, UI components for frontend), System Design (design ride-matching engines, surge pricing, real-time location tracking, dispatch services — expect deep trade-off discussions, Kafka vs RabbitMQ, P99 latency targets), Collaboration and Leadership, and a Bar Raiser round assessing cultural values and the ability to operate at high standards. Uber interviewers specifically probe distributed systems failure modes and geospatial algorithm thinking.",
    availableRoles: ["software_engineer", "data_scientist"],
  },
  {
    key: "airbnb",
    name: "Airbnb",
    region: "Global",
    logoUrl: buildLogoUrl("airbnb.com"),
    website: "https://careers.airbnb.com",
    description:
      "Global travel and hospitality marketplace connecting hosts and guests in 220+ countries, known for a human-centered design culture. Airbnb's interview process strongly emphasizes both technical excellence and lived company values. The pipeline: Recruiter Screen, Technical Phone Screen (coding problem, 60 min), and an Onsite Loop of 5–6 rounds — 2 Coding rounds (medium-hard LeetCode-style, clean and readable code expected), 1 System Design round (design marketplace infrastructure: search ranking, pricing, availability calendars, trust/safety systems), 1 Cross-Functional/Behavioral round (very high weight at Airbnb — strongly assesses connection to mission, empathy, and collaboration), and optionally an HM or Product round for senior roles. Airbnb is distinctive in that 'Culture Fit' is evaluated not as a vague gut check but with a structured rubric around their core values — be a Host, Champion the Mission, Be a Cereal Entrepreneur, Simplify. Technical correctness alone will not get you hired.",
    availableRoles: ["software_engineer", "product_manager"],
  },
  {
    key: "spotify",
    name: "Spotify",
    region: "Global",
    logoUrl: buildLogoUrl("spotify.com"),
    website: "https://www.spotifyjobs.com",
    description:
      "World's largest music streaming platform with 600M+ users, operating the most influential music recommendation algorithm in consumer tech. Spotify's engineering interview process is heavily data-science oriented. The pipeline: Recruiter Screen, Technical Screen (coding or ML design depending on role), and an Onsite Loop of 4–5 rounds covering Coding (medium-difficulty algorithmic problems), System Design (large-scale recommendation systems, playlist generation, audio streaming infrastructure, A/B testing platforms), Data Science rounds probing collaborative filtering, content-based recommendation, audio feature extraction, and experimentation frameworks, and a Values-based Behavioral round assessing Innovative, Collaborative, Sincere, and Passionate (Spotify's Band Manifesto values). Data Science candidates should be ready to discuss the Discover Weekly algorithm, cold start problems, and embedding-based similarity at scale. Spotify values candidates who combine technical depth with genuine passion for music and audio.",
    availableRoles: ["data_scientist", "software_engineer"],
  },
  {
    key: "oracle",
    name: "Oracle",
    region: "Global",
    logoUrl: buildLogoUrl("oracle.com"),
    website: "https://www.oracle.com/careers",
    description:
      "Global enterprise technology corporation and the world's most widely-used database software company, with a growing cloud infrastructure (OCI) business. Oracle's interview process is notably deep on database internals and distributed systems. The pipeline: Recruiter Screen, Technical Phone Screen (coding or architecture), and an Onsite Loop of 4–6 rounds. Expect: rigorous database internals questions (MVCC, query planner optimization, index strategies, transaction isolation levels), distributed systems design (Oracle RAC, distributed locking, consensus protocols), cloud infrastructure architecture for OCI roles (networking, compute, storage), and algorithm/data structures coding rounds with medium-hard problems. Oracle interviewers have very high depth expectations — vague answers about 'horizontal scaling' without technical detail are challenged. Senior roles involve designing enterprise-grade systems with explicit requirements for ACID compliance, disaster recovery, and multi-region consistency.",
    availableRoles: ["software_engineer", "cloud_engineer"],
  },
  {
    key: "ibm",
    name: "IBM",
    region: "Global",
    logoUrl: buildLogoUrl("ibm.com"),
    website: "https://www.ibm.com/employment",
    description:
      "Global technology and consulting company with deep enterprise and research roots, known for Watson AI, hybrid cloud (IBM Cloud), and Red Hat OpenShift. IBM's interview process blends technical depth with professional communication skills. The pipeline: Recruiter Screen, Cognitive Assessment (IBM uses personality and problem-solving assessments like the Kenexa platform), Technical Interview(s) covering domain-specific knowledge, and for senior roles, a Case Study or Solution Design exercise. For AI/ML roles, interviewers probe Watson API integration, AI ethics and explainability, and production model deployment. For cloud roles, expect Red Hat OpenShift and Kubernetes architecture questions alongside standard cloud design. IBM places unusual weight on communication and presentation quality — candidates should articulate solutions clearly in business terms, not just technical jargon. Enterprise consulting tracks require demonstrating client engagement skills alongside technical capability.",
    availableRoles: ["software_engineer", "ai_engineer", "cloud_engineer"],
  },
  {
    key: "intel",
    name: "Intel",
    region: "Global",
    logoUrl: buildLogoUrl("intel.com"),
    website: "https://jobs.intel.com",
    description:
      "Global semiconductor and computing technology leader, inventor of the x86 architecture, and a key player in AI accelerator chips (Gaudi). Intel's interview process is one of the most technically deep in the industry, particularly for hardware-software intersection roles. The pipeline: Recruiter Screen, Technical Phone Screen, and an Onsite Loop of 4–6 rounds. For AI Engineering roles: expect GPU/NPU architecture concepts, SIMD vectorization, parallel computing with OpenCL or oneAPI, ML inference optimization (quantization, pruning, INT8 precision), and model deployment on Intel hardware. For software engineering: operating systems internals, compiler optimizations, memory hierarchy and cache behavior, and multithreaded programming (POSIX threads, atomics). Interviewers expect candidates to reason at the hardware-software boundary — not just what the code does, but what it does at the instruction and cache level. Coding rounds test standard DSA but follow-ups probe performance implications.",
    availableRoles: ["software_engineer", "ai_engineer"],
  },
  {
    key: "adobe",
    name: "Adobe",
    region: "Global",
    logoUrl: buildLogoUrl("adobe.com"),
    website: "https://careers.adobe.com",
    description:
      "Global leader in creative software (Photoshop, Illustrator, Premiere) and digital experience (Experience Cloud), increasingly infusing AI into creative tools via Adobe Firefly. Adobe's interview process has a dual technical-and-design sensibility. The pipeline: Recruiter Screen, Online Assessment (HackerRank, 2–3 DSA problems), Technical Interview rounds (3–4 rounds covering data structures, algorithms, system design for media-processing and SaaS platforms, OOP design), and for UI/UX and product roles, Design Portfolio Reviews and Product Sense interviews. System design rounds often probe multimedia pipeline architecture, CDN strategies for creative assets, and subscription SaaS multi-tenancy. Adobe interviewers appreciate clean, readable code and candidates who think about accessibility and internationalization in UI work. Generative AI roles probe diffusion model fundamentals, responsible AI guardrails, and content authenticity.",
    availableRoles: ["software_engineer", "uiux"],
  },
  {
    key: "salesforce",
    name: "Salesforce",
    region: "Global",
    logoUrl: buildLogoUrl("salesforce.com"),
    website: "https://careers.salesforce.com",
    description:
      "World's #1 CRM platform serving 150,000+ enterprise customers, built on a pioneering multi-tenant cloud architecture. Salesforce's interview process blends technical depth with a strong culture and values emphasis (their V2MOM framework and Ohana culture are central). The pipeline: Recruiter Screen, Technical Phone Screen (coding problem, 45–60 min), and an Onsite Loop of 4–5 rounds covering Coding (medium-hard DSA — graphs, trees, string manipulation), System Design (multi-tenant SaaS architecture, data isolation strategies, bulk API design for enterprise scale), Core Values Interview (a dedicated round where Salesforce's values — Trust, Customer Success, Innovation, Equality — are explicitly evaluated using behavioral STAR stories), and an HM round. Multi-tenancy is Salesforce's most distinctive interview topic: expect deep questions about metadata-driven architecture, namespace isolation, governor limits, and governor limit bypass strategies. Security-first engineering is equally weighted.",
    availableRoles: ["software_engineer", "cloud_engineer", "product_manager"],
  },
  {
    key: "sap",
    name: "SAP",
    region: "Global",
    logoUrl: buildLogoUrl("sap.com"),
    website: "https://jobs.sap.com",
    description:
      "Enterprise application software leader running the back-office systems of 77% of the world's transaction revenue via SAP ERP. SAP's interview process focuses on enterprise software engineering depth and business process understanding. The pipeline: Recruiter Screen (often involves a SAP-specific skills pre-assessment), Technical Interview(s) covering object-oriented design, database optimization (SAP HANA's in-memory architecture is commonly probed), ERP integration patterns, and clean code practices in ABAP, Java, or Python, a System Design round for senior roles covering enterprise integration patterns and microservices in an ERP context, and a Behavioral round assessing alignment with SAP's LEAD (Lead, Enable, Architect, Deliver) culture. Product Management roles involve business process analysis, customer journey mapping for enterprise users, and roadmap prioritization for complex stakeholder landscapes. SAP interviewers value candidates with genuine enterprise software engineering context — not just web-scale distributed systems knowledge.",
    availableRoles: ["software_engineer", "product_manager"],
  },
  {
    key: "tesla",
    name: "Tesla",
    region: "Global",
    logoUrl: buildLogoUrl("tesla.com"),
    website: "https://www.tesla.com/careers",
    description:
      "Electric vehicle and clean energy company building autonomous driving AI (Full Self-Driving), Dojo (Tesla's custom AI supercomputer), and manufacturing robotics (Optimus). Tesla is known for one of the most intense and unpredictable interview processes in tech — with no established FAANG-style structure. The pipeline varies wildly by team: Recruiter Screen, Technical Phone Screen (often jumps straight into deep technical content — vehicle autopilot algorithms, neural network architecture, embedded systems), and an Onsite Loop of 4–8 rounds. For AI/ML roles expect: computer vision architecture (detection, segmentation, depth estimation), sensor fusion (camera-radar-lidar fusion), neural network optimization for inference on Tesla's custom FSD chip, and real-world autonomous driving edge cases. For Software Engineering: embedded C++, real-time operating systems, and low-latency systems programming. There is almost no behavioral buffering — interviews are highly technical from start to finish. Candidates who have shipped production ML systems, not just trained models in notebooks, stand out dramatically.",
    availableRoles: ["ai_engineer", "software_engineer"],
  },
  {
    key: "tiktok",
    name: "TikTok",
    region: "Global",
    logoUrl: buildLogoUrl("tiktok.com"),
    website: "https://careers.tiktok.com",
    description:
      "Global short-form video platform with 1B+ monthly active users, operating some of the world's most sophisticated recommendation algorithms. TikTok (ByteDance) is known for a rigorous, fast-paced, and algorithm-heavy interview process. The pipeline: Recruiter Screen, Online Assessment (LeetCode-style OA, 2–3 hard problems with tight time limits), Technical Phone Screen (live coding, hard difficulty), and an Onsite Loop of 4–6 rounds covering Coding (hard LeetCode — graphs, DP, segment trees), System Design (TikTok-scale recommendation architecture, creator monetization infrastructure, live streaming systems, content moderation pipelines), Data Science (recommendation algorithms, embedding models, A/B testing at scale), and Behavioral/Cultural rounds. TikTok's bar on DSA is notably higher than most FAANG companies — interviewers expect candidates to solve hard problems optimally under pressure. Familiarity with transformer-based recommendation and two-tower models is a strong differentiator for ML/data science roles.",
    availableRoles: ["software_engineer", "data_scientist"],
  },
  {
    key: "openai",
    name: "OpenAI",
    region: "Global",
    logoUrl: buildLogoUrl("openai.com"),
    website: "https://openai.com/careers",
    description:
      "AI safety and research organization behind ChatGPT, GPT-4, DALL-E, Codex, and Sora — the most influential AI lab in the world as of 2025. OpenAI's interview process is uniquely mission-focused and deeply practical. The pipeline (typically 6–8 rounds across 2–4 weeks): Recruiter Screen (mission alignment is explicitly assessed — why do you care about AGI safety?), Technical Screen (60-min 'gate' format — a single problem that progressively gets harder across 4 stages; must pass 2+ gates to advance), Work Trial Take-Home (48-hour window to build something real and production-quality, e.g., a webhook delivery system — evaluated on reliability, testing, and code quality, NOT feature count), and an Onsite Loop of 4–6 hours covering Coding, System Design (real OpenAI-scale infrastructure problems), Technical Project Presentation (defend past work under adversarial questioning), and a Behavioral/Mission Alignment round. Safety-critical roles include a unique Red Team scenario round where you must defend an AI safety protocol against 2–3 senior researchers. OpenAI values agency, adaptability, and genuine intellectual curiosity about AI. Prior LLM production experience is heavily weighted.",
    availableRoles: ["ai_engineer", "genai_engineer"],
  },
  {
    key: "stripe",
    name: "Stripe",
    region: "Global",
    logoUrl: buildLogoUrl("stripe.com"),
    website: "https://stripe.com/jobs",
    description:
      "Global financial infrastructure platform processing hundreds of billions of dollars annually, serving millions of businesses. Stripe is known for the most implementation-focused and practical interview process in top-tier tech. The pipeline: Recruiter Screen, HackerRank OA (3-part implementation-heavy problem, 60 min — not pure DSA but practical coding broken into sub-tasks), Technical Phone Screen, and an Onsite/Virtual Loop of 4–5 rounds: General Coding (practical algorithmic problems grounded in real engineering scenarios), Bug Bash (a unique debugging round — you are given intentionally buggy code and must identify, explain, and fix all bugs within a time limit — tests code reading depth and systematic reasoning), Integration Task (implement a feature or API integration as you would in actual production code — cleanliness, error handling, and test coverage are all evaluated), System Design (scalable and fault-tolerant financial infrastructure — idempotency, distributed transactions, payment retry logic, ledger consistency), and Behavioral (ownership, collaboration, engineering values). Stripe interviewers place exceptional weight on API design ergonomics and code readability. A Hiring Manager round may follow for senior roles.",
    availableRoles: ["software_engineer", "backend_dev"],
  },
];

// ── Legacy COMPANY_INTERVIEW_PROFILES (kept for backward compat) ──────────────

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
  ...COMPANIES.map((c) => ({
    key: c.key,
    name: `${c.availableRoles[0]?.replace(/_/g, " ")} @ ${c.name}`,
    logoUrl: c.logoUrl,
    website: c.website,
    styleSummary: c.description,
    defaultRole: JOB_ROLES[c.availableRoles[0]]?.name || "Software Engineer",
    defaultJobDescription:
      JOB_ROLES[c.availableRoles[0]]?.jobDescription || c.description,
  })),
];

const profileMap = new Map(
  COMPANY_INTERVIEW_PROFILES.map((item) => [item.key, item]),
);

export function getCompanyProfileByKey(key) {
  return profileMap.get(key) || profileMap.get("general");
}

export function getCompanyByKey(key) {
  return COMPANIES.find((c) => c.key === key) || null;
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

  const exact = COMPANIES.find((c) => {
    const n = c.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return n === normalized;
  });

  if (exact) return exact.key;

  const fuzzy = COMPANIES.find((c) => {
    const n = c.name
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

  const company = getCompanyByKey(companyProfile?.key);
  if (company) {
    return `Company Interview Focus:\n${company.name}\n${company.description}`;
  }

  const selected = getCompanyProfileByKey(companyProfile?.key || "general");
  return `Company Interview Focus:\n${selected.name} style\n${selected.styleSummary}`;
}
