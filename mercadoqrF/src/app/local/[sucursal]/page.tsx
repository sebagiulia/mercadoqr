'use client'
import { useEffect, useState } from "react";
import { PlaceHeader, PlaceCatalog, PlaceCategories, PlaceHeaderSkeleton, PlaceCategoriesSkeleton, PlaceCatalogSkeleton} from "@/components/place";
import { notFound } from "next/navigation";
import PlaceService from "services/placeService";
import PlaceType from "@/models/place";
import ProductType from "@/models/product";
import styles from "./page.module.css";

export default function Page({
  params,
}: {
  params: Promise<{ sucursal: string }>;
}) {
  const [place, setPlace] = useState<PlaceType | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todo");
  
  useEffect(() => {
    const fetchData = async () => {
      const { sucursal } = await params;
      try {
        const { success, data } = await PlaceService.getPlace(sucursal);

        if (!success) {
          notFound();
        } else {
          const placeData = data as PlaceType;
          setPlace(placeData);
          const responseCats = await PlaceService.getCategories(sucursal);
          setCategories(responseCats.success ? (responseCats.data as string[]) : []);
        }
      } catch (error) {
        console.error(error);
        notFound();
      }
    };

    fetchData();
  }, [params]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (place) {
          const responseProds = await PlaceService.getProducts(place.id, selectedCategory);
          setProducts(responseProds.success ? (responseProds.data as ProductType[]) : []);
      };
    }
    setProducts([]);  
    fetchProductsByCategory();
  }, [selectedCategory, place]);

  const handleChangeCategory = (category: string) => {
    setSelectedCategory(category);
  }

  return (
    <div className={styles.place}>
      {place ? 
          <PlaceHeader place={place as PlaceType} />
        : <PlaceHeaderSkeleton />}
      {categories.length > 0 ? 
          <PlaceCategories categories={categories} selectedCategory={selectedCategory} changeCategory={handleChangeCategory} /> 
        : <PlaceCategoriesSkeleton />}
      {products.length > 0 ?
          <PlaceCatalog products={products} place={place as PlaceType} />
        : <PlaceCatalogSkeleton /> }


    </div>
  
  
  )
}