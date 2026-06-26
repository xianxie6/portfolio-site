import "../../admin.css";
import { AdminNav } from "../../AdminNav";
import { ProjectForm } from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <main className="admin-shell">
      <AdminNav active="projects" />
      <section className="admin-main">
        <div className="admin-page-heading">
          <div>
            <h1>新建项目</h1>
            <p>创建后可选择草稿、发布或隐藏。</p>
          </div>
        </div>
        <div className="admin-panel">
          <ProjectForm mode="create" />
        </div>
      </section>
    </main>
  );
}
