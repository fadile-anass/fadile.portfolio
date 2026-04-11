-- Seed Data

INSERT INTO projects (title, slug, description, tech_stack, category, featured, sort_order) VALUES 
('Travel Agency Dashboard', 'travel-agency-dashboard', 'A comprehensive dashboard for managing travel agency operations.', '["Vue.js", "Tailwind CSS"]', 'frontend', 1, 1),
('Events Management App', 'events-management-app', 'Full stack application for creating and managing events.', '["Laravel", "Vue.js", "MySQL"]', 'fullstack', 1, 2),
('Health App', 'health-app', 'Healthcare management system for patients and doctors.', '["Laravel", "Vue.js", "MySQL"]', 'fullstack', 0, 3),
('Integrated Management System', 'red-crescent-ims', 'Management system built for the Red Crescent.', '["MongoDB", "Express", "React", "Node.js"]', 'fullstack', 1, 4),
('VitraPro Landing Page', 'vitrapro-landing', 'High-conversion landing page for VitraPro.', '["Vue.js", "GSAP", "Tailwind CSS"]', 'frontend', 0, 5);

INSERT INTO skills (name, category, level, sort_order) VALUES
('HTML', 'frontend', 90, 1),
('CSS', 'frontend', 88, 2),
('JavaScript', 'frontend', 85, 3),
('Tailwind', 'frontend', 85, 4),
('Bootstrap', 'frontend', 80, 5),
('React', 'frontend', 75, 6),
('Vue.js', 'frontend', 90, 7),
('Laravel', 'backend', 85, 8),
('Express.js', 'backend', 82, 9),
('Node.js', 'backend', 82, 10),
('MySQL', 'database', 80, 11),
('MongoDB', 'database', 75, 12),
('Git/GitHub', 'tools', 88, 13),
('UML', 'tools', 70, 14),
('PHP', 'backend', 75, 15),
('REST API', 'backend', 85, 16),
('Docker', 'tools', 50, 17),
('Linux', 'tools', 60, 18);

INSERT INTO experiences (company, role, type, start_date, end_date, description, location) VALUES
('Hermes Express', 'Business Manager', 'full-time', '2025-12-01', '2026-03-01', 'Managed business operations and client relationships.', 'Casablanca, Morocco'),
('IS-Tech', 'Full Stack Dev', 'full-time', '2024-10-01', '2025-11-01', 'Developed full stack web applications using Vue.js and Node.js.', 'Casablanca, Morocco'),
('Croissant Rouge Marocain', 'Intern', 'internship', '2024-04-01', '2024-07-01', 'Developed an Integrated Management System.', 'Casablanca, Morocco'),
('Installation Electrique', 'Front-End Intern', 'internship', '2023-11-01', '2024-01-01', 'Built responsive front-end interfaces.', 'Casablanca, Morocco'),
('Ancona Media', 'Web Dev Intern', 'internship', '2023-05-01', '2023-06-01', 'Assisted in web development projects.', 'Casablanca, Morocco');

INSERT INTO services (title, description, icon_name, sort_order) VALUES
('Full Stack Web Development', 'End-to-end web application development using modern frameworks.', 'code', 1),
('UI/UX Integration', 'Pixel-perfect implementation of designs with smooth animations.', 'layers', 2),
('API & Backend Engineering', 'Robust, scalable, and secure RESTful APIs and database design.', 'server', 3),
('Business Development & CRM', 'Integrating technical solutions with business growth strategies.', 'chart', 4);

INSERT INTO blog_posts (title, slug, excerpt, content, tags, published) VALUES
('Getting Started with Vue 3 and GSAP', 'vue3-gsap-intro', 'Learn how to create stunning animations in Vue 3 using GSAP.', 'Content coming soon...', '["Vue.js", "GSAP", "Animation"]', 0),
('Building a REST API with Express and SQLite', 'express-sqlite-api', 'A guide to setting up a lightweight backend.', 'Content coming soon...', '["Node.js", "Express", "SQLite"]', 0),
('The Power of Three.js in Web Design', 'threejs-web-design', 'Why 3D is the future of web experiences.', 'Content coming soon...', '["Three.js", "Web Design", "3D"]', 0);
