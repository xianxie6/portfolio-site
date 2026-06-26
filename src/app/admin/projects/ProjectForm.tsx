"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import type { ProjectStatus, ProjectType } from "@/lib/projects";

type MetricRow = {
  key: string;
  value: string;
};

export type ProjectFormData = {
  id?: string;
  title: string;
  slug: string;
  type: ProjectType;
  eyebrow: string;
  description: string;
  cover_image: string;
  cover_alt: string;
  tags: string[];
  href: string;
  metrics: Record<string, string>;
  show_on_home: boolean;
  status: ProjectStatus;
  sort_order: number;
};

type ProjectFormProps = {
  initialProject?: ProjectFormData;
  mode: "create" | "edit";
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function metricsToRows(metrics: Record<string, string>): MetricRow[] {
  const rows = Object.entries(metrics).map(([key, value]) => ({ key, value }));
  return rows.length ? rows : [{ key: "", value: "" }];
}

const emptyProject: ProjectFormData = {
  title: "",
  slug: "",
  type: "featured",
  eyebrow: "",
  description: "",
  cover_image: "",
  cover_alt: "",
  tags: [],
  href: "",
  metrics: {},
  show_on_home: true,
  status: "draft",
  sort_order: 99,
};

export function ProjectForm({ initialProject, mode }: ProjectFormProps) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectFormData>(initialProject ?? emptyProject);
  const [tagsInput, setTagsInput] = useState(project.tags.join(", "));
  const [metricRows, setMetricRows] = useState<MetricRow[]>(metricsToRows(project.metrics));
  const [slugTouched, setSlugTouched] = useState(Boolean(project.slug));
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const tags = useMemo(
    () => tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean),
    [tagsInput]
  );

  const updateProject = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => {
    setProject((current) => ({ ...current, [key]: value }));
  };

  const handleTitleChange = (title: string) => {
    setProject((current) => ({
      ...current,
      title,
      slug: slugTouched ? current.slug : slugify(title),
    }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    const metrics = Object.fromEntries(
      metricRows
        .map((row) => [row.key.trim(), row.value.trim()])
        .filter(([key, value]) => key && value)
    );
    const payload = {
      ...project,
      tags,
      metrics,
      sort_order: Number(project.sort_order),
    };
    const endpoint = mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${project.id}`;
    const response = await fetch(endpoint, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    setIsSaving(false);

    if (!response.ok) {
      setError("保存失败，请检查必填项或 Slug 是否重复。");
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  };

  const deleteProject = async () => {
    if (!project.id || !window.confirm(`确定删除「${project.title}」吗？此操作不可恢复。`)) return;

    const response = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("删除失败，请重试。");
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  };

  return (
    <form className="admin-project-form" onSubmit={submit}>
      {error && <div className="admin-error">{error}</div>}

      <label className="admin-field">
        <span>标题</span>
        <input required value={project.title} onChange={(event) => handleTitleChange(event.target.value)} />
      </label>

      <label className="admin-field">
        <span>Slug</span>
        <input
          required
          value={project.slug}
          onChange={(event) => {
            setSlugTouched(true);
            updateProject("slug", slugify(event.target.value));
          }}
        />
      </label>

      <div className="admin-form-grid">
        <fieldset className="admin-radio-group">
          <legend>类型</legend>
          {(["featured", "small"] as ProjectType[]).map((type) => (
            <label key={type}>
              <input
                checked={project.type === type}
                name="type"
                onChange={() => updateProject("type", type)}
                type="radio"
              />
              {type}
            </label>
          ))}
        </fieldset>

        <fieldset className="admin-radio-group">
          <legend>状态</legend>
          {(["draft", "published", "hidden"] as ProjectStatus[]).map((status) => (
            <label key={status}>
              <input
                checked={project.status === status}
                name="status"
                onChange={() => updateProject("status", status)}
                type="radio"
              />
              {status === "draft" ? "草稿" : status === "published" ? "发布" : "隐藏"}
            </label>
          ))}
        </fieldset>
      </div>

      <label className="admin-field">
        <span>Eyebrow</span>
        <input value={project.eyebrow} onChange={(event) => updateProject("eyebrow", event.target.value)} />
      </label>

      <label className="admin-field">
        <span>一句话描述</span>
        <textarea
          required
          value={project.description}
          onChange={(event) => updateProject("description", event.target.value)}
        />
      </label>

      <div className="admin-form-grid">
        <label className="admin-field">
          <span>封面图 URL</span>
          <input
            value={project.cover_image}
            onChange={(event) => updateProject("cover_image", event.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>封面图 Alt</span>
          <input value={project.cover_alt} onChange={(event) => updateProject("cover_alt", event.target.value)} />
        </label>
      </div>

      <label className="admin-field">
        <span>标签</span>
        <input value={tagsInput} onChange={(event) => setTagsInput(event.target.value)} />
      </label>

      <div className="admin-tag-preview">
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <label className="admin-field">
        <span>外链 href</span>
        <input value={project.href} onChange={(event) => updateProject("href", event.target.value)} />
      </label>

      <div className="admin-field">
        <span>数据指标</span>
        <div className="admin-metrics-editor">
          {metricRows.map((row, index) => (
            <div className="admin-metric-row" key={index}>
              <input
                placeholder="key"
                value={row.key}
                onChange={(event) =>
                  setMetricRows((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, key: event.target.value } : item
                    )
                  )
                }
              />
              <input
                placeholder="value"
                value={row.value}
                onChange={(event) =>
                  setMetricRows((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, value: event.target.value } : item
                    )
                  )
                }
              />
              <button
                type="button"
                onClick={() => setMetricRows((current) => current.filter((_, itemIndex) => itemIndex !== index))}
              >
                删除
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setMetricRows((current) => [...current, { key: "", value: "" }])}>
            增加指标
          </button>
        </div>
      </div>

      <div className="admin-form-grid">
        <label className="admin-field">
          <span>排序权重</span>
          <input
            type="number"
            value={project.sort_order}
            onChange={(event) => updateProject("sort_order", Number(event.target.value))}
          />
        </label>

        <label className="admin-switch">
          <input
            checked={project.show_on_home}
            onChange={(event) => updateProject("show_on_home", event.target.checked)}
            type="checkbox"
          />
          <span>展示在首页</span>
        </label>
      </div>

      <div className="admin-form-actions">
        <button className="admin-primary-button" disabled={isSaving} type="submit">
          {isSaving ? "保存中..." : "保存"}
        </button>
        {mode === "edit" && (
          <button className="admin-danger-button" onClick={deleteProject} type="button">
            删除项目
          </button>
        )}
      </div>
    </form>
  );
}
