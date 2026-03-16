import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SOURCE_COLORS } from '../lib/constants';
import SourceBadge from './SourceBadge';
import type { Product } from '../lib/types';

interface Props {
  product: Product;
  onPress: (product: Product) => void;
}

export default function ProductCard({ product, onPress }: Props) {
  const priceColor = SOURCE_COLORS[product.source] ?? COLORS.primary;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product)}
      activeOpacity={0.75}
    >
      <View style={styles.imageWrap}>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        <View style={styles.badgeOverlay}>
          <SourceBadge source={product.source} />
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <View style={styles.footer}>
          <Text style={[styles.price, { color: priceColor }]}>{product.price}</Text>
          {product.condition && (
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{product.condition}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    margin: 4,
  },
  imageWrap: {
    position: 'relative',
    height: 150,
    backgroundColor: COLORS.surfaceAlt,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
  },
  badgeOverlay: {
    position: 'absolute',
    top: 6,
    left: 6,
  },
  body: {
    padding: 8,
    gap: 6,
  },
  title: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
  },
  conditionBadge: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  conditionText: {
    color: COLORS.textDim,
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
