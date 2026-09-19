import type { APIRoute } from 'astro';

/**
 * 动态生成 robots.txt。
 *
 * sitemap 地址由 astro.config 的 `site` 推导，因此绑定自定义域名后无需改动此文件。
 * 不要额外创建 public/robots.txt，否则会与本路由冲突。
 */
export const GET: APIRoute = ({ site }) => {
  const lines = ['User-agent: *', 'Allow: /'];

  if (site) {
    lines.push('', `Sitemap: ${new URL('sitemap-index.xml', site).href}`);
  }

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
