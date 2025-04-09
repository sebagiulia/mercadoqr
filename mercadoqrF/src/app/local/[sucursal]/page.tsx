'use client'
import { useEffect, useState } from "react";
import { PopupProduct, PlaceHeader, PlaceCatalog, PlaceCategories, PlaceHeaderSkeleton, PlaceCategoriesSkeleton, PlaceCatalogSkeleton} from "@/components/place";
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
  const [isLoadingProds, setIsLoadingProds] = useState(true);
  
  const [categories, setCategories] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("Todo"); 
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  
  const [prodsByCategory, setProdsCache] = useState<Record<string, ProductType[]>>({});
  
  const handleProdsCache = async (prods: ProductType[]) => {
    const prodToCat = prods.reduce((acc, prod) => {
      const { category } = prod ;
      if (acc[category]) {
          acc[category].push(prod);
      } else {
        acc[category] = [prod];
      }
      return acc;
    }, {} as Record<string, ProductType[]>);
    
    const cache = { ...prodsByCategory };
    for (const category in prodToCat) {
      if (cache[category]) {
        cache[category] = cache[category].filter((prod) => !prodToCat[category].some((p) => p.id === prod.id));
        cache[category] = [...cache[category], ...prodToCat[category]];
      } else {
        cache[category] = prodToCat[category];
      }
    } 
    setProdsCache(cache);
  }

  useEffect(() => {
    const fetchData = async () => {
      const { sucursal } = await params;
      try {
        const { success, data } = await PlaceService.getPlace(sucursal);

        if (!success) {   
          window.location.href = "/404";
        } else {
          const placeData = data as PlaceType;
          setPlace(placeData);
          const responseCats = await PlaceService.getCategories(sucursal);
          setCategories(responseCats.success ? (responseCats.data as string[]) : []);
        }
      } catch (error) {
        console.error(error)
        window.location.href = "/404";
      }
    };

    fetchData();
  }, [params]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setIsLoadingProds(true);
      if (place) {
          const responseProds = await PlaceService.getProducts(place.id, selectedCategory);
          if(responseProds.success) {
            handleProdsCache(responseProds.success ? (responseProds.data as ProductType[]) : []).then(()=>{
              setIsLoadingProds(false);
            });
          } else {
            setIsLoadingProds(false);
          }
      };
    }
    fetchProductsByCategory();
  }, [selectedCategory, place]);

  const handleChangeCategory = (category: string) => {
    setSelectedCategory(category);
  }

  const handleSelectProduct = (product: ProductType) => {
    setSelectedProduct(product);
  }

  const handleClose = () => {
    setSelectedProduct(null);
  }

  return (
    <div className={styles.place}>
      {place ? 
          <PlaceHeader place={place as PlaceType} />
        : <PlaceHeaderSkeleton />}
      <div className={styles.catalog_page}>
        
      {categories.length > 0 ? 
          <PlaceCategories categories={categories} selectedCategory={selectedCategory} changeCategory={handleChangeCategory} /> 
          : <PlaceCategoriesSkeleton />}
      {!isLoadingProds?
          <PlaceCatalog selected={selectedCategory} products={prodsByCategory} handleSelectProd={handleSelectProduct} />
          : <PlaceCatalogSkeleton selected={selectedCategory} products={prodsByCategory} handleSelectProd={handleSelectProduct}/> }
      { selectedProduct && <PopupProduct product={selectedProduct} placename={(place as PlaceType).name} handleClose={handleClose} />}
          </div>
    </div>
  
  
  )
}