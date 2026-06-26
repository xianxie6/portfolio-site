import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";

type Env = {
  DB: D1Database;
};

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  content_format: "markdown";
  cover_image: string | null;
  tags: string;
  status: "draft" | "published" | "hidden";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function parseTags(tags: string) {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === "string") : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as Env).DB;

  const { results = [] } = await db
    .prepare(
      `SELECT
        id,
        title,
        slug,
        summary,
        content,
        content_format,
        cover_image,
        tags,
        status,
        published_at,
        created_at,
        updated_at
      FROM articles
      WHERE status = 'published'
      ORDER BY published_at DESC, created_at DESC`
    )
    .all<ArticleRow>();

  return Response.json(
    {
      articles: results.map((article) => ({
        ...article,
        tags: parseTags(article.tags),
      })),
    },
    {
      headers: {
        "cache-control": "public, max-age=60",
      },
    }
  );
}
