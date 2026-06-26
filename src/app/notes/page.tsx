import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notes · AI 学习心得",
  description: "记录学习 AI 过程中的想法、踩坑与收获。",
};

type Env = { DB: D1Database };

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  tags: string;
  published_at: string | null;
};

function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === "string") : [];
  } catch {
    return [];
  }
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function getPublishedArticles() {
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as Env).DB;
  const { results = [] } = await db
    .prepare(
      `SELECT id, title, slug, summary, tags, published_at
       FROM articles
       WHERE status = 'published'
       ORDER BY published_at DESC, created_at DESC`
    )
    .all<ArticleRow>();
  return results.map((a) => ({ ...a, parsedTags: parseTags(a.tags) }));
}

export default async function NotesPage() {
  const articles = await getPublishedArticles();

  return (
    <main>
      <header className="nav">
        <Link
          href="/"
          className="brand"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 0,
            textDecoration: "none",
          }}
        >
          <span style={{ color: "#E86C3A", fontWeight: 600, fontSize: "15px", lineHeight: 1.2 }}>
            Xian De
          </span>
          <span style={{ color: "#999", fontSize: "12px", fontWeight: 400, lineHeight: 1.4 }}>
            Product Designer · ToB Focus
          </span>
        </Link>
        <nav>
          <Link href="/#work" style={{ color: "#aaa7b1", fontSize: "13px", padding: "8px 0" }}>
            Projects
          </Link>
          <Link href="/#about" style={{ color: "#aaa7b1", fontSize: "13px", padding: "8px 0" }}>
            About
          </Link>
          <Link
            href="/notes"
            style={{ color: "#7b6cf6", fontSize: "13px", padding: "8px 0", fontWeight: 600 }}
          >
            Notes
          </Link>
          <a
            href="mailto:zhangxian54@126.com"
            style={{
              display: "inline-block",
              color: "#E86C3A",
              border: "1.5px solid #E86C3A",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Start With Me ↗
          </a>
        </nav>
      </header>

      <div className="page-shell">
        <section style={{ padding: "80px 0 120px" }}>
          <div style={{ marginBottom: "56px" }}>
            <p
              style={{
                color: "var(--purple)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                margin: "0 0 12px",
              }}
            >
              NOTES
            </p>
            <h1
              style={{
                color: "var(--ink)",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 500,
                letterSpacing: "-0.05em",
                margin: "0 0 14px",
              }}
            >
              AI 学习心得
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "15px", margin: 0 }}>
              记录学习 AI 过程中的想法、踩坑与收获。
            </p>
          </div>

          {articles.length === 0 ? (
            <div style={{ color: "var(--muted)", padding: "120px 0", textAlign: "center" }}>
              <p style={{ fontSize: "16px", margin: 0 }}>暂无文章，敬请期待</p>
            </div>
          ) : (
            <div className="notes-grid">
              {articles.map((article) => (
                <Link href={`/notes/${article.slug}`} key={article.id} className="note-card">
                  <div className="note-card-inner">
                    <div>
                      <h2 className="note-title">{article.title}</h2>
                      {article.summary && <p className="note-summary">{article.summary}</p>}
                    </div>
                    <div className="note-meta">
                      <div className="tags">
                        {article.parsedTags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      {article.published_at && (
                        <time style={{ color: "var(--faint)", fontSize: "11px", flexShrink: 0 }}>
                          {formatDate(article.published_at)}
                        </time>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
