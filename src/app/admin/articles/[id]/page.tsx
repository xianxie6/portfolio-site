import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";
import { notFound } from "next/navigation";

import "../../admin.css";
import { AdminNav } from "../../AdminNav";
import { ArticleForm, type ArticleFormData } from "../ArticleForm";

export const dynamic = "force-dynamic";

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  tags: string;
  status: "draft" | "published" | "hidden";
  published_at: string | null;
};

type RouteContext = { params: Promise<{ id: string }> };

async function getArticle(id: string): Promise<ArticleRow | null> {
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as { DB: D1Database }).DB;
  return db
    .prepare(`SELECT id, title, slug, summary, content, tags, status, published_at FROM articles WHERE id = ?`)
    .bind(id)
    .first<ArticleRow>();
}

export default async function AdminArticleEditPage({ params }: RouteContext) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  const initial: ArticleFormData = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    summary: article.summary ?? "",
    content: article.content ?? "",
    tags: JSON.parse(article.tags || "[]") as string[],
    status: article.status === "published" ? "published" : "draft",
  };

  return (
    <main className="admin-shell">
      <AdminNav active="articles" />
      <section className="admin-main">
        <div className="admin-page-heading">
          <div>
            <h1>编辑文章</h1>
            <p>{article.title}</p>
          </div>
        </div>
        <div className="admin-panel">
          <ArticleForm initial={initial} />
        </div>
      </section>
    </main>
  );
}
