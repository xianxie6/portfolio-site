ALTER TABLE projects ADD COLUMN metrics TEXT NOT NULL DEFAULT '{}';
ALTER TABLE projects ADD COLUMN show_on_home INTEGER NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_projects_home_status_sort_order
  ON projects (show_on_home, status, sort_order);
