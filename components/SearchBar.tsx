"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Search, X, Sparkles, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PrenomData } from "@/types";
import { capitalizeFirstName } from "@/lib/utils";
import { calculateAverageScore } from "@/utils/scoring";
import { DEFAULT_CONFIG, UI_MESSAGES } from "@/lib/constants";
import { OptimizedSearch, debounceWithCancel } from "@/lib/performance";

interface SearchBarProps {
  data: PrenomData[];
  selectedPrenom: PrenomData | null;
  onPrenomSelect: (prenom: PrenomData | null) => void;
  className?: string;
}

const SearchBarComponent = ({
  data,
  selectedPrenom,
  onPrenomSelect,
  className,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [filteredResults, setFilteredResults] = React.useState<PrenomData[]>(
    []
  );
  const [dropdownPosition, setDropdownPosition] = React.useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Instance de recherche optimisée
  const optimizedSearch = React.useMemo(() => {
    return new OptimizedSearch(data);
  }, [data]);

  // Fonction de recherche optimisée
  const searchPrenoms = React.useCallback(
    (term: string) => {
      if (!term.trim()) {
        setFilteredResults([]);
        return;
      }

      const results = optimizedSearch.search(
        term,
        DEFAULT_CONFIG.MAX_SEARCH_RESULTS
      );
      setFilteredResults(results);
    },
    [optimizedSearch]
  );

  // Debounced search optimisé
  const debouncedSearch = React.useMemo(
    () =>
      debounceWithCancel(
        (term: string) => searchPrenoms(term),
        DEFAULT_CONFIG.SEARCH_DEBOUNCE_DELAY
      ),
    [searchPrenoms]
  );

  // Effect pour la recherche
  React.useEffect(() => {
    debouncedSearch(searchTerm);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  // Gérer la sélection d'un prénom
  const handlePrenomSelect = (prenom: PrenomData) => {
    onPrenomSelect(prenom);
    setSearchTerm(prenom.firstname);
    setIsOpen(false);
    setIsFocused(false);
    setFilteredResults([]);
  };

  // Clear search
  const handleClear = () => {
    setSearchTerm("");
    setFilteredResults([]);
    onPrenomSelect(null);
    setIsOpen(false);
  };

  // Gérer les touches clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setIsFocused(false);
    }
  };

  // Gérer le focus
  const handleFocus = () => {
    setIsFocused(true);
    if (filteredResults.length > 0) {
      setIsOpen(true);
    }
    updateDropdownPosition();
  };

  // Mettre à jour la position du dropdown
  const updateDropdownPosition = React.useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  // Mettre à jour la position lors du scroll ou resize
  React.useEffect(() => {
    const handleScrollOrResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    window.addEventListener("scroll", handleScrollOrResize);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updateDropdownPosition]);

  const handleBlur = () => {
    // Délai pour permettre aux clics sur les résultats
    setTimeout(() => {
      setIsFocused(false);
      setIsOpen(false);
    }, 200);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Search className="w-4 h-4 text-primary" />
          </div>
          <span>Recherche de prénom</span>
          {filteredResults.length > 0 && (
            <div className="inline-flex items-center space-x-1 bg-accent/10 text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              <span>
                {filteredResults.length} résultat
                {filteredResults.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="relative">
          <div
            className={`
            relative flex items-center transition-all duration-300
            ${isFocused ? "scale-105" : "scale-100"}
          `}
          >
            <div
              className={`
              absolute left-3 transition-all duration-200
              ${isFocused ? "text-primary scale-110" : "text-muted-foreground"}
            `}
            >
              <Search className="h-4 w-4" />
            </div>
            <Input
              ref={inputRef}
              type="text"
              placeholder={UI_MESSAGES.SEARCH_PLACEHOLDER}
              value={searchTerm}
              onChange={(e) => {
                const newValue = e.target.value;
                setSearchTerm(newValue);
                setIsOpen(true);
                updateDropdownPosition();

                // Si la barre de recherche est complètement vidée, effacer la sélection
                if (newValue === "" && selectedPrenom) {
                  onPrenomSelect(null);
                }
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={`
                pl-10 pr-10 h-12 text-base transition-all duration-300
                ${
                  isFocused
                    ? "border-primary shadow-lg shadow-primary/20 bg-background"
                    : "border-border hover:border-primary/50"
                }
              `}
            />
            {(searchTerm || selectedPrenom) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className={`
                  absolute right-1 h-8 w-8 p-0 transition-all duration-200
                  ${
                    isFocused
                      ? "text-primary hover:bg-primary/10"
                      : "text-muted-foreground hover:bg-accent"
                  }
                `}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          {/* Résultats de recherche */}
          {isOpen &&
            filteredResults.length > 0 &&
            typeof window !== "undefined" &&
            createPortal(
              <div
                className="fixed z-[9999] mt-2 animate-slide-down"
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: `${dropdownPosition.width}px`,
                }}
              >
                <Command className="rounded-xl border-2 shadow-2xl bg-background backdrop-blur-md border-primary/20">
                  <CommandList className="max-h-[300px] overflow-y-auto">
                    <CommandGroup>
                      {filteredResults.map((prenom, index) => (
                        <CommandItem
                          key={prenom.firstname}
                          value={prenom.firstname}
                          onSelect={() => handlePrenomSelect(prenom)}
                          className={`
                          flex items-center justify-between cursor-pointer transition-all duration-200 
                          hover:bg-primary/5 hover:border-l-4 hover:border-l-primary p-4 mx-1 rounded-lg
                          animate-slide-right
                        `}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                              <span className="text-primary font-semibold text-sm">
                                {capitalizeFirstName(prenom.firstname)[0]}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-foreground">
                                {capitalizeFirstName(prenom.firstname)}
                              </span>
                              <div className="text-xs text-muted-foreground">
                                {prenom.count.toLocaleString()} candidats
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <div className="text-sm font-semibold text-success">
                                {Math.round(prenom.taux_fel * 100)}%
                              </div>
                              <div className="text-xs text-muted-foreground">
                                TB+
                              </div>
                            </div>
                            <TrendingUp className="w-4 h-4 text-success" />
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>,
              document.body
            )}

          {/* Message si pas de résultats */}
          {isOpen &&
            searchTerm &&
            filteredResults.length === 0 &&
            typeof window !== "undefined" &&
            createPortal(
              <div
                className="fixed z-[9999] mt-2 animate-slide-down"
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: `${dropdownPosition.width}px`,
                }}
              >
                <Command className="rounded-xl border shadow-2xl bg-background backdrop-blur-sm">
                  <CommandList>
                    <CommandEmpty className="py-8 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                          <Search className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="text-sm font-medium">
                          Aucun résultat
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Essayez un autre prénom
                        </div>
                      </div>
                    </CommandEmpty>
                  </CommandList>
                </Command>
              </div>,
              document.body
            )}
        </div>

        {/* Information sur le prénom sélectionné */}
        {selectedPrenom && (
          <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent rounded-xl border border-primary/20 animate-slide-up">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <span className="text-primary font-bold text-lg">
                  {capitalizeFirstName(selectedPrenom.firstname)[0]}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">
                  Prénom sélectionné :{" "}
                  {capitalizeFirstName(selectedPrenom.firstname)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {selectedPrenom.count.toLocaleString()} candidats •{" "}
                  {Math.round(selectedPrenom.taux_tb * 100)}% mention TB •{" "}
                  <span className="text-sm text-muted-foreground mt-1">
                    Note : {calculateAverageScore(selectedPrenom).toFixed(1)}/10
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-success">
                  {Math.round(selectedPrenom.taux_fel * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">TB+</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const SearchBar = React.memo(
  SearchBarComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.data === nextProps.data &&
      prevProps.selectedPrenom === nextProps.selectedPrenom &&
      prevProps.className === nextProps.className
    );
  }
);

SearchBar.displayName = "SearchBar";
