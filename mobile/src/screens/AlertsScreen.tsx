import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AlertItem from '../components/AlertItem';
import EmptyState from '../components/EmptyState';
import { useAlerts } from '../hooks/useAlerts';
import { COLORS } from '../lib/constants';

export default function AlertsScreen() {
  const { alerts, loading, saving, error, save, remove, refresh } = useAlerts();
  const [query, setQuery] = useState('');

  const handleSave = () => {
    save(query.trim());
    setQuery('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={88}
    >
      {/* Create alert */}
      <View style={styles.createSection}>
        <Text style={styles.sectionTitle}>Nuovo alert</Text>
        <Text style={styles.sectionSub}>
          Es: "nike air max 42 max:80" · Ricevi notifiche quando appare un nuovo prodotto
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="nike air max 42 max:80"
            placeholderTextColor={COLORS.muted}
            returnKeyType="done"
            onSubmitEditing={handleSave}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.addBtn, (!query.trim() || saving) && styles.addBtnDisabled]}
            onPress={handleSave}
            disabled={!query.trim() || saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="add" size={22} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      {/* List */}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>
            I miei alert
            {alerts.length > 0 && (
              <Text style={styles.count}> ({alerts.length})</Text>
            )}
          </Text>
          <TouchableOpacity onPress={refresh} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="refresh-outline" size={18} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : alerts.length === 0 ? (
          <EmptyState
            icon="notifications-off-outline"
            title="Nessun alert"
            subtitle="Aggiungi un alert per monitorare prezzi e nuovi annunci."
          />
        ) : (
          <FlatList
            data={alerts}
            keyExtractor={a => String(a.id)}
            renderItem={({ item }) => (
              <AlertItem alert={item} onDelete={remove} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  createSection: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionSub: {
    color: COLORS.textDim,
    fontSize: 12,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: { opacity: 0.5 },
  error: { color: COLORS.error, fontSize: 12, marginTop: 4 },
  listSection: { flex: 1, padding: 16 },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  count: { color: COLORS.textDim, fontWeight: '400' },
  listContent: { paddingBottom: 24 },
});
