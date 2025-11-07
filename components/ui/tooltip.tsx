import React from "react";

interface TooltipProps {
  visible: boolean;
  x: number;
  y: number;
  prenom: string;
  count: number;
  tbPlusPercentage: number;
  isAdjusted?: boolean;
}

export function Tooltip({
  visible,
  x,
  y,
  prenom,
  count,
  tbPlusPercentage,
  isAdjusted = false,
}: TooltipProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: x + 15, // Décalage à droite du curseur
        top: y - 10, // Légèrement au-dessus du curseur
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm font-medium">
        {/* Flèche du tooltip */}
        <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>

        {/* Contenu */}
        <div className="text-gray-900 space-y-1">
          <div className="font-semibold text-blue-600">{prenom}</div>
          <div className="text-xs text-gray-600">
            <div>
              {count} candidats{isAdjusted ? " (position ajustée)" : ""}
            </div>
            <div>{tbPlusPercentage.toFixed(1)}% TB+</div>
          </div>
        </div>
      </div>
    </div>
  );
}
