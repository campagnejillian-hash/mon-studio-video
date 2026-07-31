/**
 * Index de recherche JSON généré au build.
 * Consommé côté client par Fuse.js (barre de recherche).
 * Ne contient que des comparatifs + fiches produits publiés.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const [comparatifs, produits] = await Promise.all([
    getCollection('comparatifs', ({ data }) => !data.brouillon),
    getCollection('produits', ({ data }) => !data.brouillon),
  ]);

  const index = [
    ...comparatifs.map((c) => ({
      type: c.data.type === 'pilier' ? 'Guide pilier' : 'Guide',
      angle: c.data.angle,
      title: c.data.h1,
      description: c.data.description,
      url: `/${c.slug}`,
    })),
    ...produits.map((p) => ({
      type: 'Fiche produit',
      angle: 'produit',
      title: p.data.nom,
      description: p.data.resume,
      url: `/produits/${p.slug}`,
    })),
  ];

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
