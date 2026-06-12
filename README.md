# Portfolio Site

个人作品集网站，使用 Next.js 构建并静态导出，部署于 Cloudflare Workers。

## 本地开发

```bash
npm install
npm run dev
```

访问 <http://localhost:3001>。

## 构建与预览

```bash
npm run build
npm run preview
```

## 部署

```bash
npm run deploy
```

Wrangler 会将 `out` 目录中的静态网站发布到 Cloudflare。
