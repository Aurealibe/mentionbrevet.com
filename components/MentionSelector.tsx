"use client";

import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MENTIONS, MENTION_ORDER } from "@/lib/constants";
import { MentionKey } from "@/types";
import { Check, Target } from "lucide-react";

interface MentionSelectorProps {
  selectedMention: MentionKey;
  onMentionChange: (mention: MentionKey) => void;
  className?: string;
}

const MentionSelectorComponent = ({
  selectedMention,
  onMentionChange,
  className,
}: MentionSelectorProps) => {
  const [animatingCard, setAnimatingCard] = React.useState<string | null>(null);

  const handleMentionSelect = (mentionKey: MentionKey) => {
    setAnimatingCard(mentionKey);
    onMentionChange(mentionKey);

    // Reset animation après un délai
    setTimeout(() => setAnimatingCard(null), 300);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <span>Type de mention</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sélectionnez le type de mention à afficher sur l&apos;axe horizontal
          du graphique.
        </p>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedMention}
          onValueChange={handleMentionSelect}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {MENTION_ORDER.map((mentionKey, index) => {
            const mention = MENTIONS[mentionKey];
            const isSelected = selectedMention === mentionKey;
            const isAnimating = animatingCard === mentionKey;

            return (
              <div
                key={mentionKey}
                className={`
                  relative group cursor-pointer transition-all duration-300 ease-out
                  ${isAnimating ? "animate-scale-in" : ""}
                  ${isSelected ? "scale-105" : "hover:scale-102"}
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <RadioGroupItem
                  value={mentionKey}
                  id={mentionKey}
                  className="sr-only"
                />
                <Label
                  htmlFor={mentionKey}
                  className={`
                    flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                    hover-lift relative overflow-hidden
                    ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                        : "border-border hover:border-primary/50 hover:bg-accent/30"
                    }
                  `}
                >
                  {/* Background gradient pour la carte sélectionnée */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-xl" />
                  )}

                  {/* Indicateur de couleur */}
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`
                        w-4 h-4 rounded-full transition-all duration-300 shadow-md
                        ${
                          isSelected
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                            : ""
                        }
                      `}
                      style={{ backgroundColor: mention.color }}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Contenu textuel */}
                  <div className="flex-1 relative">
                    <div
                      className={`
                      font-semibold text-sm transition-colors duration-200
                      ${
                        isSelected
                          ? "text-primary"
                          : "text-foreground group-hover:text-primary"
                      }
                    `}
                    >
                      {mention.shortLabel}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {mention.label}
                    </div>
                  </div>

                  {/* Badge indicateur pour la sélection */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-scale-in">
                      <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                    </div>
                  )}

                  {/* Effet de survol */}
                  <div
                    className={`
                    absolute inset-0 rounded-xl transition-opacity duration-300
                    ${
                      isSelected
                        ? "opacity-0"
                        : "opacity-0 group-hover:opacity-100"
                    }
                  `}
                    style={{
                      background: `linear-gradient(135deg, ${mention.color}08, ${mention.color}03)`,
                    }}
                  />
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

export const MentionSelector = React.memo(MentionSelectorComponent, (prevProps, nextProps) => {
  return (
    prevProps.selectedMention === nextProps.selectedMention &&
    prevProps.className === nextProps.className
  );
});

MentionSelector.displayName = 'MentionSelector';
