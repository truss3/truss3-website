import type { APIRoute } from 'astro';

/**
 * 动态生成 robots.txt。
 *
 * sitemap 地址由 astro.config 的 `site` + `base` 共同推导，因此绑定自定义域名、
 * 或从子路径切换到根路径后，都无需改动此文件。
 *
 * 注意：站点部署在子路径（如 github.io 项目站点）时，robots.txt 位于
 * `/<repo>/robots.txt`，而爬虫只认域名根目录的 `/robots.txt`，因此该文件
 * 在子路径场景下不会被读取——绑定自定义域名后站点位于根路径，即自然生效。
 *
 * 不要额外创建 public/robots.txt，否则会与本路由冲突。
 */
export const GET: APIRoute = ({ site }) => {
  const lines = ['User-agent: *', 'Allow: /'];

  if (site) {
    // import.meta.env.BASE_URL 形如 '/truss3-website/' 或 '/'，已含尾斜杠
    const sitemapUrl = new URL(`${import.meta.env.BASE_URL}sitemap-index.xml`, site);
    lines.push('', `Sitemap: ${sitemapUrl.href}`);
  }

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
