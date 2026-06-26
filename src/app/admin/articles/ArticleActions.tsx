"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type ArticleActionData = {
  id: string;
  title: string;
  status: "draft" | "published" | "hidden";
};

export function ArticleActions({ article }: { article: ArticleActionData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggleStatus = async () => {
    setBusy(true);
    const next = article.status === "published" ? "draft" : "published";
    await fetch(`/api/admin/articles/${article.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...article, status: next }),
    });
    setBusy(false);
    router.refresh();
  };

  const deleteArticle = async () => {
    if (!window.confirm(`确定删除「${article.title}」吗？此操作不可恢复。`)) return;
    setBusy(true);
    await fetch(`/api/admin/articles/${article.id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="admin-table-actions">
      <a href={`/admin/articles/${article.id}`}>编辑</a>
      <button disabled={busy} onClick={toggleStatus} type="button">
        {article.status === "published" ? "转草稿" : "发布"}
      </button>
      <button className="danger" disabled={busy} onClick={deleteArticle} type="button">
        删除
      </button>
    </div>
  );
}
