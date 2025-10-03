import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as Login } from "../services/authService";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (name: string, password: string, place:string): Promise<string | null> => {
    setLoading(true);
    try {
      const result = await Login(name, password, place);
      if (result.success && result.data) {
        await AsyncStorage.setItem("token", result.data.token);
        return result.data.token;
      } else {
        setError(result.error?.message || "Error de autenticación");
        return null;
      }
    } catch (err: any) {
      setError("Error desconocido, intente mas tarde.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
