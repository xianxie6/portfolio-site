"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const funnel = [
  { value: "6,493", label: "展示次数", width: "100%", color: "#6758E8" },
  { value: "688", label: "产品页查看", width: "78%", color: "#7B6CF6", rate: "10.6%" },
  { value: "85", label: "首次下载", width: "58%", color: "#988DF7", rate: "12.4%" },
  { value: "99", label: "付费销量", width: "40%", color: "#B8B0FA", rate: "116.5%" },
];

const metrics = [
  { value: "11", unit: "年", label: "UX 产品设计经验" },
  { value: "1", unit: "款", label: "上架 App Store 的独立产品" },
  { value: "6,493", unit: "", label: "App Store 自然展示次数" },
  { value: "4", unit: "个", label: "App Store 自然触达地区" },
];

export type HomeProject = {
  id: string;
  eyebrow: string | null;
  title: string;
  tags: string[];
  description: string | null;
  gradient: string;
  banner: string | null;
  bannerAlt: string | null;
  href: string | null;
};

export type HomeSmallProduct = {
  id: string;
  title: string;
  eyebrow: string | null;
  tags: string[];
  description: string | null;
  image: string | null;
  imageAlt: string | null;
  href: string | null;
};

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const socialLinks = [
  { name: "小红书", platform: "xiaohongshu", href: "https://xhslink.com/m/4eWa7HWg8LY" },
  { name: "Bilibili", platform: "bilibili", href: "https://b23.tv/4zEhA8Z" },
  { name: "抖音", platform: "douyin", href: "https://v.douyin.com/l6taOy-Opfs/" },
  {
    name: "YouTube",
    platform: "youtube",
    href: "https://youtube.com/channel/UC6ItRCtOd0pEMxhOigGjA8g?si=ako4n5iOAXAnBjF-",
  },
];


function SocialIcon({ platform }: { platform: string }) {
  if (platform === "xiaohongshu") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#ff2442" />
        <path
          d="M7.2 10.2h17.6v11.6H7.2zM10.2 7.2v5.5M16 7.2v5.5M21.8 7.2v5.5M11.2 16h9.6M11.2 19h9.6"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  if (platform === "bilibili") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#00aeec" />
        <path
          d="m11.2 7.2 3.1 3.5m6.5-3.5-3.1 3.5M7.7 12.3h16.6c1 0 1.8.8 1.8 1.8v9.1c0 1-.8 1.8-1.8 1.8H7.7c-1 0-1.8-.8-1.8-1.8v-9.1c0-1 .8-1.8 1.8-1.8Z"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="M11 18.2v2.1m10-2.1v2.1" stroke="#fff" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (platform === "douyin") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#161823" />
        <path
          d="M18.1 8.1v10.2a4.8 4.8 0 1 1-4.8-4.8"
          fill="none"
          stroke="#25f4ee"
          strokeLinecap="round"
          strokeWidth="3.2"
          transform="translate(-1 1)"
        />
        <path
          d="M18.1 8.1c.8 3.5 2.7 5.3 5.8 5.8M18.1 18.3a4.8 4.8 0 1 1-4.8-4.8"
          fill="none"
          stroke="#fe2c55"
          strokeLinecap="round"
          strokeWidth="3.2"
          transform="translate(1 -1)"
        />
        <path
          d="M18.1 8.1v10.2a4.8 4.8 0 1 1-4.8-4.8m4.8-5.4c.8 3.5 2.7 5.3 5.8 5.8"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth="2.3"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#ff0033" />
      <path d="m13 10.8 9 5.2-9 5.2Z" fill="#fff" />
    </svg>
  );
}

function Funnel() {
  return (
    <motion.div
      className="funnel"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="funnel-heading">
        <span>APP STORE CONVERSION</span>
        <strong>自然流量转化漏斗</strong>
      </div>
      <div className="funnel-list">
        {funnel.map((item, index) => (
          <div className="funnel-stage" key={item.label}>
            {item.rate && (
              <div className="conversion">
                <span>↓</span>
                <b>{item.rate}</b>
              </div>
            )}
            <motion.div
              className="funnel-bar"
              initial={{ width: 0 }}
              animate={{ width: item.width }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              style={{ backgroundColor: item.color }}
            />
            <div className="funnel-meta">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SectionTitle({ label, note }: { label: string; note: string }) {
  return (
    <div className="section-title">
      <span>{label}</span>
      <div />
      <span>{note}</span>
    </div>
  );
}

type HomeClientProps = {
  projects: HomeProject[];
  smallProducts: HomeSmallProduct[];
};

export function HomeClient({ projects, smallProducts }: HomeClientProps) {
  const [openProject, setOpenProject] = useState<string | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const openLink = (href: string | null) => {
    if (href) window.open(href, "_blank", "noreferrer");
  };

  return (
    <main>
      <header className="nav">
        <button className="brand" onClick={() => scrollTo("home")} aria-label="返回首页" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
          <span style={{ color: "#E86C3A", fontWeight: 600, fontSize: "15px", lineHeight: 1.2 }}>Xian De</span>
          <span style={{ color: "#999", fontSize: "12px", fontWeight: 400, lineHeight: 1.4 }}>Product Designer · ToB Focus</span>
        </button>
        <nav>
          <button onClick={() => scrollTo("work")}>Projects</button>
          <button onClick={() => scrollTo("about")}>About</button>
          <a href="/notes" style={{ color: "#aaa7b1", fontSize: "13px", padding: "8px 0" }}>
            Notes
          </a>
          <a
            href="mailto:zhangxian54@126.com"
            style={{
              display: "inline-block",
              color: "#E86C3A",
              border: "1.5px solid #E86C3A",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#E86C3A"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "#E86C3A"; }}
          >
            Start With Me ↗
          </a>
        </nav>
      </header>

      <div className="page-shell">
        {/* ── Hero Three-Column ── */}
        <style>{`
          @keyframes cardDrop {
            0% {
              transform: translateY(-120%) rotate(0deg);
              animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            60% { transform: translateY(0%) rotate(0deg) }
            70% { transform: translateY(0%) rotate(-1.5deg) }
            80% { transform: translateY(0%) rotate(1.5deg) }
            90% { transform: translateY(0%) rotate(-1deg) }
            95% { transform: translateY(0%) rotate(0.8deg) }
            100% { transform: translateY(0%) rotate(0deg) }
          }
          @keyframes swing {
            0%   { transform: rotate(0deg) }
            20%  { transform: rotate(-1deg) }
            50%  { transform: rotate(0.8deg) }
            80%  { transform: rotate(-0.6deg) }
            100% { transform: rotate(0deg) }
          }
          @keyframes cloud1 {
            from { transform: translateX(0px) translateY(0px) }
            to   { transform: translateX(20px) translateY(-10px) }
          }
          @keyframes cloud2 {
            from { transform: translateX(0px) translateY(0px) }
            to   { transform: translateX(-15px) translateY(-8px) }
          }
          @keyframes cloud3 {
            from { transform: translateX(0px) translateY(0px) }
            to   { transform: translateX(10px) translateY(-12px) }
          }
        `}</style>
        <section
          id="home"
          className="w-screen relative overflow-hidden"
          style={{ background: "#F8F6F2", marginLeft: "calc(50% - 50vw)" }}
        >
          {/* ── Cloud blobs ── */}
          <div style={{ position: "absolute", width: 600, height: 300, bottom: -100, left: -100, background: "#FFD580", filter: "blur(80px)", opacity: 0.8, zIndex: 0, animation: "cloud1 8s ease-in-out infinite alternate", borderRadius: "50%" }} />
          <div style={{ position: "absolute", width: 500, height: 250, bottom: -80, left: "30%", background: "#FFBB88", filter: "blur(100px)", opacity: 0.6, zIndex: 0, animation: "cloud2 12s ease-in-out infinite alternate", borderRadius: "50%" }} />
          <div style={{ position: "absolute", width: 400, height: 200, bottom: -60, right: -80, background: "#D4BBFF", filter: "blur(90px)", opacity: 0.6, zIndex: 0, animation: "cloud3 16s ease-in-out infinite alternate", borderRadius: "50%" }} />

          <div
            className="max-w-[1440px] mx-auto px-16 flex items-center min-h-screen"
            style={{ gap: "40px", position: "relative", zIndex: 1 }}
          >
            {/* ── Left 40% ── */}
            <div style={{ flex: "0 0 40%" }}>
              <span
                style={{
                  display: "block",
                  color: "#FF6B35",
                  fontSize: "28px",
                  marginBottom: "16px",
                }}
              >
                ✦
              </span>

              <h1
                style={{
                  fontSize: "clamp(40px, 4vw, 60px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  margin: "0 0 20px",
                  color: "#1a1a1a",
                }}
              >
                <span style={{ display: "block" }}>Designing</span>
                <span style={{ display: "block", fontStyle: "italic", color: "#FF6B35" }}>
                  Impactful
                </span>
                <span style={{ display: "block" }}>Experiences</span>
              </h1>

              <p
                style={{
                  color: "#888",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  margin: "0 0 28px",
                  maxWidth: "360px",
                }}
              >
                15 年设计经验，用 AI 把设计边界推向产品全链路
              </p>

              <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
                <button
                  onClick={() => scrollTo("work")}
                  style={{
                    background: "#FF6B35",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 22px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  View My Work →
                </button>
                <button
                  style={{
                    background: "transparent",
                    color: "#333",
                    border: "1.5px solid #333",
                    borderRadius: "8px",
                    padding: "12px 22px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Download Resume ↓
                </button>
              </div>

              <div
                style={{
                  color: "#999",
                  fontSize: "13px",
                  lineHeight: 1.9,
                  marginBottom: "20px",
                }}
              >
                <div style={{ color: "#E86C3A" }}>📍 Based in Shandong, China</div>
                <div style={{ color: "#E86C3A" }}>Open to Remote Opportunities</div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                {/* GitHub */}
                <a
                  href="https://github.com/zhangxian"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  style={{ color: "#555", display: "flex" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                  </svg>
                </a>
                {/* Notion */}
                <a
                  href="#"
                  aria-label="Notion"
                  style={{ color: "#555", display: "flex" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  style={{ color: "#555", display: "flex" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* ── Middle 40% ── */}
            <div
              style={{
                flex: "0 0 40%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transformOrigin: "top center",
                  animation: "cardDrop 2.5s 0.2s forwards, swing 6s 2.7s ease-in-out infinite",
                }}
              >
                {/* Hanging string */}
                <div
                  style={{
                    width: "2px",
                    height: "48px",
                    background: "#ccc",
                  }}
                />
                {/* Card */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    padding: "10px",
                    width: "280px",
                    boxShadow: "0 4px 28px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* Avatar placeholder */}
                  <div
                    id="hero-avatar"
                    style={{
                      width: "260px",
                      height: "280px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #9B8CFF 0%, #C084FC 50%, #7C3AED 100%)",
                    }}
                  />
                  {/* Name & Role */}
                  <div
                    style={{
                      textAlign: "center",
                      padding: "14px 0 10px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Brush Script MT', 'Comic Sans MS', cursive",
                        fontSize: "30px",
                        color: "#FF6B35",
                        margin: "0 0 4px",
                        lineHeight: 1,
                      }}
                    >
                      Xian De
                    </p>
                    <p
                      style={{
                        color: "#aaa",
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        margin: 0,
                      }}
                    >
                      PRODUCT DESIGNER
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right 20% ── */}
            <div style={{ flex: "0 0 20%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}>
                  ● Featured Projects
                </span>
                <button
                  onClick={() => scrollTo("work")}
                  style={{
                    fontSize: "12px",
                    color: "#FF6B35",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  View All →
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { num: "01", title: "Mochi", sub: "AI Diary & Companion App", tag: "iOS App" },
                  {
                    num: "02",
                    title: "Codex Skill",
                    sub: "Knowledge System Platform",
                    tag: "Open Source",
                  },
                  {
                    num: "03",
                    title: "声语大陆",
                    sub: "Children's English App",
                    tag: "Education",
                  },
                ].map((p) => (
                  <div
                    key={p.num}
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            margin: "0 0 2px",
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#222",
                          }}
                        >
                          {p.title}
                        </p>
                        <p
                          style={{
                            margin: "0 0 8px",
                            fontSize: "11px",
                            color: "#888",
                            lineHeight: 1.4,
                          }}
                        >
                          {p.sub}
                        </p>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#FF6B35",
                            border: "1px solid #FF6B35",
                            borderRadius: "4px",
                            padding: "2px 7px",
                          }}
                        >
                          {p.tag}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#ccc",
                          fontWeight: 700,
                          flexShrink: 0,
                          marginLeft: "8px",
                        }}
                      >
                        {p.num}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Quote ── */}
              <div style={{ marginTop: "24px", paddingTop: "20px" }}>
                <div style={{ color: "#E86C3A", fontSize: "32px", lineHeight: 1, marginBottom: "8px" }}>&ldquo;</div>
                <p style={{ fontSize: "14px", color: "#444", lineHeight: 1.6, margin: "0 0 12px" }}>
                  Good design is not just what it looks like, but how it helps people achieve more.
                </p>
                <div style={{ width: "60px", borderBottom: "2px solid #E86C3A" }} />
              </div>
            </div>
          </div>
        </section>

        <motion.section
          className="metrics"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.08 }}
        >
          {metrics.map((metric) => (
            <motion.div className="metric" variants={reveal} key={metric.label}>
              <div>
                <strong>{metric.value}</strong>
                <span>{metric.unit}</span>
              </div>
              <p>{metric.label}</p>
            </motion.div>
          ))}
        </motion.section>

        <section className="about" id="about">
          <SectionTitle label="ABOUT" note="关于我" />
          <motion.div
            className="about-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={reveal}
            transition={{ duration: 0.6 }}
          >
            <div className="about-copy">
              <p>
                Hi～我是张弦，山东大学设计系毕业，11 年 UX 产品设计师，主要做 ToB
                软件产品。从 2025 年 7 月开始，我在社交平台持续分享自己的 AI 笔记；同年
                11 月，上架了人生第一款独立开发的 App「Mochi」。
              </p>
              <p>
                Mochi 从想法、需求、设计、开发、测试到上架，全部由我一个人通过 vibe coding
                完成。上线后获得 6,493 次 App Store 展示、688 次产品页查看、85 次首次下载和
                99 笔销量，自然触达亚太、美国和加拿大、拉丁美洲与加勒比、非洲中东和印度
                4 个地区。
              </p>
              <p>
                一路走来，GitHub 上的每一个项目和任务，都是我亲手踩过的坑，也是一次次把想法做成
                可运行产品的记录：从提示词库、互动网页、AI 应用，到整理出包含 36 个知识模块、
                3,000+ 行内容和 90 天行动路径的 AI 技能成长操作系统。第一次把可复用的 Codex Skill
                分享出来，也第一次收到了陌生开发者的关注，目前获得 14 个 stars 和 4 个 forks。
              </p>
            </div>
            <aside className="about-profile">
              <div className="profile-group">
                <span className="profile-label">主力工具</span>
                <strong className="tool-name">Claude Code · Codex</strong>
              </div>
              <div className="profile-group">
                <span className="profile-label">内容品牌</span>
                <strong className="brand-name">弦的AI日记</strong>
                <div className="social-grid">
                  {socialLinks.map((social) => (
                    <div className="social-item" key={social.name}>
                      <div className="social-name">
                        <span className="social-icon">
                          <SocialIcon platform={social.platform} />
                        </span>
                        <strong>{social.name}</strong>
                      </div>
                      <a href={social.href} target="_blank" rel="noreferrer">
                        访问主页 <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </motion.div>
        </section>

        <section className="work" id="work">
          <SectionTitle label="SELECTED WORK" note={`${projects.length} Projects`} />
          <div className="project-grid">
            {projects.map((project, index) => (
              <motion.article
                className={`project-card ${project.banner ? "has-banner" : ""} ${project.href ? "is-linkable" : ""}`}
                key={project.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={reveal}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={project.href ? { y: -7 } : undefined}
                onClick={() => openLink(project.href)}
                style={project.href ? { cursor: "pointer" } : undefined}
                role={project.href ? "link" : undefined}
                tabIndex={project.href ? 0 : undefined}
                onKeyDown={(e) => e.key === "Enter" && openLink(project.href)}
              >
                <div className="project-cover" style={{ background: project.gradient }}>
                  {project.banner ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.banner} alt={project.bannerAlt ?? project.title} />
                  ) : (
                    <span>{project.eyebrow}</span>
                  )}
                </div>
                <div className="project-body">
                  <div className="project-heading">
                    <h3>{project.title}</h3>
                    <b>0{index + 1}</b>
                  </div>
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span
                        className={
                          tag.includes("stars")
                            ? "star-tag"
                            : tag === "已上架"
                              ? "accent-tag"
                              : ""
                        }
                        key={tag}
                      >
                        {tag.includes("stars") ? "★ " : ""}
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p>{project.description}</p>
                  <div className="project-footer">
                    {project.id === "mochi" && (
                      <button
                        className="funnel-toggle"
                        aria-expanded={openProject === "mochi"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenProject(openProject === "mochi" ? null : "mochi");
                        }}
                      >
                        {openProject === "mochi" ? "收起数据 ↑" : "查看转化数据 →"}
                      </button>
                    )}
                    {project.href && project.id !== "mochi" && (
                      <div className="project-link-hint">
                        查看详情 <span>↗</span>
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {openProject === "mochi" && project.id === "mochi" && <Funnel />}
                  </AnimatePresence>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="small-products-heading">
            <SectionTitle label="SMALL PRODUCTS" note={`${smallProducts.length} Experiments`} />
          </div>
          <div className="small-product-grid">
            {smallProducts.map((product, index) => (
              <motion.article
                className={`small-product-card ${product.href ? "is-linkable" : ""}`}
                key={product.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={reveal}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={product.href ? { y: -6 } : undefined}
                onClick={() => openLink(product.href)}
                style={product.href ? { cursor: "pointer" } : undefined}
                role={product.href ? "link" : undefined}
                tabIndex={product.href ? 0 : undefined}
                onKeyDown={(e) => e.key === "Enter" && openLink(product.href)}
              >
                <div className="small-product-cover">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image} alt={product.imageAlt ?? product.title} />
                  ) : (
                    <span>{product.eyebrow}</span>
                  )}
                </div>
                <div className="small-product-body">
                  <span className="small-product-eyebrow">{product.eyebrow}</span>
                  <div className="small-product-title">
                    <h3>{product.title}</h3>
                    <b>0{index + 1}</b>
                  </div>
                  <p>{product.description}</p>
                  <div className="tags">
                    {product.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  {product.href && (
                    <div className="small-product-link-hint">
                      体验作品 <span aria-hidden="true">↗</span>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <footer>
          <div>
            <span>LET&apos;S BUILD SOMETHING USEFUL</span>
            <h2>不只是用 AI，是知道该让它做什么。</h2>
          </div>
          <a href="mailto:zhangxian54@126.com">zhangxian54@126.com ↗</a>
          <small>© 2026 张弦</small>
        </footer>
      </div>
    </main>
  );
}
