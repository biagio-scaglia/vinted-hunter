import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SOURCE_COLORS, SOURCE_LABELS } from '../lib/constants';
import SourceBadge from '../components/SourceBadge';
import type { RootStackParamList } from '../lib/types';

type Route = RouteProp<RootStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const { params: { product } } = useRoute<Route>();
  const priceColor = SOURCE_COLORS[product.source] ?? COLORS.primary;

  const openLink = async () => {
    await WebBrowser.openBrowserAsync(product.link, {
      toolbarColor: COLORS.surface,
      controlsColor: COLORS.primary,
    });
  };

  const shareProduct = async () => {
    await Share.share({
      title: product.title,
      message: `${product.title} - ${product.price}\n${product.link}`,
    });
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageWrap}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={48} color={COLORS.muted} />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.body}>
          <SourceBadge source={product.source} />

          <Text style={styles.title}>{product.title}</Text>

          <Text style={[styles.price, { color: priceColor }]}>{product.price}</Text>

          {product.condition && (
            <View style={styles.conditionRow}>
              <Ionicons name="star-outline" size={14} color={COLORS.muted} />
              <Text style={styles.conditionText}>{product.condition}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Ionicons name="storefront-outline" size={14} color={COLORS.muted} />
            <Text style={styles.metaText}>
              {SOURCE_LABELS[product.source] ?? product.source}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.shareBtn} onPress={shareProduct} activeOpacity={0.75}>
          <Ionicons name="share-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.openBtn} onPress={openLink} activeOpacity={0.8}>
          <Ionicons name="open-outline" size={18} color="#fff" />
          <Text style={styles.openText}>Vedi annuncio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  imageWrap: { height: 280, backgroundColor: COLORS.surfaceAlt },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: 20, gap: 10 },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  conditionText: { color: COLORS.textDim, fontSize: 14 },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: { color: COLORS.textDim, fontSize: 13 },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  shareBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  openText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
