import "../../admin.css";
import { AdminNav } from "../../AdminNav";
import { ArticleForm } from "../ArticleForm";

export default function AdminArticlesNewPage() {
  return (
    <main className="admin-shell">
      <AdminNav active="articles" />
      <section className="admin-main">
        <div className="admin-page-heading">
          <div>
            <h1>新建文章</h1>
            <p>填写内容后点击保存，默认为草稿状态。</p>
          </div>
        </div>
        <div className="admin-panel">
          <ArticleForm />
        </div>
      </section>
    </main>
  );
}
