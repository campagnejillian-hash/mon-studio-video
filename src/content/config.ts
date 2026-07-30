import { defineCollection, reference, z } from 'astro:content';

/**
 * Collection « produits » : une fiche = un appareil IPL.
 * Le contenu éditorial va dans le corps MDX ; les données structurées
 * (comparatif, JSON-LD) proviennent du frontmatter ci-dessous.
 */
const produits = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      nom: z.string(),
      marque: z.string(),
      technologie: z.string(), // ex : « Lumière pulsée intense (IPL) »
      nbFlashs: z.number().int().positive(), // nombre de flashs annoncé
      zones: z.array(z.string()), // zones traitables
      capteurDePeau: z.boolean(), // capteur de teint intégré ?
      alimentation: z.enum(['filaire', 'sans-fil', 'filaire-et-sans-fil']),
      compatibilitePeau: z.string(), // ex : « Peaux très claires à mates »
      compatibilitePoil: z.string(), // ex : « Poils bruns à noirs »
      pointsForts: z.array(z.string()).min(1),
      pointsFaibles: z.array(z.string()).min(1),
      note: z.number().min(0).max(10), // note globale /10
      verdict: z.string(), // résumé du verdict (1-2 phrases)

      // Affiliation — JAMAIS de prix en dur.
      affiliateUrl: z
        .string()
        .url()
        .describe('https://www.amazon.fr/dp/ASIN/?tag=guidepratiq0b-21'),
      asin: z.string().optional(), // ASIN Amazon (facultatif, pour info)

      // Média
      image: image(), // visuel produit optimisé par Astro
      imageAlt: z.string(), // texte alternatif descriptif (SEO + a11y)

      // Métadonnées SEO / affichage
      seoTitle: z.string().optional(), // surcharge de la balise <title>
      seoDescription: z.string().optional(),
      resume: z.string(), // chapô affiché en haut de fiche
      datePublication: z.coerce.date(),
      dateMaj: z.coerce.date().optional(),
      brouillon: z.boolean().default(false),
    }),
});

/**
 * Collection « comparatifs » : page pilier + satellites longue traîne.
 * `type: 'pilier'` pour la page centrale, `'satellite'` pour les guides
 * « meilleur X pour Y », « A vs B » et « avis [modèle] ».
 */
const comparatifs = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(), // balise <title>
      h1: z.string(), // H1 unique et distinct du title si besoin
      description: z.string(), // meta description unique
      type: z.enum(['pilier', 'satellite']),

      // Angle éditorial du satellite (utile pour le maillage et la recherche).
      angle: z
        .enum(['type-de-peau', 'type-de-poil', 'zone', 'versus', 'avis', 'general'])
        .default('general'),

      // Produits mis en avant dans ce guide (ordre = classement affiché).
      produits: z.array(reference('produits')).default([]),

      // FAQ affichée + injectée en JSON-LD (FAQPage).
      faq: z
        .array(z.object({ question: z.string(), reponse: z.string() }))
        .default([]),

      // Maillage interne
      pilier: reference('comparatifs').optional(), // lien vers la page pilier

      // Média / SEO
      ogImage: z.string().optional(),
      resume: z.string(), // chapô / intro courte
      datePublication: z.coerce.date(),
      dateMaj: z.coerce.date().optional(),
      brouillon: z.boolean().default(false),
    }),
});

export const collections = { produits, comparatifs };
