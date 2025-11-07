// Types principaux pour les données du brevet
export interface PrenomData {
  firstname: string;
  count: number;
  taux_sm: number; // Sans mention
  taux_ab: number; // Assez bien
  taux_b: number; // Bien
  taux_tb: number; // Très bien
  taux_fel: number; // Félicitations
}

// Types pour les mentions
export type MentionKey =
  | "taux_sm"
  | "taux_ab"
  | "taux_b"
  | "taux_tb"
  | "taux_fel";

export interface MentionType {
  key: MentionKey;
  label: string;
  color: string;
  shortLabel: string;
}

// Type pour les résultats de similarité
export interface SimilarityResult {
  prenom: string;
  distance: number;
}

// Type pour les statistiques détaillées d'un prénom
export interface PrenomStats {
  firstname: string;
  count: number;
  taux_sm: number;
  taux_ab: number;
  taux_b: number;
  taux_tb: number;
  taux_fel: number;
  similarPrenoms: string[];
}

// Type pour les données du graphique
export interface ChartDataPoint {
  x: number; // Taux de la mention sélectionnée
  y: number; // Nombre d'occurrences (count)
  firstname: string;
}

// Type pour la configuration du graphique
export interface ChartConfig {
  selectedMention: MentionKey;
  showLabels: boolean;
  useLogScale: boolean;
}

// Type pour les filtres
export interface FilterConfig {
  minCount: number;
  maxCount?: number;
  selectedMention: MentionKey;
}

// Type pour les résultats de recherche
export interface SearchResult {
  prenom: PrenomData;
  score: number;
}
