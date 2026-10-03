export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  iconName: string;
}

export interface PillarItem {
  id: string;
  tag: string;
  title: string;
  tagline: string;
  description: string;
  bulletPoints: string[];
  gradient: string;
  badgeColor: string;
  iconName: string;
}

export interface HackathonItem {
  id: string;
  slug: string;
  name: string;
  edition: string;
  tagline: string;
  description: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  mode: "Online" | "In-Person" | "Hybrid";
  location: string;
  dateRange: string;
  prizePool: string;
  registeredCount: number;
  tags: string[];
  bannerGradient: string;
  bannerUrl?: string;
  tracks: { title: string; desc: string; icon: string }[];
  prizes: { place: string; reward: string; perks: string }[];
  eligibility: string;
  featured?: boolean;
}

export interface SpeakerSession {
  id: string;
  title: string;
  category: "AI & Machine Learning" | "Web Development" | "Web3" | "Cybersecurity" | "Cloud & DevOps" | "Startups & Career";
  speaker: {
    name: string;
    role: string;
    company: string;
    avatar: string;
    verified: boolean;
  };
  date: string;
  time: string;
  duration: string;
  mode: "Live Stream" | "Virtual Workshop" | "Campus Keynote";
  seatsLeft: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  highlights: string[];
  isCallForSpeakers?: boolean;
}

export interface EventExperience {
  id: string;
  type: string;
  title: string;
  description: string;
  statBadge: string;
  gradient: string;
  highlights: string[];
  icon: string;
}

export interface ImpactStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

export interface CommunityValue {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  date: string;
  author: string;
  tags: string[];
  contentSummary: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

// -------------------------------------------------------------
// CENTRAL SITE CONFIGURATION
// Real official data for NEXHACK
// -------------------------------------------------------------
export const SITE_CONFIG = {
  name: "NEXHACK",
  tagline: "Build. Hack. Learn. Connect.",
  category: "Student Tech Community / Hackathons / Innovation / Technology Events",
  description:
    "NEXHACK is a student-focused technology community organizing hackathons, coding competitions, technology workshops, knowledge sessions, networking events, innovation challenges, and tech experiences across schools and colleges.",
  foundedYear: 2026,
  currentYear: 2026,
  whatsappUrl: "https://chat.whatsapp.com/CNHePNAmYHE8Y4klu7TPMq",
  linkedinUrl: "https://linkedin.com/company/nexhack",
  instagramUrl: "https://www.instagram.com/nexhack.in/",
  xUrl: "https://x.com/nexhack_in",
  githubUrl: "https://github.com/nexhack-in",
  contactEmail: "hello@nexhack.in",
  supportEmail: "support@nexhack.in",
  founderEmail: "sourav@nexhack.in",
  phone: "8383071603",
  campusEmail: "partners@nexhack.in",
};

// -------------------------------------------------------------
// COMMUNITY MILESTONES & TARGETS
// Real configuration values (easily edited from this file)
// -------------------------------------------------------------
export const COMMUNITY_STATS: StatItem[] = [
  {
    id: "students",
    value: 10,
    suffix: "K+",
    label: "Students Reached",
    sublabel: "Across schools & colleges",
    iconName: "Users",
  },
  {
    id: "colleges",
    value: 100,
    suffix: "+",
    label: "Colleges & Schools",
    sublabel: "Target campus network",
    iconName: "GraduationCap",
  },
  {
    id: "states",
    value: 20,
    suffix: "+",
    label: "States & Regions",
    sublabel: "Pan-India presence",
    iconName: "MapPin",
  },
  {
    id: "events",
    value: 50,
    suffix: "+",
    label: "Events & Sprints",
    sublabel: "Planned & executed",
    iconName: "Trophy",
  },
  {
    id: "projects",
    value: 250,
    suffix: "+",
    label: "Projects & MVPs",
    sublabel: "Built by student teams",
    iconName: "Rocket",
  },
];

// -------------------------------------------------------------
// CORE PILLARS OF NEXHACK
// -------------------------------------------------------------
export const NEXHACK_PILLARS: PillarItem[] = [
  {
    id: "build",
    tag: "01 / BUILD",
    title: "BUILD",
    tagline: "Turn ideas into real projects.",
    description:
      "Move beyond theory. Build working software, web apps, AI tools, developer utilities, and startup prototypes with guidance from senior builders.",
    bulletPoints: [
      "Access starter kits, APIs, and project templates",
      "Hands-on technical sprint mentors",
      "Demo days and project showcases",
    ],
    gradient: "from-blue-600 via-indigo-600 to-cyan-500",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    iconName: "Code2",
  },
  {
    id: "learn",
    tag: "02 / LEARN",
    title: "LEARN",
    tagline: "Learn from experts, developers, founders and industry professionals.",
    description:
      "Upskill through interactive knowledge sessions, technical workshops, and structured developer roadmaps across modern engineering domains.",
    bulletPoints: [
      "Real-world code walkthroughs and debugging sessions",
      "Q&A with working software engineers and founders",
      "Beginner-friendly roadmaps for first-time hackers",
    ],
    gradient: "from-violet-600 via-purple-600 to-indigo-500",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    iconName: "BookOpen",
  },
  {
    id: "compete",
    tag: "03 / COMPETE",
    title: "COMPETE",
    tagline: "Participate in hackathons, challenges and coding competitions.",
    description:
      "Test your problem-solving skills in high-energy hackathons and challenges. Form teams, solve practical problems, and compete for recognitions and prizes.",
    bulletPoints: [
      "Structured hackathons across schools and colleges",
      "Transparent judging criteria focused on execution",
      "Exciting prize pools, certificates, and recognition",
    ],
    gradient: "from-indigo-600 via-blue-600 to-cyan-600",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    iconName: "Flame",
  },
  {
    id: "connect",
    tag: "04 / CONNECT",
    title: "CONNECT",
    tagline: "Meet students, mentors, developers, founders and innovators.",
    description:
      "Build a network that lasts throughout your college journey and career. Find hackathon teammates, potential co-founders, and mentor connections.",
    bulletPoints: [
      "Active 24/7 WhatsApp & community channels",
      "Campus chapters and local student tech meetups",
      "Cross-college collaboration across schools and universities",
    ],
    gradient: "from-cyan-600 via-teal-600 to-blue-600",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    iconName: "Sparkles",
  },
];

// -------------------------------------------------------------
// HACKATHONS (NEXHACK EDITIONS)
// -------------------------------------------------------------
export const HACKATHONS_DATA: HackathonItem[] = [
  {
    id: "nexhack-3",
    slug: "nexhack-3-0",
    name: "NEXHACK 3.0",
    edition: "Flagship Edition",
    tagline: "The Future Starts Here",
    description:
      "The premier student hackathon bringing together passionate developers, designers, and innovators to solve pressing challenges in modern technology.",
    status: "Upcoming",
    mode: "Hybrid",
    location: "Bengaluru + Online Track",
    dateRange: "Announcing Soon (Late 2026)",
    prizePool: "Cash Grants & Perks",
    registeredCount: 0,
    tags: ["AI & ML", "Web3", "Full Stack", "Open Innovation"],
    bannerGradient: "from-blue-600 via-indigo-600 to-cyan-500",
    tracks: [
      {
        title: "Artificial Intelligence & Automation",
        desc: "Build AI agents, machine learning workflows, and practical automated tooling.",
        icon: "Bot",
      },
      {
        title: "Web & Mobile Experiences",
        desc: "Create responsive, accessible, high-performance applications that solve student and campus needs.",
        icon: "Smartphone",
      },
      {
        title: "Open Innovation",
        desc: "Propose and prototype your own original product or software solution.",
        icon: "Lightbulb",
      },
    ],
    prizes: [
      { place: "Top Team", reward: "Prize Pool & Trophy", perks: "Mentorship & Incubation Support" },
      { place: "Track Winners", reward: "Category Awards", perks: "Developer Merchandise & Certificates" },
    ],
    eligibility: "Open to all verified high school and college students.",
    featured: true,
  },
  {
    id: "nexhack-2",
    slug: "nexhack-2-0",
    name: "NEXHACK 2.0",
    edition: "National Chapter",
    tagline: "Build What's Next",
    description:
      "A national student hackathon focused on turning raw ideas into tangible MVPs with mentorship rounds and developer showcases.",
    status: "Upcoming",
    mode: "Online",
    location: "Virtual (Devfolio / Online)",
    dateRange: "Upcoming Sprint",
    prizePool: "Cash Grants & Swag",
    registeredCount: 0,
    tags: ["Full Stack", "Cloud", "Developer Tools"],
    bannerGradient: "from-violet-600 via-purple-600 to-indigo-600",
    tracks: [
      {
        title: "Developer Tools & Infrastructure",
        desc: "APIs, CLIs, libraries, and utilities that make developer workflows 10x faster.",
        icon: "Cpu",
      },
      {
        title: "Smart Campus & EdTech",
        desc: "Solutions making education and college life more collaborative and efficient.",
        icon: "School",
      },
    ],
    prizes: [
      { place: "Winner", reward: "Cash Grant", perks: "Winner Certificate & Trophy" },
      { place: "Runner Up", reward: "Developer Perks", perks: "Certificate of Excellence" },
    ],
    eligibility: "College undergraduates & school students.",
    featured: false,
  },
  {
    id: "nexhack-1",
    slug: "nexhack-1-0",
    name: "NEXHACK 1.0",
    edition: "Inaugural Edition",
    tagline: "National Student Hackathon",
    description:
      "Where the NEXHACK movement started: bringing student builders together for collaboration, coding sprints, and hands-on learning.",
    status: "Completed",
    mode: "Hybrid",
    location: "National Virtual Edition",
    dateRange: "Completed Edition",
    prizePool: "Certificates & Grants",
    registeredCount: 500,
    tags: ["Open Source", "Web Dev", "Beginners"],
    bannerGradient: "from-cyan-600 via-blue-600 to-indigo-600",
    tracks: [
      {
        title: "Open Source Solutions",
        desc: "Software built openly for public good and student utility.",
        icon: "Code2",
      },
      {
        title: "First-Time Hacker Track",
        desc: "Dedicated beginner track with active mentor support.",
        icon: "Trophy",
      },
    ],
    prizes: [
      { place: "Best Project", reward: "Honors & Grants", perks: "National Recognition" },
    ],
    eligibility: "Students from all academic disciplines.",
    featured: false,
  },
];

// -------------------------------------------------------------
// KNOWLEDGE SESSIONS & TOPICS
// Real technical learning domains with open Call for Speakers
// -------------------------------------------------------------
export const KNOWLEDGE_SESSIONS_DATA: SpeakerSession[] = [
  {
    id: "ks-1",
    title: "Hands-on AI Engineering: Building Applications with LLMs",
    category: "AI & Machine Learning",
    speaker: {
      name: "Community Tech Mentor",
      role: "Lead Instructor",
      company: "NEXHACK Knowledge Track",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      verified: true,
    },
    date: "Upcoming Weekend",
    time: "6:00 PM IST",
    duration: "60 mins",
    mode: "Live Stream",
    seatsLeft: 100,
    level: "Beginner",
    highlights: [
      "Understanding modern LLM APIs and prompt patterns",
      "Connecting models with web frontends using Next.js",
      "Open Q&A for student projects and hackathon ideas",
    ],
  },
  {
    id: "ks-2",
    title: "Modern Fullstack Web: From Zero to Deployed in 60 Minutes",
    category: "Web Development",
    speaker: {
      name: "NEXHACK Core Team",
      role: "Engineering Lead",
      company: "NEXHACK Community",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      verified: true,
    },
    date: "Upcoming Weekend",
    time: "5:00 PM IST",
    duration: "60 mins",
    mode: "Virtual Workshop",
    seatsLeft: 85,
    level: "Beginner",
    highlights: [
      "Setting up Next.js, TypeScript, and Tailwind CSS",
      "Building clean, accessible, responsive components",
      "Deploying to production on modern edge platforms",
    ],
  },
  {
    id: "ks-3",
    title: "Call for Speakers & Mentors: Share Your Expertise",
    category: "Startups & Career",
    speaker: {
      name: "Open Community Slot",
      role: "Guest Speaker / Mentor",
      company: "Apply to Lead a Session",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300",
      verified: false,
    },
    date: "Open Submissions",
    time: "Flexible Slots",
    duration: "45-60 mins",
    mode: "Live Stream",
    seatsLeft: 5,
    level: "Intermediate",
    highlights: [
      "Are you an engineer, founder, or open-source maintainer?",
      "Host a session for 10,000+ enthusiastic student builders",
      "Direct exposure to student developer talent across India",
    ],
    isCallForSpeakers: true,
  },
];

// -------------------------------------------------------------
// EVENT EXPERIENCES
// -------------------------------------------------------------
export const EVENT_EXPERIENCES: EventExperience[] = [
  {
    id: "exp-hackathons",
    type: "Hackathons",
    title: "Hackathons & Coding Sprints",
    description:
      "Intensive sprints where students collaborate in teams to build innovative software solutions from scratch within a set timeframe.",
    statBadge: "Core Program",
    gradient: "from-blue-600 to-indigo-600",
    highlights: ["Team collaboration", "Problem-solving sprints", "Project showcases"],
    icon: "Trophy",
  },
  {
    id: "exp-workshops",
    type: "Workshops",
    title: "Hands-on Technical Workshops",
    description:
      "Interactive code-alongs and technical workshops that teach students practical, industry-relevant programming skills.",
    statBadge: "Practical Learning",
    gradient: "from-violet-600 to-purple-600",
    highlights: ["Step-by-step code guidance", "Practical exercises", "Starter repositories"],
    icon: "Laptop",
  },
  {
    id: "exp-sessions",
    type: "Knowledge Sessions",
    title: "Expert Knowledge Sessions",
    description:
      "Structured sessions covering AI, web development, cybersecurity, cloud architecture, and software careers.",
    statBadge: "Weekly Learning",
    gradient: "from-indigo-600 to-cyan-600",
    highlights: ["Interactive Q&A", "Career insights", "Tech trend breakdowns"],
    icon: "GraduationCap",
  },
  {
    id: "exp-networking",
    type: "Networking",
    title: "Community Networking",
    description:
      "Connect with like-minded students, find potential co-founders, and build long-lasting friendships with builders across different colleges.",
    statBadge: "Builder Network",
    gradient: "from-cyan-600 to-teal-600",
    highlights: ["Team formation", "Cross-college connections", "Peer reviews"],
    icon: "Users",
  },
  {
    id: "exp-competitions",
    type: "Competitions",
    title: "Coding Competitions & Challenges",
    description:
      "Skill-building challenges, algorithmic contests, and innovation sprints designed to sharpen technical capability.",
    statBadge: "Skill Building",
    gradient: "from-blue-500 to-violet-500",
    highlights: ["Problem solving", "Rapid prototyping", "Skill recognition"],
    icon: "Flame",
  },
  {
    id: "exp-campus",
    type: "Campus Events",
    title: "Campus Takeovers & School Events",
    description:
      "Bringing hackathons, workshops, and tech experiences directly to schools, colleges, and university campuses.",
    statBadge: "On-Ground & Virtual",
    gradient: "from-purple-600 to-pink-600",
    highlights: ["Partner with student clubs", "Turnkey hackathon support", "Campus ambassador chapters"],
    icon: "Building2",
  },
];

// -------------------------------------------------------------
// REAL IMPACT TIMELINE
// -------------------------------------------------------------
export const IMPACT_TIMELINE: ImpactStep[] = [
  {
    step: "01",
    title: "Idea",
    subtitle: "Identify Real Problems",
    description:
      "Identify a real problem in your college, school, community, or everyday workflow that can be solved with technology.",
    icon: "Lightbulb",
  },
  {
    step: "02",
    title: "Learn",
    subtitle: "Learn Modern Stacks",
    description:
      "Participate in workshops, study starter guides, and learn how to use modern web frameworks, AI models, and APIs.",
    icon: "BookOpen",
  },
  {
    step: "03",
    title: "Build",
    subtitle: "Prototype Working Software",
    description:
      "Write real code, connect databases, create interfaces, and turn your initial idea into a functional prototype.",
    icon: "Code2",
  },
  {
    step: "04",
    title: "Compete",
    subtitle: "Present at Hackathons",
    description:
      "Showcase your solution to mentors and fellow students in hackathons and coding challenges.",
    icon: "Trophy",
  },
  {
    step: "05",
    title: "Connect",
    subtitle: "Expand Your Network",
    description:
      "Meet developers from other colleges, build peer connections, and find mentors to guide your tech journey.",
    icon: "Network",
  },
  {
    step: "06",
    title: "Launch",
    subtitle: "Ship to Users",
    description:
      "Deploy your project openly, publish open-source code on GitHub, and take your first step toward building a product.",
    icon: "Rocket",
  },
];

// -------------------------------------------------------------
// COMMUNITY VALUES / MANIFESTO (REAL, NO FAKE TESTIMONIALS)
// -------------------------------------------------------------
export const COMMUNITY_VALUES: CommunityValue[] = [
  {
    id: "val-1",
    title: "Open to Every Student",
    subtitle: "From Beginners to Advanced Coders",
    description:
      "NEXHACK does not filter by college pedigree or past experience. Whether you're in school writing your first lines of HTML or building advanced systems, you belong here.",
    badge: "Inclusive Ecosystem",
  },
  {
    id: "val-2",
    title: "Builders Over Spectators",
    subtitle: "Learning by Doing",
    description:
      "We believe true technical confidence comes from writing code, breaking things, and deploying projects, not just watching slides.",
    badge: "Action-Oriented",
  },
  {
    id: "val-3",
    title: "Peer-to-Peer Collaboration",
    subtitle: "Students Helping Students",
    description:
      "When ambitious students collaborate across different campuses, cities, and disciplines, innovation accelerates exponentially.",
    badge: "Community-First",
  },
  {
    id: "val-4",
    title: "Zero Barrier to Entry",
    subtitle: "Always 100% Free for Students",
    description:
      "All NEXHACK hackathons, community workshops, and open sessions are accessible to students with zero registration fees.",
    badge: "Free & Accessible",
  },
];

// -------------------------------------------------------------
// BLOG & RESOURCES
// Authentic student guides and blueprints
// -------------------------------------------------------------
export const RESOURCES_DATA: ResourceItem[] = [
  {
    id: "res-1",
    title: "The First-Time Hacker Playbook: How to Succeed in Your First Hackathon",
    category: "Hackathon Guides",
    excerpt:
      "A practical guide on how to pick a problem, divide roles in a team, avoid common traps, and build a demo that works.",
    readTime: "6 min read",
    date: "Community Guide",
    author: "NEXHACK Team",
    tags: ["Hackathons", "Beginners", "Teamwork"],
    contentSummary: [
      "How to keep your hackathon scope small and achievable in 24-36 hours",
      "Dividing responsibilities: Frontend, Backend, UI design, and Presentation",
      "The 3-minute project demo checklist: What judges look for",
      "Essential pre-hackathon boilerplates and repo setup checklist",
    ],
  },
  {
    id: "res-2",
    title: "Getting Started with Modern Web Development: HTML, CSS, JS to Next.js",
    category: "Web Development",
    excerpt:
      "A structured roadmap for student developers looking to transition from basic web programming to modern full-stack frameworks.",
    readTime: "8 min read",
    date: "Learning Roadmap",
    author: "NEXHACK Team",
    tags: ["Web Dev", "Next.js", "Roadmap"],
    contentSummary: [
      "Core JavaScript fundamentals you actually need before jumping to React",
      "Why component-based architecture makes project building easier",
      "Modern styling with Tailwind CSS and accessible component patterns",
      "Deploying your portfolio and hackathon projects to the web for free",
    ],
  },
  {
    id: "res-3",
    title: "Git & GitHub Essentials for Hackathon Teams",
    category: "Developer Tooling",
    excerpt:
      "Prevent code loss and merge conflicts during high-speed coding sprints with simple, reliable git branching habits.",
    readTime: "5 min read",
    date: "Technical Guide",
    author: "NEXHACK Team",
    tags: ["Git", "GitHub", "Teamwork"],
    contentSummary: [
      "The simple 2-branch team workflow: main and feature branches",
      "How to resolve merge conflicts cleanly without panic",
      "Writing clear commit messages and README documentation",
      "Using GitHub Issues to track your hackathon tasks",
    ],
  },
];

// -------------------------------------------------------------
// CAMPUS PARTNER PERKS & FORM DATA
// -------------------------------------------------------------
export const CAMPUS_PARTNERS_DATA = {
  headline: "BRING NEXHACK TO YOUR CAMPUS",
  subheadline:
    "We collaborate with schools, colleges, universities, student clubs, and tech societies to organize hackathons, certified workshops, and innovation experiences on your campus.",
  benefits: [
    {
      title: "Hackathon Blueprint & Tooling",
      desc: "Complete operational guidelines, judging rubrics, registration templates, and event structure.",
    },
    {
      title: "Technical Workshops & Mentorship",
      desc: "Connect your students with experienced developers and mentors for workshops and sprints.",
    },
    {
      title: "Ecosystem Network Access",
      desc: "Connect your campus tech club with student developers and chapters across India.",
    },
    {
      title: "Official Campus Chapter Recognition",
      desc: "Establish an official student-led NEXHACK Chapter on your campus.",
    },
  ],
  stats: [
    { label: "Colleges & Schools Network", value: "100+" },
    { label: "States & Regions", value: "20+" },
    { label: "Student Outreach", value: "10,000+" },
    { label: "Free for Students", value: "100%" },
  ],
};

// -------------------------------------------------------------
// TECHNOLOGIES & TOOLS (GENUINE STACK WE BUILD WITH)
// -------------------------------------------------------------
export const TECH_ECOSYSTEM = [
  { name: "Next.js", category: "Full-Stack Framework" },
  { name: "React", category: "UI Library" },
  { name: "TypeScript", category: "Type-Safe JavaScript" },
  { name: "Python", category: "AI & Backend" },
  { name: "Tailwind CSS", category: "Modern Styling" },
  { name: "Node.js", category: "JavaScript Runtime" },
  { name: "Git & GitHub", category: "Version Control" },
  { name: "Docker", category: "Containers" },
  { name: "Linux", category: "Operating System" },
  { name: "PostgreSQL", category: "Database" },
];

// -------------------------------------------------------------
// FAQS
// -------------------------------------------------------------
export const FAQS_DATA: FaqItem[] = [
  {
    category: "General",
    question: "What is NEXHACK and who can join?",
    answer:
      "NEXHACK is a student-driven technology community. Any student enrolled in school (Grades 8-12), college, university, or recently graduated can participate in our hackathons, attend workshops, and join our community.",
  },
  {
    category: "Hackathons",
    question: "Do I need prior coding experience to participate in a hackathon?",
    answer:
      "No! We actively encourage beginners. Our events include starter guides, beginner-friendly tracks, and mentors to help you build your very first project.",
  },
  {
    category: "Cost",
    question: "Is there any registration fee for NEXHACK events?",
    answer:
      "No. All NEXHACK community hackathons, workshops, and knowledge sessions are 100% free of cost for students.",
  },
  {
    category: "Teams",
    question: "What if I don't have a team?",
    answer:
      "You can join solo! We organize team formation channels and mixers on WhatsApp where you can meet teammates before the sprint starts.",
  },
  {
    category: "Campus Chapters",
    question: "How can I bring NEXHACK to my school or college?",
    answer:
      "Submit the Campus Partner form on this website. Our team will reach out with the event toolkit, mentor support, and collaboration details.",
  },
];

// -------------------------------------------------------------
// EXTENDED DATA FOR DEDICATED PAGES
// -------------------------------------------------------------

// 1. ABOUT PAGE DATA
export const ABOUT_LEADERSHIP_ROLES = [
  {
    role: "Community Leads & Organizers",
    description: "Student leaders coordinating national hackathons, logistics, campus outreach, and community operations.",
    badge: "Operations",
    icon: "Users",
  },
  {
    role: "Technical Track Mentors",
    description: "Senior students and industry practitioners providing code reviews, workshop instruction, and hackathon guidance.",
    badge: "Engineering",
    icon: "Code2",
  },
  {
    role: "Campus Chapter Ambassadors",
    description: "On-campus representatives driving local tech clubs, code-alongs, and regional hackathon participation.",
    badge: "Outreach",
    icon: "GraduationCap",
  },
  {
    role: "Design & Media Creators",
    description: "Designers building visual identities, UI design systems, interactive media, and developer documentation.",
    badge: "Creative",
    icon: "Sparkles",
  },
];

export const ABOUT_ROADMAP = [
  {
    period: "2024 - Inception",
    title: "The First Spark",
    description: "Launched NEXHACK 1.0 as a national student virtual sprint with 500+ participants, uniting coders from across 30+ colleges.",
    status: "Completed",
  },
  {
    period: "2025 - Expansion",
    title: "Campus Mesh & Workshops",
    description: "Expanded to 100+ partner colleges and schools, hosting bi-weekly technical masterclasses, developer guides, and regional meetups.",
    status: "Active",
  },
  {
    period: "2026 - Scaled Ecosystem",
    title: "Flagship Hackathons & Builder Fund",
    description: "Hosting NEXHACK 3.0 Hybrid Edition, launching student micro-grants for open-source MVPs, and establishing 50+ official campus chapters.",
    status: "Upcoming",
  },
];

// 2. HACKATHON EVALUATION CRITERIA & RULES
export const HACKATHON_EVALUATION_CRITERIA = [
  {
    title: "Technical Complexity & Execution",
    weight: "30%",
    description: "Architectural depth, functional code, API/DB integrations, and clean code hygiene.",
    icon: "Terminal",
  },
  {
    title: "Originality & Problem Relevance",
    weight: "25%",
    description: "Addressing real-world friction in education, sustainability, developer productivity, or civic life.",
    icon: "Lightbulb",
  },
  {
    title: "UI / UX Polish & Accessibility",
    weight: "25%",
    description: "Thoughtful interface design, responsive layout, intuitive user flow, and functional completeness.",
    icon: "Layers",
  },
  {
    title: "Presentation & Live Demo",
    weight: "20%",
    description: "Clear explanation of the problem, working live demo (no recorded mockups), and articulate Q&A.",
    icon: "Presentation",
  },
];

export const HACKATHON_RULES = [
  {
    rule: "Fresh Code Requirement",
    desc: "All code must be written during the hackathon period. Using third-party open-source libraries and APIs is allowed.",
  },
  {
    rule: "Team Composition",
    desc: "Teams can have 1 to 4 members. Cross-college and cross-school teams are encouraged.",
  },
  {
    rule: "Public GitHub Repository",
    desc: "Projects must be submitted with a public repository, commit history, and a clear README with setup instructions.",
  },
  {
    rule: "Zero Plagiarism",
    desc: "Submitting pre-existing commercial projects or copy-pasting other hackathon submissions results in instant disqualification.",
  },
];

export const PAST_WINNER_SPOTLIGHTS = [
  {
    title: "AgriSense IoT & Crop Advisory",
    category: "Hardware & AI",
    edition: "NEXHACK 1.0 Winner",
    summary: "Built by a 3-student team: low-cost soil moisture sensor syncing with a lightweight Next.js farmer dashboard and automated weather alerts.",
    impact: "Deployed on 2 regional test farms",
  },
  {
    title: "PeerNote Open Campus Hub",
    category: "EdTech & Fullstack",
    edition: "NEXHACK 1.0 Runner-up",
    summary: "Decentralized, peer-reviewed notes and assignment repository for university students with Markdown rendering and AI flashcard generator.",
    impact: "Used by 1,200+ campus students",
  },
  {
    title: "EcoRoute Transit Tracker",
    category: "Civic Tech",
    edition: "NEXHACK 1.0 Track Prize",
    summary: "Real-time crowdsourced public bus tracker with predictive arrival estimates for tier-2 city bus routes.",
    impact: "Open-sourced with 150+ stars on GitHub",
  },
];

// 3. EXTENDED SESSIONS FOR EVENTS PAGE
export const ALL_EVENTS_DATA: SpeakerSession[] = [
  {
    id: "evt-1",
    title: "Hands-on AI Engineering: Building Applications with LLMs",
    category: "AI & Machine Learning",
    speaker: {
      name: "Community Tech Mentor",
      role: "AI Practitioner & Mentor",
      company: "NEXHACK AI Track",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      verified: true,
    },
    date: "Saturday, 6:00 PM IST",
    time: "60 mins",
    duration: "Live Interactive Code-Along",
    mode: "Live Stream",
    seatsLeft: 94,
    level: "Beginner",
    highlights: [
      "Core principles of LLM integration (function calling, embeddings)",
      "Building a working AI assistant with Next.js App Router and streaming UI",
      "Live Q&A on selecting models and avoiding hallucination in student projects",
    ],
  },
  {
    id: "evt-2",
    title: "Modern Fullstack Web: From Zero to Deployed in 60 Minutes",
    category: "Web Development",
    speaker: {
      name: "NEXHACK Engineering Crew",
      role: "Fullstack Lead",
      company: "NEXHACK Community",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      verified: true,
    },
    date: "Sunday, 5:00 PM IST",
    time: "75 mins",
    duration: "Workshop + Code Lab",
    mode: "Virtual Workshop",
    seatsLeft: 72,
    level: "Beginner",
    highlights: [
      "Setting up Next.js 16 with TypeScript and Tailwind CSS v4",
      "Server Components vs Client Components explained simply",
      "Deploying your portfolio and database to production edge platforms",
    ],
  },
  {
    id: "evt-3",
    title: "Docker & Containerization for Hackathon Teams",
    category: "Cloud & DevOps",
    speaker: {
      name: "DevOps Working Group",
      role: "Cloud Architect Mentor",
      company: "Open Source Contributor",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
      verified: true,
    },
    date: "Upcoming Weekend",
    time: "4:00 PM IST",
    duration: "60 mins",
    mode: "Virtual Workshop",
    seatsLeft: 110,
    level: "Intermediate",
    highlights: [
      "Writing clean Dockerfiles for Python and Node.js applications",
      "Using Docker Compose for multi-container web apps with PostgreSQL",
      "How containers eliminate 'it worked on my machine' during hackathon judging",
    ],
  },
  {
    id: "evt-4",
    title: "Mastering Git & GitHub: Branching Without Panic in 24-Hour Sprints",
    category: "Web Development",
    speaker: {
      name: "NEXHACK Campus Leads",
      role: "Student Mentor",
      company: "NEXHACK Open Source Track",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300",
      verified: true,
    },
    date: "Upcoming Weekend",
    time: "7:00 PM IST",
    duration: "45 mins",
    mode: "Virtual Workshop",
    seatsLeft: 88,
    level: "Beginner",
    highlights: [
      "Git workflow that actually works for 4-person hackathon teams",
      "Resolving merge conflicts step-by-step live",
      "Creating professional pull requests and issue tracking boards",
    ],
  },
  {
    id: "evt-5",
    title: "System Design for College Builders: Designing Scalable Backends",
    category: "Cloud & DevOps",
    speaker: {
      name: "Senior Systems Engineer",
      role: "Guest Mentor",
      company: "NEXHACK Mentor Network",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300",
      verified: true,
    },
    date: "Monthly Masterclass",
    time: "6:30 PM IST",
    duration: "90 mins",
    mode: "Live Stream",
    seatsLeft: 140,
    level: "Intermediate",
    highlights: [
      "Database selection: SQL vs NoSQL vs In-memory caches",
      "Rate limiting, caching patterns, and background workers",
      "How to speak intelligently about system architecture in hackathon demos",
    ],
  },
  {
    id: "evt-6",
    title: "Call for Speakers & Mentors: Lead a Session for 10,000+ Students",
    category: "Startups & Career",
    speaker: {
      name: "Open Community Slot",
      role: "Guest Mentor / Speaker",
      company: "Apply to Share Your Knowledge",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300",
      verified: false,
    },
    date: "Rolling Submissions",
    time: "Flexible Slots",
    duration: "45-60 mins",
    mode: "Live Stream",
    seatsLeft: 10,
    level: "Intermediate",
    highlights: [
      "Teach practical skills directly to passionate student engineers",
      "Mentorship certificate and recognition on the national NEXHACK platform",
      "Connect with potential student contributors, interns, and co-founders",
    ],
    isCallForSpeakers: true,
  },
];

// 4. COMMUNITY CITY NODES & SPACES
export const COMMUNITY_CITY_NODES = [
  { city: "Delhi NCR", status: "Active Node", students: "1,800+", colleges: "30+ Campuses" },
  { city: "Bengaluru", status: "Active Node", students: "2,200+", colleges: "28+ Campuses" },
  { city: "Mumbai & Pune", status: "Active Node", students: "1,500+", colleges: "24+ Campuses" },
  { city: "Hyderabad", status: "Active Node", students: "1,200+", colleges: "20+ Campuses" },
  { city: "Chennai", status: "Active Node", students: "950+", colleges: "18+ Campuses" },
  { city: "Kolkata", status: "Active Node", students: "750+", colleges: "15+ Campuses" },
  { city: "Jaipur & Rajasthan", status: "Active Node", students: "650+", colleges: "12+ Campuses" },
  { city: "Chandigarh & Punjab", status: "Active Node", students: "600+", colleges: "10+ Campuses" },
  { city: "Ahmedabad & Gujarat", status: "Active Node", students: "550+", colleges: "9+ Campuses" },
  { city: "Lucknow & UP", status: "Growing Node", students: "500+", colleges: "8+ Campuses" },
  { city: "Indore & MP", status: "Growing Node", students: "450+", colleges: "8+ Campuses" },
  { city: "Kochi & Kerala", status: "Growing Node", students: "400+", colleges: "7+ Campuses" },
];

export const COMMUNITY_DISCUSSION_SPACES = [
  {
    name: "#general-chat",
    description: "Daily tech chatter, question of the day, and connecting with students from other colleges.",
    members: "10k+",
    icon: "MessageSquare",
    href: "https://chat.whatsapp.com/IZSIwb5Zu19CB8qOax8NUd",
  },
  {
    name: "#hackathon-squad-finder",
    description: "Looking for a frontend designer, backend coder, or pitch lead? Assemble your dream team.",
    members: "3.5k+",
    icon: "Users",
    href: "https://chat.whatsapp.com/CwFjSEfDbqj5cIOfTFMn2R",
  },
  {
    name: "#code-help-and-debug",
    description: "Stuck on an error, CORS issue, or build bug? Get fast help from fellow student coders.",
    members: "4.2k+",
    icon: "Terminal",
    href: "https://chat.whatsapp.com/LTSp2W4mNuN0fNWbbzSqqt",
  },
  {
    name: "#project-showcase",
    description: "Share your GitHub repos, live deployments, and side projects for feedback and stars.",
    members: "2.8k+",
    icon: "Rocket",
    href: "https://chat.whatsapp.com/KbxEhGclu5iJNFtzlDndCB",
  },
  {
    name: "#internship-opportunities",
    description: "Verified student internships, open-source programs (GSoC, LFX), and hackathon job bounties.",
    members: "6.1k+",
    icon: "Briefcase",
    href: "https://chat.whatsapp.com/LdVUROvCIZ8B9RuetBiOgn",
  },
];

export const COMMUNITY_CHARTER_RULES = [
  {
    title: "Respect & Inclusivity",
    desc: "Zero tolerance for harassment, elitism, or condescending behavior. Every coder was once a beginner.",
  },
  {
    title: "No Gatekeeping",
    desc: "Share knowledge freely. If someone asks a beginner question, provide helpful guidance or documentation.",
  },
  {
    title: "Authentic Attribution",
    desc: "Give credit where credit is due. Acknowledge open-source tools, teammate contributions, and mentors.",
  },
  {
    title: "Constructive Feedback",
    desc: "When reviewing another student's project, point out strengths first and suggest actionable improvements.",
  },
  {
    title: "Student-First Spirit",
    desc: "Our community exists to build, learn, compete, and connect — not for spam, self-promotion, or paid promotions.",
  },
];

// 5. EXTENDED RESOURCES DIRECTORY
export const EXTENDED_RESOURCES_DATA: ResourceItem[] = [
  {
    id: "res-1",
    title: "The First-Time Hacker Playbook: How to Win Your First Hackathon",
    category: "Hackathon Strategy",
    excerpt: "A practical guide on how to pick a realistic problem, divide team roles, avoid scope creep, and deliver a live demo that wows judges.",
    readTime: "7 min read",
    date: "Core Guide",
    author: "NEXHACK Team",
    tags: ["Hackathons", "Beginners", "Teamwork", "Demo"],
    contentSummary: [
      "Rule 1: Never build a full user auth system if your core value is an AI or data algorithm.",
      "Divide responsibilities explicitly: 1 Frontend Lead, 1 Backend/Data Lead, 1 Pitch & Demo Lead.",
      "The 3-Minute Demo Formula: 30s Problem, 90s Live Demo, 30s Architecture, 30s Q&A.",
      "Deploy on Day 1: Setup Vercel or Fly.io at hour 4, never at hour 23 when WiFi is clogged.",
    ],
  },
  {
    id: "res-2",
    title: "Modern Web Stack in 2026: Next.js, TypeScript & Tailwind CSS",
    category: "Frontend & Fullstack",
    excerpt: "Why this stack has become the gold standard for rapid student prototyping, high performance, and accessible UI.",
    readTime: "8 min read",
    date: "Tech Roadmap",
    author: "NEXHACK Team",
    tags: ["Web Dev", "Next.js", "TypeScript", "Tailwind"],
    contentSummary: [
      "Understanding React 19 and Next.js App Router for zero-config routing and API endpoints.",
      "Why TypeScript prevents 80% of runtime bugs during frantic hackathon debugging.",
      "Tailwind CSS utility patterns for responsive, mobile-first design without writing CSS files.",
      "Useful component primitives and accessible iconography libraries.",
    ],
  },
  {
    id: "res-3",
    title: "Git & GitHub Team Workflows for Fast-Paced Coding Sprints",
    category: "Developer Tooling",
    excerpt: "Prevent code loss and merge conflicts during 24-hour sprints with a simple, fail-safe Git branching workflow.",
    readTime: "5 min read",
    date: "DevOps & Tooling",
    author: "NEXHACK Team",
    tags: ["Git", "GitHub", "Teamwork", "Branching"],
    contentSummary: [
      "The Golden Rule: Never commit directly to main. Keep main always deployable.",
      "Create feature branches: `git checkout -b feature/login-page` and open a PR.",
      "Resolving merge conflicts: Pull latest main first before attempting to merge your branch.",
      "Writing a punchy GitHub README: Problem, Demo Video Link, Tech Stack, and Run Locally steps.",
    ],
  },
  {
    id: "res-4",
    title: "How to Build an Unbeatable Hackathon Pitch & Demo Deck",
    category: "Pitch & Presentation",
    excerpt: "Judges review dozens of projects in under an hour. Here is how to make yours unforgettable in 180 seconds.",
    readTime: "6 min read",
    date: "Presentation Strategy",
    author: "NEXHACK Mentors",
    tags: ["Pitching", "Demo Day", "Judges", "Slides"],
    contentSummary: [
      "Hook the audience in 10 seconds: Describe a visceral pain point before showing software.",
      "Never show slides for more than 45 seconds — judges want to see working software.",
      "Have a backup plan: Screen recording on phone/laptop in case campus WiFi drops during the demo.",
      "Answer questions concisely: Be honest about technical limitations rather than bluffing.",
    ],
  },
  {
    id: "res-5",
    title: "Free Developer Tools & Cloud Tiers Every Student Must Know",
    category: "Student Perks",
    excerpt: "Curated list of verified free tiers, student packs, database grants, and AI API credits available to university students.",
    readTime: "5 min read",
    date: "Student Perks",
    author: "NEXHACK Team",
    tags: ["Free Tools", "Cloud", "APIs", "Student Pack"],
    contentSummary: [
      "GitHub Student Developer Pack: Free domains, Canva Pro, JetBrains IDEs, and GitHub Copilot.",
      "Hosting & Compute: Vercel (Frontends), Supabase / Neon (Free Postgres), Fly.io (Containers).",
      "AI APIs: Google Gemini free tier API keys and Hugging Face inference endpoints.",
      "Design & Mockups: Figma Education plan for unlimited team collaboration.",
    ],
  },
  {
    id: "res-6",
    title: "Building APIs that Won't Crash During Judge Evaluation",
    category: "Backend Engineering",
    excerpt: "Simple defensive backend patterns: input validation with Zod, proper HTTP status codes, and error fallbacks.",
    readTime: "6 min read",
    date: "Backend Engineering",
    author: "NEXHACK Team",
    tags: ["Backend", "Node.js", "Python", "API"],
    contentSummary: [
      "Always validate request payloads to avoid 500 unhandled exceptions.",
      "Use proper HTTP status codes (200, 201, 400, 404, 500) so frontend error toasts work cleanly.",
      "Add CORS headers properly early on to prevent last-minute localhost blocking errors.",
      "Include a health check endpoint `/api/health` to confirm server status instantly.",
    ],
  },
];

// 6. CAMPUS CHAPTER PROGRAM DETAILS
export const CAMPUS_CHAPTER_TIERS = [
  {
    title: "Campus Partner Society",
    suitableFor: "Existing Tech Clubs, ACM/IEEE Chapters, Coding Societies",
    benefits: [
      "Co-brand official NEXHACK regional hackathons and sprints",
      "Access to national mentor pool and workshop instructors",
      "National certificate of collaboration for the student club",
      "Direct cross-promotion to NEXHACK's 10,000+ student network",
    ],
  },
  {
    title: "Official NEXHACK Campus Chapter",
    suitableFor: "Colleges launching a dedicated NEXHACK Student Chapter",
    benefits: [
      "Official Chapter Charter and Leadership badging for Campus Leads",
      "Turnkey Hackathon in a Box (judging portals, rubrics, problem sets)",
      "Access to exclusive NEXHACK swag, stickers, and developer perks",
      "Priority representation in national inter-college hackathon leagues",
    ],
  },
];

export const CAMPUS_ONBOARDING_STEPS = [
  {
    step: "01",
    title: "Submit Interest",
    desc: "Fill the partnership form on this page with details of your institution, club, or student community.",
  },
  {
    step: "02",
    title: "Quick Alignment Call",
    desc: "Meet virtually with the NEXHACK Community Team to explore event dates, tracks, and faculty coordinator support.",
  },
  {
    step: "03",
    title: "Receive Event Kit",
    desc: "Get access to promotional assets, problem statements, evaluation guidelines, and mentor network contacts.",
  },
  {
    step: "04",
    title: "Launch & Code",
    desc: "Host your hackathon or workshop on-ground with co-branded certificates, national leaderboards, and sponsor perks.",
  },
];

