import { PrenomData } from "@/types";

export interface SimilarityResult {
  prenom: PrenomData;
  distance: number;
  similarity: number; // Pourcentage de similarité (0-100)
}

export interface SimilarPrenom extends PrenomData {
  similarity?: number;
}

/**
 * Calcule la distance euclidienne entre deux prénoms basée sur leurs taux de mentions
 */
function calculateEuclideanDistance(
  prenom1: PrenomData,
  prenom2: PrenomData
): number {
  const taux1 = [
    prenom1.taux_sm,
    prenom1.taux_ab,
    prenom1.taux_b,
    prenom1.taux_tb,
    prenom1.taux_fel,
  ];
  const taux2 = [
    prenom2.taux_sm,
    prenom2.taux_ab,
    prenom2.taux_b,
    prenom2.taux_tb,
    prenom2.taux_fel,
  ];

  let sum = 0;
  for (let i = 0; i < taux1.length; i++) {
    sum += Math.pow(taux1[i] - taux2[i], 2);
  }

  return Math.sqrt(sum);
}

/**
 * Convertit une distance en score de similarité (0-100%)
 */
function distanceToSimilarity(distance: number): number {
  // Plus la distance est faible, plus la similarité est élevée
  // Distance max théorique : √5 ≈ 2.236 (si tous les taux sont à l'opposé)
  // On normalise sur 100%
  const maxDistance = Math.sqrt(5);
  const similarity = Math.max(0, 100 - (distance / maxDistance) * 100);
  return Math.round(similarity * 100) / 100; // Arrondi à 2 décimales
}

/**
 * Trouve les prénoms similaires à un prénom donné
 */
export function findSimilarPrenoms(
  targetPrenom: PrenomData,
  allPrenoms: PrenomData[],
  options: {
    maxResults?: number;
    minSimilarity?: number;
    excludeTarget?: boolean;
  } = {}
): SimilarityResult[] {
  const {
    maxResults = 12,
    minSimilarity = 70, // Seuil minimum de similarité (70%)
    excludeTarget = true,
  } = options;

  const similarities: SimilarityResult[] = [];

  for (const prenom of allPrenoms) {
    // Exclure le prénom cible si demandé
    if (excludeTarget && prenom.firstname === targetPrenom.firstname) {
      continue;
    }

    const distance = calculateEuclideanDistance(targetPrenom, prenom);
    const similarity = distanceToSimilarity(distance);

    // Filtrer par seuil de similarité
    if (similarity >= minSimilarity) {
      similarities.push({
        prenom,
        distance,
        similarity,
      });
    }
  }

  // Trier par similarité décroissante (distance croissante)
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Limiter le nombre de résultats
  return similarities.slice(0, maxResults);
}

/**
 * Alias simple pour findSimilarPrenoms utilisé par les API routes
 * Retourne les prénoms similaires avec leur score de similarité
 */
export function findSimilarNames(
  prenom: PrenomData,
  allPrenoms: PrenomData[],
  count: number = 5
): SimilarPrenom[] {
  const results = findSimilarPrenoms(prenom, allPrenoms, {
    maxResults: count,
    excludeTarget: true
  });

  return results.map(r => ({
    ...r.prenom,
    similarity: r.similarity
  }));
}

/**
 * Trouve les prénoms avec un profil de mentions similaire
 * Retourne une liste formatée pour l'affichage
 */
export function getSimilarPrenomsNames(
  targetPrenom: PrenomData,
  allPrenoms: PrenomData[],
  maxResults: number = 10
): string[] {
  const similarPrenoms = findSimilarPrenoms(targetPrenom, allPrenoms, {
    maxResults,
    minSimilarity: 65, // Seuil un peu plus bas pour avoir plus de résultats
    excludeTarget: true,
  });

  return similarPrenoms.map((result) => result.prenom.firstname);
}

/**
 * Analyse la distribution des mentions d'un prénom
 * Retourne le type de profil dominant
 */
export function analyzeMentionProfile(prenom: PrenomData): {
  dominantMention: "sm" | "ab" | "b" | "tb" | "fel";
  profileType: "excellent" | "bon" | "moyen" | "faible";
  description: string;
} {
  const taux = {
    sm: prenom.taux_sm,
    ab: prenom.taux_ab,
    b: prenom.taux_b,
    tb: prenom.taux_tb,
    fel: prenom.taux_fel,
  };

  // Trouver la mention dominante
  const dominantMention = Object.entries(taux).reduce((a, b) =>
    taux[a[0] as keyof typeof taux] > taux[b[0] as keyof typeof taux] ? a : b
  )[0] as keyof typeof taux;

  // Calculer le score global (pondéré)
  const globalScore =
    (taux.sm * 0 + taux.ab * 1 + taux.b * 2 + taux.tb * 3 + taux.fel * 4) / 4; // Normalisation sur 1

  // Déterminer le type de profil
  let profileType: "excellent" | "bon" | "moyen" | "faible";
  let description: string;

  if (globalScore >= 0.7) {
    profileType = "excellent";
    description = "Profil de réussite élevée avec de nombreuses mentions";
  } else if (globalScore >= 0.5) {
    profileType = "bon";
    description = "Profil de bonne réussite scolaire";
  } else if (globalScore >= 0.3) {
    profileType = "moyen";
    description = "Profil de réussite dans la moyenne";
  } else {
    profileType = "faible";
    description = "Profil avec des difficultés scolaires";
  }

  return {
    dominantMention,
    profileType,
    description,
  };
}
