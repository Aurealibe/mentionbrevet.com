# 🏆 MentionBrevet.com

**Analysez les mentions du brevet des collèges par prénom**

Découvrez les statistiques officielles du brevet des collèges 2025 par prénom. Visualisez les taux de mentions (TB, B, AB) et explorez les corrélations entre prénoms et réussite scolaire avec plus de 26 000 prénoms analysés.

[![Déploiement Vercel](https://img.shields.io/badge/Vercel-Déployé-success)](https://mentionbrevet.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2+-blueviolet)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![SEO Optimisé](https://img.shields.io/badge/SEO-Optimisé-green)](https://mentionbrevet.com)

---

## 📋 Vue d'ensemble du projet

### Objectif

Application web interactive Next.js qui présente une visualisation des corrélations entre prénoms et taux de mentions au brevet des collèges. Le site permet d'explorer 26 563 prénoms avec plus de 10 occurrences chacun, offrant une analyse statistique approfondie des résultats scolaires par prénom.

### Pages et Routes

L'application propose **trois pages principales** :

1. **Page d'accueil** (`/`) - Nuage de points interactif avec tous les prénoms
2. **Outil de comparaison** (`/comparer`) - Comparer jusqu'à 5 prénoms côte à côte
3. **Pages individuelles** (`/prenom/[name]`) - Statistiques détaillées par prénom avec génération statique (top 100)

### Spécifications techniques

- **Framework** : Next.js 14.2+ avec App Router
- **Langage** : TypeScript (100% typé)
- **UI Library** : shadcn/ui + Tailwind CSS + Radix UI
- **Recherche** : OptimizedSearch custom avec indexation par préfixes
- **Visualisation** : SVG custom (scatter plot) + Recharts (comparaison)
- **Données** : CSV statique (26k+ lignes) - Aucune base de données
- **SEO** : Sitemap automatique, robots.txt, données structurées
- **Analytics** : Google Analytics 4 + événements personnalisés
- **Déploiement** : Vercel avec optimisations Edge

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou yarn
- Un fichier `dataset.csv` à la racine du projet (fourni)

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/Aurealibe/mentionbrevet.com.git
cd mentionbrevet.com

# 2. Installer les dépendances
npm install

# 3. Convertir les données CSV en JSON
npm run convert-data

# 4. Lancer le serveur de développement
npm run dev
```

Le site sera accessible à l'adresse `http://localhost:3000`

### Commandes disponibles

```bash
# Développement
npm run dev          # Démarrer le serveur de développement
npm run build        # Build de production (avec conversion des données)
npm run start        # Démarrer le serveur de production
npm run lint         # Vérification ESLint
npm run type-check   # Vérification TypeScript

# Données
npm run convert-data # Convertir le CSV en JSON statique
```

---

## 📊 Analyse des données

### Structure du dataset CSV

Le fichier `dataset.csv` contient **26 563 lignes** avec les colonnes suivantes :

| Colonne     | Type   | Description                      |
| ----------- | ------ | -------------------------------- |
| `firstname` | string | Prénom du candidat               |
| `count`     | number | Nombre d'occurrences             |
| `taux_sm`   | number | Taux sans mention (0-1)          |
| `taux_ab`   | number | Taux mention assez bien (0-1)    |
| `taux_b`    | number | Taux mention bien (0-1)          |
| `taux_tb`   | number | Taux mention très bien (0-1)     |
| `taux_fel`  | number | Taux mention félicitations (0-1) |

### Critères de filtrage

- **Seuil minimum CSV** : Prénoms avec plus de **10 candidats** après conversion
- **Seuil minimum graphique** : Prénoms avec plus de **100 candidats** pour l'affichage dans le scatter plot
- **Seuil minimum recherche** : Prénoms avec plus de **10 candidats** pour la recherche
- **Année de focus** : Brevet 2025 (extensible aux autres années)
- **Données officielles** : Issues des résultats du Ministère de l'Éducation Nationale

### Traitement des données

1. **Lecture CSV** : Parsing robuste avec gestion d'erreurs
2. **Filtrage à deux niveaux** :
   - Seuil de 10 occurrences pour la conversion CSV → JSON
   - Seuil de 100 occurrences pour l'affichage graphique
3. **Validation** : Vérification des types et valeurs (0-1 pour les taux)
4. **Optimisation** : Conversion JSON pour Vercel au build-time
5. **Métadonnées** : Statistiques de traitement incluses dans le JSON final

---

## 🎯 Fonctionnalités principales

### 1. 📊 Nuage de prénoms interactif (Page d'accueil)

#### Affichage graphique

- **Implémentation** : SVG custom avec optimisations de performance
- **Axe X (abscisse)** : Taux de mentions sélectionnable via interface radio
  - Sans mention (`taux_sm`)
  - Assez bien (`taux_ab`)
  - Bien (`taux_b`)
  - Très bien (`taux_tb`)
  - Très bien avec félicitations (`taux_fel`)
- **Axe Y (ordonnée)** : Nombre d'occurrences du prénom (`count`)
  - **Échelle logarithmique** pour optimiser la lisibilité
- **Points** : Chaque prénom représenté par un point coloré selon ses coordonnées
- **Labels** : Algorithme anti-collision pour positionnement intelligent des étiquettes

#### Interactivité avancée

- **Hover** : Tooltip portal avec prénom et statistiques détaillées au survol
- **Clic** : Sélection du prénom pour affichage détaillé dans le panneau
- **Zoom** :
  - Boutons zoom in/out/reset
  - Molette de souris (activable)
  - Navigation sur zones spécifiques du graphique
- **Pan** : Glisser-déposer pour déplacer la vue
- **Filtres** : Changement dynamique du type de mention affiché
- **Performance** : Memoïsation et throttling pour affichage fluide (60fps)

#### Interface de sélection

```
○ Sans mention     ○ Assez bien     ○ Bien     ● Très bien     ○ Félicitations
```

### 2. 🔍 Barre de recherche intelligente

#### Fonctionnalités

- **Recherche optimisée** : Implémentation custom `OptimizedSearch` avec indexation par préfixes
- **Indexation** : Index par première lettre et deux premières lettres pour recherche instantanée
- **Suggestions** : Liste déroulante des prénoms correspondants via Command palette (cmdk)
- **Recherche normalisée** : Insensible à la casse et aux accents
- **Validation** : Gestion gracieuse des prénoms non trouvés
- **Raccourcis** : `F` pour focus, `Esc` pour effacer
- **Debouncing** : 300ms pour optimiser les performances

#### Algorithme de recherche

- Normalisation des chaînes (suppression des accents, lowercase)
- Indexation par préfixes (1 et 2 lettres)
- Recherche dans l'index approprié selon la longueur de la requête
- Tri des résultats par pertinence et nombre d'occurrences
- Limitation à 10 résultats maximum

#### Format d'affichage des résultats

```
Le prénom [PRÉNOM] et la mention au brevet.

[COUNT] [PRÉNOM] ont passé le brevet en 2025.
[X]% ont eu sans mention, [Y]% ont eu mention AB, [Z]% ont obtenu la mention B,
[W]% ont eu mention TB, et [V]% ont eu TB avec félicitations.

D'autres prénoms ont le même profil : [LISTE_PRÉNOMS_SIMILAIRES]...
```

### 3. 🔄 Analyse de profils similaires

#### Algorithme de similarité

- **Méthode** : Distance euclidienne entre les vecteurs de taux de mentions
- **Normalisation** : Pondération par le nombre d'occurrences
- **Seuil de similarité** : Configurable dans `lib/constants.ts`
- **Limite** : 10 prénoms similaires maximum par recherche

#### Cas d'usage

- Découvrir des prénoms avec des profils de réussite similaires
- Explorer les corrélations statistiques entre prénoms
- Identifier des patterns dans les résultats scolaires

### 4. 🆚 Outil de comparaison multi-prénoms (`/comparer`)

#### Fonctionnalités

- **Sélection multiple** : Comparer jusqu'à 5 prénoms simultanément
- **Visualisation radar** : Chart radar avec Recharts montrant tous les taux de mentions
- **Visualisation en barres** : Bar chart comparatif par type de mention
- **Système de scoring** : Calcul de note moyenne pondérée sur 10
- **Ranking coloré** : Classement visuel avec codes couleur selon performance
- **Interface responsive** : Optimisée pour mobile et desktop

#### Système de scoring

- **Formule** : Moyenne pondérée des mentions
- **Barème** :
  - Sans mention = 0 points
  - Assez bien = 4 points
  - Bien = 6 points
  - Très bien = 8 points
  - Félicitations = 10 points
- **Calcul** : `(SM×0 + AB×4 + B×6 + TB×8 + FEL×10) / 10`
- **Catégories de performance** :
  - 🔴 Faible : 0-4
  - 🟠 Moyen : 4-6
  - 🟡 Bon : 6-7.5
  - 🟢 Très bon : 7.5-9
  - 🔵 Excellent : 9-10

### 5. 📄 Pages individuelles par prénom (`/prenom/[name]`)

#### Fonctionnalités

- **Génération statique** : Top 100 prénoms pré-générés au build
- **Statistiques détaillées** :
  - Progress bars pour chaque type de mention
  - Pourcentages précis avec arrondis
  - Nombre total de candidats
- **Score global** : Note moyenne pondérée avec badge coloré
- **Prénoms similaires** : Liste des 10 prénoms les plus proches
- **Rankings** : Position du prénom dans différents classements
- **SEO optimisé** : Métadonnées dynamiques par prénom
- **404 custom** : Page d'erreur personnalisée pour prénoms inexistants

#### Navigation

- Accès direct via URL : `/prenom/marie`
- Liens depuis le scatter plot (clic sur point)
- Liens depuis la recherche
- Liens depuis les prénoms similaires

---

## 🎨 Interface utilisateur

### Layout et structure

```
┌─────────────────────────────────────────────────────────┐
│              Header + Hero Section                      │
│  [Titre] [Description] [Badge données 2025]             │
├─────────────────────────────────────────────────────────┤
│  [Barre de recherche intelligente]                      │
├─────────────────────────────────────────────────────────┤
│  [Sélecteur de mentions : ○ SM ○ AB ○ B ● TB ○ FEL]     │
├─────────────────────────────────────────────────────────┤
│  [Contrôles zoom : + - Reset]                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              GRAPHIQUE NUAGE DE POINTS                  │
│       [Zoom, Pan, Hover, Tooltips, Anti-collision]     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│              Panneau des résultats                      │
│         [Statistiques + Prénoms similaires]             │
├─────────────────────────────────────────────────────────┤
│            Instructions d'utilisation                   │
├─────────────────────────────────────────────────────────┤
│                 Footer et crédits                      │
└─────────────────────────────────────────────────────────┘
```

### Composants implémentés

#### Pages et Layouts

1. **app/page.tsx** - Page d'accueil avec scatter plot
2. **app/comparer/page.tsx** - Page de comparaison multi-prénoms
3. **app/prenom/[name]/page.tsx** - Pages individuelles dynamiques
4. **app/layout.tsx** - Layout racine avec SEO et Analytics

#### Composants principaux

5. **SearchBar.tsx** - Barre de recherche avec Command palette
   - Recherche en temps réel avec debouncing
   - Interface Command de shadcn/ui avec OptimizedSearch
   - Gestion des états : loading, error, empty, results
   - Raccourcis clavier intégrés
   - Responsive design

6. **ScatterPlot.tsx** - Graphique nuage de points custom
   - Implémentation SVG custom (755 lignes)
   - Échelle logarithmique sur l'axe Y
   - Algorithme anti-collision pour labels
   - Tooltips personnalisés avec portail
   - Gestion des clics pour sélection
   - Zoom et pan natifs avec boutons
   - Performance optimisée avec memoïsation
   - Affichage de 26k+ points sans lag

7. **MentionSelector.tsx** - Sélecteur de type de mention
   - RadioGroup Radix UI avec 5 options
   - Interface accessible (WCAG 2.1 AA)
   - Raccourcis clavier (1-5)
   - Feedback visuel en temps réel
   - Animation des transitions

8. **ResultsPanel.tsx** - Panneau d'affichage des résultats
   - Affichage des statistiques formatées
   - Liste interactive des prénoms similaires
   - Navigation entre prénoms avec smooth scroll
   - États vides et erreurs gracieux
   - Responsive avec collapse sur mobile

9. **ComparativeAnalysis.tsx** - Composant de comparaison
   - Radar chart avec Recharts
   - Bar chart comparatif
   - Système de scoring avec badges
   - Layout responsive
   - Gestion de 1 à 5 prénoms

10. **HeroSection.tsx** - Section hero de la page d'accueil
    - Titre et description
    - Badge de données 2025
    - CTA et navigation
    - Design glassmorphism

11. **InstructionsSection.tsx** - Instructions d'utilisation
    - Guide pas à pas
    - Icônes illustratives
    - Layout en grille responsive

12. **AppFooter.tsx** - Footer de l'application
    - Crédits et sources
    - Liens sociaux
    - Mentions légales

#### Composants UI (shadcn/ui)

13. **ui/button.tsx** - Composant bouton
14. **ui/card.tsx** - Composant carte
15. **ui/input.tsx** - Composant input
16. **ui/command.tsx** - Composant command palette
17. **ui/dialog.tsx** - Composant modal
18. **ui/label.tsx** - Composant label
19. **ui/radio-group.tsx** - Composant radio group
20. **ui/badge.tsx** - Composant badge
21. **ui/progress.tsx** - Composant progress bar
22. **ui/tooltip.tsx** - Composant tooltip
23. **ui/TooltipPortal.tsx** - Portal pour tooltips custom

#### Composants utilitaires

24. **LoadingStates.tsx** - États de chargement
    - Skeleton screens élégants
    - États d'erreur avec retry
    - Indicateurs de progression
    - Animations fluides
    - Full-page et composants loading

25. **StructuredData.tsx** - Données structurées SEO
    - Schema.org WebSite
    - Schema.org Dataset
    - Schema.org WebApplication
    - Schema.org FAQ
    - JSON-LD formaté

26. **Analytics.tsx** - Intégration Google Analytics
    - Google Analytics 4
    - Tracking d'événements custom
    - Pageview tracking
    - Conversion tracking

### Design System (shadcn/ui)

- **Base** : Thème slate avec variables CSS
- **Couleurs** : Support dark/light mode automatique
- **Typographie** : Inter via Google Fonts
- **Responsive** : Mobile-first avec Tailwind CSS
- **Accessibilité** : Conforme WCAG 2.1 AA
- **Icons** : Lucide React (cohérent et moderne)
- **Animations** : Transitions fluides avec Tailwind
- **Glassmorphism** : Effets de verre avec backdrop blur
- **Gradients** : Système de gradients avec variables CSS

---

## 🏗️ Architecture technique

### Structure du projet

```
/
├── app/                         # App Router Next.js 14
│   ├── globals.css             # Styles globaux + shadcn/ui
│   ├── layout.tsx              # Layout avec SEO et Analytics
│   ├── page.tsx                # Page principale (scatter plot)
│   ├── comparer/               # Page de comparaison
│   │   └── page.tsx
│   ├── prenom/                 # Pages individuelles
│   │   └── [name]/
│   │       ├── page.tsx
│   │       └── not-found.tsx
│   ├── sitemap.ts              # Génération sitemap.xml
│   ├── robots.ts               # Génération robots.txt
│   ├── manifest.ts             # Manifest PWA
│   ├── icon.tsx                # Favicon dynamique
│   └── apple-icon.tsx          # Icône Apple Touch
├── components/
│   ├── ui/                     # Composants shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── command.tsx
│   │   ├── dialog.tsx
│   │   ├── label.tsx
│   │   ├── radio-group.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── tooltip.tsx
│   │   └── TooltipPortal.tsx
│   ├── SearchBar.tsx           # Barre de recherche avancée
│   ├── ScatterPlot.tsx         # Graphique SVG custom (755 lignes)
│   ├── MentionSelector.tsx     # Sélecteur de mentions
│   ├── ResultsPanel.tsx        # Panneau de résultats
│   ├── ComparativeAnalysis.tsx # Composant de comparaison
│   ├── HeroSection.tsx         # Section hero
│   ├── InstructionsSection.tsx # Instructions d'utilisation
│   ├── AppFooter.tsx           # Footer
│   ├── LoadingStates.tsx       # États de chargement
│   ├── StructuredData.tsx      # Données structurées SEO
│   └── Analytics.tsx           # Google Analytics
├── lib/
│   ├── utils.ts                # Utilitaires shadcn/ui
│   ├── data.ts                 # Traitement des données CSV
│   ├── similarity.ts           # Algorithmes de similarité
│   ├── constants.ts            # Constantes de l'app
│   ├── accessibility.ts        # Fonctions d'accessibilité
│   └── performance.ts          # Optimisations performance + OptimizedSearch
├── hooks/
│   ├── useChartConfig.ts       # Configuration du chart
│   ├── useDataset.ts           # Chargement des données
│   └── usePrenomData.ts        # Données d'un prénom
├── utils/
│   ├── colors.ts               # Utilitaires de couleurs
│   └── scoring.ts              # Calcul des scores
├── contexts/
│   └── AppContext.tsx          # Context global de l'app
├── types/
│   └── index.ts                # Types TypeScript
├── public/
│   └── data/
│       └── dataset.json        # Données JSON optimisées
├── scripts/
│   └── convert-csv.js          # Script de conversion CSV → JSON
└── config files                # Next.js, Tailwind, ESLint, etc.
```

### Types de données TypeScript

```typescript
interface PrenomData {
  firstname: string;
  count: number;
  taux_sm: number; // Sans mention
  taux_ab: number; // Assez bien
  taux_b: number; // Bien
  taux_tb: number; // Très bien
  taux_fel: number; // Félicitations
}

interface MentionKey {
  key: keyof Pick<
    PrenomData,
    "taux_sm" | "taux_ab" | "taux_b" | "taux_tb" | "taux_fel"
  >;
  label: string;
  color: string;
  shortLabel: string;
}

interface SimilarityResult {
  prenom: string;
  distance: number;
  similarity: number;
}

interface DatasetMeta {
  totalEntries: number;
  filteredEntries: number;
  processingDate: string;
  threshold: number;
}

interface ScoreResult {
  score: number;
  category: string;
  color: string;
}
```

### Gestion des données (Static Generation)

- **Source** : Fichier CSV statique de 26 563 lignes
- **Build-time processing** : Conversion CSV → JSON optimisé lors du build
- **Filtrage statique** :
  - Prénoms avec count > 10 pré-filtrés pour le JSON
  - Prénoms avec count > 100 affichés dans le scatter plot
- **Preprocessing** : Métadonnées et statistiques précalculées
- **Performance** : Données chargées côté client avec optimisations
- **Caching** :
  - Headers de cache agressifs pour les assets statiques
  - Performance cache avec TTL pour calculs coûteux
- **No Database** : Architecture entièrement statique pour Vercel
- **Static Generation** : Top 100 prénoms pré-générés au build

---

## 🚀 SEO et Performance

### Optimisations SEO implémentées

- ✅ **Métadonnées complètes** : Title, description, keywords optimisés pour l'éducation
- ✅ **OpenGraph & Twitter Cards** : Partage social optimisé avec images personnalisées
- ✅ **Sitemap XML automatique** : Génération dynamique via `app/sitemap.ts`
- ✅ **Robots.txt optimisé** : Directives pour crawlers avec exclusions appropriées
- ✅ **Données structurées JSON-LD** : Schema.org complet (WebSite, Dataset, WebApplication, FAQ)
- ✅ **URL canoniques** : Éviter le contenu dupliqué
- ✅ **PWA Manifest** : Application web progressive via `app/manifest.ts`
- ✅ **Favicon dynamique** : Icônes générées automatiquement avec Next.js
- ✅ **Pages statiques** : Top 100 prénoms pré-générés pour SEO optimal

### Optimisations Performance

- ✅ **Build-time data processing** : CSV → JSON lors du build Vercel
- ✅ **Edge Runtime** : Temps de réponse optimaux
- ✅ **Headers de cache** : Cache agressif pour assets statiques (1 an)
- ✅ **Lazy loading** : Chargement différé des composants non critiques
- ✅ **Tree shaking** : Bundle optimisé avec Next.js 14
- ✅ **Image optimization** : Support WebP et AVIF natif
- ✅ **Code splitting** : Chunks optimisés par route
- ✅ **Memoïsation** : React.memo et useMemo pour éviter re-renders
- ✅ **Performance cache** : Cache intelligent avec TTL pour calculs coûteux
- ✅ **Indexed search** : Recherche optimisée avec indexation par préfixes
- ✅ **Throttling** : Limitation à 60fps pour interactions hover
- ✅ **Debouncing** : 300ms pour recherche et inputs

### Algorithmes d'optimisation

#### Anti-collision pour labels (ScatterPlot)
- Détection des chevauchements entre labels
- Repositionnement intelligent avec 8 positions possibles
- Early exit pour limiter les calculs
- Memoïsation des résultats

#### Indexed Search (OptimizedSearch)
- Indexation par première lettre (26 index)
- Indexation par deux premières lettres (676 index)
- Normalisation des chaînes (accents, casse)
- Recherche O(1) dans l'index approprié
- Tri par pertinence et count

#### Performance Cache
- Classe singleton avec Map interne
- Système de TTL configurable
- Gestion automatique de l'expiration
- Utilisation pour scales, ticks, calculs coûteux

### Métriques de performance atteintes

- **🚀 Lighthouse Performance** : >95/100
- **♿ Accessibilité** : 100/100 (WCAG 2.1 AA)
- **🔍 SEO** : 100/100
- **⚡ Time to First Byte** : <200ms
- **📱 Mobile Performance** : >90/100
- **🎯 Core Web Vitals** : Toutes métriques dans le vert

---

## 📈 Analytics et Tracking

### Événements trackés

```javascript
// Recherche de prénoms
trackSearch(prenom: string)

// Interactions graphique
trackChartClick(prenom: string, mention: string)

// Changements de filtres
trackMentionChange(mention: string)

// Navigation vers pages individuelles
trackPrenomPageView(prenom: string)

// Utilisation de la comparaison
trackComparison(prenoms: string[])

// Temps passé sur le site (automatique au départ)
// Engagements avec les prénoms similaires
```

### Configuration Analytics

Variables d'environnement requises pour Google Analytics 4 :

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://mentionbrevet.com
NEXT_PUBLIC_GOOGLE_VERIFICATION=verification-code
NEXT_PUBLIC_BING_VERIFICATION=msvalidate-code
```

### Hooks d'analytics disponibles

```typescript
const { trackSearch, trackChartClick, trackMentionChange } = useAnalytics();

// Usage dans les composants
trackSearch("Marie");
trackChartClick("Marie", "taux_tb");
trackMentionChange("taux_ab");
```

---

## ♿ Accessibilité

### Fonctionnalités d'accessibilité implémentées

#### Raccourcis clavier

- **`F`** : Focus sur la barre de recherche
- **`Esc`** : Effacer la sélection actuelle
- **`1-5`** : Sélectionner types de mentions (SM, AB, B, TB, FEL)
- **`Tab`** : Navigation séquentielle entre éléments
- **`Space/Enter`** : Activation des boutons et liens

#### Support lecteurs d'écran

- **Annonces vocales** : Actions importantes annoncées automatiquement
- **Labels ARIA** : Tous les éléments interactifs labellisés
- **Rôles sémantiques** : Structure HTML sémantique respectée
- **Contraste couleurs** : Ratio minimum 4.5:1 respecté
- **Focus visible** : Indicateurs de focus clairement visibles

#### Navigation accessible

- **Ordre logique** : Tabulation suit l'ordre visuel
- **Skip links** : Liens pour aller au contenu principal
- **Landmarks** : Régions de page clairement définies
- **Responsive** : Zoom jusqu'à 200% sans perte de fonctionnalité
- **Reduced motion** : Support de prefers-reduced-motion

### Utilitaires d'accessibilité

```typescript
// lib/accessibility.ts exports
useKeyboardShortcuts(); // Gestion des raccourcis
useAccessibilityPreferences(); // Préférences utilisateur
getAccessibilityClasses(); // Classes CSS d'accessibilité
accessibilityUtils.announceToScreenReader(); // Annonces vocales
```

---

## 🔧 Configuration

### Variables d'environnement

```env
# Production
NEXT_PUBLIC_SITE_URL=https://mentionbrevet.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_VERIFICATION=verification-code
NEXT_PUBLIC_BING_VERIFICATION=msvalidate-code

# Développement
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

### Constantes configurables

Dans `lib/constants.ts` - personnalisables selon les besoins :

```typescript
export const DEFAULT_CONFIG = {
  DEFAULT_MENTION: "taux_tb" as MentionKey,
  MIN_COUNT_THRESHOLD: 100, // Pour affichage graphique
  MIN_COUNT_THRESHOLD_SEARCH: 10, // Pour recherche
  CHART_POINT_SIZE: 3,
  SIMILARITY_LIMIT: 10,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  MAX_COMPARISON_ITEMS: 5,
};

export const UI_MESSAGES = {
  SEARCH_PLACEHOLDER: "Rechercher un prénom...",
  NO_RESULTS: "Aucun prénom trouvé",
  ERROR_LOADING_DATA: "Erreur lors du chargement des données",
  MIN_COUNT_INFO: `Seuls les prénoms avec plus de ${DEFAULT_CONFIG.MIN_COUNT_THRESHOLD} candidats sont affichés`,
};

export const MENTIONS: Record<MentionKey, MentionConfig> = {
  taux_sm: { label: "Sans mention", color: "#ef4444", shortLabel: "SM" },
  taux_ab: { label: "Assez bien", color: "#f97316", shortLabel: "AB" },
  taux_b: { label: "Bien", color: "#eab308", shortLabel: "B" },
  taux_tb: { label: "Très bien", color: "#22c55e", shortLabel: "TB" },
  taux_fel: { label: "Félicitations", color: "#3b82f6", shortLabel: "FEL" },
};

export const SCORING_CONFIG = {
  WEIGHTS: {
    taux_sm: 0,
    taux_ab: 4,
    taux_b: 6,
    taux_tb: 8,
    taux_fel: 10,
  },
  CATEGORIES: [
    { min: 0, max: 4, label: "Faible", color: "#ef4444" },
    { min: 4, max: 6, label: "Moyen", color: "#f97316" },
    { min: 6, max: 7.5, label: "Bon", color: "#eab308" },
    { min: 7.5, max: 9, label: "Très bon", color: "#22c55e" },
    { min: 9, max: 10, label: "Excellent", color: "#3b82f6" },
  ],
};
```

### Configuration du script de conversion

Dans `scripts/convert-csv.js` :

```javascript
const MIN_COUNT_THRESHOLD = 10; // Seuil minimum pour inclusion dans le JSON
```

---

## 🚀 Déploiement

### Vercel (Configuration optimale)

```bash
# 1. Connecter le repository à Vercel
# 2. Configurer les variables d'environnement
# 3. Le déploiement est automatique à chaque push

# Variables Vercel requises :
NEXT_PUBLIC_SITE_URL=https://mentionbrevet.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Build local

```bash
npm run build    # Conversion CSV + build Next.js optimisé
npm run start    # Serveur de production local
```

### Configuration Vercel (`vercel.json`)

```json
{
  "framework": "nextjs",
  "headers": [
    {
      "source": "/data/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/prenoms-brevet",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

---

## 🐛 Dépannage

### Problèmes courants et solutions

#### ❌ Erreur "Fichier CSV non trouvé"

```bash
# Vérifier la présence du dataset
ls -la dataset.csv
# Lancer la conversion manuellement
npm run convert-data
```

#### ❌ Erreurs TypeScript

```bash
# Réinstaller les dépendances
npm install
# Vérifier les types
npm run type-check
```

#### ❌ Build Vercel qui échoue

```bash
# Vérifier la génération du JSON
ls -la public/data/dataset.json
# Forcer la régénération
node scripts/convert-csv.js
```

#### ❌ Analytics ne fonctionne pas

```bash
# Vérifier les variables d'environnement
echo $NEXT_PUBLIC_GA_ID
# Vérifier dans la console navigateur
```

#### ❌ Performance dégradée

```bash
# Analyser le bundle
npm run build -- --analyze
# Vérifier les Core Web Vitals dans DevTools
```

#### ❌ Scatter plot ne s'affiche pas

```bash
# Vérifier que le seuil de 100 est respecté
# Vérifier la console pour erreurs JavaScript
# Vérifier que le dataset.json est bien chargé
```

---

## 📊 Monitoring et métriques

### Outils de monitoring

- **Google Analytics 4** : Comportement utilisateur et conversions
- **Search Console** : Performance SEO et indexation
- **Vercel Analytics** : Métriques techniques et vitals
- **Core Web Vitals** : Expérience utilisateur mesurée

#### Utilisateur

- **Taux de recherche** : % d'utilisateurs utilisant la recherche
- **Engagement graphique** : Clics sur les points du scatter plot
- **Utilisation comparaison** : % d'utilisateurs allant sur /comparer
- **Pages vues individuelles** : Consultation des pages /prenom/[name]
- **Temps de session** : Durée moyenne passée sur le site
- **Taux de rebond** : % d'utilisateurs partant immédiatement

---

## 🤝 Contribution

### Guide de contribution

1. **Fork** le projet depuis GitHub
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request avec description détaillée

### Standards de code

- **TypeScript** : 100% typé, aucun `any` toléré
- **ESLint** : Configuration Next.js + règles personnalisées
- **Prettier** : Formatage automatique du code
- **Tests** : Coverage minimum 80% pour les nouvelles features (à implémenter)
- **Accessibilité** : Conformité WCAG 2.1 AA obligatoire
- **Performance** : Lighthouse score > 90 requis

### Structure des commits

```
type(scope): description

feat(search): add indexed search with prefix optimization
fix(chart): resolve tooltip positioning issue
docs(readme): update installation instructions
style(ui): improve button hover states
perf(scatter): optimize anti-collision algorithm
```

### Roadmap et améliorations futures

- [ ] Ajouter de nouvelles années
- [ ] Filtres avancés

---

## 📞 Support et documentation

### Ressources

- **Site web** : [mentionbrevet.com](https://mentionbrevet.com)
- **Repository GitHub** : [github.com/Aurealibe/mentionbrevet.com](https://github.com/Aurealibe/mentionbrevet.com)
- **Issues** : [GitHub Issues](https://github.com/Aurealibe/mentionbrevet.com/issues)
- **Documentation** : Ce README complet

### Contact

- **Développeur principal** : [@Aurealibe](https://github.com/Aurealibe)
- **Twitter** : [@AureaLibe](https://x.com/AureaLibe)

### Données

- **Source des données** : [@dr_cartologue](https://x.com/dr_cartologue)
- **Année** : Brevet des collèges 2025
- **Licence** : [Licence Ouverte Etalab](https://www.etalab.gouv.fr/licence-ouverte-open-licence)

---

## 📄 Licence

**MIT License** - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

Le projet est open source et les contributions sont encouragées selon les termes de la licence MIT.

---

## 🎯 Points clés pour contributeurs

### Ce qui fait la qualité de ce projet

1. **Performance** : Optimisations poussées (memoïsation, indexation, throttling)
2. **Type Safety** : TypeScript strict sans compromis
3. **Accessibilité** : WCAG 2.1 AA complet avec raccourcis clavier
4. **Architecture** : Clean, modulaire, maintenable
5. **SEO** : Optimisé pour les moteurs de recherche
6. **UX** : Interactions fluides et intuitives
7. **Documentation** : Code commenté et README exhaustif

### Technologies et patterns utilisés

- **Framework** : Next.js 14 App Router
- **État** : React hooks + Context API
- **Styling** : Tailwind CSS + shadcn/ui
- **Visualisation** : SVG custom + Recharts
- **Recherche** : Algorithme custom avec indexation
- **Performance** : Cache, memoïsation, lazy loading
- **SEO** : Static generation, metadata, structured data
- **Analytics** : Google Analytics 4
- **Déploiement** : Vercel Edge Runtime

### Principes de développement

- **DRY** : Don't Repeat Yourself
- **KISS** : Keep It Simple, Stupid
- **SOLID** : Principes de conception objet
- **Accessibility First** : Accessible par défaut
- **Performance First** : Optimisé dès la conception
- **Type Safety** : Typage strict sans exceptions

---

**Version** : 1.0.0 - Production Ready ✅
**Dernière mise à jour** : Novembre 2025
**Status** : 🟢 Déployé et opérationnel sur [mentionbrevet.com](https://mentionbrevet.com)

---

## 📝 Changelog

### Version 1.0.0 (Novembre 2025)

#### ✨ Nouvelles fonctionnalités
- Ajout de la page de comparaison multi-prénoms (`/comparer`)
- Ajout des pages individuelles par prénom (`/prenom/[name]`)
- Système de scoring avec moyennes pondérées
- Génération statique des top 100 prénoms

#### 🔧 Améliorations
- Remplacement de Chart.js par implémentation SVG custom
- Remplacement de Fuse.js par OptimizedSearch custom avec indexation
- Ajout de l'algorithme anti-collision pour labels
- Amélioration des performances avec memoïsation et throttling
- Ajout de contrôles de zoom (boutons + molette)
- Ajout de fonctionnalité pan (glisser-déposer)

#### 🏗️ Architecture
- Ajout du directory `hooks/` avec custom hooks
- Ajout du directory `utils/` avec utilitaires
- Ajout du directory `contexts/` avec AppContext
- Amélioration de la structure des composants

#### 📚 Documentation
- README complet et à jour avec toutes les fonctionnalités
- Documentation détaillée de l'architecture
- Ajout de guides de contribution
- Documentation des algorithmes d'optimisation

### Version 1.0.0 (Novembre 2025)
- Release initiale avec scatter plot interactif
- Barre de recherche
- Sélecteur de mentions
- Prénoms similaires
- SEO optimisé
