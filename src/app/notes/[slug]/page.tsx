import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Env = { DB: D1Database };

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
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

type RouteContext = { params: Promise<{ slug: string }> };

async function getArticle(slug: string) {
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as Env).DB;
  const article = await db
    .prepare(
      `SELECT id, title, slug, summary, content, tags, published_at
       FROM articles
       WHERE slug = ? AND status = 'published'
       LIMIT 1`
    )
    .bind(slug)
    .first<ArticleRow>();
  if (!article) return null;
  return { ...article, parsedTags: parseTags(article.tags) };
}

export async function generateMetadata({ params }: RouteContext): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} · Notes`,
    description: article.summary ?? undefined,
  };
}

export default async function ArticlePage({ params }: RouteContext) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

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
          <a href="/#work" style={{ color: "#aaa7b1", fontSize: "13px", padding: "8px 0" }}>
            Projects
          </a>
          <a href="/#about" style={{ color: "#aaa7b1", fontSize: "13px", padding: "8px 0" }}>
            About
          </a>
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
        <article style={{ padding: "72px 0 120px" }}>
          <header style={{ marginBottom: "52px", maxWidth: "720px" }}>
            {article.parsedTags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                {article.parsedTags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "#f0edff",
                      borderRadius: "999px",
                      color: "var(--purple)",
                      fontSize: "11px",
                      padding: "5px 10px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1
              style={{
                color: "var(--ink)",
                fontSize: "clamp(28px, 3.5vw, 46px)",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 1.2,
                margin: "0 0 16px",
              }}
            >
              {article.title}
            </h1>
            {article.published_at && (
              <time style={{ color: "var(--faint)", fontSize: "13px" }}>
                {formatDate(article.published_at)}
              </time>
            )}
          </header>

          {article.content ? (
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p style={{ color: "var(--muted)" }}>（正文暂未填写）</p>
          )}

          <footer
            style={{
              borderTop: "1px solid var(--line)",
              marginTop: "80px",
              paddingTop: "32px",
            }}
          >
            <Link
              href="/notes"
              style={{
                color: "var(--purple)",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              ← 返回 Notes
            </Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
