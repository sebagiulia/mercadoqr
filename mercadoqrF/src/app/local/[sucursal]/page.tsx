import Place from "@/components/place"; 
import { notFound } from "next/navigation";
import { ErrorProvider } from "errors/ErrorContext";
import PlaceService from "services/placeService";

export default async function Page({
  params,
}: {
  params: Promise<{ sucursal: string }>
}) {
  
  const sucursal = (await params).sucursal
  const response = await PlaceService.getPlace(sucursal)
    if (!response.success || !response.data) {
      notFound()
    } else {
      const place = response.data
      const responseP = await PlaceService.getProducts(place.id) 
      if(!responseP.success || !responseP.data) {
        notFound()
      } else {
        const products = responseP.data
      return (<ErrorProvider>
              <Place place={place} products={products} />
              </ErrorProvider>)
      }
    }
}