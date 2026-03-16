import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import SearchScreen from '../screens/SearchScreen';
import ScannerScreen from '../screens/ScannerScreen';
import AlertsScreen from '../screens/AlertsScreen';
import OcrScreen from '../screens/OcrScreen';
import { COLORS } from '../lib/constants';
import type { TabParamList } from '../lib/types';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Search:  'search',
  Scanner: 'barcode-outline',
  Alerts:  'notifications-outline',
  OCR:     'scan-outline',
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: COLORS.surface, shadowColor: 'transparent' },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: '700', letterSpacing: 0.5 },
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: { fontSize: 11, marginBottom: 4 },
        tabBarIcon: ({ color, size, focused }) => (
          <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
            <Ionicons name={ICONS[route.name]} size={size} color={color} />
          </View>
        ),
      })}
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Cerca', tabBarLabel: 'Cerca' }}
      />
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ title: 'Scanner', tabBarLabel: 'Scanner', headerShown: false }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{ title: 'Alert', tabBarLabel: 'Alert' }}
      />
      <Tab.Screen
        name="OCR"
        component={OcrScreen}
        options={{ title: 'OCR', tabBarLabel: 'OCR' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
  },
  iconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  iconWrapActive: {
    backgroundColor: COLORS.primaryDim,
  },
});
