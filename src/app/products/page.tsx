import ProductsClient from "@/components/sections/ProductsClient"

interface Props {
  searchParams: Promise<{
    gender?: string
    sport?: string
    cat?: string
    badge?: string
  }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const gender = params.gender || "all"
  const sport = params.sport || params.cat || ""

  return <ProductsClient initialGender={gender} initialSport={sport} />
}
