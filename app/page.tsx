"use client";

import * as React from "react";
import { MentionSelector } from "@/components/MentionSelector";
import { ScatterPlot } from "@/components/ScatterPlot";
import { ResultsPanel } from "@/components/ResultsPanel";
import { HeroSection } from "@/components/HeroSection";
import { InstructionsSection } from "@/components/InstructionsSection";
import { AppFooter } from "@/components/AppFooter";
import { loadPrenomData, loadAllPrenomData } from "@/lib/data";
import { PrenomData, MentionKey } from "@/types";
import { DEFAULT_CONFIG, UI_MESSAGES, MENTIONS } from "@/lib/constants";
import { getSimilarPrenomsNames } from "@/lib/similarity";
import { FullPageSkeleton } from "@/components/LoadingStates";
import {
  useKeyboardShortcuts,
  accessibilityUtils,
} from "@/lib/accessibility";

const HomePage = React.memo(() => {
  // États de l'application
  const [data, setData] = React.useState<PrenomData[]>([]);
  const [searchData, setSearchData] = React.useState<PrenomData[]>([]);
  const [selectedMention, setSelectedMention] = React.useState<MentionKey>(
    DEFAULT_CONFIG.DEFAULT_MENTION
  );
  const [selectedPrenom, setSelectedPrenom] = React.useState<PrenomData | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);


  // Raccourcis clavier
  useKeyboardShortcuts({
    escape: () => {
      setSelectedPrenom(null);
      accessibilityUtils.announceToScreenReader("Sélection effacée");
    },
    f: () => {
      const searchInput = document.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        accessibilityUtils.announceToScreenReader("Focus sur la recherche");
      }
    },
    "1": () => setSelectedMention("taux_sm"),
    "2": () => setSelectedMention("taux_ab"),
    "3": () => setSelectedMention("taux_b"),
    "4": () => setSelectedMention("taux_tb"),
    "5": () => setSelectedMention("taux_fel"),
  });

  // Charger les données au démarrage
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Charger les données du graphique (100+) et de recherche (28+) en parallèle
        const [prenomData, allPrenomData] = await Promise.all([
          loadPrenomData(),
          loadAllPrenomData(),
        ]);
        setData(prenomData);
        setSearchData(allPrenomData);
      } catch (err) {
        // Error loading data - state already set to show error
        setError(
          err instanceof Error ? err.message : UI_MESSAGES.ERROR_LOADING_DATA
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Gérer la sélection d'un prénom depuis la recherche ou le graphique
  const handlePrenomSelect = React.useCallback((prenom: PrenomData | null) => {
    setSelectedPrenom(prenom);
    if (prenom) {
      accessibilityUtils.announceToScreenReader(
        `Prénom ${prenom.firstname} sélectionné. ${
          prenom.count
        } candidats avec ${Math.round(
          prenom.taux_tb * 100
        )}% de mention très bien.`
      );
    }
  }, []);

  // Gérer la sélection d'un prénom par nom (pour les prénoms similaires)
  const handlePrenomSelectByName = React.useCallback(
    (prenomName: string) => {
      // Chercher d'abord dans les données de recherche (plus complètes)
      const prenomData = searchData.find(
        (p) => p.firstname.toLowerCase() === prenomName.toLowerCase()
      );
      if (prenomData) {
        handlePrenomSelect(prenomData);
      }
    },
    [searchData, handlePrenomSelect]
  );

  // Gérer le changement de mention
  const handleMentionChange = React.useCallback((mention: MentionKey) => {
    setSelectedMention(mention);
    const mentionLabel = MENTIONS[mention].label;
    accessibilityUtils.announceToScreenReader(
      `Affichage changé vers ${mentionLabel}`
    );
  }, []);

  // Gérer le clic sur un point du graphique
  const handlePointClick = React.useCallback(handlePrenomSelect, [handlePrenomSelect]);

  // Calculer les prénoms similaires au prénom sélectionné
  const similarPrenoms = React.useMemo(() => {
    if (!selectedPrenom || searchData.length === 0) {
      return [];
    }
    return getSimilarPrenomsNames(selectedPrenom, searchData, 10);
  }, [selectedPrenom, searchData]);

  // État de chargement avec skeleton élégant
  if (isLoading) {
    return <FullPageSkeleton />;
  }

  // État d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-center text-center space-y-6 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <div className="text-4xl">⚠️</div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Erreur de chargement</h1>
              <p className="text-muted-foreground max-w-md">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn-gradient px-6 py-3 rounded-xl font-medium"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <HeroSection
        searchData={searchData}
        selectedPrenom={selectedPrenom}
        onPrenomSelect={handlePrenomSelect}
      />

      {/* Sélecteur de mentions */}
      <section className="container-custom py-4">
        <div className="animate-slide-up delay-400">
          <MentionSelector
            selectedMention={selectedMention}
            onMentionChange={handleMentionChange}
            className="card-glass"
          />
        </div>
      </section>

      {/* Section principale : Graphique et résultats */}
      <section className="container-custom pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Graphique principal */}
          <div className="xl:col-span-2 animate-slide-right delay-600">
            <ScatterPlot
              data={data}
              selectedMention={selectedMention}
              selectedPrenom={selectedPrenom}
              onPointClick={handlePointClick}
              className="card-glass"
            />
          </div>

          {/* Panneau de résultats */}
          <div className="xl:col-span-1 animate-slide-left delay-700">
            <ResultsPanel
              selectedPrenom={selectedPrenom}
              similarPrenoms={similarPrenoms}
              onPrenomSelect={handlePrenomSelectByName}
              className="card-glass"
            />
          </div>
        </div>
      </section>

      <InstructionsSection />

      <AppFooter />
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;
