"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PrenomData } from "@/types";
import { STATS_TEMPLATE, UI_MESSAGES } from "@/lib/constants";
import { capitalizeFirstName, formatPercentage } from "@/lib/utils";
import {
  BarChart3,
  Users,
  TrendingUp,
  Award,
  Search,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface ResultsPanelProps {
  selectedPrenom: PrenomData | null;
  similarPrenoms?: string[];
  onPrenomSelect?: (prenomName: string) => void;
  className?: string;
}

const ResultsPanelComponent = ({
  selectedPrenom,
  similarPrenoms = [],
  onPrenomSelect,
  className,
}: ResultsPanelProps) => {
  // Formater le texte des statistiques selon le template
  const formatStatsText = (prenom: PrenomData): string => {
    const title = STATS_TEMPLATE.TITLE.replace(
      "{firstname}",
      capitalizeFirstName(prenom.firstname)
    );

    const content = STATS_TEMPLATE.CONTENT.replace(
      "{count}",
      prenom.count.toString()
    )
      .replace("{firstname}", capitalizeFirstName(prenom.firstname))
      .replace("{sm}", Math.round(prenom.taux_sm * 100).toString())
      .replace("{ab}", Math.round(prenom.taux_ab * 100).toString())
      .replace("{b}", Math.round(prenom.taux_b * 100).toString())
      .replace("{tb}", Math.round(prenom.taux_tb * 100).toString())
      .replace("{fel}", Math.round(prenom.taux_fel * 100).toString());

    return `${title}\n\n${content}`;
  };

  // Calculer les statistiques détaillées
  const getDetailedStats = (prenom: PrenomData) => {
    const total = prenom.count;
    const stats = [
      {
        label: "Sans mention",
        count: Math.round(prenom.taux_sm * total),
        percentage: prenom.taux_sm,
        color: "#ef4444",
        icon: "⚪",
      },
      {
        label: "Assez bien",
        count: Math.round(prenom.taux_ab * total),
        percentage: prenom.taux_ab,
        color: "#f97316",
        icon: "🟠",
      },
      {
        label: "Bien",
        count: Math.round(prenom.taux_b * total),
        percentage: prenom.taux_b,
        color: "#eab308",
        icon: "🟡",
      },
      {
        label: "Très bien",
        count: Math.round(prenom.taux_tb * total),
        percentage: prenom.taux_tb,
        color: "#22c55e",
        icon: "🟢",
      },
      {
        label: "TB avec félicitations",
        count: Math.round(prenom.taux_fel * total),
        percentage: prenom.taux_fel,
        color: "#3b82f6",
        icon: "🔵",
      },
    ];

    return stats.filter((stat) => stat.count > 0);
  };

  if (!selectedPrenom) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <span>Statistiques détaillées</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Aucun prénom sélectionné
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Sélectionnez un prénom dans le graphique ou utilisez la
                recherche pour afficher ses statistiques détaillées.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Cliquez sur le graphique</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span>Utilisez la recherche</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const detailedStats = getDetailedStats(selectedPrenom);
  const statsText = formatStatsText(selectedPrenom);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <span>Statistiques détaillées</span>
          </div>
          <Link href={`/prenom/${encodeURIComponent(selectedPrenom.firstname)}`}>
            <Button size="sm" variant="outline" className="gap-2">
              <ExternalLink className="h-3 w-3" />
              Voir plus
            </Button>
          </Link>
        </CardTitle>
        <div className="flex items-center space-x-2 mt-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
            <span className="text-primary font-bold text-lg">
              {capitalizeFirstName(selectedPrenom.firstname)[0]}
            </span>
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {capitalizeFirstName(selectedPrenom.firstname)}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedPrenom.count.toLocaleString()} candidats analysés
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 animate-fade-blur">
        {/* Métriques clés en haut */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up delay-100">
          {(() => {
            const sansMentionValue = selectedPrenom.taux_sm;
            const tbPlusValue = selectedPrenom.taux_fel;
            const sansMentionIsHigher = sansMentionValue > tbPlusValue;

            return (
              <>
                <div
                  className={`p-4 rounded-xl border hover-lift ${
                    sansMentionIsHigher
                      ? "bg-gradient-to-br from-red-500/20 to-red-400/10 border-red-500/30"
                      : "bg-gradient-to-br from-muted/20 to-muted/10 border-muted/30"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span
                      className={`text-xs font-medium ${
                        sansMentionIsHigher
                          ? "text-red-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      Sans mention
                    </span>
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      sansMentionIsHigher ? "text-red-600" : "text-foreground"
                    }`}
                  >
                    {formatPercentage(sansMentionValue)}
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl border hover-lift ${
                    !sansMentionIsHigher
                      ? "bg-gradient-to-br from-blue-500/20 to-blue-400/10 border-blue-500/30"
                      : "bg-gradient-to-br from-muted/20 to-muted/10 border-muted/30"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Award
                      className={`w-4 h-4 ${
                        !sansMentionIsHigher
                          ? "text-blue-600"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        !sansMentionIsHigher
                          ? "text-blue-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      TB+
                    </span>
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      !sansMentionIsHigher ? "text-blue-600" : "text-foreground"
                    }`}
                  >
                    {formatPercentage(tbPlusValue)}
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Répartition visuelle des mentions */}
        <div className="animate-slide-up delay-200">
          <h4 className="font-semibold mb-4 flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Répartition des mentions</span>
          </h4>
          <div className="space-y-3">
            {detailedStats.map((stat, index) => (
              <div
                key={index}
                className="group hover:bg-muted/20 p-3 rounded-lg transition-all duration-200 animate-slide-right"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{stat.icon}</span>
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: stat.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{stat.label}</span>
                      <span className="text-sm font-semibold">
                        {stat.count.toLocaleString()} (
                        {formatPercentage(stat.percentage)})
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500 shadow-sm"
                        style={{
                          width: `${Math.max(stat.percentage * 100, 2)}%`,
                          backgroundColor: stat.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Texte formaté selon le template */}
        <div className="animate-slide-up delay-400">
          <h4 className="font-semibold mb-3 flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Analyse détaillée</span>
          </h4>
          <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/20 rounded-xl border border-border/50 text-sm leading-relaxed">
            <pre className="whitespace-pre-wrap font-sans text-muted-foreground">
              {statsText}
            </pre>
          </div>
        </div>

        {/* Métriques additionnelles */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up delay-500">
          <div className="text-center p-3 bg-muted/30 rounded-lg hover-lift">
            <div className="text-lg font-bold text-foreground">
              {selectedPrenom.count.toLocaleString()}
            </div>
            <div className="text-xs text-black flex items-center justify-center space-x-1">
              <Users className="w-3 h-3" />
              <span>Total candidats</span>
            </div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg hover-lift">
            <div className="text-lg font-bold text-warning">
              {formatPercentage(
                selectedPrenom.taux_b +
                  selectedPrenom.taux_tb +
                  selectedPrenom.taux_fel
              )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center space-x-1">
              <Award className="w-3 h-3" />
              <span>Mentions B+</span>
            </div>
          </div>
        </div>

        {/* Prénoms similaires */}
        {similarPrenoms.length > 0 && (
          <div className="animate-slide-up delay-600">
            <h4 className="font-semibold mb-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Prénoms avec profil similaire</span>
              <div className="inline-flex items-center space-x-1 bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                <span>{similarPrenoms.length}</span>
              </div>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {similarPrenoms.slice(0, 8).map((prenom, index) => (
                <button
                  key={index}
                  onClick={() => onPrenomSelect?.(prenom)}
                  className="flex items-center space-x-2 p-2 bg-muted/20 hover:bg-success/10 border hover:border-success/30 rounded-lg text-sm transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 animate-scale-in"
                  style={{ animationDelay: `${700 + index * 50}ms` }}
                  aria-label={`Afficher les statistiques de ${capitalizeFirstName(
                    prenom
                  )}`}
                >
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center text-xs font-semibold text-success">
                    {capitalizeFirstName(prenom)[0]}
                  </div>
                  <span className="font-medium text-foreground truncate">
                    {capitalizeFirstName(prenom)}
                  </span>
                </button>
              ))}
              {similarPrenoms.length > 8 && (
                <div className="col-span-2 text-center text-xs text-muted-foreground p-2 animate-scale-in delay-700">
                  +{similarPrenoms.length - 8} autres prénoms similaires...
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const ResultsPanel = React.memo(ResultsPanelComponent, (prevProps, nextProps) => {
  return (
    prevProps.selectedPrenom === nextProps.selectedPrenom &&
    JSON.stringify(prevProps.similarPrenoms) === JSON.stringify(nextProps.similarPrenoms) &&
    prevProps.className === nextProps.className
  );
});

ResultsPanel.displayName = 'ResultsPanel';
