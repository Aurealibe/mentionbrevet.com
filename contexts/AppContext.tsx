'use client'

import * as React from 'react'
import { PrenomData, MentionKey } from '@/types'

interface AppContextValue {
  // Selected data
  selectedPrenom: PrenomData | null
  setSelectedPrenom: (prenom: PrenomData | null) => void

  // Selected mention
  selectedMention: MentionKey
  setSelectedMention: (mention: MentionKey) => void

  // Comparison mode
  comparisonPrenoms: PrenomData[]
  addToComparison: (prenom: PrenomData) => void
  removeFromComparison: (firstname: string) => void
  clearComparison: () => void
}

const AppContext = React.createContext<AppContextValue | undefined>(undefined)

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [selectedPrenom, setSelectedPrenom] = React.useState<PrenomData | null>(null)
  const [selectedMention, setSelectedMention] = React.useState<MentionKey>('taux_tb')
  const [comparisonPrenoms, setComparisonPrenoms] = React.useState<PrenomData[]>([])

  const addToComparison = React.useCallback((prenom: PrenomData) => {
    setComparisonPrenoms(prev => {
      // Avoid duplicates
      if (prev.some(p => p.firstname === prenom.firstname)) {
        return prev
      }
      // Limit to 5 comparisons
      if (prev.length >= 5) {
        return [...prev.slice(1), prenom]
      }
      return [...prev, prenom]
    })
  }, [])

  const removeFromComparison = React.useCallback((firstname: string) => {
    setComparisonPrenoms(prev => prev.filter(p => p.firstname !== firstname))
  }, [])

  const clearComparison = React.useCallback(() => {
    setComparisonPrenoms([])
  }, [])

  const value = React.useMemo(() => ({
    selectedPrenom,
    setSelectedPrenom,
    selectedMention,
    setSelectedMention,
    comparisonPrenoms,
    addToComparison,
    removeFromComparison,
    clearComparison,
  }), [
    selectedPrenom,
    selectedMention,
    comparisonPrenoms,
    addToComparison,
    removeFromComparison,
    clearComparison,
  ])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = React.useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

// Export individual hooks for convenience
export function useSelectedPrenom() {
  const { selectedPrenom, setSelectedPrenom } = useAppContext()
  return [selectedPrenom, setSelectedPrenom] as const
}

export function useSelectedMention() {
  const { selectedMention, setSelectedMention } = useAppContext()
  return [selectedMention, setSelectedMention] as const
}

export function useComparison() {
  const { comparisonPrenoms, addToComparison, removeFromComparison, clearComparison } = useAppContext()
  return {
    prenoms: comparisonPrenoms,
    add: addToComparison,
    remove: removeFromComparison,
    clear: clearComparison,
  }
}