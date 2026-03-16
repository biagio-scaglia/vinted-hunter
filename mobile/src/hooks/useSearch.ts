import { useState, useCallback } from 'react';
import * as api from '../lib/api';
import type { Product, SearchFilters } from '../lib/types';

export interface SearchState {
  results: Product[];
  loading: boolean;
  error: string | null;
  lastQuery: string;
}

export function useSearch(filters: SearchFilters) {
  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    lastQuery: '',
  });

  const run = useCallback(
    async (query: string) => {
      if (!query.trim()) return;
      setState(s => ({ ...s, loading: true, error: null, lastQuery: query }));
      try {
        const args: Parameters<typeof api.search>[1] = {
          sources: filters.sources.length ? filters.sources : undefined,
        };
        if (filters.min_price) args.min_price = parseFloat(filters.min_price);
        if (filters.max_price) args.max_price = parseFloat(filters.max_price);

        const data = await api.search(query, args);
        setState(s => ({ ...s, results: data.results ?? [], loading: false }));
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Errore sconosciuto';
        setState(s => ({ ...s, error: msg, loading: false }));
      }
    },
    [filters]
  );

  const clear = useCallback(() => {
    setState({ results: [], loading: false, error: null, lastQuery: '' });
  }, []);

  return { ...state, run, clear };
}
