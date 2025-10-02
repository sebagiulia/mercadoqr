// hooks/usePlace.ts
import { useState, useEffect } from "react";
import { Place } from "../models/Place";
import { getPlaceData } from "../services/placeService";
import AsyncStorage from "@react-native-async-storage/async-storage";


export function usePlace(token: string | null, onUnauthorized?: () => void) {
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchPlace = async () => {
      setLoading(true);
      try {
        const response = await getPlaceData(token);
        if (response.success && response.data) {
          setPlace(response.data);
        } else {
            await AsyncStorage.removeItem("token");
            onUnauthorized?.();
        }
      } catch (err) {
        setError("Error cargando sucursal");
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [token]);

  return { place, loading, error};
}
