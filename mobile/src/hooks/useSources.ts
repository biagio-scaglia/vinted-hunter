import { useState, useEffect } from 'react';
import * as api from '../lib/api';
import type { MarketplaceInfo } from '../lib/types';

export function useSources() {
  const [sources, setSources] = useState<MarketplaceInfo[]>([]);

  useEffect(() => {
    api.getSources().then(setSources).catch(() => {});
  }, []);

  return sources;
}
