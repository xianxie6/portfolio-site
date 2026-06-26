import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";

type Env = {
  DB: D1Database;
};

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  type: "featured" | "small";
  eyebrow: string | null;
  description: string | null;
  cover_image: string | null;
  cover_alt: string | null;
  tags: string;
  href: string | null;
  status: "draft" | "published" | "hidden";
  sort_order: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
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
        type,
        eyebrow,
        description,
        cover_image,
        cover_alt,
        tags,
        href,
        status,
        sort_order,
        created_at,
        updated_at,
        published_at
      FROM projects
      WHERE status = 'published'
      ORDER BY sort_order ASC, published_at DESC`
    )
    .all<ProjectRow>();

  return Response.json(
    {
      projects: results.map((project) => ({
        ...project,
        tags: parseTags(project.tags),
      })),
    },
    {
      headers: {
        "cache-control": "public, max-age=60",
      },
    }
  );
}
