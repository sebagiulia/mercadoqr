import { useEffect, useState } from "react";
import { places } from "../data/places";
import Place from "../models/place";
import PlaceService from "@/services/placeService";

// Datos simulados (antes estaban en ../data/places)
const mockPlaces: Place[] = places;

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchPlaces = async () => {
          setLoading(true);
          try {
              const {success, data} = await PlaceService.getPlaces("-");
              if (success) {
                  const places = data || [];
                  setPlaces(places);
                  setLoading(false);
              } else {
                  setLoading(false);
              }
          } catch (error) {
              console.error(error);
              setLoading(false);
              setPlaces([])
          }
      };
      fetchPlaces();
  }, []);

  return { places, loading };
}
