'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PrenomData } from '@/types'
import { capitalizeFirstName } from '@/lib/utils'
import { calculateAverageScore } from '@/utils/scoring'
import { getComparisonColor } from '@/utils/colors'

interface ComparativeAnalysisProps {
  selectedPrenoms: PrenomData[]
  isMobile?: boolean
}

export function ComparativeAnalysis({ selectedPrenoms, isMobile = false }: ComparativeAnalysisProps) {
  if (selectedPrenoms.length < 2) return null

  const cardClassName = isMobile ? "lg:hidden order-2" : ""

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <CardTitle>Analyse comparative</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Indicateur principal : Félicitations du jury uniquement */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-sm mb-3 text-purple-900">🏆 TB+ (Félicitations du jury)</h4>
          {selectedPrenoms
            .map((prenom) => ({
              prenom,
              felicitations: prenom.taux_fel * 100
            }))
            .sort((a, b) => b.felicitations - a.felicitations)
            .map(({ prenom, felicitations }, rank) => {
              const color = getComparisonColor(rank + 1, selectedPrenoms.length)
              return (
                <div key={prenom.firstname} className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {rank === 0 && felicitations > 0 && <span className="text-lg">👑</span>}
                    <div className={`w-2 h-2 rounded-full ${color.bg}`} />
                    <span className="text-sm font-medium">
                      {capitalizeFirstName(prenom.firstname)}
                    </span>
                  </div>
                  <span className={`font-bold ${rank === 0 && felicitations > 0 ? 'text-purple-700 text-base' : 'text-gray-600 text-sm'}`}>
                    {felicitations.toFixed(1)}%
                  </span>
                </div>
              )
            })}
        </div>

        {/* Scores moyens avec indicateur visuel */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Scores moyens</h4>
          {(() => {
            const prenomsWithScores = selectedPrenoms.map(p => ({
              prenom: p,
              score: calculateAverageScore(p),
              tbPlus: p.taux_tb + p.taux_fel,
              fel: p.taux_fel
            }))

            prenomsWithScores.sort((a, b) => {
              if (a.score !== b.score) return b.score - a.score
              if (a.tbPlus !== b.tbPlus) return b.tbPlus - a.tbPlus
              return b.fel - a.fel
            })

            return prenomsWithScores.map((item, position) => {
              const { prenom, score } = item
              const color = getComparisonColor(position + 1, prenomsWithScores.length)

              const textColorMap: Record<string, string> = {
                'bg-green-600': 'text-green-600',
                'bg-green-500': 'text-green-600',
                'bg-yellow-500': 'text-yellow-600',
                'bg-orange-500': 'text-orange-600',
                'bg-red-500': 'text-red-600'
              }
              const textColor = textColorMap[color.bg] || 'text-gray-600'

              return (
                <div key={prenom.firstname} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${color.bg}`} />
                      <span className="text-sm">
                        {capitalizeFirstName(prenom.firstname)}
                      </span>
                    </div>
                    <span className={`font-bold ${textColor}`}>
                      {score.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress
                    value={score * 10}
                    className="h-2"
                    indicatorClassName={color.bg}
                  />
                </div>
              )
            })
          })()}
        </div>

        {/* Différences principales (seulement pour 2 prénoms) */}
        {selectedPrenoms.length === 2 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Différences principales</h4>
            {(() => {
              let better = selectedPrenoms[0]
              let worse = selectedPrenoms[1]
              const scoreDiff = calculateAverageScore(better) - calculateAverageScore(worse)

              if (scoreDiff < 0) {
                const temp = better
                better = worse
                worse = temp
              }

              return (
                <>
                  {/* TB+ */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">TB+</span>
                    <div className="flex items-center gap-2">
                      <span className={better.taux_fel > worse.taux_fel ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {(better.taux_fel * 100).toFixed(1)}%
                      </span>
                      <span className="text-muted-foreground">vs</span>
                      <span className={worse.taux_fel === 0 ? 'text-red-600 font-medium' : 'text-gray-500'}>
                        {(worse.taux_fel * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Sans mention */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sans mention</span>
                    <div className="flex items-center gap-2">
                      <span className={better.taux_sm < worse.taux_sm ? 'text-green-600 font-medium' : 'text-gray-500'}>
                        {(better.taux_sm * 100).toFixed(1)}%
                      </span>
                      <span className="text-muted-foreground">vs</span>
                      <span className={worse.taux_sm > better.taux_sm ? 'text-red-600 font-medium' : 'text-gray-500'}>
                        {(worse.taux_sm * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}