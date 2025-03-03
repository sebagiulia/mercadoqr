import { notFound } from "next/navigation"
import Product from "@/components/product"
import { ErrorProvider } from "errors/ErrorContext"
import PlaceService from "services/placeService"
import ProductType from "@/models/product"
import PlaceType from "@/models/place"
export default async function Page({
  params,
}: {
  params: Promise<{ sucursal: string, producto:string }>
}) {
  const sucursal = (await params).sucursal
  const producto = (await params).producto
  try {
    const {success, data, error} = await PlaceService.getPlace(sucursal)
    if(!success) {
      notFound()
    } 
    const place = data as PlaceType
    
    const result = await PlaceService.getProduct(sucursal, producto)
    if(!result.success) {
      notFound()
    } 
    const product = result.data as ProductType
      return (<ErrorProvider>
              <Product product={product} place={place} />
              </ErrorProvider>)

  } catch (error) {
    notFound()
  }
}