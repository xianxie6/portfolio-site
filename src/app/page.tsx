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
  { value: "4", unit: "个", label: "自然覆盖海外地区" },
];

const projects = [
  {
    id: "mochi",
    eyebrow: "MOCHI · IOS APP",
    title: "Mochi",
    tags: ["iOS App", "独立产品", "已上架"],
    description: "从 0 到 1 独立完成，App Store 自然覆盖 4 个全球区域",
    gradient: "linear-gradient(135deg, #D9D5FF 0%, #EEEAFE 100%)",
    banner: "/mochi-banner.webp",
    bannerAlt: "Mochi 应用横幅",
    href: "https://apps.apple.com/cn/app/mochi/id6755081548",
  },
  {
    id: "commercial",
    eyebrow: "AI · NEXT.JS",
    title: "商业化项目",
    tags: ["Next.js", "全栈", "华为云部署"],
    description: "设计师独立完成前端 + 后台数据库 + 内容管理系统，已部署至华为云独立服务器",
    gradient: "linear-gradient(135deg, #E4E5FF 0%, #F0F1FF 100%)",
    banner: "/商业化项目.webp",
    bannerAlt: "商业化项目横幅",
    href: null,
  },
  {
    id: "industry",
    eyebrow: "CODEX SKILL · OPEN SOURCE",
    title: "行业知识系统构建引擎",
    tags: ["Codex Skill", "开源工具", "14 stars", "4 forks"],
    description:
      "可复用的 Codex Skill，从零搭建任意行业的完整认知体系，已被其他开发者 fork 使用。包含数据库构建、竞品分析、账号研究、知识地图生成、情报订阅五大模块",
    gradient: "linear-gradient(135deg, #DDE9FF 0%, #EEF4FF 100%)",
    banner: "/industry-banner.webp",
    bannerAlt: "行业知识系统构建引擎横幅",
    href: "https://ux-ai-skills-os.pages.dev/#4-ai-%E6%8A%80%E8%83%BD%E6%88%90%E9%95%BF%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E6%80%BB%E8%A7%88",
  },
];

const smallProducts = [
  {
    id: "instant-camera",
    title: "拍立得相机",
    eyebrow: "WEB CAMERA · CREATIVE TOOL",
    tags: ["互动网页", "拍立得", "AI 辅助开发"],
    description: "一款可以即时拍摄、生成并收藏拍立得照片的趣味相机网页。",
    image: "/instant-camera.webp",
    imageAlt: "拍立得相机产品界面",
    href: "https://pailide-three.vercel.app/",
  },
  {
    id: "notebooklm-prompts",
    title: "NotebookLM 提示词库",
    eyebrow: "PROMPT LIBRARY · WEB",
    tags: ["提示词库", "NotebookLM", "效率工具"],
    description: "收集并分类高质量 NotebookLM 提示词，支持按场景快速查找与复制。",
    image: "/notebooklm-prompts.webp",
    imageAlt: "NotebookLM 提示词库网站界面",
    href: "https://notebook-prompts.vercel.app/",
  },
  {
    id: "phonosia",
    title: "声语大陆",
    eyebrow: "CHILDREN'S ENGLISH · APP",
    tags: ["儿童英语", "语音识别", "游戏化学习"],
    description: "通过语音互动和冒险地图，帮助儿童练习并掌握英语单词。",
    image: "/phonosia-english-app.webp",
    imageAlt: "声语大陆儿童英语单词 App 界面",
    href: null,
  },
];

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

export default function Home() {
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
        <button className="brand" onClick={() => scrollTo("home")} aria-label="返回首页">
          <span className="brand-dot" />
          张弦
        </button>
        <nav>
          <button onClick={() => scrollTo("work")}>Projects</button>
          <button onClick={() => scrollTo("about")}>About</button>
        </nav>
      </header>

      <div className="page-shell">
        <section className="hero" id="home">
          <motion.div
            className="hero-copy"
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.65 }}
          >
            <p className="kicker">PERSONAL PORTFOLIO · 2026</p>
            <h1>Xian</h1>
            <div className="role-line">
              <span>张弦</span>
              <i />
              <strong>UX DESIGNER × AI BUILDER</strong>
            </div>
            <p className="hero-intro">11 年设计经验，用 AI 把设计边界推向产品全链路</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => scrollTo("work")}>
                查看案例 <span>↗</span>
              </button>
              <a className="secondary-button" href="mailto:zhangxian54@126.com">
                联系我
              </a>
            </div>
          </motion.div>
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
                软件产品。2025 年起全面进入 AI 领域。
              </p>
              <p>
                那一年，我独立完成了一款宠物情绪陪伴 App「Mochi」—— 从需求、设计到
                vibe coding 全部一个人完成，已上架 App Store。
              </p>
              <p>
                在公司，我把设计边界推向了整个产品链路：需求、设计、测试，独立完成 AI
                产品官网，含 CMS 后台、知识库数据库、管理员文章发布系统，部署到华为云独立服务器。
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
          <SectionTitle label="SELECTED WORK" note="3 Projects" />
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
                    <img src={project.banner} alt={project.bannerAlt} />
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
            <SectionTitle label="SMALL PRODUCTS" note="3 Experiments" />
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.imageAlt} />
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
