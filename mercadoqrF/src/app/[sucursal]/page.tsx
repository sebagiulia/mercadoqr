import Place from "@/components/place"; 
import PlaceService from "servicios/placeServiceJSONImp";
import { notFound } from "next/navigation";
import { ErrorProvider } from "errors/ErrorContext";

export default async function Page({
  params,
}: {
  params: Promise<{ sucursal: string }>
}) {
  const placeService = new PlaceService() 
  const sucursal = (await params).sucursal
  const place = await placeService.getPlace(sucursal)
    if (place === null) {
      notFound()
    } else {
      const products = await placeService.getProducts(place.id) 
      return (<ErrorProvider>
              <Place place={place} products={products} />
              </ErrorProvider>)
    }
}