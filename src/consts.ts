/**
 * Constantes globales du site.
 * Centralise l'identité, les URLs et les valeurs par défaut SEO.
 * Remplacez ces valeurs par les vôtres.
 */

export const SITE = {
  /** Nom court affiché dans le header et les données structurées. */
  name: 'Comparateur IPL',
  /** Nom complet / baseline pour les balises title et Open Graph. */
  title: 'Comparateur IPL — Le banc d’essai des épilateurs à lumière pulsée',
  /** Description par défaut (fallback meta description). */
  description:
    'Comparatif indépendant des meilleurs épilateurs à lumière pulsée (IPL). Tests, fiches détaillées et conseils par type de peau et de poil.',
  /** Langue principale (attribut lang + balise og:locale). */
  lang: 'fr',
  locale: 'fr_FR',
  /** Auteur / éditeur du site. */
  author: 'La rédaction Comparateur IPL',
  /** Handle Twitter/X (sans @) — laissez vide si non applicable. */
  twitter: '',
  /** Image Open Graph par défaut (dans /public). */
  defaultOgImage: '/og-default.svg',
  /** Tag d'affiliation Amazon — utilisé pour valider/afficher les liens. */
  amazonTag: 'guidepratiq0b-21',
} as const;

/** Navigation principale. */
export const NAV_LINKS = [
  { href: '/meilleur-epilateur-ipl-2026', label: 'Le comparatif 2026' },
  { href: '/comparatifs', label: 'Tous les guides' },
  { href: '/recherche', label: 'Recherche' },
  { href: '/a-propos', label: 'Méthodologie' },
] as const;

/** Liens de pied de page. */
export const FOOTER_LINKS = [
  { href: '/a-propos', label: 'À propos & méthodologie' },
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/meilleur-epilateur-ipl-2026', label: 'Comparatif 2026' },
] as const;
