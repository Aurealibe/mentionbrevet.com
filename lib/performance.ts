import { PrenomData, MentionKey } from "@/types";

// Cache pour les calculs coûteux
const performanceCache = new Map<string, unknown>();

/**
 * Cache générique pour les résultats de fonctions
 */
export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyGenerator?: (...args: TArgs) => string
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>();

  return (...args: TArgs): TReturn => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);

    // Limiter la taille du cache pour éviter les fuites mémoire
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    return result;
  };
}

/**
 * Debounce optimisé avec annulation
 */
export function debounceWithCancel<TArgs extends unknown[]>(
  func: (...args: TArgs) => void,
  delay: number
): ((...args: TArgs) => void) & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | null = null;

  const debouncedFunc = ((...args: TArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  }) as ((...args: TArgs) => void) & { cancel: () => void };

  debouncedFunc.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFunc;
}

/**
 * Throttle pour limiter les appels fréquents
 */
export function throttle<TArgs extends unknown[], TReturn>(
  func: (...args: TArgs) => TReturn,
  delay: number
): (...args: TArgs) => TReturn | undefined {
  let lastCall = 0;

  return (...args: TArgs): TReturn | undefined => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
    return undefined;
  };
}

/**
 * Calcul des échelles optimisé avec cache
 */
export const calculateScales = memoize(
  (
    chartPoints: Array<{ x: number; y: number }>,
    plotWidth: number,
    plotHeight: number
  ) => {
    const xValues = chartPoints.map((p) => p.x);
    const yValues = chartPoints.map((p) => p.y);

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const xRange = xMax - xMin;

    // Calculer le padding en fonction de la plage, avec un minimum absolu
    const xPadding = Math.max(xRange * 0.05, 1); // Au moins 1% de padding

    // Forcer une marge à gauche, même si xMin est 0
    const xAdjustedMin = Math.max(-1, xMin - xPadding); // Permet de descendre jusqu'à -1%
    const xAdjustedMax = Math.min(100, xMax + xPadding);

    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const yMinLog = Math.log10(Math.max(yMin * 0.9, 1));
    const yMaxLog = Math.log10(yMax * 1.1);

    return {
      xScale: (value: number) =>
        ((value - xAdjustedMin) / (xAdjustedMax - xAdjustedMin)) * plotWidth,
      yScale: (value: number) => {
        const logValue = Math.log10(Math.max(value, 1));
        const normalized = (logValue - yMinLog) / (yMaxLog - yMinLog);
        return plotHeight - normalized * plotHeight;
      },
      bounds: { xMin: xAdjustedMin, xMax: xAdjustedMax, yMin, yMax },
    };
  },
  (chartPoints, plotWidth, plotHeight) =>
    `scales-${chartPoints.length}-${plotWidth}-${plotHeight}-${
      chartPoints[0]?.x
    }-${chartPoints[chartPoints.length - 1]?.x}`
);

/**
 * Calcul des ticks optimisé avec cache
 */
export const calculateTicks = memoize(
  (bounds: { xMin: number; xMax: number; yMin: number; yMax: number }) => {
    // Ticks X avec intervalles réguliers de 5%
    const xTicks = [];

    // Commencer par le multiple de 5 le plus proche inférieur à xMin
    const startTick = Math.floor(bounds.xMin / 5) * 5;

    // Générer les ticks par intervalles de 5%
    for (let tick = startTick; tick <= bounds.xMax + 5; tick += 5) {
      if (tick >= bounds.xMin - 2 && tick <= bounds.xMax + 2) {
        xTicks.push(tick);
      }
    }

    // Ticks Y (inchangé)
    const yTicks = [];
    let current = Math.pow(10, Math.floor(Math.log10(bounds.yMin)));

    while (current <= bounds.yMax * 1.5) {
      if (current >= bounds.yMin * 0.8) {
        yTicks.push(current);
      }
      current *= current < 1000 ? 2 : 2.5;
      if (yTicks.length > 8) break;
    }

    return { xTicks, yTicks };
  },
  (bounds) =>
    `ticks-${bounds.xMin}-${bounds.xMax}-${bounds.yMin}-${bounds.yMax}`
);

/**
 * Algorithme anti-collision optimisé avec early exit
 */
export function optimizedAntiCollision(
  points: Array<{ adjustedX: number; adjustedY: number }>,
  options: {
    minDistance?: number;
    maxIterations?: number;
    repulsionForce?: number;
    plotWidth: number;
    plotHeight: number;
  }
): Array<{ adjustedX: number; adjustedY: number }> {
  const {
    minDistance = 18,
    maxIterations = 100,
    repulsionForce = 0.6,
    plotWidth,
    plotHeight,
  } = options;

  // Copie des points pour éviter les mutations
  const workingPoints = points.map((p) => ({ ...p }));

  // Fonction de distance optimisée
  const distance = (
    p1: (typeof workingPoints)[0],
    p2: (typeof workingPoints)[0]
  ) => {
    const dx = p1.adjustedX - p2.adjustedX;
    const dy = p1.adjustedY - p2.adjustedY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Early exit si peu de points
  if (workingPoints.length < 10) {
    return workingPoints;
  }

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let moved = false;
    let totalMovement = 0;

    for (let i = 0; i < workingPoints.length; i++) {
      let totalForceX = 0;
      let totalForceY = 0;

      // Optimisation : ne vérifier que les points proches
      for (let j = 0; j < workingPoints.length; j++) {
        if (i === j) continue;

        const dist = distance(workingPoints[i], workingPoints[j]);
        if (dist < minDistance && dist > 0) {
          const angle = Math.atan2(
            workingPoints[i].adjustedY - workingPoints[j].adjustedY,
            workingPoints[i].adjustedX - workingPoints[j].adjustedX
          );

          const force = (minDistance - dist) * repulsionForce;
          totalForceX += Math.cos(angle) * force;
          totalForceY += Math.sin(angle) * force;
        }
      }

      const movement = Math.sqrt(
        totalForceX * totalForceX + totalForceY * totalForceY
      );
      if (movement > 0.05) {
        workingPoints[i].adjustedX += totalForceX;
        workingPoints[i].adjustedY += totalForceY;

        // Contraindre dans les limites
        workingPoints[i].adjustedX = Math.max(
          20,
          Math.min(plotWidth - 20, workingPoints[i].adjustedX)
        );
        workingPoints[i].adjustedY = Math.max(
          10,
          Math.min(plotHeight - 10, workingPoints[i].adjustedY)
        );

        moved = true;
        totalMovement += movement;
      }
    }

    // Early exit si convergence
    if (!moved || totalMovement < 1.0) {
      console.log(`Anti-collision converged after ${iteration + 1} iterations`);
      break;
    }
  }

  return workingPoints;
}

/**
 * Recherche optimisée avec index
 */
export class OptimizedSearch {
  private searchIndex: Map<string, PrenomData[]> = new Map();
  private data: PrenomData[] = [];

  constructor(data: PrenomData[]) {
    this.data = data;
    this.buildSearchIndex();
  }

  private buildSearchIndex() {
    this.searchIndex.clear();

    // Créer un index pour les premières lettres
    for (const item of this.data) {
      const normalized = this.normalizeString(item.firstname);

      // Index par première lettre
      const firstLetter = normalized[0];
      if (!this.searchIndex.has(firstLetter)) {
        this.searchIndex.set(firstLetter, []);
      }
      this.searchIndex.get(firstLetter)!.push(item);

      // Index par les 2 premières lettres
      if (normalized.length >= 2) {
        const firstTwoLetters = normalized.substring(0, 2);
        if (!this.searchIndex.has(firstTwoLetters)) {
          this.searchIndex.set(firstTwoLetters, []);
        }
        this.searchIndex.get(firstTwoLetters)!.push(item);
      }
    }
  }

  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  search(term: string, maxResults: number = 10): PrenomData[] {
    if (!term.trim()) return [];

    const normalizedTerm = this.normalizeString(term);

    // Recherche optimisée en utilisant l'index
    let candidates: PrenomData[] = [];

    if (normalizedTerm.length >= 2) {
      const prefix = normalizedTerm.substring(0, 2);
      candidates = this.searchIndex.get(prefix) || [];
    } else {
      const firstLetter = normalizedTerm[0];
      candidates = this.searchIndex.get(firstLetter) || [];
    }

    // Filtrer et trier les candidats
    const results = candidates
      .filter((prenom) => {
        const normalizedPrenom = this.normalizeString(prenom.firstname);
        return normalizedPrenom.includes(normalizedTerm);
      })
      .sort((a, b) => {
        const aNormalized = this.normalizeString(a.firstname);
        const bNormalized = this.normalizeString(b.firstname);

        const aStartsWith = aNormalized.startsWith(normalizedTerm);
        const bStartsWith = bNormalized.startsWith(normalizedTerm);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        return b.count - a.count;
      })
      .slice(0, maxResults);

    return results;
  }
}

/**
 * Gestionnaire de cache pour les données coûteuses
 */
export class PerformanceCache {
  private cache = new Map<
    string,
    { data: unknown; timestamp: number; ttl: number }
  >();

  set(key: string, data: unknown, ttl: number = 300000) {
    // 5 minutes par défaut
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

export const globalCache = new PerformanceCache();
