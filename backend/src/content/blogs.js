import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLOGS_ROOT = path.resolve(__dirname, '../../../public/blogs');

function safeReadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.warn(`Skipping invalid blog file: ${filePath}`, error);
    return null;
  }
}

function normalizePost(post, folderName) {
  if (!post || typeof post !== 'object') return null;

  return {
    ...post,
    slug: post.slug || folderName,
    cover_image: typeof post.cover_image === 'string' && post.cover_image.length > 0
      ? post.cover_image
      : null,
    published: Number(post.published ?? 0)
  };
}

export function loadBlogPosts() {
  if (!fs.existsSync(BLOGS_ROOT)) return [];

  const entries = fs.readdirSync(BLOGS_ROOT, { withFileTypes: true });
  const posts = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const postPath = path.join(BLOGS_ROOT, entry.name, 'post.json');
      if (!fs.existsSync(postPath)) return null;
      return normalizePost(safeReadJson(postPath), entry.name);
    })
    .filter(Boolean);

  return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function loadPublishedBlogPosts() {
  return loadBlogPosts().filter((post) => post.published === 1);
}

export function loadBlogPostBySlug(slug) {
  return loadBlogPosts().find((post) => post.slug === slug) || null;
}

export function loadPublishedBlogPostBySlug(slug) {
  return loadPublishedBlogPosts().find((post) => post.slug === slug) || null;
}
