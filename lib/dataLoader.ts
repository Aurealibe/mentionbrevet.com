import { PrenomData } from "@/types";

interface DatasetFile {
  metadata: {
    generatedAt: string;
    totalRecords: number;
    filteredRecords: number;
    minCountThreshold: number;
    version: string;
  };
  data: PrenomData[];
}

/**
 * Singleton class for efficient data loading and caching
 */
class DataLoader {
  private static instance: DataLoader;
  private rawData: PrenomData[] | null = null;
  private loadPromise: Promise<PrenomData[]> | null = null;

  private constructor() {}

  static getInstance(): DataLoader {
    if (!DataLoader.instance) {
      DataLoader.instance = new DataLoader();
    }
    return DataLoader.instance;
  }

  /**
   * Load raw data once and cache it
   */
  async loadRawData(): Promise<PrenomData[]> {
    // Return cached data if available
    if (this.rawData) {
      return this.rawData;
    }

    // Return existing promise if loading is in progress
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Start new loading process
    this.loadPromise = this.loadDataFromFile();

    try {
      this.rawData = await this.loadPromise;
      return this.rawData;
    } finally {
      this.loadPromise = null;
    }
  }

  private async loadDataFromFile(): Promise<PrenomData[]> {
    try {
      let dataset: DatasetFile;

      if (typeof window === 'undefined') {
        // Server/build environment - Import JSON directly
        dataset = (await import('../public/data/dataset.json')).default as DatasetFile;
      } else {
        // Client environment
        const response = await fetch("/data/dataset.json", {
          headers: {
            'Cache-Control': 'max-age=31536000, immutable'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        dataset = await response.json();
      }

      // Validate data structure
      if (!dataset.data || !Array.isArray(dataset.data)) {
        throw new Error("Invalid dataset format: missing data array");
      }

      // Validate each item
      const validData = dataset.data.filter((item) => {
        return (
          item.firstname &&
          typeof item.count === "number" &&
          item.count >= 0 &&
          typeof item.taux_sm === "number" &&
          typeof item.taux_ab === "number" &&
          typeof item.taux_b === "number" &&
          typeof item.taux_tb === "number" &&
          typeof item.taux_fel === "number"
        );
      });

      console.log(`✅ Loaded ${validData.length} valid prenoms from dataset`);
      return validData;
    } catch (error) {
      console.error("❌ Error loading data:", error);
      throw new Error("Failed to load prenom data");
    }
  }

  /**
   * Clear cached data (useful for testing or data updates)
   */
  clearCache(): void {
    this.rawData = null;
    this.loadPromise = null;
  }
}

// Export singleton instance
export const dataLoader = DataLoader.getInstance();