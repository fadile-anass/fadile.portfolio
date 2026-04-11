const db = {
  projects: [
    { id: 1, title: 'Ilya Tour', slug: 'travel-agency-dashboard', description: 'A comprehensive dashboard for managing travel agency operations.', tech_stack: '["Vue.js", "Tailwind CSS"]', category: 'frontend', featured: 1, sort_order: 1, image_url: '/images/projects/ilyatour.png', demo_url: '#', github_url: '#' },
    { id: 2, title: 'Eventlink', slug: 'events-management-app', description: 'Full stack application for creating and managing events.', tech_stack: '["Laravel", "Vue.js", "MySQL"]', category: 'fullstack', featured: 1, sort_order: 2, image_url: '/images/projects/eventlink.png', demo_url: '#', github_url: '#' },
    { id: 3, title: 'Amasante', slug: 'health-app', description: 'Healthcare management system for patients and doctors.', tech_stack: '["Laravel", "Vue.js", "MySQL"]', category: 'fullstack', featured: 0, sort_order: 3, image_url: '/images/projects/amasante.png', demo_url: '#', github_url: '#' },
    { id: 4, title: 'Integrated Management System', slug: 'red-crescent-ims', description: 'Management system built for the Red Crescent.', tech_stack: '["MongoDB", "Express", "React", "Node.js"]', category: 'fullstack', featured: 1, sort_order: 4, image_url: '/images/projects/red-crescent-ims.png', demo_url: '#', github_url: '#' },
    { id: 5, title: 'Distrack — Suivi Distribution', slug: 'distrack-field-tracking', description: 'Plateforme professionnelle (FR) de suivi, contrôle et preuve d’exécution des opérations de distribution terrain : transparence, traçabilité et performance sur le terrain.', tech_stack: '["Laravel", "Vue.js", "MySQL"]', category: 'fullstack', featured: 0, sort_order: 5, image_url: '/images/projects/distrack.png', demo_url: '#', github_url: '#' },
    { id: 6, title: 'Electrical Installation Morocco', slug: 'security-camera-garage-door-morocco', description: 'Local provider offering professional IP and wireless surveillance camera installation, garage door sales & installation, and accessories; serves Casablanca, Marrakech, Rabat and nearby cities, with an online shop and free quotes.', tech_stack: '["HTML", "JAVASCRIPT", "TAILWIND CSS"]', category: 'frontend', featured: 0, sort_order: 6, image_url: '/images/projects/installation_electric.png', demo_url: 'https://www.installation-electrique.site/', github_url: 'https://github.com/fadile-anass/is-electrique-langing-page' },
    // { id: 7, title: 'VitraPro Landing Page', slug: 'vitrapro-landing', description: 'High-conversion landing page for VitraPro.', tech_stack: '["Vue.js", "GSAP", "Tailwind CSS"]', category: 'frontend', featured: 0, sort_order: 5, image_url: '/images/projects/vitrapro-landing.png', demo_url: '#', github_url: '#' }
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
    { id: 1, title: 'Getting Started with Vue 3 and GSAP', slug: 'vue3-gsap-intro', excerpt: 'Learn how to create stunning animations in Vue 3 using GSAP.', content: 'Content coming soon...', tags: '["Vue.js", "GSAP", "Animation"]', published: 0, created_at: '2026-04-01T12:00:00Z' },
    { id: 2, title: 'Building a REST API with Express and SQLite', slug: 'express-sqlite-api', excerpt: 'A guide to setting up a lightweight backend.', content: 'Content coming soon...', tags: '["Node.js", "Express", "SQLite"]', published: 0, created_at: '2026-04-02T12:00:00Z' },
    { id: 3, title: 'The Power of Three.js in Web Design', slug: 'threejs-web-design', excerpt: 'Why 3D is the future of web experiences.', content: 'Content coming soon...', tags: '["Three.js", "Web Design", "3D"]', published: 0, created_at: '2026-04-03T12:00:00Z' }
  ],
  contacts: []
};

export default {
  init: () => {
    console.log('Mock database initialized.');
  },
  query: (table, conditions = null) => {
    let result = [...db[table]];
    if (conditions) {
      result = result.filter(conditions);
    }
    return result;
  },
  insert: (table, data) => {
    const newId = db[table].length > 0 ? Math.max(...db[table].map(i => i.id)) + 1 : 1;
    db[table].push({ id: newId, ...data, created_at: new Date().toISOString() });
    return newId;
  }
};
