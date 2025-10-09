import { useEffect, useState } from "react";
import PlaceService from "@/services/placeService";
import Product from "@/models/product";
import Place from "@/models/place";

// Datos simulados (antes estaban en ../data/places)
export function usePlace(placeName: string) {
  const [place, setPlace] = useState<Place>();
  const [products, setProducts] = useState<Product[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula fetch a una API con timeout
    
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await PlaceService.getPlace(placeName);
        if (response.success && response.data) {    
          const placeData = response.data as Place;
          setPlace(placeData);
          const responseProds = await PlaceService.getProducts(placeData.id, "Todo");
          if(responseProds.success) {
            setProducts(responseProds.data as Product[]);
          } else {
            console.error("Product error");
            setProducts([]);
          }
        } else {
          setPlace(undefined);
          setProducts(undefined);
        }
      } catch (error) {
        console.error(error);
      } finally {
          setLoading(false);
        }
      }

  fetchData();
}, []);

return { place, products, loading };
}
