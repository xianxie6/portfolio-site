import type { D1Database } from "@cloudflare/workers-types";

export type ProjectStatus = "draft" | "published" | "hidden";
export type ProjectType = "featured" | "small";

export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  type: ProjectType;
  eyebrow: string | null;
  description: string | null;
  cover_image: string | null;
  cover_alt: string | null;
  tags: string;
  href: string | null;
  metrics: string;
  show_on_home: number;
  status: ProjectStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type ProjectPayload = {
  title: string;
  slug: string;
  type: ProjectType;
  eyebrow: string | null;
  description: string;
  cover_image: string | null;
  cover_alt: string | null;
  tags: string[];
  href: string | null;
  metrics: Record<string, string>;
  show_on_home: boolean;
  status: ProjectStatus;
  sort_order: number;
};

const validTypes = new Set<ProjectType>(["featured", "small"]);
const validStatuses = new Set<ProjectStatus>(["draft", "published", "hidden"]);

export function parseJsonArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function parseJsonObject(value: string) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateProjectPayload(input: unknown): ProjectPayload {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid project payload.");
  }

  const data = input as Record<string, unknown>;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const slug = normalizeSlug(typeof data.slug === "string" ? data.slug : "");
  const type = data.type === "small" ? "small" : "featured";
  const eyebrow = typeof data.eyebrow === "string" && data.eyebrow.trim() ? data.eyebrow.trim() : null;
  const description = typeof data.description === "string" ? data.description.trim() : "";
  const coverImage =
    typeof data.cover_image === "string" && data.cover_image.trim() ? data.cover_image.trim() : null;
  const coverAlt = typeof data.cover_alt === "string" && data.cover_alt.trim() ? data.cover_alt.trim() : null;
  const href = typeof data.href === "string" && data.href.trim() ? data.href.trim() : null;
  const status = validStatuses.has(data.status as ProjectStatus) ? (data.status as ProjectStatus) : "draft";
  const sortOrder = Number.isFinite(Number(data.sort_order)) ? Number(data.sort_order) : 99;
  const showOnHome = Boolean(data.show_on_home);
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean)
    : [];
  const metrics =
    data.metrics && typeof data.metrics === "object" && !Array.isArray(data.metrics)
      ? Object.fromEntries(
          Object.entries(data.metrics as Record<string, unknown>)
            .map(([key, value]) => [key.trim(), String(value).trim()])
            .filter(([key, value]) => key && value)
        )
      : {};

  if (!title) throw new Error("Title is required.");
  if (!slug) throw new Error("Slug is required.");
  if (!validTypes.has(type)) throw new Error("Invalid project type.");
  if (!description) throw new Error("Description is required.");

  return {
    title,
    slug,
    type,
    eyebrow,
    description,
    cover_image: coverImage,
    cover_alt: coverAlt,
    tags,
    href,
    metrics,
    show_on_home: showOnHome,
    status,
    sort_order: sortOrder,
  };
}

export function toProjectView(row: ProjectRow) {
  return {
    ...row,
    tags: parseJsonArray(row.tags),
    metrics: parseJsonObject(row.metrics),
    show_on_home: Boolean(row.show_on_home),
  };
}

export async function getProjectById(db: D1Database, id: string) {
  return db
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
        metrics,
        show_on_home,
        status,
        sort_order,
        created_at,
        updated_at,
        published_at
      FROM projects
      WHERE id = ?
      LIMIT 1`
    )
    .bind(id)
    .first<ProjectRow>();
}
