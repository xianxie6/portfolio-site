import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";
import Link from "next/link";

import "./admin.css";
import { AdminNav } from "./AdminNav";

export const dynamic = "force-dynamic";

type Env = {
  DB: D1Database;
};

type Counts = {
  published_projects: number;
  draft_projects: number;
  published_articles: number;
  draft_articles: number;
};

async function getCounts() {
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as Env).DB;

  const counts = await db
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM projects WHERE status = 'published') AS published_projects,
        (SELECT COUNT(*) FROM projects WHERE status = 'draft') AS draft_projects,
        (SELECT COUNT(*) FROM articles WHERE status = 'published') AS published_articles,
        (SELECT COUNT(*) FROM articles WHERE status = 'draft') AS draft_articles`
    )
    .first<Counts>();

  return {
    publishedProjects: counts?.published_projects ?? 0,
    draftProjects: counts?.draft_projects ?? 0,
    publishedArticles: counts?.published_articles ?? 0,
    draftArticles: counts?.draft_articles ?? 0,
  };
}

export default async function AdminPage() {
  const counts = await getCounts();

  return (
    <main className="admin-shell">
      <AdminNav active="overview" />
      <section className="admin-main">
        <div className="admin-page-heading">
          <div>
            <h1>概览</h1>
            <p>查看内容状态和常用入口。</p>
          </div>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span>已发布项目</span>
            <strong>{counts.publishedProjects}</strong>
          </div>
          <div className="admin-stat-card">
            <span>草稿项目</span>
            <strong>{counts.draftProjects}</strong>
          </div>
          <div className="admin-stat-card">
            <span>已发布文章</span>
            <strong>{counts.publishedArticles}</strong>
          </div>
          <div className="admin-stat-card">
            <span>草稿文章</span>
            <strong>{counts.draftArticles}</strong>
          </div>
        </div>

        <div className="admin-panel">
          <h2>快捷操作</h2>
          <div className="admin-actions">
            <Link className="admin-primary-button" href="/admin/projects/new">
              新建项目
            </Link>
            <Link className="admin-secondary-button" href="/admin/articles/new">
              写文章
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
