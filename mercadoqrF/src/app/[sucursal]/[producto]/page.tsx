import { notFound } from "next/navigation"
import PlaceService from "servicios/placeServiceJSONImp"
import Product from "@/components/product"
import { ErrorProvider } from "errors/ErrorContext"
export default async function Page({
  params,
}: {
  params: Promise<{ sucursal: string, producto:string }>
}) {
  const placeService = new PlaceService()
  const sucursal = (await params).sucursal
  const producto = (await params).producto
  const product = await placeService.getProduct(sucursal, producto)
  if(product === null){
    notFound()
  } else {
    return (<ErrorProvider>
            <Product product={Object.assign({},product)} />
          </ErrorProvider>)
  }
}