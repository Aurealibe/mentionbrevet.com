import { PrenomData, ChartDataPoint, MentionKey } from "@/types";
import { DEFAULT_CONFIG } from "./constants";
import { dataLoader } from "./dataLoader";

// Separate caches for filtered data
let cachedChartData: PrenomData[] | null = null;
let cachedSearchData: PrenomData[] | null = null;

/**
 * Alias pour loadAllPrenomData - for backward compatibility
 */
export async function loadData(): Promise<PrenomData[]> {
  return loadAllPrenomData();
}

/**
 * Load all data for search (28+ occurrences)
 */
export async function loadAllPrenomData(): Promise<PrenomData[]> {
  if (cachedSearchData) {
    return cachedSearchData;
  }

  try {
    // Use singleton to load raw data once
    const rawData = await dataLoader.loadRawData();

    // Filter for search threshold (28+)
    const validData = rawData.filter((item) =>
      item.count >= DEFAULT_CONFIG.MIN_COUNT_THRESHOLD_SEARCH
    );

    cachedSearchData = validData;
    console.log(`✅ Filtered ${validData.length} prenoms for search (28+)`);

    return validData;
  } catch (error) {
    console.error("❌ Error loading search data:", error);
    throw new Error("Failed to load prenom search data");
  }
}

/**
 * Load data for chart visualization (100+ occurrences)
 */
export async function loadPrenomData(): Promise<PrenomData[]> {
  if (cachedChartData) {
    return cachedChartData;
  }

  try {
    // Use singleton to load raw data once
    const rawData = await dataLoader.loadRawData();

    // Filter for chart threshold (100+)
    const validData = rawData.filter((item) =>
      item.count >= DEFAULT_CONFIG.MIN_COUNT_THRESHOLD
    );

    cachedChartData = validData;
    console.log(`✅ Filtered ${validData.length} prenoms for chart (100+)`);

    return validData;
  } catch (error) {
    console.error("❌ Error loading chart data:", error);
    throw new Error("Failed to load prenom data");
  }
}

/**
 * Convertir les données en points pour le graphique
 */
export function dataToChartPoints(
  data: PrenomData[],
  selectedMention: MentionKey
): ChartDataPoint[] {
  return data.map((item) => ({
    x: item[selectedMention] * 100, // Convertir en pourcentage
    y: item.count,
    firstname: item.firstname,
  }));
}

/**
 * Obtenir les statistiques globales des données
 */
export function getDataStats(data: PrenomData[]) {
  if (data.length === 0) {
    return {
      totalPrenoms: 0,
      totalCandidats: 0,
      avgCount: 0,
      minCount: 0,
      maxCount: 0,
      avgTauxTB: 0,
    };
  }

  const totalCandidats = data.reduce((sum, item) => sum + item.count, 0);
  const avgCount = totalCandidats / data.length;
  const minCount = Math.min(...data.map((item) => item.count));
  const maxCount = Math.max(...data.map((item) => item.count));
  const avgTauxTB =
    data.reduce((sum, item) => sum + item.taux_tb, 0) / data.length;

  return {
    totalPrenoms: data.length,
    totalCandidats,
    avgCount: Math.round(avgCount),
    minCount,
    maxCount,
    avgTauxTB: Math.round(avgTauxTB * 100),
  };
}

/**
 * Rechercher un prénom par nom exact
 */
export function findPrenomByName(
  data: PrenomData[],
  firstname: string
): PrenomData | null {
  const normalizedSearch = firstname.toLowerCase().trim();
  return (
    data.find((item) => item.firstname.toLowerCase() === normalizedSearch) ||
    null
  );
}

/**
 * Obtenir les prénoms les plus représentés
 */
export function getTopPrenoms(
  data: PrenomData[],
  limit: number = 10
): PrenomData[] {
  return [...data].sort((a, b) => b.count - a.count).slice(0, limit);
}

/**
 * Obtenir les prénoms avec le meilleur taux de mention TB
 */
export function getTopMentionTB(
  data: PrenomData[],
  limit: number = 10
): PrenomData[] {
  return [...data].sort((a, b) => b.taux_tb - a.taux_tb).slice(0, limit);
}

/**
 * Filtrer les données selon différents critères
 */
export function filterData(
  data: PrenomData[],
  filters: {
    minCount?: number;
    maxCount?: number;
    minTauxTB?: number;
    maxTauxTB?: number;
    searchTerm?: string;
  }
): PrenomData[] {
  return data.filter((item) => {
    // Filtre par count
    if (filters.minCount && item.count < filters.minCount) return false;
    if (filters.maxCount && item.count > filters.maxCount) return false;

    // Filtre par taux TB
    if (filters.minTauxTB && item.taux_tb < filters.minTauxTB) return false;
    if (filters.maxTauxTB && item.taux_tb > filters.maxTauxTB) return false;

    // Filtre par terme de recherche
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      if (!item.firstname.toLowerCase().includes(searchLower)) return false;
    }

    return true;
  });
}
