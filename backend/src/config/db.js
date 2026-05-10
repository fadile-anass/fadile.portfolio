import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const db = {
projects: [
  {
    id: 1,
    title: 'Distrack — Field Distribution Tracking System',
    slug: 'distrack-field-tracking',
    description: 'Professional platform designed to track, verify, and optimize field distribution operations. Built to provide real-time visibility, proof of execution, and performance analytics for companies managing field teams.',
    tech_stack: '["Laravel", "Vue.js", "MySQL"]',
    category: 'fullstack',
    featured: 1,
    sort_order: 0,
    image_url: '/images/projects/distrack.jpg',
    demo_url: '#',
    github_url: '#'
  },
  {
    id: 2,
    title: 'Ilya Tour — Travel Agency Management Dashboard',
    slug: 'travel-agency-dashboard',
    description: 'Advanced dashboard for managing travel agency operations including bookings, client management, and reporting. Designed to streamline workflows and improve operational efficiency.',
    tech_stack: '["Vue.js", "Tailwind CSS"]',
    category: 'frontend',
    featured: 1,
    sort_order: 1,
    image_url: '/images/projects/ilyatour.jpg',
    demo_url: '#',
    github_url: '#'
  },
  {
    id: 3,
    title: 'Eventlink — Event Management Platform',
    slug: 'events-management-app',
    description: 'Full-stack application that allows users to create, manage, and track events with an admin dashboard. Includes scalable architecture and structured data management.',
    tech_stack: '["Laravel", "Vue.js", "MySQL"]',
    category: 'fullstack',
    featured: 1,
    sort_order: 2,
    image_url: '/images/projects/eventlink.jpg',
    demo_url: '#',
    github_url: '#'
  },
  {
    id: 4,
    title: 'Integrated Management System (Red Crescent)',
    slug: 'red-crescent-ims',
    description: 'Comprehensive management system developed for Croissant Rouge Marocain to handle internal operations, user management, and data tracking using a scalable MERN stack architecture.',
    tech_stack: '["MongoDB", "Express", "React", "Node.js"]',
    category: 'fullstack',
    featured: 1,
    sort_order: 3,
    image_url: '/images/projects/red-crescent-ims.jpg',
    demo_url: '#',
    github_url: '#'
  },
  {
    id: 5,
    title: 'Electrical Installation Morocco — Business Website',
    slug: 'security-camera-garage-door-morocco',
    description: 'Real-world business website for a service provider offering surveillance installation and automation systems. Built to generate leads, showcase services, and support online visibility.',
    tech_stack: '["HTML", "JavaScript", "Tailwind CSS"]',
    category: 'frontend',
    featured: 0,
    sort_order: 4,
    image_url: '/images/projects/installation_electric.jpg',
    demo_url: 'https://www.installation-electrique.site/',
    github_url: 'https://github.com/fadile-anass/is-electrique-langing-page'
  },
  {
    id: 6,
    title: 'Amasante — Healthcare Management System',
    slug: 'health-app',
    description: 'Healthcare platform enabling interaction between patients and doctors, including appointment management and data organization. Focused on usability and structured backend logic.',
    tech_stack: '["Laravel", "Vue.js", "MySQL"]',
    category: 'fullstack',
    featured: 0,
    sort_order: 5,
    image_url: '/images/projects/amasante.jpg',
    demo_url: '#',
    github_url: '#'
  },
  // {
  //   id: 7,
  //   title: 'Spinner Wheel App — Custom Decision Tool',
  //   slug: 'spinner-wheel-app',
  //   description: 'Interactive backend-powered application allowing users to create customizable spinner wheels for product selection, games, or decision-making tools.',
  //   tech_stack: '["Node.js", "Express"]',
  //   category: 'backend',
  //   featured: 0,
  //   sort_order: 6,
  //   image_url: '/images/projects/spinner.jpg',
  //   demo_url: '#',
  //   github_url: '#'
  // }
],
  skills: [
    { id: 1, name: 'HTML', category: 'frontend', level: 90, sort_order: 1 },
    { id: 2, name: 'CSS', category: 'frontend', level: 88, sort_order: 2 },
    { id: 3, name: 'JavaScript', category: 'frontend', level: 85, sort_order: 3 },
    { id: 4, name: 'Tailwind', category: 'frontend', level: 85, sort_order: 4 },
    { id: 5, name: 'Bootstrap', category: 'frontend', level: 80, sort_order: 5 },
    { id: 6, name: 'React', category: 'frontend', level: 75, sort_order: 6 },
    { id: 7, name: 'Vue.js', category: 'frontend', level: 90, sort_order: 7 },
    { id: 8, name: 'Laravel', category: 'backend', level: 85, sort_order: 8 },
    { id: 9, name: 'Express.js', category: 'backend', level: 82, sort_order: 9 },
    { id: 10, name: 'Node.js', category: 'backend', level: 82, sort_order: 10 },
    { id: 11, name: 'MySQL', category: 'database', level: 80, sort_order: 11 },
    { id: 12, name: 'MongoDB', category: 'database', level: 75, sort_order: 12 },
    { id: 13, name: 'Git/GitHub', category: 'tools', level: 88, sort_order: 13 },
    { id: 14, name: 'UML', category: 'tools', level: 70, sort_order: 14 },
    { id: 15, name: 'PHP', category: 'backend', level: 75, sort_order: 15 },
    { id: 16, name: 'REST API', category: 'backend', level: 85, sort_order: 16 },
    { id: 17, name: 'Docker', category: 'tools', level: 50, sort_order: 17 },
    { id: 18, name: 'Linux', category: 'tools', level: 60, sort_order: 18 }
  ],
  experiences: [
    { id: 1, company: 'Hermes Express', role: 'Business Manager', type: 'full-time', start_date: '2025-12-01', end_date: '2026-03-01', description: 'Managed business operations and client relationships.', location: 'Casablanca, Morocco' },
    { id: 2, company: 'IS-Tech', role: 'Full Stack Dev', type: 'full-time', start_date: '2024-10-01', end_date: '2025-11-01', description: 'Developed full stack web applications using Vue.js and Node.js.', location: 'Casablanca, Morocco' },
    { id: 3, company: 'Croissant Rouge Marocain', role: 'Intern', type: 'internship', start_date: '2024-04-01', end_date: '2024-07-01', description: 'Developed an Integrated Management System.', location: 'Casablanca, Morocco' },
    { id: 4, company: 'Installation Electrique', role: 'Front-End Intern', type: 'internship', start_date: '2023-11-01', end_date: '2024-01-01', description: 'Built responsive front-end interfaces.', location: 'Casablanca, Morocco' },
    { id: 5, company: 'Ancona Media', role: 'Web Dev Intern', type: 'internship', start_date: '2023-05-01', end_date: '2023-06-01', description: 'Assisted in web development projects.', location: 'Casablanca, Morocco' }
  ],
  services: [
    { id: 1, title: 'Full Stack Web Development', description: 'End-to-end web application development using modern frameworks.', icon_name: 'code', sort_order: 1 },
    { id: 2, title: 'UI/UX Integration', description: 'Pixel-perfect implementation of designs with smooth animations.', icon_name: 'layers', sort_order: 2 },
    { id: 3, title: 'API & Backend Engineering', description: 'Robust, scalable, and secure RESTful APIs and database design.', icon_name: 'server', sort_order: 3 },
    { id: 4, title: 'Business Development & CRM', description: 'Integrating technical solutions with business growth strategies.', icon_name: 'chart', sort_order: 4 }
  ],
blog_posts: [
{
  id: 1,
  title: 'From Developer to Problem Solver: The Mindset Shift That Changed Everything',
  slug: 'developer-to-problem-solver',
  excerpt: 'Most developers focus on code. The best developers focus on solving real problems. This mindset shift changed how I build software.',
  content: `
<h2>Introduction</h2>
<p>When I first started in development, I believed that writing clean code and mastering frameworks was enough to succeed. I focused heavily on syntax, best practices, and learning new technologies.</p>

<p>But as I started working on real-world projects, I realized something important: <strong>clients and businesses don’t care about code — they care about results.</strong></p>

<h2>The Wrong Focus</h2>
<p>Many developers fall into the same trap. They spend hours debating frameworks, optimizing code structure, or chasing trends.</p>

<p>But in reality, none of that matters if the product doesn’t solve a real problem.</p>

<h2>The Shift in Thinking</h2>
<p>I started changing my approach. Instead of asking:</p>
<ul>
<li>“What technology should I use?”</li>
</ul>

<p>I began asking:</p>
<ul>
<li>“What problem am I solving?”</li>
<li>“Who is this for?”</li>
<li>“What value does this bring?”</li>
</ul>

<p>This completely changed how I build applications.</p>

<h2>Real Example: Distrack</h2>
<p>When working on Distrack, the goal wasn’t to build a “cool app”. The goal was to solve a real business problem:</p>

<ul>
<li>Lack of visibility in field operations</li>
<li>No proof of execution</li>
<li>Poor tracking of performance</li>
</ul>

<p>So instead of focusing only on features, I focused on:</p>
<ul>
<li>Tracking systems</li>
<li>Data transparency</li>
<li>Performance insights</li>
</ul>

<p>This is what made the project valuable.</p>

<h2>What Changed in My Workflow</h2>
<p>Now, every time I build something, I follow this mindset:</p>

<ul>
<li>Start with the problem</li>
<li>Understand the user</li>
<li>Design the solution</li>
<li>Then write the code</li>
</ul>

<h2>Why This Matters</h2>
<p>This approach makes you:</p>
<ul>
<li>More valuable to clients</li>
<li>More effective as a developer</li>
<li>More aligned with real-world needs</li>
</ul>

<h2>Conclusion</h2>
<p>If you want to grow fast in development, stop thinking like a coder and start thinking like a problem solver.</p>

<p>Because at the end of the day, <strong>code is just a tool — solving problems is the real skill.</strong></p>
`,
  cover_image: '/images/blog/problem-solver.jpg',
  read_time: 6,
  tags: '["Mindset", "Career", "Development"]',
  published: 1,
  created_at: '2026-04-13T10:00:00Z'
},
  {
    id: 2,
    title: 'Why Most Web Apps Fail (And How to Build Ones That Succeed)',
    slug: 'why-web-apps-fail',
    excerpt: 'Many web apps fail not because of bad code, but because of bad thinking. Let’s break down what actually matters.',
    content: `
<h2>The Real Problem</h2>
<p>Most developers focus too much on technology and not enough on user value.</p>

<h2>What Actually Matters</h2>
<ul>
<li>Solving a real problem</li>
<li>Simple and intuitive UX</li>
<li>Performance and reliability</li>
</ul>

<h2>My Approach</h2>
<p>When building platforms like Eventlink or management systems, I focus on usability and business logic first.</p>

<h2>Takeaway</h2>
<p>Good code is important, but useful products win.</p>
    `,
    cover_image: '/images/blog/web-apps.jpg',
    read_time: 5,
    tags: '["Web Development", "Product", "UX"]',
    published: 1,
    created_at: '2026-04-13T11:00:00Z'
  },
  {
    id: 3,
    title: 'Building Scalable Dashboards with Vue.js and Laravel',
    slug: 'scalable-dashboards-vue-laravel',
    excerpt: 'Dashboards are at the core of modern applications. Here’s how I build scalable and maintainable ones.',
    content: `
<h2>Why Dashboards Matter</h2>
<p>Dashboards centralize data and help businesses make decisions faster.</p>

<h2>My Stack</h2>
<p>I use Vue.js for dynamic interfaces and Laravel for structured backend logic.</p>

<h2>Best Practices</h2>
<ul>
<li>Modular components</li>
<li>Reusable APIs</li>
<li>Clear data flow</li>
</ul>

<h2>Example</h2>
<p>I applied this approach in Ilya Tour and Distrack systems.</p>
    `,
    cover_image: '/images/blog/dashboard.jpg',
    read_time: 6,
    tags: '["Vue.js", "Laravel", "Architecture"]',
    published: 1,
    created_at: '2026-04-13T12:00:00Z'
  },
{
  id: 4,
  title: 'The Business Side of Development: What Most Developers Ignore',
  slug: 'business-side-of-dev',
  excerpt: 'Understanding business is what separates average developers from high-impact ones. Here’s what most developers miss.',
  content: `
<h2>Introduction</h2>
<p>Most developers focus only on the technical side of building applications. They learn frameworks, tools, and best practices.</p>

<p>But there is another side that is often ignored: <strong>the business side.</strong></p>

<h2>Why Business Matters</h2>
<p>Every application exists for a reason. That reason is usually tied to business goals:</p>

<ul>
<li>Increase revenue</li>
<li>Save time</li>
<li>Improve efficiency</li>
<li>Solve operational problems</li>
</ul>

<p>If you don’t understand these goals, you are just writing code — not building value.</p>

<h2>My Experience</h2>
<p>Working on real-world projects and in business environments helped me understand something important:</p>

<p><strong>The best solutions are not the most complex ones — they are the most useful ones.</strong></p>

<h2>Example: Real Business Projects</h2>
<p>When building platforms like Distrack or management systems, I focused on:</p>

<ul>
<li>What the business actually needs</li>
<li>How users interact with the system</li>
<li>What can improve efficiency</li>
</ul>

<p>This approach leads to better results than just focusing on features.</p>

<h2>What Developers Should Learn</h2>
<p>To become more valuable, developers should understand:</p>

<ul>
<li>User behavior</li>
<li>Business processes</li>
<li>Performance and scalability</li>
<li>ROI (return on investment)</li>
</ul>

<h2>The Advantage</h2>
<p>When you combine technical skills with business understanding, you become:</p>

<ul>
<li>More than a developer</li>
<li>A problem solver</li>
<li>A valuable asset to any team or client</li>
</ul>

<h2>Conclusion</h2>
<p>Technology is important, but business is what gives it meaning.</p>

<p>If you want to stand out, don’t just learn how to code — learn why you are building.</p>
`,
  cover_image: '/images/blog/business-dev.jpg',
  read_time: 7,
  tags: '["Business", "Career", "Development"]',
  published: 1,
  created_at: '2026-04-13T13:00:00Z'
},
  {
    id: 5,
    title: 'From Idea to Product: How I Build Real-World Applications',
    slug: 'idea-to-product',
    excerpt: 'Turning an idea into a working product requires more than coding. Here’s my process.',
    content: `
<h2>Step 1: Understand the Problem</h2>
<p>Every project starts with a clear problem to solve.</p>

<h2>Step 2: Plan the System</h2>
<p>I design the architecture before writing code.</p>

<h2>Step 3: Build Iteratively</h2>
<p>I focus on delivering value quickly, then improving.</p>

<h2>Step 4: Optimize</h2>
<p>Performance and UX are key to success.</p>
    `,
    cover_image: '/images/blog/product.jpg',
    read_time: 5,
    tags: '["Process", "Development", "Startup"]',
    published: 1,
    created_at: '2026-04-13T14:00:00Z'
  },
  {
    id: 6,
    title: 'Why Tracking Systems Are Powerful for Businesses',
    slug: 'tracking-systems-business',
    excerpt: 'Tracking systems can transform how businesses operate. Here’s why they are so valuable.',
    content: `
<h2>Visibility is Power</h2>
<p>Businesses need to know what’s happening in real time.</p>

<h2>Use Cases</h2>
<ul>
<li>Field operations</li>
<li>Logistics</li>
<li>Performance tracking</li>
</ul>

<h2>Example</h2>
<p>Distrack was built to provide transparency and accountability in field distribution.</p>

<h2>Final Thought</h2>
<p>Systems that provide clarity always create value.</p>
    `,
    cover_image: '/images/blog/tracking.jpg',
    read_time: 4,
    tags: '["Systems", "Business", "Tech"]',
    published: 1,
    created_at: '2026-04-13T15:00:00Z'
  },
  {
  id: 7,
  title: 'User-Centric Thinking: Building for Humans, Not Just Code',
  slug: 'user-centric-thinking',
  excerpt: 'Great products are not defined by code quality alone, but by how users experience them. Discover how user-centric thinking transforms interfaces into meaningful, intuitive solutions.',
  content: `
<h2>What is User-Centric Thinking?</h2>
<p><strong>User-Centric Thinking</strong> is the ability to design and build solutions with the end user in mind. It goes beyond writing clean code — it’s about creating experiences that are intuitive, accessible, and genuinely useful.</p>
<p>Instead of asking <em>"How do I build this?"</em>, user-centric developers ask <strong>"How will people use this?"</strong></p>

<h2>Why It Matters</h2>
<p>In real-world applications, users don’t care about your tech stack. They care about:</p>
<ul>
  <li>How easy it is to navigate</li>
  <li>How fast they can achieve their goal</li>
  <li>How clear and understandable the interface is</li>
</ul>
<p>A technically perfect application can still fail if users find it confusing or frustrating.</p>

<h2>From Developer Thinking to User Thinking</h2>
<p>Developers often focus on logic, structure, and performance. While these are essential, they must be balanced with usability.</p>
<p>User-centric thinking shifts the mindset:</p>
<ul>
  <li><strong>From features → to value</strong></li>
  <li><strong>From complexity → to simplicity</strong></li>
  <li><strong>From implementation → to experience</strong></li>
</ul>

<h2>Practical Examples</h2>
<ul>
  <li>A form with 10 fields → simplified into 3 essential steps</li>
  <li>A dashboard full of data → reorganized into clear sections</li>
  <li>Technical error messages → replaced with human-friendly feedback</li>
</ul>

<h2>Key Principles</h2>
<ul>
  <li><strong>Clarity:</strong> Users should understand instantly what to do</li>
  <li><strong>Simplicity:</strong> Remove unnecessary steps and distractions</li>
  <li><strong>Consistency:</strong> Keep UI patterns predictable</li>
  <li><strong>Feedback:</strong> Always show what’s happening (loading, success, errors)</li>
</ul>

<h2>How I Apply It in My Projects</h2>
<p>In my work, I prioritize:</p>
<ul>
  <li>Clean and readable interfaces using Tailwind CSS</li>
  <li>Smooth interactions and animations that guide the user</li>
  <li>Logical flows that reduce friction and confusion</li>
</ul>
<p>Whether it's a dashboard, landing page, or full-stack app, the goal is always the same: <strong>make the experience effortless.</strong></p>

<h2>Final Thought</h2>
<p>At the end of the day, software is not built for developers — it’s built for people.</p>
<p><strong>User-centric thinking is what transforms code into real-world impact.</strong></p>
  `,
  cover_image: '/images/blog/user-centric-thinking.jpg',
  read_time: 4,
  tags: '["UX", "Soft Skills", "Frontend"]',
  published: 1,
  created_at: '2026-04-16T12:00:00Z'
},
{
  id: 8,
  title: 'RAG vs Prompting vs Function Calling vs Fine-Tuning: What Actually Matters in AI Systems',
  slug: 'rag-vs-prompt-vs-function-vs-finetuning',
  excerpt: 'Most developers focus on the model, but the real power of AI comes from how you use it. Here’s a clear breakdown of RAG, Prompting, Function Calling, and Fine-tuning.',
  content: `
<h2>Introduction</h2>
<p>At GITEX Africa, many AI-powered products were criticized for one reason:</p>

<p><strong>“You’re just using APIs. You didn’t build your own model.”</strong></p>

<p>This raises an important question:</p>

<p><strong>What actually makes an AI product powerful?</strong></p>

<p>The answer is not the model itself.</p>

<p>It’s how you design the system around it.</p>

<p>To understand that, you need to know the difference between four key concepts:</p>
<ul>
<li>RAG</li>
<li>Prompt Engineering</li>
<li>Function Calling</li>
<li>Fine-tuning</li>
</ul>

<hr />

<h2>1. RAG (Retrieval-Augmented Generation)</h2>
<p>RAG is what allows AI to use real data.</p>

<p>Instead of relying only on what the model learned during training, RAG connects it to your database or documents.</p>

<h3>How it works</h3>
<ul>
<li>User asks a question</li>
<li>The system retrieves relevant data</li>
<li>The AI generates an answer based on that data</li>
</ul>

<h3>Use case</h3>
<p>In a CRM:</p>
<ul>
<li>“Which invoices are unpaid?”</li>
<li>The system queries the database</li>
<li>The AI answers with real results</li>
</ul>

<p><strong>Key role:</strong> Data access (real-time, dynamic)</p>

<hr />

<h2>2. Prompt Engineering</h2>
<p>Prompting is how you guide the AI’s behavior.</p>

<p>You don’t change the model — you change the instructions.</p>

<h3>Example</h3>
<ul>
<li>Basic: “Explain invoices”</li>
<li>Better: “You are a financial assistant. Explain unpaid invoices clearly and highlight risks.”</li>
</ul>

<p><strong>Key role:</strong> Control responses (clarity, tone, structure)</p>

<hr />

<h2>3. Function Calling</h2>
<p>Function calling allows the AI to interact with your system.</p>

<p>Instead of just answering, it can trigger real actions.</p>

<h3>Example</h3>
<ul>
<li>User: “Create an invoice for Client X”</li>
<li>AI calls your backend API</li>
<li>The invoice is created</li>
</ul>

<p><strong>Key role:</strong> Execute actions (automation, workflows)</p>

<hr />

<h2>4. Fine-tuning</h2>
<p>Fine-tuning is used to customize the model’s behavior.</p>

<p>You train it on your own examples to make it more consistent.</p>

<h3>Use cases</h3>
<ul>
<li>Writing in a specific tone</li>
<li>Generating structured outputs</li>
<li>Handling repetitive tasks</li>
</ul>

<p><strong>Important:</strong></p>
<p>Fine-tuning does not give access to real-time data.</p>

<p><strong>Key role:</strong> Style and consistency</p>

<hr />

<h2>Comparison: Different Roles, Not Competitors</h2>

<table>
<tr>
<th>Approach</th>
<th>Main Role</th>
<th>Best For</th>
</tr>
<tr>
<td>RAG</td>
<td>Access data</td>
<td>Real-time answers</td>
</tr>
<tr>
<td>Prompting</td>
<td>Guide behavior</td>
<td>Better responses</td>
</tr>
<tr>
<td>Function Calling</td>
<td>Trigger actions</td>
<td>Automation</td>
</tr>
<tr>
<td>Fine-tuning</td>
<td>Customize model</td>
<td>Consistency & tone</td>
</tr>
</table>

<p><strong>Key insight:</strong></p>
<p>These are not alternatives.</p>
<p>They are complementary.</p>

<hr />

<h2>Why Building Your Own LLM Is Not the Priority</h2>
<p>Training your own model requires:</p>
<ul>
<li>Massive datasets</li>
<li>High infrastructure costs</li>
<li>Advanced expertise</li>
</ul>

<p>Most products don’t need that.</p>

<p>They need:</p>
<ul>
<li>Good data integration (RAG)</li>
<li>Clear instructions (Prompting)</li>
<li>System actions (Function Calling)</li>
<li>Consistency (Fine-tuning)</li>
</ul>

<hr />

<h2>Conclusion</h2>
<p>AI is not about choosing one technique.</p>

<p>It’s about combining them correctly.</p>

<p>The most effective systems today are built like this:</p>
<ul>
<li>RAG → to access real data</li>
<li>Prompting → to guide responses</li>
<li>Function Calling → to take action</li>
<li>Fine-tuning → to refine behavior</li>
</ul>

<p><strong>The model is just one part of the system.</strong></p>

<p><strong>The real value comes from how you use it.</strong></p>
`,
  cover_image: '/images/blog/ai-comparison.jpg',
  read_time: 8,
  tags: '["AI", "RAG", "LLM", "SaaS", "Engineering"]',
  published: 1,
  created_at: '2026-04-22T15:30:00Z'
},
{
  id: 9,
  title: 'Market Research: How to Validate an Idea Before You Build It',
  slug: 'market-research-validate-before-building',
  excerpt: 'Most businesses don’t fail because of execution, but because they build something nobody needs. Here’s a practical way to validate your idea before investing time and money.',
  content: `
<h2>Introduction</h2>
<p>Many products don’t fail because of poor execution.</p>

<p>They fail because there was no real demand in the first place.</p>

<p>Teams spend weeks or months building…</p>
<p>Only to realize later that users are not interested.</p>

<p>This is not a development problem.</p>

<p><strong>It’s a validation problem.</strong></p>

<p>Market research is what helps you avoid that.</p>

<p>It allows you to make decisions based on reality — not assumptions.</p>

<hr />

<h2>1. Define Your Target Audience</h2>
<p>You can’t build for “everyone”.</p>

<p>The more specific your audience is, the more relevant your solution becomes.</p>

<h3>Ask yourself</h3>
<ul>
<li>Who exactly will use this product?</li>
<li>What is their role or situation?</li>
<li>What are they trying to achieve?</li>
</ul>

<h3>Example</h3>
<p>Instead of:</p>
<ul>
<li>“People who manage projects”</li>
</ul>

<p>Be specific:</p>
<ul>
<li>“Freelancers managing multiple clients without a structured workflow”</li>
</ul>

<p><strong>Key role:</strong> Clarity (focus your product and messaging)</p>

<hr />

<h2>2. Identify Real Problems</h2>
<p>People don’t pay for ideas.</p>

<p>They pay to solve problems.</p>

<p>Your goal is to find problems that already exist — not to invent new ones.</p>

<h3>Where to look</h3>
<ul>
<li>Product reviews</li>
<li>Online communities (Reddit, forums)</li>
<li>Comments on competitor products</li>
</ul>

<h3>What to look for</h3>
<ul>
<li>Repeated complaints</li>
<li>Frustrations</li>
<li>Workarounds people are using</li>
</ul>

<p><strong>Key role:</strong> Relevance (build something people actually need)</p>

<hr />

<h2>3. Analyze Competitors</h2>
<p>If competitors exist, it’s a good sign.</p>

<p>It means there is already demand.</p>

<p>Your job is not to copy them.</p>

<p>It’s to understand:</p>

<ul>
<li>What they do well</li>
<li>What users like</li>
<li>What users complain about</li>
</ul>

<h3>Focus on gaps</h3>
<p>The best opportunities are often:</p>
<ul>
<li>Features that are missing</li>
<li>Poor user experience</li>
<li>Complex workflows that could be simplified</li>
</ul>

<p><strong>Key role:</strong> Positioning (stand out instead of competing directly)</p>

<hr />

<h2>4. Validate Before You Build</h2>
<p>You don’t need a full product to validate an idea.</p>

<p>You just need signals.</p>

<h3>Simple validation methods</h3>
<ul>
<li>Landing page explaining your idea</li>
<li>Collect emails or interest</li>
<li>Share the concept with your target audience</li>
<li>Ask for feedback before building</li>
</ul>

<p>The goal is to answer one question:</p>

<p><strong>“Do people actually want this?”</strong></p>

<p><strong>Key role:</strong> Risk reduction (avoid wasting time and money)</p>

<hr />

<h2>Common Mistakes</h2>
<ul>
<li>Building too fast without validation</li>
<li>Assuming you are the user</li>
<li>Ignoring negative feedback</li>
<li>Focusing on features instead of problems</li>
</ul>

<p>These mistakes are expensive.</p>

<p>Not because of code…</p>
<p>But because of wrong direction.</p>

<hr />

<h2>A Practical Approach</h2>
<p>In practice, market research doesn’t need to be complex.</p>

<p>A few hours of focused research can save weeks of development.</p>

<p>The goal is simple:</p>
<ul>
<li>Understand the user</li>
<li>Identify real problems</li>
<li>Validate before building</li>
</ul>

<p>This approach allows you to:</p>
<ul>
<li>Reduce risk</li>
<li>Make better decisions</li>
<li>Build products that people actually use</li>
</ul>

<hr />

<h2>Conclusion</h2>
<p>Market research is not about collecting data.</p>

<p>It’s about making better decisions.</p>

<p><strong>The biggest mistake is not building the wrong product.</strong></p>

<p><strong>It’s building without knowing if it should exist.</strong></p>

<p>Before your next project:</p>
<ul>
<li>Take time to understand the market</li>
<li>Validate your idea</li>
<li>Then build with confidence</li>
</ul>

<p><strong>Clarity before execution always wins.</strong></p>
`,
  cover_image: '/images/blog/market-research.jpg',
  read_time: 6,
  tags: '["Market Research", "Startup", "Product", "Business", "Strategy"]',
  published: 1,
  created_at: '2026-04-25T18:00:00Z'
},
{
  id: 10,
  title: 'Why Most Business Websites Don’t Bring Clients (And How to Fix It)',
  slug: 'why-websites-dont-bring-clients',
  excerpt: 'Many businesses invest in a website but see little to no results. The problem is not design or code — it’s strategy. Here’s how to turn your website into a client-generating tool.',
  content: `
<h2>Introduction</h2>
<p>Today, almost every business has a website.</p>

<p>But having a website doesn’t mean getting clients.</p>

<p>Many websites look good…</p>
<p>But fail to generate real results.</p>

<p>This is not a technical issue.</p>

<p><strong>It’s a strategy problem.</strong></p>

<p>A website should not just exist.</p>

<p>It should work for your business.</p>

<hr />

<h2>1. No Clear Goal</h2>
<p>Most websites try to do everything at once.</p>

<ul>
<li>Present the company</li>
<li>Show services</li>
<li>Look modern</li>
</ul>

<p>But they forget one simple question:</p>

<p><strong>What do you want the user to do?</strong></p>

<p>Without a clear goal, your website becomes just a digital brochure.</p>

<h3>Examples of clear goals</h3>
<ul>
<li>Generate leads</li>
<li>Book calls</li>
<li>Sell a product</li>
</ul>

<p><strong>Key role:</strong> Direction (guide user actions)</p>

<hr />

<h2>2. Too Much Focus on Design</h2>
<p>Design is important.</p>

<p>But design alone doesn’t bring results.</p>

<p>Many businesses focus on:</p>

<ul>
<li>Animations</li>
<li>Colors</li>
<li>Trendy layouts</li>
</ul>

<p>While ignoring usability and clarity.</p>

<p>A simple and clear interface will always outperform a complex one.</p>

<p><strong>Key role:</strong> Clarity (make actions obvious)</p>

<hr />

<h2>3. No User Journey</h2>
<p>When a visitor lands on your website… what happens next?</p>

<p>If the answer is not obvious, they leave.</p>

<h3>Common issues</h3>
<ul>
<li>No clear navigation</li>
<li>No call-to-action</li>
<li>Too much information at once</li>
</ul>

<p>Users should be guided step by step.</p>

<p>From understanding → to trust → to action.</p>

<p><strong>Key role:</strong> Flow (guide users toward conversion)</p>

<hr />

<h2>4. No Trust Elements</h2>
<p>People don’t trust easily online.</p>

<p>If your website doesn’t show proof, users hesitate.</p>

<h3>Missing trust signals</h3>
<ul>
<li>Testimonials</li>
<li>Case studies</li>
<li>Client results</li>
<li>Real examples of work</li>
</ul>

<p>Without trust, users don’t take action.</p>

<p><strong>Key role:</strong> Credibility (build confidence)</p>

<hr />

<h2>Common Mistakes</h2>
<ul>
<li>Focusing only on how the website looks</li>
<li>Ignoring user behavior</li>
<li>Not defining a clear objective</li>
<li>Building without thinking about conversion</li>
</ul>

<p>These mistakes are common.</p>

<p>And they directly impact results.</p>

<hr />

<h2>A Practical Approach</h2>
<p>A high-performing website is not complicated.</p>

<p>It follows a simple structure:</p>

<ul>
<li>Clear message</li>
<li>Strong value proposition</li>
<li>Guided user journey</li>
<li>Visible call-to-action</li>
<li>Trust elements</li>
</ul>

<p>This approach helps you:</p>

<ul>
<li>Convert more visitors</li>
<li>Reduce friction</li>
<li>Improve user experience</li>
</ul>

<hr />

<h2>Conclusion</h2>
<p>A website is not just a design project.</p>

<p>It’s a business tool.</p>

<p><strong>The goal is not to impress visitors.</strong></p>

<p><strong>The goal is to convert them.</strong></p>

<p>Before improving your website, ask yourself:</p>

<ul>
<li>Is the goal clear?</li>
<li>Is the user guided?</li>
<li>Is there trust?</li>
</ul>

<p>If not, that’s where to start.</p>

<p><strong>Because a good website doesn’t just look good.</strong></p>

<p><strong>It brings clients.</strong></p>
`,
  cover_image: '/images/blog/website-conversion.jpg',
  read_time: 5,
  tags: '["Web Development", "Conversion", "Business", "UX", "Strategy"]',
  published: 1,
  created_at: '2026-04-28T18:00:00Z'
},
{
  id: 11,
  title: 'From Idea to MVP with AI: Why Most Products Fail Before Development',
  slug: 'idea-to-mvp-with-ai',
  excerpt: 'Building with AI is faster than ever. But speed is not the problem — structure is. Here’s how to go from idea to MVP using AI to define product specs and roadmaps before coding.',
  content: `
<h2>Introduction</h2>
<p>Today, building a product is easier than ever.</p>

<p>With AI, you can generate code, design interfaces, and launch quickly.</p>

<p>But faster building doesn’t mean better products.</p>

<p>In fact, it creates a new problem.</p>

<p><strong>You can now build the wrong product faster than ever.</strong></p>

<p>This is not a technical issue.</p>

<p><strong>It’s a structure problem.</strong></p>

<p>Before writing code, you need clarity.</p>

<hr />

<h2>1. The Real Problem: No Structure</h2>
<p>Most ideas don’t fail because of bad development.</p>

<p>They fail because the idea was never clearly defined.</p>

<p>When an idea comes in, it is often:</p>

<ul>
<li>Too broad</li>
<li>Missing key details</li>
<li>Not validated</li>
<li>Overloaded with features</li>
</ul>

<p>Starting development at this stage leads to confusion.</p>

<p>You are not building a product.</p>

<p>You are building assumptions.</p>

<p><strong>Key role:</strong> Clarity (define what you are actually building)</p>

<hr />

<h2>2. Jumping Too Fast into Code</h2>
<p>AI makes it easy to start coding immediately.</p>

<p>But speed can be misleading.</p>

<p>Many developers:</p>

<ul>
<li>Generate code quickly</li>
<li>Build features immediately</li>
<li>Skip planning</li>
</ul>

<p>This leads to wasted time and rework.</p>

<p><strong>Because building fast without direction is still inefficient.</strong></p>

<p><strong>Key role:</strong> Direction (build with purpose, not speed)</p>

<hr />

<h2>3. No Clear MVP Definition</h2>
<p>One of the biggest mistakes is trying to build too much.</p>

<p>Without a clear MVP, projects become complex very quickly.</p>

<h3>Common issues</h3>
<ul>
<li>Too many features in the first version</li>
<li>No prioritization</li>
<li>No clear value delivered</li>
</ul>

<p>An MVP is not a smaller product.</p>

<p>It is a focused product.</p>

<p><strong>Key role:</strong> Focus (deliver essential value first)</p>

<hr />

<h2>4. No Roadmap Before Development</h2>
<p>Many projects start without a clear plan.</p>

<p>This creates uncertainty during development.</p>

<h3>Common problems</h3>
<ul>
<li>No clear phases</li>
<li>Features built in the wrong order</li>
<li>Dependencies discovered too late</li>
</ul>

<p>Without a roadmap, development becomes reactive.</p>

<p>Instead of executing, you are constantly adjusting.</p>

<p><strong>Key role:</strong> Planning (structure execution before coding)</p>

<hr />

<h2>A Practical Approach Using AI</h2>
<p>AI should not be used only for coding.</p>

<p>It should be used to structure decisions.</p>

<p>A simple and effective workflow:</p>

<ul>
<li>Idea → define the problem and users</li>
<li>Structure → build a product specification</li>
<li>MVP → select only essential features</li>
<li>Roadmap → plan development phases</li>
<li>Code → execute with clarity</li>
</ul>

<p>This approach helps you:</p>

<ul>
<li>Avoid building unnecessary features</li>
<li>Reduce development time</li>
<li>Improve product quality</li>
</ul>

<hr />

<h2>Common Mistakes</h2>
<ul>
<li>Starting with code instead of structure</li>
<li>Relying on AI only for development</li>
<li>Building too many features too early</li>
<li>Skipping product planning</li>
</ul>

<p>These mistakes are common.</p>

<p>And they directly impact the success of your product.</p>

<hr />

<h2>Conclusion</h2>
<p>AI changed how fast we can build.</p>

<p>But it didn’t change what makes a product successful.</p>

<p><strong>The goal is not to build faster.</strong></p>

<p><strong>The goal is to build the right thing.</strong></p>

<p>Before starting your next project, ask yourself:</p>

<ul>
<li>Is the idea clearly defined?</li>
<li>Is the MVP focused?</li>
<li>Is there a roadmap?</li>
</ul>

<p>If not, that’s where to start.</p>

<p><strong>Because the best products are not built faster.</strong></p>

<p><strong>They are built with clarity.</strong></p>
`,
  cover_image: '/images/blog/idea-to-mvp-ai.jpg',
  read_time: 5,
  tags: '["AI", "Product Development", "MVP", "Startups", "Strategy"]',
  published: 1,
  created_at: '2026-05-01T18:00:00Z'
},
{
  "id": 12,
  "title": "Automation Before AI: Why Most Businesses Should Fix Workflows First",
  "slug": "automation-before-ai-workflows",
  "excerpt": "Many businesses rush into AI without fixing their processes. The result is more complexity, not efficiency. Here’s how to automate your workflows first and where AI actually adds value.",
  "content": `
<h2>Introduction</h2>
<p>AI is everywhere.</p>

<p>Every business wants to integrate it.</p>

<p>Chatbots, automation, smart assistants…</p>

<p>But in most cases, AI is not the real solution.</p>

<p><strong>The real problem is simpler.</strong></p>

<p><strong>Too much manual work.</strong></p>

<p>Before adding intelligence, you need structure.</p>

<hr />

<h2>1. The Real Problem: Manual Work Everywhere</h2>
<p>In many businesses, daily operations are still manual.</p>

<p>Simple tasks are repeated every day:</p>

<ul>
<li>Copying data between tools</li>
<li>Sending the same replies to clients</li>
<li>Updating spreadsheets manually</li>
<li>Tracking leads by hand</li>
</ul>

<p>These tasks are not complex.</p>

<p>They are just repetitive.</p>

<p><strong>And repetition is what automation solves best.</strong></p>

<p><strong>Key role:</strong> Efficiency (remove unnecessary manual work)</p>

<hr />

<h2>2. Jumping Too Fast into AI</h2>
<p>Many businesses try to “add AI” directly into their operations.</p>

<p>But without structure, this creates new problems:</p>

<ul>
<li>Inconsistent outputs</li>
<li>Confusing workflows</li>
<li>More time spent fixing issues</li>
</ul>

<p>AI does not fix broken processes.</p>

<p><strong>It amplifies them.</strong></p>

<p><strong>Key role:</strong> Structure (fix the system before adding intelligence)</p>

<hr />

<h2>3. No Clear Workflow Design</h2>
<p>One of the biggest issues is the lack of defined workflows.</p>

<p>Most processes are informal and not documented.</p>

<h3>Common issues</h3>
<ul>
<li>No clear steps from input to output</li>
<li>Tasks handled differently each time</li>
<li>No ownership or responsibility</li>
</ul>

<p>Without a structured workflow, automation is impossible.</p>

<p><strong>You can’t automate what you haven’t defined.</strong></p>

<p><strong>Key role:</strong> Clarity (define how work should flow)</p>

<hr />

<h2>4. No System Connecting Tools</h2>
<p>Even when tools exist, they are often disconnected.</p>

<p>Teams use multiple platforms, but data does not flow between them.</p>

<h3>Common problems</h3>
<ul>
<li>Manual data transfer between tools</li>
<li>Duplicate information</li>
<li>Errors caused by human input</li>
</ul>

<p>This creates friction in daily operations.</p>

<p><strong>A system should connect tools, not separate them.</strong></p>

<p><strong>Key role:</strong> Integration (create a connected system)</p>

<hr />

<h2>A Practical Automation Approach</h2>
<p>Before using AI, focus on building a simple automation system.</p>

<p>A practical workflow looks like this:</p>

<ul>
<li>Input → user submits form or sends message</li>
<li>Processing → data is stored and organized</li>
<li>Action → automatic response is triggered</li>
<li>Sync → data is sent to CRM or database</li>
<li>Notification → team is informed instantly</li>
</ul>

<p>This approach helps you:</p>

<ul>
<li>Save time on repetitive tasks</li>
<li>Reduce human error</li>
<li>Improve response speed</li>
</ul>

<p>No AI required.</p>

<p>But a massive improvement in efficiency.</p>

<hr />

<h2>Where AI Actually Adds Value</h2>
<p>Once your workflows are structured and automated, AI becomes powerful.</p>

<p>Now you can use it to:</p>

<ul>
<li>Personalize client communication</li>
<li>Summarize conversations</li>
<li>Analyze customer data</li>
<li>Generate content</li>
</ul>

<p>AI should not replace your system.</p>

<p><strong>It should enhance it.</strong></p>

<p><strong>Key role:</strong> Intelligence (optimize an already working system)</p>

<hr />

<h2>Common Mistakes</h2>
<ul>
<li>Starting with AI instead of automation</li>
<li>Trying to automate undefined processes</li>
<li>Using too many disconnected tools</li>
<li>Ignoring workflow design</li>
</ul>

<p>These mistakes are common.</p>

<p>And they slow down growth instead of accelerating it.</p>

<hr />

<h2>Conclusion</h2>
<p>AI changed how businesses operate.</p>

<p>But it didn’t change the fundamentals.</p>

<p><strong>The goal is not to add AI.</strong></p>

<p><strong>The goal is to remove manual work.</strong></p>

<p>Before your next improvement, ask:</p>

<ul>
<li>What tasks are repetitive?</li>
<li>What processes are unclear?</li>
<li>What can be automated today?</li>
</ul>

<p>If you solve that first, AI becomes a multiplier.</p>

<p><strong>Because the best systems are not just intelligent.</strong></p>

<p><strong>They are structured.</strong></p>
`,
  "cover_image": "/images/blog/automation-before-ai.jpg",
  "read_time": 5,
  "tags": "[\"Automation\", \"AI\", \"Business Systems\", \"Workflows\", \"Productivity\"]",
  "published": 1,
  "created_at": "2026-05-05T17:00:00Z"
},
{
  "id": 13,
  "title": "The Cheapest AI Is the One You Control: Reduce Costs with Local Models and VPS",
  "slug": "own-your-ai-reduce-costs-local-vps",
  "excerpt": "AI costs can grow fast when relying only on APIs. Discover how running AI locally or on a VPS helps businesses reduce costs, improve control, and build scalable systems.",
  "content": `
<h2>Introduction</h2>
<p>AI is powerful.</p>

<p>But for many businesses, it becomes expensive very quickly.</p>

<p>Most teams start by using AI APIs.</p>

<p>It’s simple, fast, and effective.</p>

<p>But as usage grows, so do the costs.</p>

<p><strong>And that’s where the real challenge begins.</strong></p>

<p><strong>The question is no longer “How to use AI?”</strong></p>

<p><strong>It becomes “How to control it?”</strong></p>

<hr />

<h2>1. The Hidden Cost of AI APIs</h2>
<p>Most AI tools rely on a usage-based pricing model.</p>

<p>You are charged for:</p>

<ul>
<li>Input tokens (what you send)</li>
<li>Output tokens (what you receive)</li>
</ul>

<p>At small scale, this feels affordable.</p>

<p>But at scale, it becomes unpredictable.</p>

<h3>Common cost drivers</h3>
<ul>
<li>Long prompts with unnecessary data</li>
<li>Repeated requests</li>
<li>Large responses</li>
<li>High-frequency usage</li>
</ul>

<p><strong>More usage means more cost.</strong></p>

<p><strong>Key role:</strong> Awareness (understand how AI pricing works)</p>

<hr />

<h2>2. Why AI Costs Increase at Scale</h2>
<p>As businesses grow, AI becomes part of daily workflows.</p>

<p>But without optimization, inefficiencies appear:</p>

<ul>
<li>Sending too much context</li>
<li>No control over response size</li>
<li>Repeating the same requests manually</li>
<li>No structured workflows</li>
</ul>

<p>These small issues grow quickly.</p>

<p><strong>And they directly impact your budget.</strong></p>

<p><strong>Key role:</strong> Optimization (reduce unnecessary usage)</p>

<hr />

<h2>3. The Shift: From Using AI to Controlling AI</h2>
<p>Some teams are starting to think differently.</p>

<p>Instead of relying fully on external APIs, they explore new approaches.</p>

<p><strong>They move from usage to ownership.</strong></p>

<p>This includes:</p>

<ul>
<li>Running open-source language models</li>
<li>Deploying AI locally or on a VPS</li>
<li>Designing workflows adapted to their operations</li>
<li>Connecting AI directly to internal systems</li>
</ul>

<p>This shift changes everything.</p>

<p><strong>Key role:</strong> Control (own the system instead of renting it)</p>

<hr />

<h2>4. Running AI Locally or on a VPS</h2>
<p>Instead of paying per request, businesses can run their own AI infrastructure.</p>

<h3>What this looks like</h3>
<ul>
<li>Models hosted on local machines or private servers</li>
<li>AI connected to databases and internal tools</li>
<li>Custom workflows designed for specific use cases</li>
</ul>

<p>In this setup, costs are not tied to each request.</p>

<p>You manage your own environment.</p>

<p><strong>Key role:</strong> Infrastructure (build a controlled system)</p>

<hr />

<h2>5. Benefits of Owning Your AI</h2>

<h3>Predictable Costs</h3>
<p>You pay for infrastructure instead of per token.</p>

<p>This makes expenses stable and easier to manage.</p>

<h3>More Control</h3>
<p>You decide how AI is used and what it processes.</p>

<h3>Data Privacy</h3>
<p>Sensitive data stays inside your system.</p>

<p>No external API dependency.</p>

<h3>Custom Workflows</h3>
<p>Systems are tailored to your business logic.</p>

<p>Not generic solutions.</p>

<p><strong>Key role:</strong> Efficiency (better results with less cost)</p>

<hr />

<h2>6. When Should You Consider This Approach?</h2>
<p>Running your own AI is not always necessary.</p>

<p>It becomes relevant when:</p>

<ul>
<li>You have high AI usage</li>
<li>You process large volumes of data</li>
<li>Costs are increasing rapidly</li>
<li>You need more control or privacy</li>
</ul>

<p>For testing, APIs are enough.</p>

<p>For scaling, ownership becomes strategic.</p>

<p><strong>Key role:</strong> Strategy (choose the right timing)</p>

<hr />

<h2>7. Common Mistakes</h2>
<ul>
<li>Using AI without optimizing usage</li>
<li>Sending unnecessary data</li>
<li>Ignoring workflow design</li>
<li>Depending entirely on external APIs</li>
</ul>

<p>These mistakes increase cost without adding value.</p>

<hr />

<h2>Conclusion</h2>
<p>AI is not just about using tools.</p>

<p>It’s about building systems.</p>

<p><strong>The goal is not to use more AI.</strong></p>

<p><strong>The goal is to use it better.</strong></p>

<p>And eventually, to control it.</p>

<p>Because the real advantage is not access to AI.</p>

<p><strong>It’s how you integrate it into your workflow.</strong></p>

<p><strong>And how much of it you own.</strong></p>
`,
  "cover_image": "/images/blog/own-your-ai-blog.jpg",
  "read_time": 6,
  "tags": "[\"AI\", \"LLM\", \"Open Source\", \"VPS\", \"Cost Optimization\", \"Automation\", \"Tech Strategy\"]",
  "published": 1,
  "created_at": "2026-05-09T17:00:00Z"
}
],
  contacts: [],
  blog_reactions: [],
  blog_comments: [],
  admins: []
};

let tursoClient = null;

export default {
  init: async () => {
    if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
      tursoClient = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      console.log('Turso DB connected.');
      try {
        await tursoClient.execute(`
          CREATE TABLE IF NOT EXISTS blog_comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            author_name TEXT NOT NULL,
            content TEXT NOT NULL,
            ip_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        await tursoClient.execute(`
          CREATE TABLE IF NOT EXISTS blog_reactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            emoji TEXT NOT NULL,
            ip_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        await tursoClient.execute(`
          CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            ip_address TEXT,
            read_status INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        await tursoClient.execute(`
          CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        // Seed initial admin if empty
        const adminCount = await tursoClient.execute('SELECT COUNT(*) as count FROM admins');
        if (Number(adminCount.rows[0].count) === 0) {
          const hash = await bcrypt.hash('admin123', 10);
          await tursoClient.execute('INSERT INTO admins (username, password_hash) VALUES (?, ?)', ['admin', hash]);
          console.log('Default admin user seeded in Turso');
        }

      } catch (err) {
        console.error('Failed to create Turso tables:', err);
      }
    } else {
      console.log('Mock database initialized (No Turso credentials found).');
      if (db.admins.length === 0) {
        const hash = await bcrypt.hash('admin123', 10);
        db.admins.push({ id: 1, username: 'admin', password_hash: hash, created_at: new Date().toISOString() });
      }
    }
  },
  query: (table, conditions = null) => {
    let result = db[table] ? [...db[table]] : [];
    if (conditions) {
      result = result.filter(conditions);
    }
    return result;
  },
  insert: (table, data) => {
    if (!db[table]) db[table] = [];
    const newId = db[table].length > 0 ? Math.max(...db[table].map(i => i.id)) + 1 : 1;
    db[table].push({ id: newId, ...data, created_at: new Date().toISOString() });
    return newId;
  },
  delete: (table, id) => {
    if (!db[table]) return false;
    const index = db[table].findIndex(i => i.id === id);
    if (index !== -1) {
      db[table].splice(index, 1);
      return true;
    }
    return false;
  },
  queryTurso: async (sql, args = []) => {
    if (!tursoClient) return [];
    const result = await tursoClient.execute({ sql, args });
    return result.rows;
  },
  executeTurso: async (sql, args = []) => {
    if (!tursoClient) return null;
    return await tursoClient.execute({ sql, args });
  }
};

