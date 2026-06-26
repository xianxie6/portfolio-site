"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import "../admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/admin/auth", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("密码错误，请重试");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1>后台登录</h1>
        <p>输入管理员密码后进入作品集后台。</p>

        {error && <div className="admin-error">{error}</div>}

        <label className="admin-field">
          <span>密码</span>
          <input
            autoComplete="current-password"
            autoFocus
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>

        <button className="admin-primary-button" disabled={isSubmitting || !password} type="submit">
          {isSubmitting ? "登录中..." : "登录"}
        </button>
      </form>
    </main>
  );
}
