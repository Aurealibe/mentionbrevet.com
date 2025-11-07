import { MentionType, MentionKey } from "@/types";

// Configuration des mentions
export const MENTIONS: Record<MentionKey, MentionType> = {
  taux_sm: {
    key: "taux_sm",
    label: "Sans mention",
    shortLabel: "SM",
    color: "#ef4444", // red-500
  },
  taux_ab: {
    key: "taux_ab",
    label: "Assez bien",
    shortLabel: "AB",
    color: "#f97316", // orange-500
  },
  taux_b: {
    key: "taux_b",
    label: "Bien",
    shortLabel: "B",
    color: "#eab308", // yellow-500
  },
  taux_tb: {
    key: "taux_tb",
    label: "Très bien",
    shortLabel: "TB",
    color: "#22c55e", // green-500
  },
  taux_fel: {
    key: "taux_fel",
    label: "Très bien avec félicitations",
    shortLabel: "TB+",
    color: "#3b82f6", // blue-500
  },
};

// Liste ordonnée des mentions (de la moins bonne à la meilleure)
export const MENTION_ORDER: MentionKey[] = [
  "taux_sm",
  "taux_ab",
  "taux_b",
  "taux_tb",
  "taux_fel",
];

// Configuration par défaut
export const DEFAULT_CONFIG = {
  // Seuil minimum d'occurrences pour afficher un prénom dans le graphique
  MIN_COUNT_THRESHOLD: 100,

  // Seuil minimum d'occurrences pour afficher un prénom dans la barre de recherche
  MIN_COUNT_THRESHOLD_SEARCH: 10,

  // Mention sélectionnée par défaut
  DEFAULT_MENTION: "taux_fel" as MentionKey,

  // Nombre maximum de prénoms similaires à afficher
  MAX_SIMILAR_PRENOMS: 15,

  // Seuil de similarité (distance euclidienne)
  SIMILARITY_THRESHOLD: 0.3,

  // Configuration du graphique
  CHART_CONFIG: {
    USE_LOG_SCALE: true,
    SHOW_LABELS_THRESHOLD: 50, // Nombre max de points avant de cacher les labels
    POINT_RADIUS: 4,
    HOVER_RADIUS: 6,
  },

  // Délai de debounce pour la recherche (ms)
  SEARCH_DEBOUNCE_DELAY: 300,

  // Nombre maximum de résultats de recherche
  MAX_SEARCH_RESULTS: 10,
};

// Couleurs pour le thème
export const CHART_COLORS = {
  POINT_DEFAULT: "#64748b", // slate-500
  POINT_HIGHLIGHTED: "#0f172a", // slate-900
  POINT_SELECTED: "#dc2626", // red-600
  GRID_LINES: "#e2e8f0", // slate-200
  AXIS_LABELS: "#475569", // slate-600
};

// Messages d'aide et d'information
export const UI_MESSAGES = {
  LOADING: "Chargement des données...",
  NO_RESULTS: "Aucun résultat trouvé",
  SEARCH_PLACEHOLDER: "Rechercher un prénom...",
  ERROR_LOADING_DATA: "Erreur lors du chargement des données",
  MIN_COUNT_INFO: `Seuls les prénoms avec plus de ${DEFAULT_CONFIG.MIN_COUNT_THRESHOLD} occurrences sont affichés`,
};

// Configuration des axes du graphique
export const AXIS_CONFIG = {
  X_AXIS: {
    LABEL: "Taux de mentions (%)",
    MIN: 0,
    MAX: 100,
    STEP: 10,
  },
  Y_AXIS: {
    LABEL: "Nombre d'occurrences",
    LOG_BASE: 10,
    MIN_LOG: 1,
    MAX_LOG: 10000,
  },
};

// Format d'affichage des statistiques
export const STATS_TEMPLATE = {
  TITLE: "Le prénom {firstname} et la mention au brevet.",
  CONTENT: `{count} {firstname} ont passé le brevet en 2025. {sm}% ont eu sans mention, {ab}% ont eu mention AB, {b}% ont obtenu la mention B, {tb}% ont eu mention TB, et {fel}% ont eu TB avec félicitations.`,
};
