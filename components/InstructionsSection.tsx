'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { UI_MESSAGES } from '@/lib/constants'

export const InstructionsSection = React.memo(() => {
  return (
    <section className="container-custom pb-12">
      <Card className="card-glass animate-slide-up delay-800">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instructions d'utilisation */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Comment utiliser cette application</span>
              </h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  • <strong>Recherche :</strong> Tapez un prénom pour voir ses
                  statistiques détaillées
                </p>
                <p>
                  • <strong>Graphique :</strong> Cliquez sur un prénom pour
                  l&apos;analyser
                </p>
                <p>
                  • <strong>Mentions :</strong> Sélectionnez le type de
                  mention à afficher
                </p>
                <p>
                  • <strong>Navigation :</strong> Utilisez les raccourcis
                  clavier pour une expérience plus rapide
                </p>
              </div>
            </div>

            {/* Raccourcis clavier */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Raccourcis clavier</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <kbd className="bg-muted px-2 py-1 rounded font-mono">
                    F
                  </kbd>
                  <span className="text-muted-foreground">Rechercher</span>
                </div>
                <div className="flex items-center space-x-2">
                  <kbd className="bg-muted px-2 py-1 rounded font-mono">
                    Esc
                  </kbd>
                  <span className="text-muted-foreground">Effacer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <kbd className="bg-muted px-2 py-1 rounded font-mono">
                    1-5
                  </kbd>
                  <span className="text-muted-foreground">Mentions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <kbd className="bg-muted px-2 py-1 rounded font-mono">
                    Tab
                  </kbd>
                  <span className="text-muted-foreground">Navigation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Note méthodologique */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>📊 Méthodologie :</strong> {UI_MESSAGES.MIN_COUNT_INFO}.
              Les données sont issues du brevet des collèges 2025. Le
              graphique utilise une échelle logarithmique pour l&apos;axe des
              occurrences afin d&apos;optimiser la lisibilité.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
})

InstructionsSection.displayName = 'InstructionsSection'