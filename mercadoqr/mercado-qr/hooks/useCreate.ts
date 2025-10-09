import PlaceService from "@/services/placeService";
import FormData from "../models/formData";
import { useState } from "react";

export function useCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

const createPlace = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await PlaceService.createPlace(data);
      if (!response.success) {
        setError(response.error?.message || "Error al crear el negocio, intente mas tarde.");
      } else {
        setError("");
      }
    } catch (error) {
      setError("Error al crear el negocio, intente mas tarde.");
    } finally {
      setLoading(false);
    }
  }

return { createPlace, loading, error };
}
