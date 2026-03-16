import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../lib/constants';

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  onFilterPress?: () => void;
  loading?: boolean;
  placeholder?: string;
  filterActive?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onCancel,
  onFilterPress,
  loading,
  placeholder = 'Cerca su Vinted, Subito...',
  filterActive,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <Ionicons name="search" size={16} color={COLORS.muted} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor={COLORS.muted}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {loading && onCancel && (
          <TouchableOpacity onPress={onCancel} style={styles.stopBtn}>
            <Ionicons name="stop-circle" size={20} color={COLORS.error} />
          </TouchableOpacity>
        )}
      </View>

      {onFilterPress && (
        <TouchableOpacity
          style={[styles.filterBtn, filterActive && styles.filterBtnActive]}
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={filterActive ? COLORS.primary : COLORS.muted}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.searchBtn, loading && styles.searchBtnLoading]}
        onPress={loading ? onCancel : onSubmit}
        activeOpacity={0.8}
      >
        {loading
          ? <ActivityIndicator size="small" color="#fff" />
          : <Ionicons name="arrow-forward" size={18} color="#fff" />
        }
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    height: 42,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    height: '100%',
  },
  stopBtn: {
    marginLeft: 4,
    padding: 2,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryDim,
  },
  searchBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnLoading: {
    backgroundColor: COLORS.error,
  },
});
