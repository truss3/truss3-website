// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * 站点地址用于生成 canonical / sitemap / OG 的绝对 URL。
 *
 * 部署形态：
 *  - 自定义域名（推荐）-> SITE_URL=https://your-domain.com，BASE_PATH=/
 *  - GitHub Pages 项目站点 -> SITE_URL=https://<org>.github.io，BASE_PATH=/<repo>/
 *
 * 均由构建时环境变量注入，不把域名硬编码进源码。
 */
const site = process.env.SITE_URL ?? 'http://localhost:4321';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  // 统一生成带尾斜杠的规范 URL，避免 sitemap 同时收录 /about 与 /about/ 两个变体
  trailingSlash: 'always',

  integrations: [sitemap()],

  build: {
    // 生成 /about/index.html 形式的目录结构，URL 更干净
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  devToolbar: {
    enabled: false,
  },
});
