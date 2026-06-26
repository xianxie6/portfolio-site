import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";

import { HomeClient, type HomeProject, type HomeSmallProduct } from "./HomeClient";

export const dynamic = "force-dynamic";

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
  sort_order: number;
};

const gradients = [
  "linear-gradient(135deg, #D9D5FF 0%, #EEEAFE 100%)",
  "linear-gradient(135deg, #E4E5FF 0%, #F0F1FF 100%)",
  "linear-gradient(135deg, #DDE9FF 0%, #EEF4FF 100%)",
];

function parseTags(tags: string) {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === "string") : [];
  } catch {
    return [];
  }
}

function safeImageSrc(src: string | null) {
  return src ? encodeURI(src) : null;
}

async function getHomeProjects() {
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
        sort_order
      FROM projects
      WHERE status = 'published' AND show_on_home = 1
      ORDER BY sort_order ASC, published_at DESC`
    )
    .all<ProjectRow>();

  const featured: HomeProject[] = [];
  const small: HomeSmallProduct[] = [];

  results.forEach((project) => {
    const tags = parseTags(project.tags);

    if (project.type === "featured") {
      featured.push({
        id: project.id,
        eyebrow: project.eyebrow,
        title: project.title,
        tags,
        description: project.description,
        gradient: gradients[featured.length % gradients.length],
        banner: safeImageSrc(project.cover_image),
        bannerAlt: project.cover_alt,
        href: project.href,
      });
      return;
    }

    small.push({
      id: project.id,
      title: project.title,
      eyebrow: project.eyebrow,
      tags,
      description: project.description,
      image: safeImageSrc(project.cover_image),
      imageAlt: project.cover_alt,
      href: project.href,
    });
  });

  return { featured, small };
}

export default async function Home() {
  const { featured, small } = await getHomeProjects();

  return <HomeClient projects={featured} smallProducts={small} />;
}
