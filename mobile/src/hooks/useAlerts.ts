import { useState, useEffect, useCallback } from 'react';
import * as api from '../lib/api';
import type { Alert } from '../lib/types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const save = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setSaving(true);
    try {
      await api.saveAlert(query);
      await fetch();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Errore nel salvataggio');
    } finally {
      setSaving(false);
    }
  }, [fetch]);

  const remove = useCallback(async (id: number) => {
    // Optimistic update
    setAlerts(prev => prev.filter(a => a.id !== id));
    try {
      await api.deleteAlert(id);
    } catch {
      // Revert on error
      fetch();
    }
  }, [fetch]);

  return { alerts, loading, saving, error, save, remove, refresh: fetch };
}
