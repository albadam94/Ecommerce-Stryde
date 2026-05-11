import { notFound } from "next/navigation"
import productsData from "@/data/products.json"
import type { Product } from "@/types"
import PDPClient from "./PDPClient"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PDPPage({ params }: Props) {
  const { slug } = await params
  const product = (productsData as Product[]).find((p) => p.slug === slug)
  if (!product) notFound()

  const related = (productsData as Product[])
    .filter((p) => p.id !== product.id && p.sport === product.sport)
    .slice(0, 4)

  return <PDPClient product={product} related={related} />
}