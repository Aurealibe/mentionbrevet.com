"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipPortal } from "@/components/ui/TooltipPortal";
import { PrenomData, MentionKey, ChartDataPoint } from "@/types";
import { dataToChartPoints } from "@/lib/data";
import {
  MENTIONS,
  CHART_COLORS,
  AXIS_CONFIG,
  DEFAULT_CONFIG,
} from "@/lib/constants";
import { capitalizeFirstName, formatCount } from "@/lib/utils";
import { calculateAverageScore } from "@/utils/scoring";
import {
  calculateScales,
  calculateTicks,
  optimizedAntiCollision,
  throttle,
} from "@/lib/performance";
import { BarChart3, Info, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ScatterPlotProps {
  data: PrenomData[];
  selectedMention: MentionKey;
  selectedPrenom: PrenomData | null;
  onPointClick?: (prenom: PrenomData) => void;
  className?: string;
}

interface PositionedPoint extends ChartDataPoint {
  adjustedX: number;
  adjustedY: number;
  prenomData: PrenomData;
}

const ScatterPlotComponent = ({
  data,
  selectedMention,
  selectedPrenom,
  onPointClick,
  className,
}: ScatterPlotProps) => {
  // Créer les données augmentées avec le prénom sélectionné s'il n'est pas déjà présent
  const augmentedData = React.useMemo(() => {
    if (!selectedPrenom) {
      return data;
    }

    // Vérifier si le prénom sélectionné est déjà dans les données
    const isAlreadyInData = data.some(
      (item) => item.firstname === selectedPrenom.firstname
    );

    if (isAlreadyInData) {
      return data;
    }

    // Si le prénom sélectionné a moins d'occurrences que le minimum des données principales,
    // on l'ajuste pour qu'il apparaisse au niveau des prénoms les moins fréquents
    const minCountInData = Math.min(...data.map((item) => item.count));
    const adjustedPrenom = { ...selectedPrenom };

    if (selectedPrenom.count < minCountInData) {
      // On le place légèrement en dessous du minimum pour qu'il soit visible mais distinct
      adjustedPrenom.count = minCountInData * 0.9;
    }

    // On garde la vraie position X du prénom, même si c'est 0%
    // L'échelle du graphique s'adaptera automatiquement

    // Ajouter le prénom sélectionné (potentiellement ajusté) aux données
    return [...data, adjustedPrenom];
  }, [data, selectedPrenom]);

  const chartPoints = React.useMemo(() => {
    return dataToChartPoints(augmentedData, selectedMention);
  }, [augmentedData, selectedMention]);

  const mention = MENTIONS[selectedMention];

  // Dimensions du graphique optimisées
  const width = 1400;
  const height = 1200;
  const margin = { top: 60, right: 60, bottom: 90, left: 120 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Échelles optimisées avec cache
  const scales = React.useMemo(() => {
    return calculateScales(chartPoints, plotWidth, plotHeight);
  }, [chartPoints, plotWidth, plotHeight]);

  const { xScale, yScale, bounds } = scales as {
    xScale: (value: number) => number;
    yScale: (value: number) => number;
    bounds: { xMin: number; xMax: number; yMin: number; yMax: number };
  };

  // Algorithme de positionnement anti-collision optimisé
  const positionedPoints = React.useMemo(() => {
    const initialPoints: PositionedPoint[] = chartPoints.map((point) => {
      const prenomData = augmentedData.find(
        (p) => p.firstname === point.firstname
      )!;
      return {
        ...point,
        adjustedX: xScale(point.x),
        adjustedY: yScale(point.y),
        prenomData,
      };
    });

    const optimizedPositions = optimizedAntiCollision(initialPoints, {
      minDistance: 32,
      maxIterations: 150,
      repulsionForce: 0.8,
      plotWidth,
      plotHeight,
    });

    return initialPoints.map((point, index) => ({
      ...point,
      adjustedX: optimizedPositions[index].adjustedX,
      adjustedY: optimizedPositions[index].adjustedY,
    }));
  }, [chartPoints, augmentedData, xScale, yScale, plotWidth, plotHeight]);

  // Génération des ticks optimisée avec cache
  const ticks = React.useMemo(() => {
    return calculateTicks(bounds);
  }, [bounds]);

  const { xTicks, yTicks } = ticks as {
    xTicks: number[];
    yTicks: number[];
  };

  // État local pour les interactions
  const [hoveredPrenom, setHoveredPrenom] = React.useState<string | null>(null);

  // État pour le tooltip personnalisé
  const [tooltip, setTooltip] = React.useState<{
    visible: boolean;
    x: number;
    y: number;
    prenom: string;
    count: number;
    tbPlusPercentage: number;
    averageScore: number;
    isAdjusted: boolean;
  }>({
    visible: false,
    x: 0,
    y: 0,
    prenom: "",
    count: 0,
    tbPlusPercentage: 0,
    averageScore: 0,
    isAdjusted: false,
  });

  // États pour le zoom et pan
  const [zoom, setZoom] = React.useState({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const [isPanning, setIsPanning] = React.useState(false);
  const [lastPanPoint, setLastPanPoint] = React.useState({ x: 0, y: 0 });
  const [isZoomEnabled, setIsZoomEnabled] = React.useState(false);

  // Fonction utilitaire pour calculer le pourcentage TB+ (Félicitations uniquement)
  const calculateTBPlusPercentage = React.useCallback(
    (prenomData: PrenomData) => {
      return prenomData.taux_fel * 100;
    },
    []
  );

  // Throttler pour les interactions hover
  const throttledSetHover = React.useMemo(
    () => throttle((prenom: string | null) => setHoveredPrenom(prenom), 16), // ~60fps
    []
  );

  // Gestionnaires pour le zoom et pan
  const handleWheel = React.useCallback(
    (e: React.WheelEvent) => {
      // Ne zoomer que si le zoom est activé
      if (!isZoomEnabled) {
        return;
      }

      e.preventDefault();

      const svgRect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - svgRect.left - margin.left;
      const mouseY = e.clientY - svgRect.top - margin.top;

      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;

      setZoom((prevZoom) => {
        const newScale = Math.max(
          0.5,
          Math.min(5, prevZoom.scale * zoomFactor)
        );
        const scaleRatio = newScale / prevZoom.scale;

        return {
          scale: newScale,
          translateX: prevZoom.translateX - mouseX * (scaleRatio - 1),
          translateY: prevZoom.translateY - mouseY * (scaleRatio - 1),
        };
      });
    },
    [margin, isZoomEnabled]
  );

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        // Clic gauche seulement
        // Activer le zoom si ce n'est pas déjà fait
        if (!isZoomEnabled) {
          setIsZoomEnabled(true);
        }
        setIsPanning(true);
        setLastPanPoint({ x: e.clientX, y: e.clientY });
      }
    },
    [isZoomEnabled]
  );

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - lastPanPoint.x;
        const deltaY = e.clientY - lastPanPoint.y;

        setZoom((prevZoom) => ({
          ...prevZoom,
          translateX: prevZoom.translateX + deltaX,
          translateY: prevZoom.translateY + deltaY,
        }));

        setLastPanPoint({ x: e.clientX, y: e.clientY });
      }
    },
    [isPanning, lastPanPoint]
  );

  const handleMouseUp = React.useCallback(() => {
    setIsPanning(false);
  }, []);

  // Gestionnaire pour désactiver le zoom en cliquant en dehors
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const chartContainer = document.querySelector(".chart-container");
      if (chartContainer && !chartContainer.contains(event.target as Node)) {
        setIsZoomEnabled(false);
      }
    };

    if (isZoomEnabled) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isZoomEnabled]);

  // Réinitialiser le zoom quand la mention change
  React.useEffect(() => {
    setZoom({
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
    setIsZoomEnabled(false);
  }, [selectedMention]);

  // Fonctions de contrôle du zoom
  const zoomIn = () => {
    setZoom((prevZoom) => ({
      ...prevZoom,
      scale: Math.min(5, prevZoom.scale * 1.2),
    }));
  };

  const zoomOut = () => {
    setZoom((prevZoom) => ({
      ...prevZoom,
      scale: Math.max(0.5, prevZoom.scale / 1.2),
    }));
  };

  const resetZoom = () => {
    setZoom({
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
  };

  // Gérer le clic sur un prénom
  const handlePrenomClick = (prenom: PrenomData) => {
    if (!isPanning && onPointClick) {
      onPointClick(prenom);
    }
  };

  // Gestionnaires pour le tooltip personnalisé
  const handlePrenomMouseEnter = React.useCallback(
    (event: React.MouseEvent, point: PositionedPoint) => {
      throttledSetHover(point.firstname);

      // Si c'est le prénom sélectionné et qu'il a été ajusté, utiliser le vrai count
      const isAdjustedPrenom =
        selectedPrenom?.firstname === point.firstname &&
        selectedPrenom &&
        !data.some((item) => item.firstname === selectedPrenom.firstname);

      const realCount = isAdjustedPrenom
        ? selectedPrenom.count
        : point.prenomData.count;

      // Vérifier si seule la position Y a été ajustée (count différent)
      const isPositionAdjusted =
        isAdjustedPrenom && selectedPrenom.count !== point.prenomData.count;

      // Position du tooltip au curseur de la souris
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        prenom: capitalizeFirstName(point.firstname),
        count: realCount,
        tbPlusPercentage: calculateTBPlusPercentage(
          point.prenomData  // Toujours utiliser les données du prénom survolé
        ),
        averageScore: calculateAverageScore(point.prenomData), // Calculer la note moyenne
        isAdjusted: isPositionAdjusted,
      });
    },
    [throttledSetHover, calculateTBPlusPercentage, selectedPrenom, data]
  );

  const handlePrenomMouseMove = React.useCallback(
    (event: React.MouseEvent, point: PositionedPoint) => {
      // Mettre à jour la position du tooltip pour suivre la souris
      if (tooltip.visible && hoveredPrenom === point.firstname) {
        setTooltip((prev) => ({
          ...prev,
          x: event.clientX,
          y: event.clientY,
        }));
      }
    },
    [tooltip.visible, hoveredPrenom]
  );

  const handlePrenomMouseLeave = React.useCallback(() => {
    throttledSetHover(null);
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, [throttledSetHover]);

  return (
    <Card className={`${className} chart-container`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="text-lg">
                Nuage de prénoms : mention {mention.label}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              title="Dézoomer"
            >
              <ZoomOut className="w-4 h-4 text-primary" />
            </button>
            <button
              onClick={zoomIn}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              title="Zoomer"
            >
              <ZoomIn className="w-4 h-4 text-primary" />
            </button>
            <button
              onClick={resetZoom}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              title="Réinitialiser le zoom"
            >
              <RotateCcw className="w-4 h-4 text-primary" />
            </button>
            <div className="text-xs text-muted-foreground ml-2">
              {Math.round(zoom.scale * 100)}%
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 animate-fade-blur">
        <div className="w-full overflow-x-auto animate-slide-up delay-200">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto border-2 rounded-xl bg-gradient-to-br from-background to-muted/10 shadow-lg border-border/20 scatter-plot-svg"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor: isPanning
                ? "grabbing"
                : isZoomEnabled
                ? "grab"
                : "pointer",
            }}
          >
            {/* Définitions pour les gradients et filtres */}
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="3"
                  floodColor="rgba(0,0,0,0.15)"
                />
              </filter>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient
                id="gridGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.GRID_LINES}
                  stopOpacity="0.1"
                />
                <stop
                  offset="100%"
                  stopColor={CHART_COLORS.GRID_LINES}
                  stopOpacity="0.05"
                />
              </linearGradient>
            </defs>

            {/* Grille de fond */}
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Lignes de grille verticales */}
              {xTicks.map((tick: number) => (
                <line
                  key={`x-grid-${tick}`}
                  x1={xScale(tick)}
                  y1={0}
                  x2={xScale(tick)}
                  y2={plotHeight}
                  stroke="url(#gridGradient)"
                  strokeWidth={1}
                  opacity={0.6}
                />
              ))}

              {/* Lignes de grille horizontales */}
              {yTicks.map((tick: number) => (
                <line
                  key={`y-grid-${tick}`}
                  x1={0}
                  y1={yScale(tick)}
                  x2={plotWidth}
                  y2={yScale(tick)}
                  stroke="url(#gridGradient)"
                  strokeWidth={1}
                  opacity={0.6}
                />
              ))}
            </g>

            {/* Axes avec design amélioré */}
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Axe X */}
              <line
                x1={0}
                y1={plotHeight}
                x2={plotWidth}
                y2={plotHeight}
                stroke={CHART_COLORS.AXIS_LABELS}
                strokeWidth={3}
                strokeLinecap="round"
              />

              {/* Axe Y */}
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={plotHeight}
                stroke={CHART_COLORS.AXIS_LABELS}
                strokeWidth={3}
                strokeLinecap="round"
              />

              {/* Ticks et labels de l'axe X */}
              {xTicks.map((tick: number) => (
                <g key={`x-tick-${tick}`}>
                  <line
                    x1={xScale(tick)}
                    y1={plotHeight}
                    x2={xScale(tick)}
                    y2={plotHeight + 10}
                    stroke={CHART_COLORS.AXIS_LABELS}
                    strokeWidth={2}
                  />
                  <text
                    x={xScale(tick)}
                    y={plotHeight + 28}
                    textAnchor="middle"
                    fontSize={14}
                    fill={CHART_COLORS.AXIS_LABELS}
                    fontWeight="600"
                  >
                    {tick}%
                  </text>
                </g>
              ))}

              {/* Ticks et labels de l'axe Y */}
              {yTicks.map((tick: number) => (
                <g key={`y-tick-${tick}`}>
                  <line
                    x1={-10}
                    y1={yScale(tick)}
                    x2={0}
                    y2={yScale(tick)}
                    stroke={CHART_COLORS.AXIS_LABELS}
                    strokeWidth={2}
                  />
                  <text
                    x={-18}
                    y={yScale(tick)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={14}
                    fill={CHART_COLORS.AXIS_LABELS}
                    fontWeight="600"
                  >
                    {formatCount(tick)}
                  </text>
                </g>
              ))}
            </g>

            {/* Labels des axes avec icônes */}
            <g>
              <text
                x={margin.left + plotWidth / 2}
                y={height - 35}
                textAnchor="middle"
                fontSize={16}
                fontWeight="bold"
                fill={CHART_COLORS.AXIS_LABELS}
              >
                📊 {mention.label} (%)
              </text>

              <text
                x={35}
                y={margin.top + plotHeight / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={16}
                fontWeight="bold"
                fill={CHART_COLORS.AXIS_LABELS}
                transform={`rotate(-90, 35, ${margin.top + plotHeight / 2})`}
              >
                👥 {AXIS_CONFIG.Y_AXIS.LABEL}
              </text>
            </g>

            {/* Indicateur d'état du zoom en haut à droite */}
            <text
              x={width - 20}
              y={25}
              textAnchor="end"
              fontSize={18}
              fontWeight="600"
              fill={isZoomEnabled ? "#16a34a" : "#ea580c"}
              className="transition-colors duration-300"
            >
              {isZoomEnabled
                ? "🔍 Zoom actif - Cliquez hors du graphique pour désactiver"
                : "👆 Appuyez sur le graphique pour zoomer"}
            </text>

            {/* Prénoms avec positionnement anti-collision optimisé */}
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              <g
                transform={`translate(${zoom.translateX}, ${zoom.translateY}) scale(${zoom.scale})`}
              >
                {positionedPoints.map((point, index) => {
                  const isSelected =
                    selectedPrenom?.firstname === point.firstname;
                  const isHovered = hoveredPrenom === point.firstname;

                  // Taille de police dynamique selon l'importance (count) et position
                  const baseFontSize = Math.max(
                    14,
                    Math.min(24, 12 + Math.log10(point.y) * 3)
                  );
                  const fontSize = isSelected
                    ? baseFontSize + 4
                    : isHovered
                    ? baseFontSize + 2
                    : baseFontSize;

                  return (
                    <text
                      key={`${point.firstname}-${index}`}
                      x={point.adjustedX}
                      y={point.adjustedY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={fontSize}
                      fontWeight={
                        isSelected ? "bold" : isHovered ? "600" : "500"
                      }
                      fill={
                        isSelected ? CHART_COLORS.POINT_SELECTED : mention.color
                      }
                      className="cursor-pointer transition-all duration-300 select-none hover:drop-shadow-lg"
                      style={{
                        filter: isSelected
                          ? "url(#glow)"
                          : isHovered
                          ? "url(#shadow)"
                          : "none",
                        opacity: isSelected ? 1 : isHovered ? 0.95 : 0.88,
                      }}
                      onMouseEnter={(e) => handlePrenomMouseEnter(e, point)}
                      onMouseMove={(e) => handlePrenomMouseMove(e, point)}
                      onMouseLeave={handlePrenomMouseLeave}
                      onClick={() => handlePrenomClick(point.prenomData)}
                    >
                      {capitalizeFirstName(point.firstname)}
                    </text>
                  );
                })}
              </g>
            </g>
          </svg>
        </div>

        {/* Instructions améliorées */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-xl border border-primary/10 animate-slide-up delay-300">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div className="text-sm space-y-2">
              <div className="font-medium text-foreground">
                Guide de lecture du graphique
              </div>
              <div className="text-muted-foreground space-y-1">
                <p>
                  <strong>
                    Seuls les prénoms les plus donnés (100+ occurrences) sont
                    affichés par défaut. Si votre prénom n&apos;est pas visible,
                    utilisez la barre de recherche pour accéder à tous les
                    prénoms avec 10+ occurrences.
                  </strong>
                </p>
                <br />

                <p>
                  • <strong>Position horizontale :</strong> Taux de{" "}
                  {mention.label.toLowerCase()} (plus à droite = taux plus
                  élevé)
                </p>
                <p>
                  • <strong>Position verticale :</strong> Nombre de candidats
                  (échelle logarithmique pour optimiser la lisibilité)
                </p>
                <p>
                  • <strong>Taille du texte :</strong> Proportionnelle au nombre
                  d&apos;occurrences du prénom
                </p>
                <p>
                  • <strong>Interaction :</strong> Survolez ou cliquez sur un
                  prénom pour voir ses détails
                </p>
                <p>
                  • <strong>Navigation :</strong> Utilisez les boutons +/- pour
                  zoomer ou cliquez sur le graphique pour activer le zoom à la
                  molette, puis cliquez-glissez pour déplacer la vue
                </p>
                <p>
                  • <strong>Zoom molette :</strong> Le texte indique si le zoom
                  à la molette est actif. Cliquez en dehors du graphique pour le
                  désactiver
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Tooltip personnalisé avec Portal */}
      <TooltipPortal
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        prenom={tooltip.prenom}
        count={tooltip.count}
        tbPlusPercentage={tooltip.tbPlusPercentage}
        averageScore={tooltip.averageScore}
        isAdjusted={tooltip.isAdjusted}
      />
    </Card>
  );
}

export const ScatterPlot = React.memo(ScatterPlotComponent, (prevProps, nextProps) => {
  return (
    prevProps.data === nextProps.data &&
    prevProps.selectedMention === nextProps.selectedMention &&
    prevProps.selectedPrenom === nextProps.selectedPrenom &&
    prevProps.className === nextProps.className
  );
});

ScatterPlot.displayName = 'ScatterPlot';
