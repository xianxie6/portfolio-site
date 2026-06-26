import { getCloudflareContext } from "@opennextjs/cloudflare";

import { requireAdminSession, type AdminEnv } from "@/lib/admin-auth";

type RouteContext = { params: Promise<{ id: string }> };

type ArticleStatus = "draft" | "published";

type ArticlePayload = {
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  tags: string[];
  status: ArticleStatus;
};

function validatePayload(raw: unknown): ArticlePayload {
  if (!raw || typeof raw !== "object") throw new Error("Invalid payload");
  const d = raw as Record<string, unknown>;

  const title = String(d.title ?? "").trim();
  if (!title) throw new Error("Title is required");

  const slug = String(d.slug ?? "").trim();
  if (!slug) throw new Error("Slug is required");

  const summary = d.summary ? String(d.summary).trim() || null : null;
  const content = d.content ? String(d.content).trim() || null : null;

  const tags = Array.isArray(d.tags)
    ? d.tags.map(String).filter(Boolean)
    : typeof d.tags === "string"
      ? d.tags.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  const status: ArticleStatus = d.status === "published" ? "published" : "draft";

  return { title, slug, summary, content, tags, status };
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { env } = await getCloudflareContext({ async: true });
  const { DB } = env as AdminEnv;
  const unauthorized = await requireAdminSession(request, DB);
  if (unauthorized) return unauthorized;

  const existing = await DB.prepare("SELECT status, published_at FROM articles WHERE id = ?")
    .bind(id)
    .first<{ status: string; published_at: string | null }>();
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  let payload: ArticlePayload;
  try {
    payload = validatePayload(await request.json().catch(() => null));
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }

  const now = new Date().toISOString();
  const publishedAt =
    payload.status === "published" ? (existing.published_at ?? now) : existing.published_at;

  try {
    await DB.prepare(
      `UPDATE articles
       SET title = ?, slug = ?, summary = ?, content = ?, content_format = 'html',
           tags = ?, status = ?, published_at = ?, updated_at = ?
       WHERE id = ?`
    )
      .bind(
        payload.title,
        payload.slug,
        payload.summary,
        payload.content,
        JSON.stringify(payload.tags),
        payload.status,
        publishedAt,
        now,
        id
      )
      .run();
  } catch {
    return Response.json({ error: "Slug may already be taken." }, { status: 409 });
  }

  return Response.json({ ok: true });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { env } = await getCloudflareContext({ async: true });
  const { DB } = env as AdminEnv;
  const unauthorized = await requireAdminSession(request, DB);
  if (unauthorized) return unauthorized;

  await DB.prepare("DELETE FROM articles WHERE id = ?").bind(id).run();
  return Response.json({ ok: true });
}
