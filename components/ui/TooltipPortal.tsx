"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface TooltipPortalProps {
  visible: boolean;
  x: number;
  y: number;
  prenom: string;
  count: number;
  tbPlusPercentage: number;
  averageScore: number;
  isAdjusted?: boolean;
}

export function TooltipPortal({
  visible,
  x,
  y,
  prenom,
  count,
  tbPlusPercentage,
  averageScore,
  isAdjusted = false,
}: TooltipPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !visible) return null;

  // Ajuster la position pour éviter que le tooltip sorte de l'écran
  const tooltipWidth = 200; // Estimation de la largeur du tooltip
  const tooltipHeight = 80; // Estimation de la hauteur du tooltip

  let adjustedX = x + 15; // Décalage à droite du curseur
  let adjustedY = y - 10; // Légèrement au-dessus du curseur

  // Vérifier si le tooltip sort de l'écran à droite
  if (adjustedX + tooltipWidth > window.innerWidth) {
    adjustedX = x - tooltipWidth - 15; // Afficher à gauche du curseur
  }

  // Vérifier si le tooltip sort de l'écran en haut
  if (adjustedY < 0) {
    adjustedY = y + 25; // Afficher en dessous du curseur
  }

  // Vérifier si le tooltip sort de l'écran en bas
  if (adjustedY + tooltipHeight > window.innerHeight) {
    adjustedY = y - tooltipHeight - 10; // Afficher au-dessus
  }

  const tooltipContent = (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
      }}
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl px-3 py-2 text-sm">
        <div className="space-y-1">
          <div className="font-semibold text-blue-600 dark:text-blue-400">
            {prenom}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
            <div>
              {count} candidats{isAdjusted ? " (position ajustée)" : ""}
            </div>
            <div className="font-medium">
              {tbPlusPercentage.toFixed(1)}% TB+
            </div>
            <div className="text-gray-500 dark:text-gray-500">
              Moyenne : {averageScore.toFixed(1)}/10
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(tooltipContent, document.body);
}
