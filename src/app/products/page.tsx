import ProductsClient from "./ProductsClient"
import productsData from "@/data/products.json"
import type { Product } from "@/types"

export default function ProductsPage() {
  return <ProductsClient products={productsData as Product[]} />
}