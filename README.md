# Comparateur IPL — site statique Astro optimisé SEO

Site comparateur d'appareils d'épilation à lumière pulsée (IPL), construit avec
[Astro](https://astro.build), 100 % statique, mobile-first et pensé pour être
**techniquement irréprochable pour Google**. Déployable gratuitement sur Netlify.

Le contenu fourni est **fictif et sert d'exemple** : remplacez-le par vos vrais
produits, textes et liens d'affiliation.

---

## 🚀 Démarrage

```bash
npm install       # installe les dépendances
npm run dev       # serveur de dev sur http://localhost:4321
npm run build     # génère le site statique dans dist/
npm run preview   # prévisualise le build
```

Node 18+ requis (Node 22 recommandé, défini dans `netlify.toml`).

---

## 🗂️ Structure du projet

```
src/
├── components/         Composants réutilisables (.astro)
│   ├── BaseHead.astro          → tout le <head> SEO (title, meta, OG, canonical…)
│   ├── JsonLd.astro            → injection des données structurées
│   ├── Header / Footer         → navigation + divulgation d'affiliation globale
│   ├── AffiliateDisclosure     → bloc « divulgation d'affiliation »
│   ├── CtaButton               → bouton « Voir le prix sur Amazon » (nofollow sponsored)
│   ├── ComparisonTable         → tableau comparatif
│   ├── ProductCard             → carte produit
│   ├── ProsCons / Rating / Faq / Breadcrumbs
│   └── SearchBar.astro         → recherche client-side (Fuse.js)
├── content/
│   ├── config.ts               → schémas des collections (validation Zod)
│   ├── produits/               → fiches produits (.mdx)
│   └── comparatifs/            → page pilier + satellites (.mdx)
├── layouts/
│   └── BaseLayout.astro        → gabarit commun (head + header + footer)
├── lib/
│   └── schema.ts               → générateurs JSON-LD (Product, Review, FAQ, Breadcrumb…)
├── pages/
│   ├── index.astro             → accueil
│   ├── [slug].astro            → comparatifs sur URLs propres (/meilleur-ipl-peau-mate)
│   ├── produits/[slug].astro   → fiches produits (/produits/xxx)
│   ├── comparatifs/index.astro → liste de tous les guides
│   ├── recherche.astro         → page de recherche
│   ├── a-propos.astro          → à propos / méthodologie (E-E-A-T)
│   ├── mentions-legales.astro  → mentions légales (modèle à compléter)
│   ├── 404.astro               → page d'erreur
│   └── search.json.ts          → index de recherche généré au build
├── assets/produits/            → visuels produits (optimisés par Astro)
├── styles/global.css           → design system (thème clair/sombre)
└── consts.ts                   → configuration du site (nom, nav, tag Amazon…)
public/
├── robots.txt                  → à mettre à jour avec votre domaine
├── favicon.svg / og-default.svg
```

---

## ✍️ Ajouter du contenu

### Une fiche produit

Créez un fichier `src/content/produits/mon-modele.mdx`. Le **frontmatter** (entre
les `---`) alimente le tableau comparatif et les données structurées ; le corps
en Markdown/MDX est votre texte éditorial.

```mdx
---
nom: "Nom du modèle"
marque: "Marque"
technologie: "Lumière pulsée intense (IPL)"
nbFlashs: 400000
zones: ["Jambes", "Aisselles", "Maillot", "Visage"]
capteurDePeau: true
alimentation: "filaire"          # filaire | sans-fil | filaire-et-sans-fil
compatibilitePeau: "Peaux claires à mates"
compatibilitePoil: "Poils bruns à noirs"
pointsForts: ["…", "…"]
pointsFaibles: ["…", "…"]
note: 8.5                          # sur 10
verdict: "Résumé en une phrase."
affiliateUrl: "https://www.amazon.fr/dp/VOTRE_ASIN/?tag=guidepratiq0b-21"
asin: "VOTRE_ASIN"
image: "../../assets/produits/mon-image.jpg"
imageAlt: "Description précise de l'image"
resume: "Chapô affiché en haut de la fiche."
datePublication: 2026-01-15
dateMaj: 2026-02-01
---

Votre contenu éditorial ici (titres ##, listes, citations…).
```

> ⚠️ **Jamais de prix numérique en dur.** Le tarif est toujours celui affiché en
> temps réel sur Amazon via le bouton CTA.

### Un comparatif (pilier ou satellite)

Créez `src/content/comparatifs/mon-guide.mdx`. Le nom du fichier devient l'URL
(ex : `meilleur-ipl-peau-mate.mdx` → `/meilleur-ipl-peau-mate`).

```mdx
---
title: "Titre de la balise <title>"
h1: "H1 unique de la page"
description: "Meta description unique."
type: "satellite"                 # pilier | satellite
angle: "type-de-peau"             # type-de-peau | type-de-poil | zone | versus | avis | general
pilier: meilleur-epilateur-ipl-2026   # lien vers la page pilier
produits:                         # slugs des fiches à afficher (ordre = classement)
  - smooth-x-infinity
  - lumea-pro-9000
faq:
  - question: "…"
    reponse: "…"
resume: "Chapô / intro."
datePublication: 2026-03-05
dateMaj: 2026-03-10
---

Votre contenu. Pensez à lier vers la page pilier et vers les fiches produits.
```

Les images produits : déposez vos fichiers dans `src/assets/produits/`
(JPG/PNG/WebP). Astro les convertit automatiquement en formats modernes
(AVIF/WebP), les redimensionne et les charge en lazy-load.

---

## 🔍 SEO intégré (déjà en place)

- **Title / meta description uniques** par page, **H1 unique**, hiérarchie Hn propre.
- **Données structurées JSON-LD** : `Product` + `Review` + `AggregateRating`,
  `FAQPage`, `BreadcrumbList`, `ItemList`, `WebSite` (SearchAction).
- **sitemap.xml** (`/sitemap-index.xml`) et **robots.txt**.
- **URLs propres** sans extension (`/meilleur-ipl-peau-mate`) + **canonical**.
- **Open Graph** + **Twitter cards** sur chaque page.
- Images **lazy-load**, formats modernes, **alt descriptifs**.
- **Core Web Vitals** : polices système (0 web font), CSS inline, ~28 Ko de JS
  au total, Fuse.js chargé uniquement au focus de la recherche → CLS ≈ 0, LCP rapide.
- **Divulgation d'affiliation** visible sur chaque page + liens en
  `rel="nofollow sponsored"`.
- Pages **À propos / méthodologie** et **mentions légales** (confiance / E-E-A-T).

### ⚙️ À personnaliser avant la mise en ligne

1. **`astro.config.mjs`** → `site` : votre domaine final (ou variable d'env `SITE_URL`).
2. **`src/consts.ts`** → nom, description, auteur, handle Twitter, tag Amazon.
3. **`public/robots.txt`** → URL du sitemap avec votre domaine.
4. **`src/pages/mentions-legales.astro`** → vos informations légales réelles.
5. Remplacez les 4 fiches produits et 3 comparatifs d'exemple par votre contenu.

---

## 🌐 Déploiement gratuit sur Netlify

Le fichier `netlify.toml` est déjà configuré (build, en-têtes de sécurité et de
cache).

1. Poussez ce dépôt sur GitHub/GitLab.
2. Sur [Netlify](https://app.netlify.com) : **Add new site → Import an existing
   project**, sélectionnez le dépôt.
3. Netlify détecte la config automatiquement (commande `npm run build`, dossier
   `dist`).
4. Dans **Site settings → Environment variables**, ajoutez `SITE_URL` avec votre
   domaine final (ex : `https://mon-comparateur-ipl.fr`) pour des URLs
   canoniques et un sitemap corrects.
5. Déployez. C'est gratuit (offre Netlify Free : CDN mondial, HTTPS automatique).

> Astuce : après avoir connecté votre domaine, redéployez pour que le sitemap et
> les balises canonical prennent la bonne URL.
