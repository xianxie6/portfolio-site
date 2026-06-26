import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";
import Link from "next/link";

import { parseJsonArray, parseJsonObject, type ProjectRow } from "@/lib/projects";

import "../admin.css";
import { AdminNav } from "../AdminNav";
import { ProjectActions, type ProjectActionData } from "./ProjectActions";

export const dynamic = "force-dynamic";

type Env = {
  DB: D1Database;
};

async function getProjects() {
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
        metrics,
        show_on_home,
        status,
        sort_order,
        created_at,
        updated_at,
        published_at
      FROM projects
      ORDER BY sort_order ASC, updated_at DESC`
    )
    .all<ProjectRow>();

  return results;
}

function toActionData(project: ProjectRow): ProjectActionData {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    type: project.type,
    eyebrow: project.eyebrow,
    description: project.description,
    cover_image: project.cover_image,
    cover_alt: project.cover_alt,
    tags: parseJsonArray(project.tags),
    href: project.href,
    metrics: parseJsonObject(project.metrics),
    show_on_home: Boolean(project.show_on_home),
    status: project.status,
    sort_order: project.sort_order,
  };
}

function safeImageSrc(src: string) {
  return encodeURI(src);
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="admin-shell">
      <AdminNav active="projects" />
      <section className="admin-main">
        <div className="admin-page-heading">
          <div>
            <h1>项目管理</h1>
            <p>管理首页大卡片和小作品区展示内容。</p>
          </div>
          <Link className="admin-primary-button" href="/admin/projects/new">
            新建项目
          </Link>
        </div>

        <div className="admin-table-card">
          <table className="admin-project-table">
            <thead>
              <tr>
                <th>封面</th>
                <th>标题</th>
                <th>类型</th>
                <th>状态</th>
                <th>排序</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <div className="admin-cover-chip">
                      {project.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={safeImageSrc(project.cover_image)} alt={project.cover_alt ?? project.title} />
                      ) : (
                        <span>{project.title.slice(0, 1)}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-project-title-cell">
                      <strong>{project.title}</strong>
                      <span>{project.slug}</span>
                    </div>
                  </td>
                  <td>{project.type}</td>
                  <td>
                    <span className={`admin-status-badge ${project.status}`}>{project.status}</span>
                  </td>
                  <td>{project.sort_order}</td>
                  <td>
                    <ProjectActions project={toActionData(project)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
