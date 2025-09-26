// hooks/useScanners.ts
import { useState, useEffect } from "react";
import { BackPlaceRepository } from "../infrastructure/place/BackPlaceRepository";
import Scanner from "../domain/entities/Scanner";

const repository = new BackPlaceRepository();

export function useScanners(token: string | null, placeId?: number, onUnauthorized?: () => void) {
  const [scanners, setScanners] = useState<Scanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !placeId) return;
    const fetchScanners = async () => {
      setLoading(true);
      try {
        const response = await repository.getScanners(token);
        if (response.success && response.data) {
          setScanners(response.data);
        } else {
          if (response.error?.code === "401" || response.error?.code === "403") {
            onUnauthorized?.();
          } else {
            setError("Error cargando scanners");
          }
        }
      } catch (err) {
            setError("Error cargando scanners");
      }
      finally {
        setLoading(false);
      }
    };
    fetchScanners();
  }, [token, placeId]);

  const addScanner = async (scanner: Omit<Scanner, "id" | "accessCode">) => {
    if (!token) return;
    const response = await repository.createScanner(token, {
      ...scanner,
      id: 0,
      accessCode: "",
    });
    if (response.success && response.data) {
      const newScanner = response.data;
      setScanners((prev) => [...prev, newScanner]);
    } else {
      throw new Error(response.error?.message || "Error creando scanner");
    }
  };

  const removeScanner = async (scannerId: number) => {
    if (!token) return;
    const response = await repository.deleteScanner(token, scannerId);
    if (response.success) {
      setScanners((prev) => prev.filter((s) => s.id !== scannerId));
    } else {
      throw new Error(response.error?.message || "Error eliminando scanner");
    }
  };

  return { scanners, loading, addScanner, removeScanner};
}
