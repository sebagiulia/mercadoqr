'use client'
import { notFound } from "next/navigation"
import Product from "@/components/product"
import { ErrorProvider } from "errors/ErrorContext"
import { DependencyProvider, useDependencies } from "utils/dependencyContext"
export default async function Page({
  params,
}: {
  params: Promise<{ sucursal: string, producto:string }>
}) {
  const { placeService } = useDependencies()
  const sucursal = (await params).sucursal
  const producto = (await params).producto
  const product = await placeService.getProduct(sucursal, producto)
  if(!product){
    notFound()
  } else {
    return (<ErrorProvider>
      <DependencyProvider>
            <Product product={product} place={sucursal} />
      </DependencyProvider>
          </ErrorProvider>)
  }
}