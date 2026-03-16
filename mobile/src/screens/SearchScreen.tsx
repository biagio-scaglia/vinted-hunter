import { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import SearchBar from '../components/SearchBar';
import StatsBar from '../components/StatsBar';
import ProductCard from '../components/ProductCard';
import FilterSheet from '../components/FilterSheet';
import EmptyState from '../components/EmptyState';
import { useSearch } from '../hooks/useSearch';
import { useSources } from '../hooks/useSources';
import { COLORS } from '../lib/constants';
import * as api from '../lib/api';
import type { Product, SearchFilters, RootStackParamList, TabParamList } from '../lib/types';

type Nav = StackNavigationProp<RootStackParamList, 'Tabs'>;
type Route = RouteProp<TabParamList, 'Search'>;

const DEFAULT_FILTERS: SearchFilters = { min_price: '', max_price: '', sources: [] };

export default function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const filterRef = useRef<BottomSheetModal>(null);
  const sources = useSources();

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [saving, setSaving] = useState(false);

  const { results, loading, error, lastQuery, run, cancel } = useSearch(filters);

  // Initialise sources once loaded
  useEffect(() => {
    if (sources.length && !filters.sources.length) {
      setFilters(f => ({ ...f, sources: sources.map(s => s.name) }));
    }
  }, [sources]);

  // Pre-fill query from Scanner tab
  useEffect(() => {
    if (route.params?.query) {
      setQuery(route.params.query);
      run(route.params.query);
    }
  }, [route.params?.query]);

  const handleSearch = useCallback(() => run(query), [query, run]);

  const handleMonitor = useCallback(async () => {
    if (!lastQuery) return;
    setSaving(true);
    try { await api.saveAlert(lastQuery); } finally { setSaving(false); }
  }, [lastQuery]);

  const filterActive =
    !!filters.min_price || !!filters.max_price || filters.sources.length !== sources.length;

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => (
      <ProductCard
        product={item}
        onPress={p => navigation.navigate('ProductDetail', { product: p })}
      />
    ),
    [navigation]
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <View style={styles.root}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={handleSearch}
        onCancel={cancel}
        onFilterPress={() => filterRef.current?.present()}
        loading={loading}
        filterActive={filterActive}
      />

      <StatsBar results={results} query={lastQuery} onMonitor={handleMonitor} saving={saving} />

      {results.length === 0 && !loading ? (
        error ? (
          <EmptyState
            icon="warning-outline"
            title="Errore di rete"
            subtitle={error}
          />
        ) : (
          <EmptyState
            icon="search-outline"
            title="Inizia a cercare"
            subtitle="Digita un prodotto e premi invio. Puoi anche scannerizzare un barcode o usare l'OCR."
          />
        )
      ) : (
        <FlatList
          data={results}
          numColumns={2}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterSheet
        ref={filterRef}
        filters={filters}
        sources={sources}
        onApply={f => { setFilters(f); run(query); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  grid: { padding: 8 },
  row: { justifyContent: 'space-between' },
});
