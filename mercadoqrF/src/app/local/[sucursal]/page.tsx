'use client'
import { useEffect, useState } from "react";
import { PopupProduct, PlaceHeader, PlaceCatalog, PlaceCategories, PlaceHeaderSkeleton, PlaceCategoriesSkeleton, PlaceCatalogSkeleton} from "@/components/place";
import PlaceService from "services/placeService";
import PlaceType from "@/models/place";
import ProductType from "@/models/product";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Page({
  params,
}: {
  params: Promise<{ sucursal: string }>;
}) {
  const [place, setPlace] = useState<PlaceType | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todo");
  const [isLoadingProds, setIsLoadingProds] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const { sucursal } = await params;
      try {
        const { success, data } = await PlaceService.getPlace(sucursal);

        if (!success) {   
          router.push("/404");
        } else {
          const placeData = data as PlaceType;
          setPlace(placeData);
          const responseCats = await PlaceService.getCategories(sucursal);
          setCategories(responseCats.success ? (responseCats.data as string[]) : []);
        }
      } catch (error) {
        console.error(error)
        router.push("/404");
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
            setProducts(responseProds.success ? (responseProds.data as ProductType[]) : []);
          } else {
            setProducts([]);
          }
          setIsLoadingProds(false);
      };
    }
    setProducts([]);  
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
      {categories.length > 0 ? 
          <PlaceCategories categories={categories} selectedCategory={selectedCategory} changeCategory={handleChangeCategory} /> 
        : <PlaceCategoriesSkeleton />}
      {!isLoadingProds?
          <PlaceCatalog products={products} handleSelectProd={handleSelectProduct} />
        : <PlaceCatalogSkeleton /> }
      { selectedProduct && <PopupProduct product={selectedProduct} placename={(place as PlaceType).name} handleClose={handleClose} />}
    </div>
  
  
  )
}