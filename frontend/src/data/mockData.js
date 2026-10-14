// Mock Data matching FastAPI schemas in backend/app/schemas/

export const mockCategories = [
  { id: 'all', name: 'All Disciplines', icon: 'apps', count: 1240 },
  { id: 'eng', name: 'Engineering & Tech', icon: 'code', count: 420 },
  { id: 'design', name: 'UI/UX Design', icon: 'palette', count: 312 },
  { id: 'product', name: 'Product Management', icon: 'hub', count: 185 },
  { id: 'marketing', name: 'Marketing & Growth', icon: 'trending_up', count: 240 },
  { id: 'data', name: 'Data Science & AI', icon: 'smart_toy', count: 190 },
  { id: 'finance', name: 'Finance & Strategy', icon: 'account_balance', count: 145 },
  { id: 'security', name: 'Cybersecurity & Infra', icon: 'shield', count: 64 },
];

export const initialJobs = [
  {
    id: 'job-1',
    title: 'Staff Distributed Systems Engineer',
    company_name: 'Vercel Architecture Labs',
    location: 'San Francisco, CA (Hybrid)',
    job_type: 'Full-Time',
    salary_range: '$210,000 - $260,000 + Equity',
    category: 'Engineering & Tech',
    employer_id: 'emp-101',
    status: 'active',
    applicant_count: 24,
    created_at: '2026-10-10T09:00:00Z',
    updated_at: '2026-10-12T14:30:00Z',
    requirements: [
      '8+ years building high-throughput low-latency microservices',
      'Production mastery with Go, Rust, or modern C++',
      'Experience with Raft consensus, edge compute, and distributed caches',
      'Track record leading architectural RFCs and mentoring staff-level peers'
    ],
    description: 'We are seeking a Staff Distributed Systems Engineer to scale our global edge rendering runtime across 90+ points of presence. You will design fault-tolerant systems handling 120k requests/second with sub-15ms p99 latency guarantees.',
    tags: ['Go', 'Rust', 'Distributed Systems', 'Edge Compute'],
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'job-2',
    title: 'Principal Product Designer (Design Systems)',
    company_name: 'Linear Craft Technologies',
    location: 'Remote (Global)',
    job_type: 'Remote',
    salary_range: '$190,000 - $240,000 + 0.15% Equity',
    category: 'UI/UX Design',
    employer_id: 'emp-102',
    status: 'active',
    applicant_count: 38,
    created_at: '2026-10-11T11:00:00Z',
    updated_at: '2026-10-13T10:15:00Z',
    requirements: [
      '7+ years designing tactile, high-density desktop and web interfaces',
      'Deep mastery of Figma variables, token pipelines, and headless UI architectures',
      'Proven expertise collaborating tightly with frontend engineers using React and Tailwind',
      'Portfolio showcasing craftsmanship in micro-interactions, ergonomics, and accessibility'
    ],
    description: 'Lead our next-generation design system serving over 1.2M active developers and product leaders. You will craft bespoke interaction patterns, define tactile elevation models, and bridge Figma with production React tokens.',
    tags: ['Figma', 'Design Systems', 'Micro-interactions', 'Tailwind'],
    logo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'job-3',
    title: 'Head of AI Research & Agents',
    company_name: 'Cognition Dynamics',
    location: 'New York, NY (On-site)',
    job_type: 'Full-Time',
    salary_range: '$260,000 - $340,000 + Significant Carried Interest',
    category: 'Data Science & AI',
    employer_id: 'emp-103',
    status: 'active',
    applicant_count: 19,
    created_at: '2026-10-08T15:20:00Z',
    updated_at: '2026-10-14T08:45:00Z',
    requirements: [
      'Ph.D. or equivalent industry track record in Reinforcement Learning or LLM Reasoning',
      'Experience optimizing speculative decoding, reasoning chains, and agentic tool use',
      'Demonstrated leadership managing high-output research teams',
      'Publications at NeurIPS, ICML, or ICLR preferred'
    ],
    description: 'Drive the frontier of autonomous developer agents. As Head of AI Research, you will helm our foundation reasoning experiments, model alignment, and autonomous debugging execution loops.',
    tags: ['LLM Reasoning', 'Python', 'PyTorch', 'Agentic Workflows'],
    logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'job-4',
    title: 'Senior Product Manager - Developer Platform',
    company_name: 'Stripe Infrastructure',
    location: 'Seattle, WA (Hybrid)',
    job_type: 'Full-Time',
    salary_range: '$185,000 - $235,000 + RSUs',
    category: 'Product Management',
    employer_id: 'emp-104',
    status: 'active',
    applicant_count: 42,
    created_at: '2026-10-09T13:10:00Z',
    updated_at: '2026-10-13T16:00:00Z',
    requirements: [
      '5+ years technical product management in API platforms or cloud infra',
      'Direct software development background or strong computer science acumen',
      'Ability to articulate nuanced developer DX tradeoffs to executive leadership',
      'Track record driving measurable adoption of developer APIs and SDKs'
    ],
    description: 'Own the roadmap for our core developer API gateway, webhook delivery infrastructure, and SDK generation pipeline. You will champion developer empathy across global enterprise engineering teams.',
    tags: ['API Platform', 'Developer DX', 'Product Strategy', 'Roadmapping'],
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'job-5',
    title: 'Lead Security Operations & Zero-Trust Architect',
    company_name: 'Palisade Defense AI',
    location: 'Remote (US/EU)',
    job_type: 'Remote',
    salary_range: '$200,000 - $250,000',
    category: 'Cybersecurity & Infra',
    employer_id: 'emp-105',
    status: 'active',
    applicant_count: 14,
    created_at: '2026-10-05T08:00:00Z',
    updated_at: '2026-10-12T11:20:00Z',
    requirements: [
      'CISSP / CISM or proven 7+ years architecting enterprise Zero-Trust perimeters',
      'Expertise in eBPF kernel tracing, AWS IAM governance, and SPIFFE/SPIRE',
      'Hands-on experience mitigating nation-state attack vectors and APTs',
      'Solid programming skills in Go or Python for security automation'
    ],
    description: 'Architect and defend our cryptographic perimeter and multi-tenant AI pipelines. You will lead threat modeling, automated enclave validation, and zero-trust policy enforcement across our cloud environments.',
    tags: ['Zero Trust', 'eBPF', 'Cloud Security', 'Kubernetes'],
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'job-6',
    title: 'Director of Growth Marketing & Retention',
    company_name: 'Supabase Data Labs',
    location: 'Austin, TX (Hybrid)',
    job_type: 'Full-Time',
    salary_range: '$175,000 - $220,000 + Equity',
    category: 'Marketing & Growth',
    employer_id: 'emp-106',
    status: 'active',
    applicant_count: 31,
    created_at: '2026-10-07T14:40:00Z',
    updated_at: '2026-10-14T09:10:00Z',
    requirements: [
      '6+ years scaling B2B SaaS ARR from $10M to $50M+',
      'Deep quantitative modeling skills across product-led growth (PLG) loops',
      'Hands-on proficiency with PostHog, Segment, SQL, and retention cohorts',
      'Ability to build authentic community-driven growth campaigns for developer audiences'
    ],
    description: 'Scale our developer acquisition engine and lifecycle retention funnels. You will align content, product telemetry, and community activation into high-converting organic flywheel loops.',
    tags: ['PLG', 'Growth Loops', 'Analytics', 'SQL'],
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&auto=format&fit=crop&q=80'
  }
];

export const initialApplications = [
  {
    id: 'app-001',
    job_id: 'job-1',
    job_title: 'Staff Distributed Systems Engineer',
    company_name: 'Vercel Architecture Labs',
    seeker_id: 'usr-annie',
    seeker_name: 'Annie Chen',
    seeker_email: 'annie.chen@example.com',
    status: 'interviewing',
    recruiter_notes: 'Passed initial system design screen with distinction. Onsite loop scheduled for Friday.',
    interview_date: '2026-10-17T15:00:00Z',
    interview_stage: 'Technical Architecture Round (90m)',
    interviewers: ['Marcus Vance (VP Eng)', 'Sarah Lin (Principal Architect)'],
    created_at: '2026-10-10T14:00:00Z',
    updated_at: '2026-10-13T10:00:00Z',
    resume_url: '/resumes/annie_chen_staff_distributed.pdf'
  },
  {
    id: 'app-002',
    job_id: 'job-2',
    job_title: 'Principal Product Designer (Design Systems)',
    company_name: 'Linear Craft Technologies',
    seeker_id: 'usr-annie',
    seeker_name: 'Annie Chen',
    seeker_email: 'annie.chen@example.com',
    status: 'reviewed',
    recruiter_notes: 'Design portfolio thoroughly reviewed. Hiring manager eager to schedule portfolio deep dive.',
    interview_date: null,
    interview_stage: 'Portfolio Review',
    created_at: '2026-10-11T12:30:00Z',
    updated_at: '2026-10-12T17:00:00Z',
    resume_url: '/resumes/annie_chen_portfolio.pdf'
  },
  {
    id: 'app-003',
    job_id: 'job-3',
    job_title: 'Head of AI Research & Agents',
    company_name: 'Cognition Dynamics',
    seeker_id: 'usr-annie',
    seeker_name: 'Annie Chen',
    seeker_email: 'annie.chen@example.com',
    status: 'applied',
    recruiter_notes: 'Application received and routed to technical talent team.',
    interview_date: null,
    created_at: '2026-10-13T16:45:00Z',
    updated_at: '2026-10-13T16:45:00Z',
    resume_url: '/resumes/annie_chen_research_cv.pdf'
  },
  {
    id: 'app-004',
    job_id: 'job-4',
    job_title: 'Senior Product Manager - Developer Platform',
    company_name: 'Stripe Infrastructure',
    seeker_id: 'usr-annie',
    seeker_name: 'Annie Chen',
    seeker_email: 'annie.chen@example.com',
    status: 'accepted',
    recruiter_notes: 'Formal executive offer extended. Base $215k + equity package delivered.',
    interview_date: null,
    created_at: '2026-09-28T10:00:00Z',
    updated_at: '2026-10-12T18:30:00Z',
    resume_url: '/resumes/annie_chen_pm.pdf'
  },
  {
    id: 'app-005',
    job_id: 'job-5',
    job_title: 'Lead Security Operations & Zero-Trust Architect',
    company_name: 'Palisade Defense AI',
    seeker_id: 'usr-annie',
    seeker_name: 'Annie Chen',
    seeker_email: 'annie.chen@example.com',
    status: 'rejected',
    recruiter_notes: 'Role paused due to internal restructuring. Kept in candidate pipeline for future openings.',
    interview_date: null,
    created_at: '2026-10-02T11:15:00Z',
    updated_at: '2026-10-09T09:00:00Z',
    resume_url: '/resumes/annie_chen_security.pdf'
  }
];

export const initialSavedJobs = [
  {
    id: 'save-1',
    user_id: 'usr-annie',
    job_id: 'job-2',
    job_title: 'Principal Product Designer (Design Systems)',
    company_name: 'Linear Craft Technologies',
    location: 'Remote (Global)',
    job_type: 'Remote',
    salary_range: '$190,000 - $240,000 + 0.15% Equity',
    created_at: '2026-10-11T12:00:00Z'
  },
  {
    id: 'save-2',
    user_id: 'usr-annie',
    job_id: 'job-3',
    job_title: 'Head of AI Research & Agents',
    company_name: 'Cognition Dynamics',
    location: 'New York, NY (On-site)',
    job_type: 'Full-Time',
    salary_range: '$260,000 - $340,000 + Significant Carried Interest',
    created_at: '2026-10-12T08:30:00Z'
  },
  {
    id: 'save-3',
    user_id: 'usr-annie',
    job_id: 'job-4',
    job_title: 'Senior Product Manager - Developer Platform',
    company_name: 'Stripe Infrastructure',
    location: 'Seattle, WA (Hybrid)',
    job_type: 'Full-Time',
    salary_range: '$185,000 - $235,000 + RSUs',
    created_at: '2026-10-13T19:20:00Z'
  }
];

export const initialCandidates = [
  {
    id: 'cand-1',
    name: 'Elena Rostova',
    title: 'Staff Product Designer & Systems Architect',
    location: 'San Francisco, CA',
    experience: '8+ Years Exp',
    status: 'Open to Offers',
    skills: ['Design Systems', 'Figma Tokens', 'React', 'Ergonomics'],
    bio: 'Ex-Stripe Staff Designer. Built cohesive multi-platform design systems for 120+ internal engineers and external developers.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    salary_expectation: '$220k - $250k'
  },
  {
    id: 'cand-2',
    name: 'Tariq Al-Mansoor',
    title: 'Principal Distributed Systems Architect',
    location: 'Seattle, WA',
    experience: '11+ Years Exp',
    status: 'Interviewing Actively',
    skills: ['Go', 'Rust', 'Kubernetes', 'eBPF', 'Kafka'],
    bio: 'Architected streaming pipeline processing 40B events daily with sub-second analytics and zero unplanned downtime.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    salary_expectation: '$250k - $300k'
  },
  {
    id: 'cand-3',
    name: 'Devon Vance',
    title: 'VP of Product Engineering',
    location: 'New York, NY',
    experience: '14+ Years Exp',
    status: 'Exploring Selectively',
    skills: ['Engineering Leadership', 'Platform Ops', 'FastAPI', 'Next.js'],
    bio: 'Scaled engineering org from 15 to 110 engineers across three continents while maintaining 99.99% core platform SLA.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    salary_expectation: '$280k - $350k'
  },
  {
    id: 'cand-4',
    name: 'Aria Takahashi',
    title: 'Senior AI Research Scientist (LLMs)',
    location: 'Remote (Tokyo / US)',
    experience: '6+ Years Exp',
    status: 'Open to Offers',
    skills: ['PyTorch', 'RLHF', 'Agentic Reasoning', 'CUDA'],
    bio: 'Published at NeurIPS 2024 on parameter-efficient preference tuning for autonomous agent systems.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    salary_expectation: '$240k - $290k'
  }
];

export const initialMessages = [
  {
    id: 'thread-1',
    participant_name: 'Marcus Vance',
    participant_title: 'VP of Engineering @ Vercel Architecture Labs',
    participant_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    unread: true,
    last_message: 'Your system design breakdown on Friday was stellar. The team wants to move directly to the offer discussion stage.',
    time: '10:42 AM',
    messages: [
      {
        id: 'm1',
        sender: 'Marcus Vance',
        text: 'Hi Annie, thanks for taking the time for the distributed systems round yesterday.',
        time: 'Yesterday 3:15 PM',
        isMe: false
      },
      {
        id: 'm2',
        sender: 'Annie Chen',
        text: 'Thanks Marcus! Really enjoyed walking through the edge consensus cache model with Sarah.',
        time: 'Yesterday 4:02 PM',
        isMe: true
      },
      {
        id: 'm3',
        sender: 'Marcus Vance',
        text: 'Your system design breakdown on Friday was stellar. The team wants to move directly to the offer discussion stage.',
        time: '10:42 AM',
        isMe: false
      }
    ]
  },
  {
    id: 'thread-2',
    participant_name: 'Clara Oswald',
    participant_title: 'Design Director @ Linear Craft Technologies',
    participant_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    unread: false,
    last_message: 'Are you free for a quick 20-minute portfolio walkthrough on Tuesday afternoon?',
    time: 'Yesterday',
    messages: [
      {
        id: 'm21',
        sender: 'Clara Oswald',
        text: 'Hey Annie, loved your case study on tactile token pipelines. Are you free for a quick 20-minute portfolio walkthrough on Tuesday afternoon?',
        time: 'Yesterday 11:20 AM',
        isMe: false
      }
    ]
  }
];
