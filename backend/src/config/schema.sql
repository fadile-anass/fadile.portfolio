-- SQLite Schema (Adapted from MySQL)

CREATE TABLE IF NOT EXISTS projects (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 title TEXT NOT NULL,
 slug TEXT UNIQUE NOT NULL,
 description TEXT NOT NULL,
 tech_stack TEXT NOT NULL, -- JSON Array of tech names
 image_url TEXT,
 demo_url TEXT,
 github_url TEXT,
 category TEXT, -- 'fullstack','frontend','backend'
 featured INTEGER DEFAULT 0,
 sort_order INTEGER DEFAULT 0,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 category TEXT NOT NULL, -- 'frontend','backend','database','tools','other'
 level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 100),
 icon_name TEXT,
 sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS experiences (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 company TEXT NOT NULL,
 role TEXT NOT NULL,
 type TEXT NOT NULL, -- 'full-time','internship','freelance','contract'
 start_date TEXT NOT NULL,
 end_date TEXT, -- NULL means current
 description TEXT,
 tech_stack TEXT, -- JSON Array of tech names
 location TEXT,
 sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 title TEXT NOT NULL,
 description TEXT NOT NULL,
 icon_name TEXT,
 sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS blog_posts (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 title TEXT NOT NULL,
 slug TEXT UNIQUE NOT NULL,
 excerpt TEXT,
 content TEXT,
 tags TEXT, -- JSON Array of tag strings
 cover_image TEXT,
 read_time INTEGER, -- Minutes
 published INTEGER DEFAULT 0,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 subject TEXT,
 message TEXT NOT NULL,
 ip_address TEXT,
 read_status INTEGER DEFAULT 0,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
