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
    tools: [
      "Docker",
      "Kubernetes",
      "Jenkins",
      "GitHub Actions",
      "Terraform",
    ],
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
      "India's largest IT services company delivering digital transformation solutions to global enterprises. Known for structured technical interviews, strong fundamentals assessment, and enterprise project delivery.",
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
      "Global leader in next-generation digital services and consulting. Focuses on strong fundamentals, delivery ownership, and consistency in engineering and data roles.",
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
      "Leading technology services and consulting company. Emphasizes implementation quality, support readiness, adaptability across technologies, and strong security practices.",
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
      "Global technology company focused on digital transformation. Values engineering depth, cloud-native expertise, and strong DevOps culture for building scalable systems.",
    availableRoles: [
      "software_engineer",
      "cloud_engineer",
      "devops_engineer",
    ],
  },
  {
    key: "techmahindra",
    name: "Tech Mahindra",
    region: "India",
    logoUrl: buildLogoUrl("techmahindra.com"),
    website: "https://careers.techmahindra.com",
    description:
      "Digital transformation company specializing in telecom, enterprise, and government sectors. Known for strong engineering fundamentals and cloud data pipeline expertise.",
    availableRoles: [
      "software_engineer",
      "data_engineer",
      "cloud_engineer",
    ],
  },
  {
    key: "ltimindtree",
    name: "LTIMindtree",
    region: "India",
    logoUrl: buildLogoUrl("ltimindtree.com"),
    website: "https://www.ltimindtree.com/careers",
    description:
      "Technology consulting and digital solutions company. Emphasizes AI/ML innovation, data engineering excellence, and strong software engineering foundations.",
    availableRoles: ["software_engineer", "data_engineer", "ai_engineer"],
  },
  {
    key: "cognizant",
    name: "Cognizant",
    region: "India",
    logoUrl: buildLogoUrl("cognizant.com"),
    website: "https://careers.cognizant.com",
    description:
      "Professional services company delivering digital and technology solutions globally. Focuses on software quality, cloud migration, and data-driven analytics delivery.",
    availableRoles: [
      "software_engineer",
      "data_engineer",
      "cloud_engineer",
    ],
  },
  {
    key: "zoho",
    name: "Zoho",
    region: "India",
    logoUrl: buildLogoUrl("zoho.com"),
    website: "https://careers.zoho.com",
    description:
      "Indian SaaS giant building the world's most comprehensive business software suite. Values deep engineering skills, product ownership mindset, and full-stack development capabilities.",
    availableRoles: ["software_engineer", "fullstack_dev", "product_manager"],
  },
  {
    key: "paytm",
    name: "Paytm",
    region: "India",
    logoUrl: buildLogoUrl("paytm.com"),
    website: "https://careers.paytm.com",
    description:
      "India's leading digital payments and financial services company. Focuses on high-throughput engineering, data science for fraud detection, and product strategy for fintech.",
    availableRoles: [
      "software_engineer",
      "data_scientist",
      "product_manager",
    ],
  },
  {
    key: "flipkart",
    name: "Flipkart",
    region: "India",
    logoUrl: buildLogoUrl("flipkart.com"),
    website: "https://www.flipkartcareers.com",
    description:
      "India's largest e-commerce marketplace. Known for scale-heavy distributed systems interviews, strong algorithms focus, and product strategy for India-first markets.",
    availableRoles: [
      "software_engineer",
      "data_engineer",
      "product_manager",
    ],
  },
  {
    key: "ola",
    name: "Ola",
    region: "India",
    logoUrl: buildLogoUrl("olacabs.com"),
    website: "https://careers.olacabs.com",
    description:
      "India's leading ride-hailing and mobility platform. Interviews focus on real-time systems, AI for geospatial intelligence, and data science for dynamic pricing and logistics.",
    availableRoles: ["software_engineer", "ai_engineer", "data_scientist"],
  },
  {
    key: "swiggy",
    name: "Swiggy",
    region: "India",
    logoUrl: buildLogoUrl("swiggy.com"),
    website: "https://careers.swiggy.com",
    description:
      "India's leading on-demand food delivery and quick commerce platform. Emphasizes real-time systems, supply chain data engineering, and product strategy for hyperlocal markets.",
    availableRoles: [
      "software_engineer",
      "data_engineer",
      "product_manager",
    ],
  },
  {
    key: "zomato",
    name: "Zomato",
    region: "India",
    logoUrl: buildLogoUrl("zomato.com"),
    website: "https://jobs.zomato.com",
    description:
      "India's leading food delivery and restaurant discovery platform. Focuses on high-scale systems, data science for personalization, recommendations, and logistics optimization.",
    availableRoles: ["software_engineer", "data_scientist"],
  },
  {
    key: "razorpay",
    name: "Razorpay",
    region: "India",
    logoUrl: buildLogoUrl("razorpay.com"),
    website: "https://razorpay.com/jobs",
    description:
      "India's leading full-stack financial solutions company. Values deep backend engineering for payment infrastructure, strong API design, and product strategy for fintech innovations.",
    availableRoles: [
      "software_engineer",
      "backend_dev",
      "product_manager",
    ],
  },
  {
    key: "freshworks",
    name: "Freshworks",
    region: "India",
    logoUrl: buildLogoUrl("freshworks.com"),
    website: "https://careers.freshworks.com",
    description:
      "Global SaaS company making business software more affordable. Emphasizes clean engineering practices, customer-centric product thinking, and scalable cloud-native architectures.",
    availableRoles: ["software_engineer", "product_manager"],
  },
  {
    key: "cred",
    name: "CRED",
    region: "India",
    logoUrl: buildLogoUrl("cred.club"),
    website: "https://careers.cred.club",
    description:
      "Premium fintech platform rewarding creditworthy individuals. Known for strong engineering bar, premium product design thinking, and high standards for code quality and user experience.",
    availableRoles: ["software_engineer", "product_manager"],
  },
  {
    key: "phonepe",
    name: "PhonePe",
    region: "India",
    logoUrl: buildLogoUrl("phonepe.com"),
    website: "https://www.phonepe.com/careers",
    description:
      "India's largest digital payments platform with 500M+ users. Focuses on building ultra-reliable payment infrastructure, scalable data pipelines, and high-volume transaction systems.",
    availableRoles: ["software_engineer", "data_engineer"],
  },
  {
    key: "delhivery",
    name: "Delhivery",
    region: "India",
    logoUrl: buildLogoUrl("delhivery.com"),
    website: "https://www.delhivery.com/careers",
    description:
      "India's largest fully integrated logistics player. Emphasizes data engineering for supply chain optimization, strong algorithmic thinking for routing, and scalable software systems.",
    availableRoles: ["software_engineer", "data_engineer"],
  },
  {
    key: "byjus",
    name: "BYJU'S",
    region: "India",
    logoUrl: buildLogoUrl("byjus.com"),
    website: "https://byjus.com/careers",
    description:
      "World's leading edtech company serving 150M+ learners globally. Focuses on strong engineering foundations, product strategy for personalized learning, and scalable platform development.",
    availableRoles: ["software_engineer", "product_manager"],
  },
  {
    key: "meesho",
    name: "Meesho",
    region: "India",
    logoUrl: buildLogoUrl("meesho.com"),
    website: "https://meesho.io/careers",
    description:
      "India's leading social commerce platform empowering small businesses. Values data science for seller insights and growth, strong software engineering, and problem solving at internet scale.",
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
      "World's most influential technology company. Known for rigorous algorithmic and system design interviews, strong focus on scalability trade-offs, and engineering excellence at global scale.",
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
      "Global e-commerce and cloud computing giant. Combines deep technical assessments with Leadership Principle behavioral interviews. Emphasizes ownership, data-driven decisions, and delivery excellence.",
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
      "Global technology leader in cloud, productivity, and enterprise software. Values growth mindset, customer impact, pragmatic engineering, and strong collaboration culture.",
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
      "Social technology giant connecting billions worldwide. Emphasizes fast execution, product thinking, strong coding skills, and the ability to handle ambiguity at massive scale.",
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
      "Consumer technology company famous for innovation and design excellence. Values craftsmanship, meticulous attention to detail, deep technical quality, and a passion for extraordinary user experiences.",
    availableRoles: ["software_engineer", "uiux", "product_manager"],
  },
  {
    key: "netflix",
    name: "Netflix",
    region: "Global",
    logoUrl: buildLogoUrl("netflix.com"),
    website: "https://jobs.netflix.com",
    description:
      "World's leading streaming entertainment service. Values high ownership, exceptional judgment, production resiliency, and autonomy. Known for a culture of Freedom and Responsibility.",
    availableRoles: ["software_engineer", "data_engineer"],
  },
  {
    key: "nvidia",
    name: "NVIDIA",
    region: "Global",
    logoUrl: buildLogoUrl("nvidia.com"),
    website: "https://www.nvidia.com/en-us/about-nvidia/careers",
    description:
      "World leader in accelerated computing and AI hardware. Focuses on deep AI/ML engineering, GPU-accelerated computing architectures, and cutting-edge research for transformative AI applications.",
    availableRoles: ["ai_engineer", "ml_engineer"],
  },
  {
    key: "uber",
    name: "Uber",
    region: "Global",
    logoUrl: buildLogoUrl("uber.com"),
    website: "https://www.uber.com/careers",
    description:
      "Global transportation and technology platform. Emphasizes scale-heavy distributed systems, real-time geospatial engineering, algorithmic optimization, and strong data science capabilities.",
    availableRoles: ["software_engineer", "data_scientist"],
  },
  {
    key: "airbnb",
    name: "Airbnb",
    region: "Global",
    logoUrl: buildLogoUrl("airbnb.com"),
    website: "https://careers.airbnb.com",
    description:
      "Global travel and hospitality platform. Values strong engineering fundamentals, human-centered product thinking, and the ability to build elegant solutions for global marketplace challenges.",
    availableRoles: ["software_engineer", "product_manager"],
  },
  {
    key: "spotify",
    name: "Spotify",
    region: "Global",
    logoUrl: buildLogoUrl("spotify.com"),
    website: "https://www.spotifyjobs.com",
    description:
      "World's largest music streaming platform. Focuses on data science for personalization and recommendations, strong software engineering, and product innovation for the audio ecosystem.",
    availableRoles: ["data_scientist", "software_engineer"],
  },
  {
    key: "oracle",
    name: "Oracle",
    region: "Global",
    logoUrl: buildLogoUrl("oracle.com"),
    website: "https://www.oracle.com/careers",
    description:
      "Global enterprise technology corporation. Emphasizes deep database expertise, cloud infrastructure engineering, robust enterprise software development, and strong system design.",
    availableRoles: ["software_engineer", "cloud_engineer"],
  },
  {
    key: "ibm",
    name: "IBM",
    region: "Global",
    logoUrl: buildLogoUrl("ibm.com"),
    website: "https://www.ibm.com/employment",
    description:
      "Global technology and consulting company with deep enterprise roots. Values AI innovation, hybrid cloud architectures, strong software engineering foundations, and enterprise-grade solution delivery.",
    availableRoles: ["software_engineer", "ai_engineer", "cloud_engineer"],
  },
  {
    key: "intel",
    name: "Intel",
    region: "Global",
    logoUrl: buildLogoUrl("intel.com"),
    website: "https://jobs.intel.com",
    description:
      "Global semiconductor and computing technology leader. Focuses on AI acceleration research, systems software engineering, deep hardware-software co-design, and performance optimization work.",
    availableRoles: ["software_engineer", "ai_engineer"],
  },
  {
    key: "adobe",
    name: "Adobe",
    region: "Global",
    logoUrl: buildLogoUrl("adobe.com"),
    website: "https://careers.adobe.com",
    description:
      "Global leader in creative and digital experience software. Values deep technical quality blended with exceptional design sensibility, strong engineering for media processing, and user experience excellence.",
    availableRoles: ["software_engineer", "uiux"],
  },
  {
    key: "salesforce",
    name: "Salesforce",
    region: "Global",
    logoUrl: buildLogoUrl("salesforce.com"),
    website: "https://careers.salesforce.com",
    description:
      "World's #1 CRM platform. Emphasizes enterprise reliability, multi-tenant cloud architecture, security-first engineering, and product strategy for global enterprise customers.",
    availableRoles: [
      "software_engineer",
      "cloud_engineer",
      "product_manager",
    ],
  },
  {
    key: "sap",
    name: "SAP",
    region: "Global",
    logoUrl: buildLogoUrl("sap.com"),
    website: "https://jobs.sap.com",
    description:
      "Enterprise application software leader powering global businesses. Focuses on enterprise-grade software engineering, ERP system integration, and strategic product management for complex business processes.",
    availableRoles: ["software_engineer", "product_manager"],
  },
  {
    key: "tesla",
    name: "Tesla",
    region: "Global",
    logoUrl: buildLogoUrl("tesla.com"),
    website: "https://www.tesla.com/careers",
    description:
      "Electric vehicle and clean energy company at the frontier of AI and autonomous systems. Known for extremely high engineering bar, real-world AI deployment, and solving complex embedded systems challenges.",
    availableRoles: ["ai_engineer", "software_engineer"],
  },
  {
    key: "tiktok",
    name: "TikTok",
    region: "Global",
    logoUrl: buildLogoUrl("tiktok.com"),
    website: "https://careers.tiktok.com",
    description:
      "Global short-form video platform with 1B+ users. Emphasizes large-scale distributed systems, data science for recommendation algorithms, and fast-paced product engineering in a competitive market.",
    availableRoles: ["software_engineer", "data_scientist"],
  },
  {
    key: "openai",
    name: "OpenAI",
    region: "Global",
    logoUrl: buildLogoUrl("openai.com"),
    website: "https://openai.com/careers",
    description:
      "AI safety and research company behind ChatGPT and GPT-4. Focuses on cutting-edge AI engineering, LLM research and application, Generative AI systems deployment, and responsible AI development.",
    availableRoles: ["ai_engineer", "genai_engineer"],
  },
  {
    key: "stripe",
    name: "Stripe",
    region: "Global",
    logoUrl: buildLogoUrl("stripe.com"),
    website: "https://stripe.com/jobs",
    description:
      "Global financial infrastructure platform for the internet economy. Values exceptional backend engineering, meticulous API design, strong developer experience focus, and reliability-first distributed systems.",
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
    styleSummary: "Balanced mix of technical, behavioral, and role-fit questions.",
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
    defaultJobDescription: JOB_ROLES[c.availableRoles[0]]?.jobDescription || c.description,
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
    const n = c.name.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
    return n === normalized;
  });

  if (exact) return exact.key;

  const fuzzy = COMPANIES.find((c) => {
    const n = c.name.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
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
