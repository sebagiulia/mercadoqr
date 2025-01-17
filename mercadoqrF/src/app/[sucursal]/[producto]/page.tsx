import { notFound } from "next/navigation"
import Product from "@/components/product"
import { ErrorProvider } from "errors/ErrorContext"
import PlaceService from "services/placeService"
export default async function Page({
  params,
}: {
  params: Promise<{ sucursal: string, producto:string }>
}) {
  const sucursal = (await params).sucursal
  const producto = (await params).producto
  const response = await PlaceService.getProduct(sucursal, producto)
  if(!response.success || !response.data) {
    notFound()
  } else {
    const product = response.data
    return (<ErrorProvider>
            <Product product={product} place={sucursal} />
          </ErrorProvider>)
  }
}