import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";
import Link from "next/link";

import "../admin.css";
import { AdminNav } from "../AdminNav";
import { ArticleActions, type ArticleActionData } from "./ArticleActions";

export const dynamic = "force-dynamic";

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "hidden";
  published_at: string | null;
  created_at: string;
};

async function getArticles(): Promise<ArticleRow[]> {
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as { DB: D1Database }).DB;
  const { results = [] } = await db
    .prepare(
      `SELECT id, title, slug, status, published_at, created_at
       FROM articles ORDER BY created_at DESC`
    )
    .all<ArticleRow>();
  return results;
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return iso.slice(0, 10);
}

export default async function AdminArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="admin-shell">
      <AdminNav active="articles" />
      <section className="admin-main">
        <div className="admin-page-heading">
          <div>
            <h1>文章管理</h1>
            <p>共 {articles.length} 篇文章</p>
          </div>
          <Link className="admin-primary-button" href="/admin/articles/new">
            新建文章
          </Link>
        </div>

        <div className="admin-table-card">
          <table className="admin-article-table">
            <thead>
              <tr>
                <th>标题</th>
                <th>状态</th>
                <th>发布时间</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "var(--admin-muted)", padding: "40px 0" }}>
                    暂无文章，点击右上角新建
                  </td>
                </tr>
              ) : (
                articles.map((article) => {
                  const data: ArticleActionData = {
                    id: article.id,
                    title: article.title,
                    status: article.status,
                  };
                  return (
                    <tr key={article.id}>
                      <td>
                        <div className="admin-project-title-cell">
                          <strong>{article.title}</strong>
                          <span>{article.slug}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-status-badge ${article.status}`}>
                          {article.status === "draft" ? "草稿" : article.status === "published" ? "已发布" : "隐藏"}
                        </span>
                      </td>
                      <td>{fmtDate(article.published_at)}</td>
                      <td>{fmtDate(article.created_at)}</td>
                      <td>
                        <ArticleActions article={data} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
