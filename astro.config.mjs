// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// IMPORTANT : remplacez `site` par votre domaine final (indispensable pour des
// URLs canoniques, un sitemap.xml et des balises Open Graph correctes).
// Vous pouvez aussi le surcharger via la variable d'environnement SITE_URL
// (pratique sur Netlify : Site settings → Environment variables).
const SITE = process.env.SITE_URL || 'https://comparateur-ipl.netlify.app';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: {
    // URLs propres : /meilleur-ipl-peau-mate au lieu de /meilleur-ipl-peau-mate/
    format: 'file',
    inlineStylesheets: 'auto',
  },
  integrations: [
    mdx(),
    sitemap({
      // On exclut les pages utilitaires de l'index Google via le sitemap.
      filter: (page) =>
        !page.includes('/mentions-legales') && !page.includes('/recherche'),
      changefreq: 'weekly',
      lastmod: new Date(),
    }),
  ],
  image: {
    // Autorise l'optimisation d'images distantes (ex : visuels Amazon si besoin).
    domains: ['m.media-amazon.com', 'images-eu.ssl-images-amazon.com'],
  },
  compressHTML: true,
});
