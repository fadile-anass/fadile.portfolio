import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './backend/src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  let PORT = Number(process.env.PORT) || 3000;

  // Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for dev/vite
  }));
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  app.use('/api/', limiter);

  // Initialize DB
  db.init();

  // API Routes
  app.get('/api/projects', (req, res) => {
    try {
      const { featured, category } = req.query;
      let projects = db.query('projects');

      if (featured === '1') {
        projects = projects.filter(p => p.featured === 1);
      }
      if (category) {
        projects = projects.filter(p => p.category === category);
      }

      projects.sort((a, b) => a.sort_order - b.sort_order);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/skills', (req, res) => {
    try {
      const skills = db.query('skills').sort((a, b) => a.sort_order - b.sort_order);
      // Group by category
      const grouped = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
      }, {});
      res.json(grouped);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/experiences', (req, res) => {
    try {
      const experiences = db.query('experiences').sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/services', (req, res) => {
    try {
      const services = db.query('services').sort((a, b) => a.sort_order - b.sort_order);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/blog', (req, res) => {
    try {
      const posts = db.query('blog_posts').filter(p => p.published === 1).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 requests per hour
    message: { success: false, errors: ['Too many requests, please try again later.'] }
  });

  app.post('/api/contact', contactLimiter, (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      const errors = [];

      if (!name || name.length < 2 || name.length > 100) errors.push('Name must be between 2 and 100 characters');
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required');
      if (subject && subject.length > 200) errors.push('Subject must be less than 200 characters');
      if (!message || message.length < 10 || message.length > 2000) errors.push('Message must be between 10 and 2000 characters');

      if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
      }

      const ip = req.ip;
      db.insert('contacts', { name, email, subject: subject || '', message, ip_address: ip, read_status: 0 });

      res.json({ success: true, message: 'Your message has been sent!' });
    } catch (error) {
      res.status(500).json({ success: false, errors: [error.message] });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
      PORT++;
      server.listen(PORT, "0.0.0.0");
    }
  });
}

startServer();
