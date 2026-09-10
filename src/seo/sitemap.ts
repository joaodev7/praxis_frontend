import { BASE_URL } from './canonical';
import { BLOG_POSTS } from './blogData';

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function getPublicSitemapEntries(): SitemapEntry[] {
  const today = '2026-09-10';

  const staticEntries: SitemapEntry[] = [
    { url: `${BASE_URL}/`, lastmod: today, changefreq: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/software-para-nutricionistas/`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/software-para-nutricionista-rt/`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/software-para-consultoria-de-alimentos/`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/gestao-de-consultoria-de-alimentos/`, lastmod: today, changefreq: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/auditoria-de-seguranca-dos-alimentos/`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/checklist-rdc-216/`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/plano-de-acao-5w2h/`, lastmod: today, changefreq: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/etiquetagem-de-alimentos/`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/precos/`, lastmod: today, changefreq: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/sobre/`, lastmod: today, changefreq: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contato/`, lastmod: today, changefreq: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/seguranca/`, lastmod: today, changefreq: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/privacidade/`, lastmod: today, changefreq: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/termos/`, lastmod: today, changefreq: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/blog/`, lastmod: today, changefreq: 'daily', priority: 0.8 }
  ];

  const blogEntries: SitemapEntry[] = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}/`,
    lastmod: post.updatedAt || post.publishedAt,
    changefreq: 'monthly',
    priority: 0.7
  }));

  return [...staticEntries, ...blogEntries];
}

export function generateSitemapXml(): string {
  const entries = getPublicSitemapEntries();
  const xmlItems = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>
`;
}
