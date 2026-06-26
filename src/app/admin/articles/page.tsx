import "../admin.css";
import { AdminNav } from "../AdminNav";

export default function AdminArticlesPage() {
  return (
    <main className="admin-shell">
      <AdminNav active="articles" />
      <section className="admin-main">
        <div className="admin-page-heading">
          <div>
            <h1>文章管理</h1>
            <p>文章列表和编辑功能将在这里继续扩展。</p>
          </div>
        </div>
        <div className="admin-panel">
          <p className="admin-placeholder">当前阶段先完成登录、会话和后台工作台骨架。</p>
        </div>
      </section>
    </main>
  );
}
