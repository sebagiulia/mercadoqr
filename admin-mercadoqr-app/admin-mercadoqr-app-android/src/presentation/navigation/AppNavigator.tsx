import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from "../screens/LoginScreen";
import CatalogScreen from "../screens/CatalogScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import PlaceScreen from "../screens/PlaceScreen";
import ScannerScreen from "../screens/ScannerScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Oculta el header de las tabs
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'home';
          if (route.name === 'Scanners') iconName = 'qr-code';
          if (route.name === 'Sucursal') iconName = 'home';
          if (route.name === 'Catalogo') iconName = 'list';
          if (route.name === 'Movimientos') iconName = 'analytics';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarStyle: { height: 100, paddingBottom: 6, paddingTop: 6 }, // espacio del tabBar más bonito
      })}
    >
      <Tab.Screen name="Sucursal" component={PlaceScreen} />
      <Tab.Screen name="Scanners" component={ScannerScreen} />
      <Tab.Screen name="Catalogo" component={CatalogScreen} />
      <Tab.Screen name="Movimientos" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: true, // Oculta todos los headers
            headerTitle:'MercadoQR Admin',
            headerTitleAlign: 'center',

          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
