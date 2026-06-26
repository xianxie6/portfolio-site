import { getCloudflareContext } from "@opennextjs/cloudflare";

import { requireAdminSession, type AdminEnv } from "@/lib/admin-auth";
import { validateProjectPayload } from "@/lib/projects";

export async function POST(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const { DB } = env as AdminEnv;
  const unauthorized = await requireAdminSession(request, DB);
  if (unauthorized) return unauthorized;

  const payload = validateProjectPayload(await request.json().catch(() => null));
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const publishedAt = payload.status === "published" ? now : null;

  await DB.prepare(
    `INSERT INTO projects (
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
      metrics,
      show_on_home,
      status,
      sort_order,
      created_at,
      updated_at,
      published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
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
      now,
      publishedAt
    )
    .run();

  return Response.json({ id });
}
