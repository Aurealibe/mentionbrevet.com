'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, GitCompare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/SearchBar'
import { PrenomData } from '@/types'

interface HeroSectionProps {
  searchData: PrenomData[]
  selectedPrenom: PrenomData | null
  onPrenomSelect: (prenom: PrenomData | null) => void
}

export const HeroSection = React.memo(({
  searchData,
  selectedPrenom,
  onPrenomSelect
}: HeroSectionProps) => {
  return (
    <section className="relative overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative container-custom pt-6 pb-20 lg:pt-8 lg:pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium animate-slide-down">
            <Sparkles className="w-4 h-4" />
            <span>Données du Brevet des Collèges 2025</span>
          </div>

          <h1 className="animate-slide-up delay-100">
            Mentions du Brevet par Prénom
            <span className="block text-primary mt-2">
              Statistiques Officielles 2025
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up delay-200">
            Découvrez les statistiques officielles du brevet des collèges 2025
            par prénom. Analysez les taux de mentions (TB, B, AB) et explorez
            les corrélations entre prénoms et réussite scolaire.{" "}
            <span className="font-semibold text-foreground">
              {searchData.length} prénoms analysés
            </span>
            .
          </p>

          <div className="mt-8 max-w-4xl mx-auto animate-slide-up delay-300 space-y-8">
            <SearchBar
              data={searchData}
              selectedPrenom={selectedPrenom}
              onPrenomSelect={onPrenomSelect}
              className="card-glass"
            />
            <div className="flex justify-center">
              <Link href="/comparer">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <GitCompare className="h-5 w-5" />
                  Comparer des prénoms
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'