/**
 * robots.txt généré dynamiquement : l'URL du sitemap suit automatiquement le
 * domaine défini dans astro.config.mjs (`site` / variable d'env SITE_URL).
 * Ainsi, aucune modification manuelle après le déploiement sur Netlify.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href ?? 'https://comparateur-ipl.netlify.app/').replace(/\/$/, '');
  const body = `# robots.txt — Comparateur IPL

User-agent: *
Allow: /

# Pages utilitaires non destinées à l'index
Disallow: /recherche
Disallow: /mentions-legales

Sitemap: ${base}/sitemap-index.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
