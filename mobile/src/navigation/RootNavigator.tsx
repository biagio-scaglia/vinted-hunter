import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import { COLORS } from '../lib/constants';
import type { RootStackParamList } from '../lib/types';

const Stack = createStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.bg,
    card: COLORS.surface,
    text: COLORS.text,
    border: COLORS.border,
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.surface },
          headerTintColor: COLORS.text,
          cardStyle: { backgroundColor: COLORS.bg },
        }}
      >
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{
            title: 'Prodotto',
            presentation: 'modal',
            headerStyle: { backgroundColor: COLORS.surface },
            headerTintColor: COLORS.primary,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
