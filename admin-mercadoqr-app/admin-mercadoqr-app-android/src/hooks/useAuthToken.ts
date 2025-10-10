// hooks/useAuthToken.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import { RootStackParamList, HomeTabParamList } from "../presentation/navigation/types";

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function useAuthToken(navigation: NavigationProp, onUnauthorized?: () => void) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const stored = await AsyncStorage.getItem("token");
      if (!stored) {
        onUnauthorized?.();
      } else {
        setToken(stored);
      }
    };
    loadToken();
  }, [navigation]);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  return { token, setToken, logout };
}
