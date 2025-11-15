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


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {

  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: string = 'home';
        if (route.name === 'Sucursal') iconName = 'business';
        if (route.name === 'Catalogo') iconName = 'list';
        if (route.name === 'Movimientos') iconName = 'analytics';
        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
    })}
    >
      <Tab.Screen name="Sucursal" component={PlaceScreen} />
      <Tab.Screen name="Catalogo" component={CatalogScreen} />
      <Tab.Screen name="Movimientos" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
