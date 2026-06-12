"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const metrics = [
  { value: "11", unit: "年", label: "UX 产品设计经验" },
  { value: "1", unit: "款", label: "上架 App Store 的独立产品" },
  { value: "6,493", unit: "", label: "App Store 自然展示次数" },
  { value: "4", unit: "个", label: "自然覆盖海外地区" },
];

const funnel = [
  { value: "6,493", label: "展示次数", width: "100%", color: "#6758E8" },
  { value: "688", label: "产品页查看", width: "78%", color: "#7B6CF6", rate: "10.6%" },
  { value: "85", label: "首次下载", width: "58%", color: "#988DF7", rate: "12.4%" },
  { value: "99", label: "付费销量", width: "40%", color: "#B8B0FA", rate: "116.5%" },
];

const projects = [
  {
    id: "mochi",
    eyebrow: "MOCHI · IOS APP",
    title: "Mochi",
    tags: ["iOS App", "独立产品", "已上架"],
    description: "从 0 到 1 独立完成，App Store 自然覆盖 4 个全球区域",
    action: "查看转化数据",
    gradient: "linear-gradient(135deg, #D9D5FF 0%, #EEEAFE 100%)",
    banner: "/mochi-banner.png",
    bannerAlt: "Mochi 应用横幅",
  },
  {
    id: "hongquan",
    eyebrow: "红圈投标 AI · NEXT.JS",
    title: "红圈投标 AI",
    tags: ["Next.js", "全栈", "华为云部署"],
    description: "设计师独立完成前端 + 后台数据库 + 内容管理系统",
    action: "查看详情",
    gradient: "linear-gradient(135deg, #E4E5FF 0%, #F0F1FF 100%)",
    banner: "/toubiaoai.png",
    bannerAlt: "红圈投标 AI 横幅",
    productUrl: "https://ai-tender.hecom.cn/",
    productLinkLabel: "查看产品地址",
  },
  {
    id: "industry",
    eyebrow: "CODEX SKILL · OPEN SOURCE",
    title: "行业知识系统构建引擎",
    tags: ["Codex Skill", "开源工具", "14 stars", "4 forks"],
    description:
      "可复用的 Codex Skill，从零搭建任意行业的完整认知体系，已被其他开发者 fork 使用。包含数据库构建、竞品分析、账号研究、知识地图生成、情报订阅五大模块",
    action: "查看详情",
    gradient: "linear-gradient(135deg, #DDE9FF 0%, #EEF4FF 100%)",
    banner: "/industry-banner.png",
    bannerAlt: "行业知识系统构建引擎横幅",
    productUrl:
      "https://ux-ai-skills-os.pages.dev/#4-ai-%E6%8A%80%E8%83%BD%E6%88%90%E9%95%BF%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E6%80%BB%E8%A7%88",
    productLinkLabel: "Skill 生成的结果页面",
  },
];

const smallProducts = [
  {
    id: "instant-camera",
    title: "拍立得相机",
    eyebrow: "WEB CAMERA · CREATIVE TOOL",
    tags: ["互动网页", "拍立得", "AI 辅助开发"],
    description: "一款可以即时拍摄、生成并收藏拍立得照片的趣味相机网页。",
    image: "/instant-camera.png",
    imageAlt: "拍立得相机产品界面",
    productUrl: "https://pailide-three.vercel.app/",
  },
  {
    id: "notebooklm-prompts",
    title: "NotebookLM 提示词库",
    eyebrow: "PROMPT LIBRARY · WEB",
    tags: ["提示词库", "NotebookLM", "效率工具"],
    description: "收集并分类高质量 NotebookLM 提示词，支持按场景快速查找与复制。",
    image: "/notebooklm-prompts.png",
    imageAlt: "NotebookLM 提示词库网站界面",
    productUrl: "https://notebook-prompts.vercel.app/",
  },
  {
    id: "phonosia",
    title: "声语大陆",
    eyebrow: "CHILDREN'S ENGLISH · APP",
    tags: ["儿童英语", "语音识别", "游戏化学习"],
    description: "通过语音互动和冒险地图，帮助儿童练习并掌握英语单词。",
    image: "/phonosia-english-app.png",
    imageAlt: "声语大陆儿童英语单词 App 界面",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const socialLinks = [
  { name: "小红书", href: "https://xhslink.com/m/4eWa7HWg8LY" },
  { name: "Bilibili", href: "https://b23.tv/4zEhA8Z" },
  { name: "抖音", href: "https://v.douyin.com/l6taOy-Opfs/" },
  {
    name: "YouTube",
    href: "https://youtube.com/channel/UC6ItRCtOd0pEMxhOigGjA8g?si=ako4n5iOAXAnBjF-",
  },
];

function SectionTitle({ label, note }: { label: string; note: string }) {
  return (
    <div className="section-title">
      <span>{label}</span>
      <div />
      <span>{note}</span>
    </div>
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

export default function Home() {
  const [openProject, setOpenProject] = useState<string | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
          <a href="https://www.bilibili.com/" target="_blank" rel="noreferrer">
            Blog
          </a>
          <a className="contact-link" href="mailto:zhangxian54@126.com">
            Contact
          </a>
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
                      <strong>{social.name}</strong>
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
            {projects.map((project, index) => {
              const isOpen = openProject === project.id;
              return (
                <motion.article
                  className={`project-card ${project.banner ? "has-banner" : ""} ${
                    isOpen ? "is-open" : ""
                  }`}
                  key={project.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={reveal}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  whileHover={{ y: -7 }}
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
                    <div className="project-actions">
                      <button
                        className="project-action"
                        aria-expanded={isOpen}
                        onClick={() =>
                          setOpenProject(isOpen ? null : project.id)
                        }
                      >
                        {isOpen ? "收起详情" : project.action} <span>{isOpen ? "↑" : "→"}</span>
                      </button>
                      {project.id === "mochi" && (
                        <a
                          className="project-action product-link"
                          href="https://apps.apple.com/cn/app/mochi/id6755081548"
                          target="_blank"
                          rel="noreferrer"
                        >
                          查看产品地址 <span>↗</span>
                        </a>
                      )}
                      {project.productUrl && (
                        <a
                          className="project-action product-link"
                          href={project.productUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {project.productLinkLabel} <span>↗</span>
                        </a>
                      )}
                    </div>
                    <AnimatePresence>
                      {isOpen && project.id === "mochi" && <Funnel />}
                      {isOpen && project.id !== "mochi" && (
                        <motion.div
                          className="project-detail"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <span>ROLE & SCOPE</span>
                          <p>
                            从产品定义、体验设计到开发部署，独立推动完整链路落地，并持续以真实反馈迭代。
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="small-products-heading">
            <SectionTitle label="SMALL PRODUCTS" note="3 Experiments" />
          </div>
          <div className="small-product-grid">
            {smallProducts.map((product, index) => (
              <motion.article
                className="small-product-card"
                key={product.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={reveal}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
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
                  {product.productUrl && (
                    <a
                      className="small-product-action"
                      href={product.productUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      体验作品 <span aria-hidden="true">↗</span>
                    </a>
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
