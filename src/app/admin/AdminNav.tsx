import Link from "next/link";

type AdminNavProps = {
  active: "overview" | "projects" | "articles";
};

export function AdminNav({ active }: AdminNavProps) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-title">
        <strong>作品集后台</strong>
        <span>Portfolio Admin</span>
      </div>

      <nav className="admin-nav" aria-label="后台导航">
        <Link className={active === "overview" ? "active" : ""} href="/admin">
          概览
        </Link>
        <Link className={active === "projects" ? "active" : ""} href="/admin/projects">
          项目管理
        </Link>
        <Link className={active === "articles" ? "active" : ""} href="/admin/articles">
          文章管理
        </Link>
      </nav>

      <form className="admin-logout-form" action="/api/admin/logout" method="post">
        <button className="admin-logout-button" type="submit">
          退出登录
        </button>
      </form>
    </aside>
  );
}
