// hooks/usePlace.ts
import { useState, useEffect } from "react";
import { BackPlaceRepository } from "../infrastructure/place/BackPlaceRepository";
import { Place } from "../domain/entities/Place";

const repository = new BackPlaceRepository();

export function usePlace(token: string | null, onUnauthorized?: () => void) {
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchPlace = async () => {
      setLoading(true);
      try {
        const response = await repository.getPlaceData(token);
        if (response.success && response.data) {
          setPlace(response.data);
        } else {
          if (response.error?.code === "401" || response.error?.code === "403") {
            onUnauthorized?.();
          } else {
            setError("Error cargando sucursal");
          }
        }
      } catch (err) {
        setError("Error cargando sucursal");
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [token]);

  const updatePlace = async (data: Partial<Place>) => {
    if (!token) return;
    try {
      const response = await repository.updatePlaceData(token, data as Place);
      if (response.success && response.data) {
        setPlace(response.data);
      }
    } catch (err) {
      setError("Error actualizando sucursal");
    }
  };

  return { place, loading, error, updatePlace };
}
