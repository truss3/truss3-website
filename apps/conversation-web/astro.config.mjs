// @ts-check
import { defineConfig } from 'astro/config';

/**
 * 站点地址用于生成 canonical / sitemap / OG 的绝对 URL。
 *
 * 部署形态：
 *  - GitHub Pages 绑定自定义域名 -> SITE_URL=https://your-domain.com，base 保持 '/'
 *  - GitHub Pages 项目站点（无自定义域名）-> SITE_URL=https://<user>.github.io，base='/<repo>/'
 *
 * 构建时通过环境变量注入，避免把域名硬编码进源码。
 */
const site = process.env.SITE_URL ?? 'http://localhost:4321';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',

  build: {
    // 生成 /about/index.html 形式的目录结构，URL 更干净
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  devToolbar: {
    enabled: false,
  },
});
