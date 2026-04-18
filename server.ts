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
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';

const authenticateAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

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

  app.get('/api/blog/:slug', (req, res) => {
    try {
      const { slug } = req.params;
      const allPosts = db.query('blog_posts').filter((p: any) => p.published === 1);
      const post = allPosts.find((p: any) => p.slug === slug);
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      // Build related posts: share at least one tag, exclude current, max 2
      const postTags: string[] = JSON.parse(post.tags || '[]');
      const relatedPosts = allPosts
        .filter((p: any) => p.slug !== slug)
        .map((p: any) => {
          const pTags: string[] = JSON.parse(p.tags || '[]');
          const shared = pTags.filter(t => postTags.includes(t)).length;
          return { ...p, _shared: shared };
        })
        .filter((p: any) => p._shared > 0)
        .sort((a: any, b: any) => b._shared - a._shared)
        .slice(0, 2)
        .map(({ _shared, content, ...rest }: any) => rest); // strip content & _shared for lightness

      res.json({ ...post, relatedPosts });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Reactions & Comments
  app.get('/api/blog/:slug/reactions', async (req, res) => {
    try {
      const { slug } = req.params;
      const post = db.query('blog_posts').find((p: any) => p.slug === slug);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      let grouped: any = {};
      if (process.env.TURSO_DATABASE_URL) {
        const reactions = await db.queryTurso('SELECT * FROM blog_reactions WHERE post_id = ?', [post.id]);
        grouped = reactions.reduce((acc: any, r: any) => {
          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
          return acc;
        }, {});
      } else {
        const reactions = db.query('blog_reactions').filter((r: any) => r.post_id === post.id);
        grouped = reactions.reduce((acc: any, r: any) => {
          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
          return acc;
        }, {});
      }
      res.json(grouped);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post('/api/blog/:slug/reactions', async (req, res) => {
    try {
      const { slug } = req.params;
      const { emoji } = req.body;
      const post = db.query('blog_posts').find((p: any) => p.slug === slug);
      if (!post) return res.status(404).json({ error: 'Post not found' });

      const validEmojis = ['🔥', '❤️', '👏', '💡', '🚀', '👀'];
      if (!validEmojis.includes(emoji)) return res.status(400).json({ error: 'Invalid emoji' });

      const ip = req.ip || '0.0.0.0';
      
      if (process.env.TURSO_DATABASE_URL) {
        const existing = await db.queryTurso('SELECT * FROM blog_reactions WHERE post_id = ? AND emoji = ? AND ip_address = ? LIMIT 1', [post.id, emoji, ip]);
        if (existing.length > 0) {
          await db.executeTurso('DELETE FROM blog_reactions WHERE id = ?', [existing[0].id]);
        } else {
          await db.executeTurso('INSERT INTO blog_reactions (post_id, emoji, ip_address) VALUES (?, ?, ?)', [post.id, emoji, ip]);
        }
        const reactions = await db.queryTurso('SELECT * FROM blog_reactions WHERE post_id = ?', [post.id]);
        const grouped = reactions.reduce((acc: any, r: any) => {
          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
          return acc;
        }, {});
        return res.json(grouped);
      } else {
        const existing = db.query('blog_reactions').find((r: any) => r.post_id === post.id && r.emoji === emoji && r.ip_address === ip);
        if (existing) {
          db.delete('blog_reactions', existing.id);
        } else {
          db.insert('blog_reactions', { post_id: post.id, emoji, ip_address: ip });
        }
        const reactions = db.query('blog_reactions').filter((r: any) => r.post_id === post.id);
        const grouped = reactions.reduce((acc: any, r: any) => {
          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
          return acc;
        }, {});
        return res.json(grouped);
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get('/api/blog/:slug/comments', async (req, res) => {
    try {
      const { slug } = req.params;
      const post = db.query('blog_posts').find((p: any) => p.slug === slug);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      
      if (process.env.TURSO_DATABASE_URL) {
        const comments = await db.queryTurso('SELECT * FROM blog_comments WHERE post_id = ? ORDER BY created_at DESC', [post.id]);
        return res.json(comments);
      } else {
        const comments = db.query('blog_comments')
          .filter((c: any) => c.post_id === post.id)
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return res.json(comments);
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post('/api/blog/:slug/comments', async (req, res) => {
    try {
      const { slug } = req.params;
      const { author_name, content } = req.body;
      const post = db.query('blog_posts').find((p: any) => p.slug === slug);
      if (!post) return res.status(404).json({ error: 'Post not found' });

      if (!author_name || author_name.trim().length < 2 || author_name.trim().length > 50) {
        return res.status(400).json({ error: 'Name must be between 2 and 50 characters' });
      }
      if (!content || content.trim().length < 5 || content.trim().length > 1000) {
        return res.status(400).json({ error: 'Comment must be between 5 and 1000 characters' });
      }

      const ip = req.ip || '0.0.0.0';
      if (process.env.TURSO_DATABASE_URL) {
        await db.executeTurso('INSERT INTO blog_comments (post_id, author_name, content, ip_address) VALUES (?, ?, ?, ?)', [post.id, author_name.trim(), content.trim(), ip]);
        const comments = await db.queryTurso('SELECT * FROM blog_comments WHERE post_id = ? ORDER BY created_at DESC', [post.id]);
        return res.json(comments);
      } else {
        db.insert('blog_comments', { post_id: post.id, author_name: author_name.trim(), content: content.trim(), ip_address: ip });
        const comments = db.query('blog_comments')
          .filter((c: any) => c.post_id === post.id)
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return res.json(comments);
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 requests per hour
    message: { success: false, errors: ['Too many requests, please try again later.'] }
  });

  app.post('/api/contact', contactLimiter, async (req, res) => {
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

      const ip = req.ip || '0.0.0.0';
      if (process.env.TURSO_DATABASE_URL) {
        await db.executeTurso('INSERT INTO contacts (name, email, subject, message, ip_address, read_status) VALUES (?, ?, ?, ?, ?, 0)', [name, email, subject || '', message, ip]);
      } else {
        db.insert('contacts', { name, email, subject: subject || '', message, ip_address: ip, read_status: 0 });
      }

      try {
        const [ownerEmail, userReply] = await Promise.all([
          resend.emails.send({
            from: 'Contact Form <contact@fadile.site>',
            to: 'anassfadile18@gmail.com',
            replyTo: email,
            subject: `New Contact: ${subject || 'No Subject'}`,
            html: `
              <h3>New Message from ${name}</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            `
          }),
resend.emails.send({
  from: 'Anass Fadile <contact@fadile.site>',
  to: email,
  subject: 'Thank you for your message!', 
  template: {
    id: process.env.RESEND_TEMPLATE_ID,  
    variables: {
      name: name   
    }
  }
})
        ]);
        console.log('Emails sent successfully! Response:', ownerEmail);
      } catch (e) {
        console.error('Error sending email with Resend:', e);
      }

      res.json({ success: true, message: 'Your message has been sent!' });
    } catch (error) {
      res.status(500).json({ success: false, errors: [error.message] });
    }
  });

  // Admin Endpoints
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      let user;
      if (process.env.TURSO_DATABASE_URL) {
        const rows = await db.queryTurso('SELECT * FROM admins WHERE username = ? LIMIT 1', [username]);
        if (rows.length > 0) user = rows[0];
      } else {
        user = db.query('admins').find((u: any) => u.username === username);
      }

      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const isValid = await bcrypt.compare(password, user.password_hash as string);
      if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
    try {
      let commentsCount = 0, reactionsCount = 0, contactsCount = 0;
      if (process.env.TURSO_DATABASE_URL) {
        commentsCount = Number((await db.queryTurso('SELECT COUNT(*) as c FROM blog_comments'))[0].c);
        reactionsCount = Number((await db.queryTurso('SELECT COUNT(*) as c FROM blog_reactions'))[0].c);
        contactsCount = Number((await db.queryTurso('SELECT COUNT(*) as c FROM contacts'))[0].c);
      } else {
        commentsCount = db.query('blog_comments').length;
        reactionsCount = db.query('blog_reactions').length;
        contactsCount = db.query('contacts').length;
      }
      res.json({ commentsCount, reactionsCount, contactsCount });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/comments', authenticateAdmin, async (req, res) => {
    try {
      if (process.env.TURSO_DATABASE_URL) {
        const comments = await db.queryTurso('SELECT * FROM blog_comments ORDER BY created_at DESC');
        res.json(comments);
      } else {
        const comments = db.query('blog_comments').sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        res.json(comments);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/comments/:id', authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      if (process.env.TURSO_DATABASE_URL) {
        await db.executeTurso('DELETE FROM blog_comments WHERE id = ?', [id]);
      } else {
        db.delete('blog_comments', Number(id));
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/contacts', authenticateAdmin, async (req, res) => {
    try {
      if (process.env.TURSO_DATABASE_URL) {
        const contacts = await db.queryTurso('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json(contacts);
      } else {
        const contacts = db.query('contacts').sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        res.json(contacts);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/contacts/:id', authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      if (process.env.TURSO_DATABASE_URL) {
        await db.executeTurso('DELETE FROM contacts WHERE id = ?', [id]);
      } else {
        db.delete('contacts', Number(id));
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
