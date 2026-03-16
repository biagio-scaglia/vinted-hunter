import { forwardRef, useCallback, useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { COLORS } from '../lib/constants';
import type { MarketplaceInfo, SearchFilters } from '../lib/types';

interface Props {
  filters: SearchFilters;
  sources: MarketplaceInfo[];
  onApply: (f: SearchFilters) => void;
}

const FilterSheet = forwardRef<BottomSheetModal, Props>(({ filters, sources, onApply }, ref) => {
  const snapPoints = useMemo(() => ['55%'], []);
  const [local, setLocal] = useState<SearchFilters>(filters);

  useEffect(() => { setLocal(filters); }, [filters]);

  const toggleSource = (name: string) => {
    setLocal(prev => {
      const has = prev.sources.includes(name);
      // Keep at least one selected
      if (has && prev.sources.length === 1) return prev;
      return {
        ...prev,
        sources: has ? prev.sources.filter(s => s !== name) : [...prev.sources, name],
      };
    });
  };

  const apply = () => {
    onApply(local);
    (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
  };

  const reset = () => {
    const fresh: SearchFilters = { min_price: '', max_price: '', sources: sources.map(s => s.name) };
    setLocal(fresh);
    onApply(fresh);
    (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
  };

  const renderBackdrop = useCallback(
    (props: Parameters<typeof BottomSheetBackdrop>[0]) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bg}
      handleIndicatorStyle={styles.handle}
      keyboardBehavior={Platform.OS === 'ios' ? 'extend' : 'interactive'}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.heading}>Filtri</Text>

        {/* Stores */}
        <Text style={styles.label}>Marketplace</Text>
        <View style={styles.sourceRow}>
          {sources.map(src => {
            const active = local.sources.includes(src.name);
            return (
              <TouchableOpacity
                key={src.name}
                style={[
                  styles.sourceChip,
                  active && { borderColor: src.color, backgroundColor: src.color + '22' },
                ]}
                onPress={() => toggleSource(src.name)}
                activeOpacity={0.7}
              >
                <View style={[styles.dot, { backgroundColor: src.color }]} />
                <Text style={[styles.sourceLabel, active && { color: src.color }]}>
                  {src.display_name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Price range */}
        <Text style={styles.label}>Fascia di prezzo</Text>
        <View style={styles.priceRow}>
          <View style={styles.priceInput}>
            <Text style={styles.pricePrefix}>€</Text>
            <TextInput
              style={styles.input}
              value={local.min_price}
              onChangeText={v => setLocal(p => ({ ...p, min_price: v }))}
              placeholder="Min"
              placeholderTextColor={COLORS.muted}
              keyboardType="decimal-pad"
              returnKeyType="next"
            />
          </View>
          <Text style={styles.priceDash}>—</Text>
          <View style={styles.priceInput}>
            <Text style={styles.pricePrefix}>€</Text>
            <TextInput
              style={styles.input}
              value={local.max_price}
              onChangeText={v => setLocal(p => ({ ...p, max_price: v }))}
              placeholder="Max"
              placeholderTextColor={COLORS.muted}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={apply}
            />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.resetBtn} onPress={reset} activeOpacity={0.7}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={apply} activeOpacity={0.8}>
            <Text style={styles.applyText}>Applica filtri</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

FilterSheet.displayName = 'FilterSheet';
export default FilterSheet;

const styles = StyleSheet.create({
  bg: { backgroundColor: COLORS.surfaceAlt },
  handle: { backgroundColor: COLORS.muted },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 12 },
  heading: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  sourceRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  sourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  sourceLabel: { color: COLORS.textDim, fontSize: 14, fontWeight: '600' },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priceInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    height: 44,
  },
  pricePrefix: { color: COLORS.muted, marginRight: 4 },
  input: { flex: 1, color: COLORS.text, fontSize: 15 },
  priceDash: { color: COLORS.muted },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  resetBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: { color: COLORS.textDim, fontWeight: '600' },
  applyBtn: {
    flex: 2,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
