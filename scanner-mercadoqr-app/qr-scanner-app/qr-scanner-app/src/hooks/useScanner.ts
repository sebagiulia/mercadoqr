// hooks/useScanners.ts
import { useState, useEffect } from "react";
import Scanner from "../models/Scanner";
import { getScanner } from "../services/scannerService";

export function useScanner(token: string | null, onUnauthorized?: () => void) {
  const [scanner, setScanner] = useState<Scanner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchScanners = async () => {
      setLoading(true);
      try {
        const response = await getScanner(token);
        if (response.success && response.data) {
          setScanner(response.data);
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
  }, [token]);


  return { scanner, loadingScanner:loading, errorScanner:error};
}
