import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackAuthRepository } from "../infrastructure/auth/BackAuthRepository";

export function useLogin() {
  const [loading, setLoading] = useState(false);

  const login = async (name: string, password: string): Promise<string | null> => {
    const repo = new BackAuthRepository();
    setLoading(true);
    try {
      const result = await repo.login(name, password);
      if (result.success && result.data) {
        await AsyncStorage.setItem("token", result.data.token);
        return result.data.token;
      } else {
        throw new Error(result.error?.message || "Error desconocido");
      }
    } catch (err: any) {
      throw new Error(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
