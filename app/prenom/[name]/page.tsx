import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { loadData } from '@/lib/data'
import { findSimilarNames } from '@/lib/similarity'
import { calculateAverageScore } from '@/utils/scoring'
import type { PrenomData } from '@/types'

interface PageProps {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params
  const decodedName = decodeURIComponent(name)
  const formattedName = decodedName.charAt(0).toUpperCase() + decodedName.slice(1).toLowerCase()

  return {
    title: `${formattedName} - Statistiques Brevet des Collèges | MentionBrevet`,
    description: `Découvrez les statistiques du brevet des collèges pour le prénom ${formattedName}. Taux de réussite, mentions obtenues et comparaisons avec d'autres prénoms.`,
    openGraph: {
      title: `${formattedName} - Statistiques Brevet`,
      description: `Statistiques détaillées du brevet pour le prénom ${formattedName}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedName} - Statistiques Brevet`,
      description: `Découvrez les performances au brevet pour le prénom ${formattedName}`,
    },
  }
}

function getMentionLabel(type: string): string {
  const labels: Record<string, string> = {
    taux_sm: 'Sans mention',
    taux_ab: 'Assez bien',
    taux_b: 'Bien',
    taux_tb: 'Très bien',
    taux_fel: 'Félicitations',
  }
  return labels[type] || type
}

function getMentionColor(type: string): string {
  const colors: Record<string, string> = {
    taux_sm: 'bg-gray-500',
    taux_ab: 'bg-yellow-500',
    taux_b: 'bg-blue-500',
    taux_tb: 'bg-green-500',
    taux_fel: 'bg-purple-500',
  }
  return colors[type] || 'bg-gray-500'
}


export default async function PrenomPage({ params }: PageProps) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)
  const searchName = decodedName.toLowerCase()

  const allData = await loadData()
  const prenomData = allData.find(p => p.firstname.toLowerCase() === searchName)

  if (!prenomData) {
    notFound()
  }

  const similarNames = findSimilarNames(prenomData, allData, 5)
  const averageScore = calculateAverageScore(prenomData)
  const formattedName = prenomData.firstname.charAt(0).toUpperCase() + prenomData.firstname.slice(1)

  const mentions = [
    { type: 'taux_fel', label: 'TB+ (Félicitations)', value: prenomData.taux_fel },
    { type: 'taux_tb', label: 'Très bien', value: prenomData.taux_tb },
    { type: 'taux_b', label: 'Bien', value: prenomData.taux_b },
    { type: 'taux_ab', label: 'Assez bien', value: prenomData.taux_ab },
    { type: 'taux_sm', label: 'Sans mention', value: prenomData.taux_sm },
  ]

  const bestMention = mentions.find(m => m.value > 0)
  const totalWithMention = prenomData.taux_ab + prenomData.taux_b + prenomData.taux_tb + prenomData.taux_fel

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
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl">{formattedName}</CardTitle>
                    <CardDescription className="mt-2">
                      Basé sur {prenomData.count.toLocaleString('fr-FR')} candidats
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    Score: {averageScore.toFixed(1)}/10
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Répartition des mentions</h3>
                  <div className="space-y-3">
                    {mentions.map((mention) => (
                      <div key={mention.type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{mention.label}</span>
                          <span className="text-muted-foreground">
                            {(mention.value * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={mention.value * 100}
                          className="h-3"
                          indicatorClassName={getMentionColor(mention.type)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className={prenomData.taux_sm > 0.2 ? 'border-red-200 bg-red-50/50' : ''}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-xl">🔴</span>
                        Sans mention
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-2xl font-bold ${prenomData.taux_sm > 0.2 ? 'text-red-600' : 'text-gray-900'}`}>
                        {(prenomData.taux_sm * 100).toFixed(0)}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={(prenomData.taux_tb + prenomData.taux_fel) > 0.3 ? 'border-purple-200 bg-purple-50/50' : ''}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-xl">🏆</span>
                        TB+
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-2xl font-bold ${(prenomData.taux_tb + prenomData.taux_fel) > 0.3 ? 'text-purple-600' : 'text-gray-900'}`}>
                        {((prenomData.taux_tb + prenomData.taux_fel) * 100).toFixed(0)}%
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyse détaillée</CardTitle>
                <CardDescription>
                  Interprétation des résultats pour {formattedName}
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Les candidats prénommés <strong>{formattedName}</strong> obtiennent en moyenne
                  un score de <strong>{averageScore.toFixed(1)}/10</strong> au brevet des collèges.
                </p>
                {totalWithMention > 0.5 && (
                  <p>
                    Avec <strong>{(totalWithMention * 100).toFixed(1)}%</strong> de mentions,
                    ce prénom se situe dans la moyenne haute des résultats.
                  </p>
                )}
                {prenomData.taux_fel > 0.1 && (
                  <p>
                    Notamment, <strong>{(prenomData.taux_fel * 100).toFixed(1)}%</strong> obtiennent
                    TB+ (félicitations du jury), ce qui est remarquable.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prénoms similaires</CardTitle>
                <CardDescription>
                  Prénoms avec des résultats proches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {similarNames.map((similar) => (
                    <Link
                      key={similar.firstname}
                      href={`/prenom/${encodeURIComponent(similar.firstname)}`}
                      className="block"
                    >
                      <Card className="hover:bg-accent transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {similar.firstname.charAt(0).toUpperCase() + similar.firstname.slice(1)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {similar.count.toLocaleString('fr-FR')} candidats
                              </p>
                            </div>
                            <Badge variant="outline">
                              {(calculateAverageScore(similar)).toFixed(1)}/10
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 Méthodologie</CardTitle>
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
                  Les données sont issues du brevet des collèges 2025. Seuls les prénoms avec plus de 10 occurrences sont analysés pour garantir la pertinence statistique.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rang (félicitations)</span>
                  <span className="font-medium">
                    #{allData.sort((a, b) => b.taux_fel - a.taux_fel).findIndex(p => p.firstname === prenomData.firstname) + 1}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rang (très bien)</span>
                  <span className="font-medium">
                    #{allData.sort((a, b) => b.taux_tb - a.taux_tb).findIndex(p => p.firstname === prenomData.firstname) + 1}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Popularité</span>
                  <span className="font-medium">
                    #{allData.sort((a, b) => b.count - a.count).findIndex(p => p.firstname === prenomData.firstname) + 1}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const data = await loadData()
  const topPrenoms = data
    .sort((a, b) => b.count - a.count)
    .slice(0, 100)

  return topPrenoms.map((prenom) => ({
    name: prenom.firstname,
  }))
}