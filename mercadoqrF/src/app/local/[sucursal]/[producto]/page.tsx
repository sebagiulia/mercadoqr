import { notFound } from "next/navigation"
import Product from "@/components/product"
import { ErrorProvider } from "errors/ErrorContext"
import PlaceService from "services/placeService"
import ProductType from "@/models/product"
export default async function Page({
  params,
}: {
  params: Promise<{ sucursal: string, producto:string }>
}) {
  const sucursal = (await params).sucursal
  const producto = (await params).producto
  try {
    const {success, data, error} = await PlaceService.getProduct(sucursal, producto)
    if(!success) {
      notFound()
    } else {
      const product = data as ProductType
      return (<ErrorProvider>
              <Product product={product} place={sucursal} />
              </ErrorProvider>)
    }

  } catch (error) {
    notFound()
  }
}