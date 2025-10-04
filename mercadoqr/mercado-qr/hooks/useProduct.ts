import { useEffect, useState } from "react";
import Product from "@/models/product";
import PlaceService from "@/services/placeService";

// Simulación de fetch de un producto
export function useProduct(placeName: string, productName: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchProduct = async () => {
      setLoading(true);
    try {
      const result = await PlaceService.getProduct(placeName, productName)
      if(result.success) {
        setProduct(result.data as Product)
      } 
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }
    fetchProduct();
  }, []);

  return { product, loading };
}
