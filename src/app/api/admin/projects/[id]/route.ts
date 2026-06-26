import { getCloudflareContext } from "@opennextjs/cloudflare";

import { requireAdminSession, type AdminEnv } from "@/lib/admin-auth";
import { getProjectById, validateProjectPayload } from "@/lib/projects";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { env } = await getCloudflareContext({ async: true });
  const { DB } = env as AdminEnv;
  const unauthorized = await requireAdminSession(request, DB);
  if (unauthorized) return unauthorized;

  const existing = await getProjectById(DB, id);
  if (!existing) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }

  const payload = validateProjectPayload(await request.json().catch(() => null));
  const now = new Date().toISOString();
  const publishedAt =
    payload.status === "published" ? existing.published_at ?? now : existing.published_at;

  await DB.prepare(
    `UPDATE projects
    SET
      title = ?,
      slug = ?,
      type = ?,
      eyebrow = ?,
      description = ?,
      cover_image = ?,
      cover_alt = ?,
      tags = ?,
      href = ?,
      metrics = ?,
      show_on_home = ?,
      status = ?,
      sort_order = ?,
      updated_at = ?,
      published_at = ?
    WHERE id = ?`
  )
    .bind(
      payload.title,
      payload.slug,
      payload.type,
      payload.eyebrow,
      payload.description,
      payload.cover_image,
      payload.cover_alt,
      JSON.stringify(payload.tags),
      payload.href,
      JSON.stringify(payload.metrics),
      payload.show_on_home ? 1 : 0,
      payload.status,
      payload.sort_order,
      now,
      publishedAt,
      id
    )
    .run();

  return Response.json({ ok: true });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { env } = await getCloudflareContext({ async: true });
  const { DB } = env as AdminEnv;
  const unauthorized = await requireAdminSession(request, DB);
  if (unauthorized) return unauthorized;

  await DB.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();

  return Response.json({ ok: true });
}
