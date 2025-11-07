import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utilitaire principal pour combiner les classes CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utilitaires pour formater les données
export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

// Utilitaire pour formater les noms avec une majuscule
export function capitalizeFirstName(firstname: string): string {
  return firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
}

// Utilitaire pour débouncer les fonctions (recherche)
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Utilitaire pour calculer la distance euclidienne entre deux vecteurs
export function euclideanDistance(
  vector1: number[],
  vector2: number[]
): number {
  if (vector1.length !== vector2.length) {
    throw new Error("Vectors must have the same length");
  }

  const sumOfSquares = vector1.reduce((sum, val, index) => {
    const diff = val - vector2[index];
    return sum + diff * diff;
  }, 0);

  return Math.sqrt(sumOfSquares);
}

// Utilitaire pour normaliser une chaîne de recherche
export function normalizeSearchString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD") // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .trim();
}

// Utilitaire pour vérifier si une valeur est un nombre valide
export function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

// Utilitaire pour clamp une valeur entre min et max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Utilitaire pour générer un ID unique
export function generateId(prefix = ""): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2);
  return `${prefix}${timestamp}${randomStr}`;
}
