"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ProjectStatus, ProjectType } from "@/lib/projects";

export type ProjectActionData = {
  id: string;
  title: string;
  slug: string;
  type: ProjectType;
  eyebrow: string | null;
  description: string | null;
  cover_image: string | null;
  cover_alt: string | null;
  tags: string[];
  href: string | null;
  metrics: Record<string, string>;
  show_on_home: boolean;
  status: ProjectStatus;
  sort_order: number;
};

type ProjectActionsProps = {
  project: ProjectActionData;
};

export function ProjectActions({ project }: ProjectActionsProps) {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);

  const updateStatus = async () => {
    setIsBusy(true);
    const nextStatus = project.status === "published" ? "draft" : "published";
    await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...project,
        status: nextStatus,
      }),
    });
    setIsBusy(false);
    router.refresh();
  };

  const deleteProject = async () => {
    if (!window.confirm(`确定删除「${project.title}」吗？此操作不可恢复。`)) return;

    setIsBusy(true);
    await fetch(`/api/admin/projects/${project.id}`, {
      method: "DELETE",
    });
    setIsBusy(false);
    router.refresh();
  };

  return (
    <div className="admin-table-actions">
      <a href={`/admin/projects/${project.id}`}>编辑</a>
      <button disabled={isBusy} onClick={updateStatus} type="button">
        {project.status === "published" ? "转草稿" : "发布"}
      </button>
      <button className="danger" disabled={isBusy} onClick={deleteProject} type="button">
        删除
      </button>
    </div>
  );
}
