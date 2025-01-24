import Place from "@/components/place"; 
import { notFound } from "next/navigation";
import { ErrorProvider } from "errors/ErrorContext";
import PlaceService from "services/placeService";
import PlaceType from "@/models/place";
import ProductType from "@/models/product";

export default async function Page({
  params,
}: {
  params: Promise<{ sucursal: string }>
}) {
  
  const sucursal = (await params).sucursal
  try {
    const {success, data} = await PlaceService.getPlace(sucursal)
    
    if (!success) {
      notFound()
    } else {
      const place = data as PlaceType
      const response = await PlaceService.getProducts(place.id) 
      const products = response.success ? response.data as ProductType[] : [] as ProductType[] 
      return (<ErrorProvider>
              <Place place={place} products={products} />
              </ErrorProvider>)
      }
    } catch (error) {
    notFound()
  }

}