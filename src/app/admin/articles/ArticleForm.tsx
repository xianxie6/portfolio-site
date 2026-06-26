"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9一-龥]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type ArticleFormData = {
  id?: string;
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  tags?: string[];
  status?: "draft" | "published";
};

export function ArticleForm({ initial }: { initial?: ArticleFormData }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [tagInput, setTagInput] = useState(initial?.tags?.join(", ") ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content: initial?.content ?? "",
    editorProps: { attributes: { class: "ProseMirror" } },
  });

  useEffect(() => {
    if (!slugTouched && title) setSlug(slugify(title));
  }, [title, slugTouched]);

  const tags = useMemo(
    () => tagInput.split(",").map((s) => s.trim()).filter(Boolean),
    [tagInput]
  );

  const setLink = useCallback(() => {
    const prev = editor?.getAttributes("link").href ?? "";
    const url = window.prompt("请输入链接地址：", prev);
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    const payload = { title, slug, summary: summary || null, content: editor?.getHTML() ?? null, tags, status };
    const url = isEdit ? `/api/admin/articles/${initial!.id}` : "/api/admin/articles";
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    setBusy(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError((data as { error?: string }).error ?? "保存失败，请重试");
      return;
    }

    if (!isEdit) {
      const { id } = (await res.json()) as { id: string };
      router.push(`/admin/articles/${id}`);
    } else {
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`确定删除「${title}」吗？此操作不可恢复。`)) return;
    setBusy(true);
    await fetch(`/api/admin/articles/${initial!.id}`, { method: "DELETE" });
    router.push("/admin/articles");
  };

  const tb = (label: string, onClick: () => void, active: boolean) => (
    <button key={label} type="button" onClick={onClick} className={active ? "is-active" : ""}>
      {label}
    </button>
  );

  return (
    <form className="admin-article-form" onSubmit={handleSubmit}>
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-form-grid">
        <label className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <span>标题 *</span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="文章标题"
          />
        </label>

        <label className="admin-field">
          <span>Slug</span>
          <input
            value={slug}
            onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
            placeholder="url-slug"
          />
        </label>

        <label className="admin-field">
          <span>标签（逗号分隔）</span>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="设计, AI, 产品"
          />
        </label>
      </div>

      {tags.length > 0 && (
        <div className="admin-tag-preview">
          {tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      )}

      <label className="admin-field">
        <span>摘要（选填，最多 200 字）</span>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value.slice(0, 200))}
          placeholder="文章摘要…"
          style={{ minHeight: 80 }}
        />
        <div className="admin-char-count">{summary.length} / 200</div>
      </label>

      <fieldset className="admin-radio-group">
        <legend>发布状态</legend>
        {(["draft", "published"] as const).map((s) => (
          <label key={s}>
            <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} />
            {s === "draft" ? "草稿" : "发布"}
          </label>
        ))}
      </fieldset>

      <div className="admin-field">
        <span>正文</span>
        <div className="tiptap-toolbar">
          {tb("正文", () => editor?.chain().focus().setParagraph().run(), editor?.isActive("paragraph") ?? false)}
          {tb("H1", () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), editor?.isActive("heading", { level: 1 }) ?? false)}
          {tb("H2", () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), editor?.isActive("heading", { level: 2 }) ?? false)}
          {tb("H3", () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), editor?.isActive("heading", { level: 3 }) ?? false)}
          <div className="tiptap-divider" />
          {tb("B", () => editor?.chain().focus().toggleBold().run(), editor?.isActive("bold") ?? false)}
          {tb("I", () => editor?.chain().focus().toggleItalic().run(), editor?.isActive("italic") ?? false)}
          <div className="tiptap-divider" />
          {tb("引用", () => editor?.chain().focus().toggleBlockquote().run(), editor?.isActive("blockquote") ?? false)}
          {tb("代码块", () => editor?.chain().focus().toggleCodeBlock().run(), editor?.isActive("codeBlock") ?? false)}
          <div className="tiptap-divider" />
          {tb("• 列表", () => editor?.chain().focus().toggleBulletList().run(), editor?.isActive("bulletList") ?? false)}
          {tb("1. 列表", () => editor?.chain().focus().toggleOrderedList().run(), editor?.isActive("orderedList") ?? false)}
          <div className="tiptap-divider" />
          {tb("链接", setLink, editor?.isActive("link") ?? false)}
        </div>
        <div className="tiptap-editor" onClick={() => editor?.commands.focus()}>
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="admin-form-actions">
        <button className="admin-primary-button" type="submit" disabled={busy}>
          {busy ? "保存中…" : "保存"}
        </button>
        {isEdit && (
          <button className="admin-danger-button" type="button" disabled={busy} onClick={handleDelete}>
            删除文章
          </button>
        )}
      </div>
    </form>
  );
}
