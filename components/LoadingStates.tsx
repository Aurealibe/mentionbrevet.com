"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Skeleton de base réutilisable
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
      {...props}
    />
  );
}

// Loading state pour le graphique ScatterPlot
export function ScatterPlotSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Graphique principal */}
          <div className="relative">
            <Skeleton className="h-[750px] w-full rounded-lg" />
            {/* Points de données simulés */}
            <div className="absolute inset-4 flex flex-wrap gap-2 justify-center items-center">
              {Array.from({ length: 15 }, (_, i) => (
                <Skeleton
                  key={i}
                  className="h-4 w-16 rounded-full"
                  style={{
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>

          {/* Instructions */}
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

// Loading state pour la barre de recherche
export function SearchBarSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="relative">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="absolute left-3 top-3 h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading state pour le sélecteur de mentions
export function MentionSelectorSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Loading state pour le panneau de résultats
export function ResultsPanelSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-44" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Texte formaté */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Répartition des mentions */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Métriques clés */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="text-center p-3 space-y-2">
                <Skeleton className="h-8 w-12 mx-auto" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Prénoms similaires */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-48" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading state pour les données générales
export function DataCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-20" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Indicateur de chargement global avec animation
export function GlobalLoadingIndicator() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center space-x-2 bg-background/95 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-md">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-sm font-medium">Chargement...</span>
      </div>
    </div>
  );
}

// État de chargement complet de la page
export function FullPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-64 mx-auto" />
              <Skeleton className="h-4 w-96 mx-auto" />
            </div>
          </CardHeader>
        </Card>

        {/* Contrôles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SearchBarSkeleton />
          </div>
          <DataCardSkeleton />
        </div>

        {/* Sélecteur */}
        <MentionSelectorSkeleton />

        {/* Graphique et résultats */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ScatterPlotSkeleton />
          </div>
          <div className="xl:col-span-1">
            <ResultsPanelSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
