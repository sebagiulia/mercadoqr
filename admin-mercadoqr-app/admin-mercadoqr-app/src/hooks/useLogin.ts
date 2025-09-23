import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackAuthRepository } from "../infrastructure/auth/BackAuthRepository";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (name: string, password: string): Promise<string | null> => {
    const repo = new BackAuthRepository();
    setLoading(true);
    setError(null);
    try {
      const result = await repo.login(name, password);
      if (result.success && result.data) {
        await AsyncStorage.setItem("token", result.data.token);
        return result.data.token;
      } else {
        setError("Credenciales inválidas o error en el servidor.");
        return null;
      }
    } catch (err: any) {
      setError("Error desconocido, intente mas tarde.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, setError };
}
