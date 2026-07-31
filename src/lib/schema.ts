/**
 * Générateurs de données structurées schema.org (JSON-LD).
 * Product, Review, AggregateRating, FAQPage, BreadcrumbList.
 *
 * Note SEO : on n'affiche jamais de prix numérique en dur. Pour rester conforme
 * aux règles de Google sur `Product`, on n'émet PAS de balise `offers` avec un
 * prix inventé ; on décrit uniquement le produit et son évaluation éditoriale.
 */

import type { CollectionEntry } from 'astro:content';

type Produit = CollectionEntry<'produits'>;

/** Convertit une note /10 en note /5 (échelle habituelle de schema.org). */
export function noteSur5(note: number): number {
  return Math.round((note / 2) * 10) / 10;
}

interface ProductSchemaOptions {
  produit: Produit['data'];
  url: string; // URL absolue de la fiche
  imageUrl: string; // URL absolue de l'image
}

/**
 * Product + Review (avis ÉDITORIAL du site, un seul auteur).
 *
 * Choix de conformité : on n'émet PAS d'`AggregateRating`. Ce type suppose
 * l'agrégation de plusieurs avis d'utilisateurs ; l'utiliser pour une note
 * maison reviendrait à afficher de fausses notes agrégées. On publie donc
 * uniquement un `Review` unique, signé par la rédaction, avec sa note — ce qui
 * est honnête et conforme aux règles de Google sur les avis auto-publiés.
 */
export function buildProductSchema({ produit, url, imageUrl }: ProductSchemaOptions) {
  const rating = noteSur5(produit.note);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: produit.nom,
    image: imageUrl,
    description: produit.resume,
    brand: {
      '@type': 'Brand',
      name: produit.marque,
    },
    category: 'Épilateur à lumière pulsée (IPL)',
    url,
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rating,
        bestRating: 5,
        worstRating: 0,
      },
      author: {
        '@type': 'Organization',
        name: 'La rédaction',
      },
      reviewBody: produit.verdict,
    },
  };
}

interface FaqItem {
  question: string;
  reponse: string;
}

/** FAQPage à partir d'une liste question/réponse. */
export function buildFaqSchema(faq: FaqItem[]) {
  if (!faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.reponse,
      },
    })),
  };
}

interface Crumb {
  name: string;
  url: string; // URL absolue
}

/** BreadcrumbList pour le fil d'Ariane. */
export function buildBreadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

interface ItemListOptions {
  name: string;
  url: string;
  produits: { nom: string; url: string }[];
}

/** ItemList — utile pour une page de classement (comparatif). */
export function buildItemListSchema({ name, url, produits }: ItemListOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url,
    numberOfItems: produits.length,
    itemListElement: produits.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.nom,
      url: p.url,
    })),
  };
}

/** WebSite + SearchAction (barre de recherche interne) pour la home. */
export function buildWebsiteSchema(siteUrl: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/recherche?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
