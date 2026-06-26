import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";

type Env = { DB: D1Database };

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  content_format: string;
  cover_image: string | null;
  tags: string;
  status: "draft" | "published" | "hidden";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === "string") : [];
  } catch {
    return [];
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as Env).DB;

  const article = await db
    .prepare(
      `SELECT id, title, slug, summary, content, content_format, cover_image, tags, status, published_at, created_at, updated_at
       FROM articles
       WHERE slug = ? AND status = 'published'
       LIMIT 1`
    )
    .bind(slug)
    .first<ArticleRow>();

  if (!article) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(
    { article: { ...article, tags: parseTags(article.tags) } },
    { headers: { "cache-control": "public, max-age=60" } }
  );
}
