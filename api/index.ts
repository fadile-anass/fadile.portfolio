import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import db from '../backend/src/config/db.js';

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});
app.use('/api/', limiter);

db.init();

app.get('/api/projects', (req, res) => {
  try {
    const { featured, category } = req.query;
    let projects = db.query('projects');

    if (featured === '1') {
      projects = projects.filter((p: any) => p.featured === 1);
    }
    if (category) {
      projects = projects.filter((p: any) => p.category === category);
    }

    projects.sort((a: any, b: any) => a.sort_order - b.sort_order);
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/skills', (req, res) => {
  try {
    const skills = db.query('skills').sort((a: any, b: any) => a.sort_order - b.sort_order);
    const grouped = skills.reduce((acc: any, skill: any) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
    res.json(grouped);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/experiences', (req, res) => {
  try {
    const experiences = db.query('experiences').sort((a: any, b: any) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
    res.json(experiences);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/services', (req, res) => {
  try {
    const services = db.query('services').sort((a: any, b: any) => a.sort_order - b.sort_order);
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/blog', (req, res) => {
  try {
    const posts = db.query('blog_posts').filter((p: any) => p.published === 1).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5, 
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
  } catch (error: any) {
    res.status(500).json({ success: false, errors: [error.message] });
  }
});

export default app;
