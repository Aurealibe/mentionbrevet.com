import { useState, useEffect, useCallback, useMemo } from 'react';
import { PrenomData } from '@/types';
import { loadAllPrenomData } from '@/lib/data';

interface UsePrenomDataReturn {
  data: PrenomData[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing prenom data
 */
export const usePrenomData = (): UsePrenomDataReturn => {
  const [data, setData] = useState<PrenomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const prenoms = await loadAllPrenomData();
      setData(prenoms);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'));
      console.error('Error loading prenoms:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

/**
 * Custom hook for managing selected prenom
 */
export const useSelectedPrenom = (
  initialPrenom?: PrenomData | null
): [PrenomData | null, (prenom: PrenomData | null) => void] => {
  const [selectedPrenom, setSelectedPrenom] = useState<PrenomData | null>(
    initialPrenom || null
  );

  const handleSelectPrenom = useCallback((prenom: PrenomData | null) => {
    setSelectedPrenom(prenom);
  }, []);

  return [selectedPrenom, handleSelectPrenom];
};

/**
 * Custom hook for prenom search with memoization
 */
export const usePrenomSearch = (
  data: PrenomData[],
  searchTerm: string
): PrenomData[] => {
  return useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    const normalizedSearch = searchTerm.toLowerCase();
    return data
      .filter((prenom) =>
        prenom.firstname.toLowerCase().includes(normalizedSearch)
      )
      .slice(0, 10); // Limit results for performance
  }, [data, searchTerm]);
};