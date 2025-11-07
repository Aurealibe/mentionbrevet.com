'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from '@/components/SearchBar'
import { ComparativeAnalysis } from '@/components/ComparativeAnalysis'
import { loadAllPrenomData } from '@/lib/data'
import { capitalizeFirstName } from '@/lib/utils'
import { calculateAverageScore } from '@/utils/scoring'
import { getComparisonColor } from '@/utils/colors'
import type { PrenomData } from '@/types'
import dynamic from 'next/dynamic'

// Dynamic imports for recharts to reduce bundle size
const ResponsiveContainer = dynamic(
  () => import('recharts').then(mod => mod.ResponsiveContainer),
  { ssr: false }
) as React.ComponentType<any>
const RadarChart = dynamic(
  () => import('recharts').then(mod => mod.RadarChart),
  { ssr: false }
) as React.ComponentType<any>
const Radar = dynamic(
  () => import('recharts').then(mod => mod.Radar),
  { ssr: false }
) as React.ComponentType<any>
const PolarGrid = dynamic(
  () => import('recharts').then(mod => mod.PolarGrid),
  { ssr: false }
) as React.ComponentType<any>
const PolarAngleAxis = dynamic(
  () => import('recharts').then(mod => mod.PolarAngleAxis),
  { ssr: false }
) as React.ComponentType<any>
const PolarRadiusAxis = dynamic(
  () => import('recharts').then(mod => mod.PolarRadiusAxis),
  { ssr: false }
) as React.ComponentType<any>
const BarChart = dynamic(
  () => import('recharts').then(mod => mod.BarChart),
  { ssr: false }
) as React.ComponentType<any>
const Bar = dynamic(
  () => import('recharts').then(mod => mod.Bar),
  { ssr: false }
) as React.ComponentType<any>
const XAxis = dynamic(
  () => import('recharts').then(mod => mod.XAxis),
  { ssr: false }
) as React.ComponentType<any>
const YAxis = dynamic(
  () => import('recharts').then(mod => mod.YAxis),
  { ssr: false }
) as React.ComponentType<any>
const CartesianGrid = dynamic(
  () => import('recharts').then(mod => mod.CartesianGrid),
  { ssr: false }
) as React.ComponentType<any>
const Tooltip = dynamic(
  () => import('recharts').then(mod => mod.Tooltip),
  { ssr: false }
) as React.ComponentType<any>
const Legend = dynamic(
  () => import('recharts').then(mod => mod.Legend),
  { ssr: false }
) as React.ComponentType<any>

const MAX_COMPARISONS = 5

const ComparerPage = React.memo(() => {
  const [allData, setAllData] = React.useState<PrenomData[]>([])
  const [selectedPrenoms, setSelectedPrenoms] = React.useState<PrenomData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchKey, setSearchKey] = React.useState(0) // Force re-render of SearchBar

  const getChartColor = React.useCallback((prenom: PrenomData, allPrenoms: PrenomData[]): string => {
    const prenomsWithScores = allPrenoms.map(p => ({
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

    const position = prenomsWithScores.findIndex(p => p.prenom.firstname === prenom.firstname)
    const color = getComparisonColor(position + 1, allPrenoms.length) // +1 for 1-based index

    return color.hex
  }, [])

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadAllPrenomData()
        setAllData(data)
      } catch (error) {
        // Error loading data - state already set to show error
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handlePrenomSelect = React.useCallback((prenom: PrenomData | null) => {
    if (!prenom) return

    if (!selectedPrenoms.find(p => p.firstname === prenom.firstname)) {
      if (selectedPrenoms.length < MAX_COMPARISONS) {
        setSelectedPrenoms([...selectedPrenoms, prenom])
        // Force SearchBar to reset by changing its key
        setSearchKey(prev => prev + 1)
      }
    }
  }, [selectedPrenoms])

  const removePrenom = React.useCallback((firstname: string) => {
    setSelectedPrenoms(prev => prev.filter(p => p.firstname !== firstname))
  }, [])

  const getRadarData = React.useMemo(() => {
    if (selectedPrenoms.length === 0) return []

    return [
      {
        subject: 'Sans mention',
        ...selectedPrenoms.reduce((acc, p, i) => ({
          ...acc,
          [`prenom${i}`]: p.taux_sm * 100
        }), {})
      },
      {
        subject: 'Assez bien',
        ...selectedPrenoms.reduce((acc, p, i) => ({
          ...acc,
          [`prenom${i}`]: p.taux_ab * 100
        }), {})
      },
      {
        subject: 'Bien',
        ...selectedPrenoms.reduce((acc, p, i) => ({
          ...acc,
          [`prenom${i}`]: p.taux_b * 100
        }), {})
      },
      {
        subject: 'Très bien',
        ...selectedPrenoms.reduce((acc, p, i) => ({
          ...acc,
          [`prenom${i}`]: p.taux_tb * 100
        }), {})
      },
      {
        subject: 'Félicitations',
        ...selectedPrenoms.reduce((acc, p, i) => ({
          ...acc,
          [`prenom${i}`]: p.taux_fel * 100
        }), {})
      },
    ]
  }, [selectedPrenoms])

  const getBarData = React.useMemo(() => {
    return selectedPrenoms.map(p => ({
      name: capitalizeFirstName(p.firstname),
      'Sans mention': p.taux_sm * 100,
      'Assez bien': p.taux_ab * 100,
      'Bien': p.taux_b * 100,
      'Très bien': p.taux_tb * 100,
      'Félicitations': p.taux_fel * 100,
    }))
  }, [selectedPrenoms])


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Comparateur de prénoms</h1>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
          {/* Colonne principale (gauche sur desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sélection des prénoms</CardTitle>
                <CardDescription>
                  Ajoutez jusqu&apos;à {MAX_COMPARISONS} prénoms à comparer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {(() => {
                    // Trier les prénoms par score décroissant
                    const sortedPrenoms = [...selectedPrenoms].sort((a, b) => {
                      const scoreA = calculateAverageScore(a)
                      const scoreB = calculateAverageScore(b)
                      if (scoreA !== scoreB) return scoreB - scoreA
                      // Si scores égaux, départager par TB+
                      return (b.taux_tb + b.taux_fel) - (a.taux_tb + a.taux_fel)
                    })

                    return sortedPrenoms.map((prenom, index) => {
                      const color = getComparisonColor(index + 1, sortedPrenoms.length)
                      return (
                        <div
                          key={prenom.firstname}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${color.bg}`} />
                            <div>
                              <p className="font-medium">
                                {capitalizeFirstName(prenom.firstname)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {prenom.count.toLocaleString('fr-FR')} candidats • {(prenom.taux_tb * 100).toFixed(0)}% mention TB • {(prenom.taux_fel * 100).toFixed(0)}% TB+
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {calculateAverageScore(prenom).toFixed(1)}/10
                            </Badge>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removePrenom(prenom.firstname)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  })()}

                  {selectedPrenoms.length < MAX_COMPARISONS && (
                    <div className="pt-2">
                      <SearchBar
                        key={searchKey}
                        data={allData}
                        selectedPrenom={null}
                        onPrenomSelect={handlePrenomSelect}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sur mobile : Analyse comparative en 2ème position */}
            <ComparativeAnalysis selectedPrenoms={selectedPrenoms} isMobile={true} />

            {selectedPrenoms.length >= 2 && (
              <>
                <Card className="order-3 lg:order-2">
                  <CardHeader>
                    <CardTitle>Graphique radar</CardTitle>
                    <CardDescription>
                      Comparaison visuelle des mentions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={getRadarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" scale="auto" reversed={false} />
                        <PolarRadiusAxis angle={90} domain={[0, 40]} />
                        {selectedPrenoms.map((prenom, index) => (
                          <Radar
                            key={index}
                            name={capitalizeFirstName(prenom.firstname)}
                            dataKey={`prenom${index}`}
                            stroke={getChartColor(prenom, selectedPrenoms)}
                            fill={getChartColor(prenom, selectedPrenoms)}
                            fillOpacity={0.2}
                          />
                        ))}
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="order-4 lg:order-3">
                  <CardHeader>
                    <CardTitle>Distribution des mentions</CardTitle>
                    <CardDescription>
                      Comparaison en barres groupées
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getBarData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} tickFormatter={(value: any) => `${value}%`} />
                        <Tooltip
                          formatter={(value: any) => typeof value === 'number' ? `${value.toFixed(1)}%` : value}
                          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0' }}
                        />
                        <Legend />
                        <Bar dataKey="Sans mention" fill="#ef4444" />
                        <Bar dataKey="Assez bien" fill="#f59e0b" />
                        <Bar dataKey="Bien" fill="#3b82f6" />
                        <Bar dataKey="Très bien" fill="#22c55e" />
                        <Bar dataKey="Félicitations" fill="#a855f7" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Colonne de droite (desktop seulement) */}
          <div className="hidden lg:flex lg:flex-col gap-6">
            <ComparativeAnalysis selectedPrenoms={selectedPrenoms} />

            <Card className="order-5 lg:order-2">
              <CardHeader>
                <CardTitle className="text-lg">📊 Méthodologie</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Le score sur 10 est calculé selon une moyenne pondérée des mentions obtenues :
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• Sans mention : 0/10</li>
                  <li>• Assez bien : 4/10</li>
                  <li>• Bien : 6/10</li>
                  <li>• Très bien : 8/10</li>
                  <li>• TB+ (Félicitations) : 10/10</li>
                </ul>
                <p className="pt-2">
                  Les données sont issues du brevet des collèges 2025. Seuls les prénoms avec plus de 10 occurrences sont disponibles.
                </p>
              </CardContent>
            </Card>

            {selectedPrenoms.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Commencez la comparaison</h3>
                  <p className="text-sm text-muted-foreground">
                    Utilisez la recherche pour ajouter des prénoms à comparer
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

ComparerPage.displayName = 'ComparerPage'

export default ComparerPage