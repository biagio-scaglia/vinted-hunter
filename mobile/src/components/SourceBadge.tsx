import { View, Text, StyleSheet } from 'react-native';
import { SOURCE_COLORS, SOURCE_LABELS } from '../lib/constants';

interface Props {
  source: string;
  displayName?: string;
  color?: string;
}

export default function SourceBadge({ source, displayName, color }: Props) {
  const bg = color ?? SOURCE_COLORS[source] ?? '#64748b';
  const label = displayName ?? SOURCE_LABELS[source] ?? source;

  return (
    <View style={[styles.badge, { backgroundColor: bg + '22', borderColor: bg + '44' }]}>
      <View style={[styles.dot, { backgroundColor: bg }]} />
      <Text style={[styles.text, { color: bg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
