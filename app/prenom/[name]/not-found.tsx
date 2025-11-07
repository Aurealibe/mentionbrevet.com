import Link from 'next/link'
import { AlertCircle, ArrowLeft, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Prénom introuvable</CardTitle>
          <CardDescription>
            Ce prénom n&apos;existe pas dans notre base de données ou n&apos;a pas suffisamment de données (minimum 10 occurrences).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Link href="/">
              <Button className="w-full gap-2">
                <Search className="h-4 w-4" />
                Rechercher un autre prénom
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>Suggestions:</p>
            <ul className="mt-2 space-y-1">
              <li>Vérifiez l&apos;orthographe du prénom</li>
              <li>Essayez une variante du prénom</li>
              <li>Utilisez la recherche pour trouver des prénoms similaires</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}