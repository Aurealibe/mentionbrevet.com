'use client'

import * as React from 'react'
import { PrenomData } from '@/types'
import { loadPrenomData, loadAllPrenomData } from '@/lib/data'

interface UseDatasetOptions {
  forSearch?: boolean // If true, loads all data (28+), otherwise chart data (100+)
}

interface UseDatasetReturn {
  data: PrenomData[]
  loading: boolean
  error: Error | null
  reload: () => void
}

/**
 * Custom hook for efficient data loading and management
 * Prevents multiple components from loading the same data
 */
export function useDataset(options: UseDatasetOptions = {}): UseDatasetReturn {
  const { forSearch = false } = options

  const [data, setData] = React.useState<PrenomData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [reloadTrigger, setReloadTrigger] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Choose appropriate loader based on use case
        const loadedData = forSearch
          ? await loadAllPrenomData()
          : await loadPrenomData()

        if (!cancelled) {
          setData(loadedData)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load data'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [forSearch, reloadTrigger])

  const reload = React.useCallback(() => {
    setReloadTrigger(prev => prev + 1)
  }, [])

  return { data, loading, error, reload }
}

/**
 * Hook for searching within loaded data
 */
export function useSearchableDataset() {
  const { data, loading, error, reload } = useDataset({ forSearch: true })

  const search = React.useCallback((term: string, limit = 10) => {
    if (!term.trim()) return []

    const normalizedTerm = term.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    return data
      .filter(prenom => {
        const normalizedPrenom = prenom.firstname.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
        return normalizedPrenom.includes(normalizedTerm)
      })
      .sort((a, b) => {
        const aNormalized = a.firstname.toLowerCase()
        const bNormalized = b.firstname.toLowerCase()

        const aStartsWith = aNormalized.startsWith(normalizedTerm)
        const bStartsWith = bNormalized.startsWith(normalizedTerm)

        if (aStartsWith && !bStartsWith) return -1
        if (!aStartsWith && bStartsWith) return 1

        return b.count - a.count
      })
      .slice(0, limit)
  }, [data])

  return { data, loading, error, reload, search }
}