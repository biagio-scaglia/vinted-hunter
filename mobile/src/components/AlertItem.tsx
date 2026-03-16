import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../lib/constants';
import type { Alert } from '../lib/types';

interface Props {
  alert: Alert;
  onDelete: (id: number) => void;
}

export default function AlertItem({ alert, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Ionicons name="notifications" size={16} color={COLORS.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.keyword}>{alert.keyword || alert.query}</Text>
          {alert.max_price != null && (
            <Text style={styles.meta}>max €{alert.max_price.toFixed(2)}</Text>
          )}
          {alert.condition && (
            <Text style={styles.meta}>{alert.condition}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(alert.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="trash-outline" size={18} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  keyword: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  meta: {
    color: COLORS.textDim,
    fontSize: 12,
  },
  deleteBtn: {
    padding: 4,
  },
});
