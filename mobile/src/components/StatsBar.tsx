import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../lib/constants';
import type { Product } from '../lib/types';

interface Props {
  results: Product[];
  query: string;
  onMonitor: () => void;
  saving?: boolean;
}

export default function StatsBar({ results, query, onMonitor, saving }: Props) {
  if (!results.length) return null;

  const prices = results.map(r => r.raw_price).filter(Boolean);
  const min = prices.length ? Math.min(...prices).toFixed(2) : null;
  const max = prices.length ? Math.max(...prices).toFixed(2) : null;

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.count}>
          <Text style={styles.countNum}>{results.length}</Text> risultati
        </Text>
        {min && max && (
          <Text style={styles.range}>
            €{min} – €{max}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.monitorBtn}
        onPress={onMonitor}
        activeOpacity={0.75}
        disabled={saving}
      >
        <Ionicons name="notifications-outline" size={14} color={COLORS.primary} />
        <Text style={styles.monitorText}>{saving ? 'Salvo...' : 'Monitor'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  count: {
    color: COLORS.textDim,
    fontSize: 12,
  },
  countNum: {
    color: COLORS.text,
    fontWeight: '700',
  },
  range: {
    color: COLORS.textDim,
    fontSize: 12,
  },
  monitorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryDim,
  },
  monitorText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});
