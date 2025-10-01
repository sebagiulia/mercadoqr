// hooks/useAuthToken.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useAuthToken(navigation: any, onUnauthorized?: () => void) {
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
