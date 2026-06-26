import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";
import { notFound } from "next/navigation";

import { getProjectById, parseJsonArray, parseJsonObject } from "@/lib/projects";

import "../../admin.css";
import { AdminNav } from "../../AdminNav";
import { ProjectForm, type ProjectFormData } from "../ProjectForm";

export const dynamic = "force-dynamic";

type Env = {
  DB: D1Database;
};

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const project = await getProjectById((env as Env).DB, id);

  if (!project) {
    notFound();
  }

  const initialProject: ProjectFormData = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    type: project.type,
    eyebrow: project.eyebrow ?? "",
    description: project.description ?? "",
    cover_image: project.cover_image ?? "",
    cover_alt: project.cover_alt ?? "",
    tags: parseJsonArray(project.tags),
    href: project.href ?? "",
    metrics: parseJsonObject(project.metrics),
    show_on_home: Boolean(project.show_on_home),
    status: project.status,
    sort_order: project.sort_order,
  };

  return (
    <main className="admin-shell">
      <AdminNav active="projects" />
      <section className="admin-main">
        <div className="admin-page-heading">
          <div>
            <h1>编辑项目</h1>
            <p>{project.title}</p>
          </div>
        </div>
        <div className="admin-panel">
          <ProjectForm initialProject={initialProject} mode="edit" />
        </div>
      </section>
    </main>
  );
}
