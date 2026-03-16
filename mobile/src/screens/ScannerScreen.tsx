import { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../lib/constants';
import { lookupBarcode } from '../lib/api';
import type { TabParamList } from '../lib/types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

type Nav = BottomTabNavigationProp<TabParamList, 'Scanner'>;

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [productName, setProductName] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const navigation = useNavigation<Nav>();

  const lineY = useSharedValue(0);
  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lineY.value }],
  }));

  useEffect(() => {
    lineY.value = withRepeat(
      withSequence(
        withTiming(200, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0,   { duration: 1600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, []);

  const handleBarcode = useCallback(
    async ({ data }: { data: string }) => {
      if (scanned) return;
      setScanned(true);
      setLastCode(data);
      setProductName(null);
      setResolving(true);
      const name = await lookupBarcode(data);
      setProductName(name !== data ? name : null);
      setResolving(false);
    },
    [scanned]
  );

  const handleSearch = () => {
    const query = productName ?? lastCode;
    if (!query) return;
    navigation.navigate('Search', { query });
  };

  const handleRescan = () => {
    setScanned(false);
    setLastCode(null);
    setProductName(null);
  };

  if (!permission) {
    return <View style={styles.root} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionScreen}>
        <View style={styles.permissionIconWrap}>
          <Ionicons name="barcode-outline" size={48} color={COLORS.primary} />
        </View>
        <Text style={styles.permissionTitle}>Accesso fotocamera</Text>
        <Text style={styles.permissionSub}>
          V-Hunter ha bisogno della fotocamera per scannerizzare barcode e cercare prodotti.
        </Text>
        {permission.canAskAgain ? (
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>Consenti accesso</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.permBtn} onPress={() => Linking.openSettings()}>
            <Text style={styles.permBtnText}>Apri impostazioni</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcode}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'code128', 'qr', 'upc_a', 'upc_e'],
        }}
      />

      {/* Viewfinder overlay */}
      <View style={styles.overlay}>
        <View style={styles.overlayTop} />
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          <View style={styles.viewfinder}>
            {/* Corner marks */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            {/* Scan line */}
            {!scanned && (
              <Animated.View style={[styles.scanLine, lineStyle]} />
            )}
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom}>
          {scanned && lastCode ? (
            <View style={styles.resultCard}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              {resolving ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <>
                  {productName && (
                    <Text style={styles.resultName} numberOfLines={2}>{productName}</Text>
                  )}
                  <Text style={styles.resultCode} numberOfLines={1}>{lastCode}</Text>
                </>
              )}
              <View style={styles.resultActions}>
                <TouchableOpacity style={styles.rescanBtn} onPress={handleRescan}>
                  <Text style={styles.rescanText}>Riscan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                  <Ionicons name="search" size={16} color="#fff" />
                  <Text style={styles.searchBtnText}>Cerca</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.hint}>Punta la fotocamera su un barcode o QR code</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const CORNER = 22;
const BORDER = 3;
const VF_SIZE = 240;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1 },
  overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  overlayMiddle: { flexDirection: 'row', height: VF_SIZE },
  overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  overlayBottom: {
    flex: 1.4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  viewfinder: {
    width: VF_SIZE,
    height: VF_SIZE,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.85,
    shadowColor: COLORS.primary,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: COLORS.primary,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: BORDER, borderLeftWidth: BORDER },
  cornerTR: { top: 0, right: 0, borderTopWidth: BORDER, borderRightWidth: BORDER },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: BORDER, borderLeftWidth: BORDER },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: BORDER, borderRightWidth: BORDER },
  hint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  resultCode: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '400',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  rescanBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescanText: { color: COLORS.textDim, fontWeight: '600' },
  searchBtn: {
    flex: 2,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  searchBtnText: { color: '#fff', fontWeight: '700' },
  // Permission screen
  permissionScreen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionTitle: { color: COLORS.text, fontSize: 22, fontWeight: '700' },
  permissionSub: {
    color: COLORS.textDim,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  permBtn: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  permBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
