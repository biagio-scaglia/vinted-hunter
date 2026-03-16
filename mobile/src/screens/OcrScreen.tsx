import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useOcr } from '../hooks/useOcr';
import { COLORS } from '../lib/constants';
import type { TabParamList } from '../lib/types';

type Nav = BottomTabNavigationProp<TabParamList, 'OCR'>;

export default function OcrScreen() {
  const navigation = useNavigation<Nav>();
  const { imageUri, text, setText, loading, error, pickImage, takePhoto, extract, reset } = useOcr();

  const handleSearch = () => {
    if (!text.trim()) return;
    navigation.navigate('Search', { query: text.trim() });
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={88}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Image preview */}
        {imageUri ? (
          <View style={styles.previewWrap}>
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
            <TouchableOpacity style={styles.resetBtn} onPress={reset}>
              <Ionicons name="close-circle" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="scan-outline" size={56} color={COLORS.primary} />
            <Text style={styles.placeholderText}>
              Seleziona un'immagine o scatta una foto per estrarne il testo con OCR
            </Text>
          </View>
        )}

        {/* Picker buttons */}
        <View style={styles.pickerRow}>
          <TouchableOpacity style={styles.pickerBtn} onPress={pickImage} activeOpacity={0.75}>
            <Ionicons name="images-outline" size={20} color={COLORS.primary} />
            <Text style={styles.pickerBtnText}>Galleria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pickerBtn} onPress={takePhoto} activeOpacity={0.75}>
            <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
            <Text style={styles.pickerBtnText}>Fotocamera</Text>
          </TouchableOpacity>
        </View>

        {/* Extract button */}
        {imageUri && (
          <TouchableOpacity
            style={[styles.extractBtn, loading && styles.extractBtnDim]}
            onPress={extract}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="text-outline" size={18} color="#fff" />
                <Text style={styles.extractBtnText}>Estrai testo</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        {/* OCR result */}
        {text.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>Testo estratto</Text>
            <Text style={styles.resultHint}>Puoi modificarlo prima di cercare</Text>
            <TextInput
              style={styles.resultInput}
              value={text}
              onChangeText={setText}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={COLORS.muted}
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.8}>
              <Ionicons name="search" size={18} color="#fff" />
              <Text style={styles.searchBtnText}>Cerca questo testo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16, gap: 14 },
  placeholder: {
    height: 200,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 24,
    gap: 12,
  },
  placeholderText: {
    color: COLORS.textDim,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
  },
  previewWrap: {
    position: 'relative',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  preview: { width: '100%', height: '100%' },
  resetBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 14,
  },
  pickerRow: { flexDirection: 'row', gap: 10 },
  pickerBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pickerBtnText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  extractBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  extractBtnDim: { opacity: 0.7 },
  extractBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  error: { color: COLORS.error, fontSize: 13, textAlign: 'center' },
  resultSection: { gap: 8 },
  resultLabel: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  resultHint: { color: COLORS.textDim, fontSize: 12 },
  resultInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: 14,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  searchBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
