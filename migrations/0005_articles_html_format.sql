-- Recreate articles table to support 'html' content_format (Tiptap)
-- SQLite does not support ALTER COLUMN / modifying CHECK constraints
PRAGMA foreign_keys=OFF;

CREATE TABLE articles_v2 (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT,
  content_format TEXT NOT NULL DEFAULT 'html',
  cover_image TEXT,
  tags TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'hidden')),
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO articles_v2
  SELECT id, title, slug, summary, content, 'html', cover_image, tags, status, published_at, created_at, updated_at
  FROM articles;

DROP TABLE articles;
ALTER TABLE articles_v2 RENAME TO articles;

CREATE INDEX IF NOT EXISTS idx_articles_status_published_at
  ON articles (status, published_at);

PRAGMA foreign_keys=ON;
