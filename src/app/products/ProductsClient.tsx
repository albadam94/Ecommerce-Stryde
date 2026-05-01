"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import type { Product } from "@/types"

const CATEGORIES  = ["Jackets", "T-shirts", "Shorts", "Leggings", "Accessories"]
const SIZES       = ["XS", "S", "M", "L", "XL"]
const COLORS      = ["#F5F5F3", "#C8FF00", "#FF8C00", "#1A1F3C", "#555555", "#00C896", "#FF4B4B", "#FFB800"]
const COLLECTIONS = ["Core collection", "FW25"]

const SUBCAT_MAP: Record<string, string> = {
  Jackets: "jackets", "T-shirts": "tshirts", Shorts: "shorts",
  Leggings: "leggings", Accessories: "accessories",
}

interface Props { products: Product[] }

export default function ProductsClient({ products }: Props) {
  const searchParams = useSearchParams()
  const genderParam  = searchParams.get("gender")
  const sportParam   = searchParams.get("sport") || searchParams.get("cat")
  const badgeParam   = searchParams.get("badge")

  const [gender,       setGender]       = useState(() =>
    genderParam ? genderParam.charAt(0).toUpperCase() + genderParam.slice(1) : "All"
  )
  const [activeSize,   setActiveSize]   = useState("M")
  const [activeColor,  setActiveColor]  = useState<string | null>(null)
  const [checkedCats,  setCheckedCats]  = useState<string[]>([])
  const [checkedColls, setCheckedColls] = useState<string[]>(["Core collection"])
  const [stockOnly,    setStockOnly]    = useState(true)
  const [preSale,      setPreSale]      = useState(false)
  const [sortBy,       setSortBy]       = useState("Relevance")
  const [viewMode,     setViewMode]     = useState<"grid4" | "grid2" | "list">("grid4")

  const filteredProducts = products.filter((p) => {
    if (gender !== "All") {
      const g = gender.toLowerCase()
      if (p.gender !== g && p.gender !== "unisex") return false
    }
    if (sportParam && p.category !== sportParam.toLowerCase()) return false
    if (badgeParam && p.badge !== badgeParam) return false
    if (checkedCats.length > 0 && !checkedCats.map(c => SUBCAT_MAP[c]).includes(p.category)) return false
    if (stockOnly && !p.inStock) return false
    return true
  })

  const toggleCat  = (c: string) => setCheckedCats(p  => p.includes(c) ? p.filter(x => x !== c) : [...p, c])
  const toggleColl = (c: string) => setCheckedColls(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])
  const clearAll   = () => { setCheckedCats([]); setCheckedColls([]); setActiveColor(null); setActiveSize("") }

  const sportLabel = sportParam
    ? sportParam.charAt(0).toUpperCase() + sportParam.slice(1)
    : "Running"

  const gridClass = {
    grid4: "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    grid2: "grid-cols-2",
    list:  "grid-cols-1",
  }[viewMode]

  return (
    <div className="bg-black min-h-screen text-white">

      {/* BREADCRUMB */}
      <div className="max-w-[1440px] mx-auto px-20 pt-8">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[1.5px]">
          <Link href="/" className="text-white/40 hover:text-white transition-colors">Home</Link>
          {gender !== "All" && (
            <>
              <span className="text-white/20">›</span>
              <span className="text-white/40">{gender}</span>
            </>
          )}
          <span className="text-white/20">›</span>
          <span className="text-white/70">{sportLabel}</span>
        </div>
      </div>

      {/* PAGE HEADER */}
      <div className="max-w-[1440px] mx-auto px-20 pt-8 pb-6">
        <div className="flex items-end justify-between">
          <h1 className="font-display font-extrabold text-[56px] uppercase leading-[0.9] tracking-[-2px]">
            {gender !== "All" && <>{gender}&apos;s <br /></>}
            <span className="text-volt">{sportLabel}</span>
          </h1>
          <div className="text-right">
            <p className="text-white font-medium text-[13px] tracking-[0.5px]">
              {filteredProducts.length} products
            </p>
            <p className="text-white/30 text-[12px] font-light mt-1 max-w-[280px] text-right">
              High-performance technique for the athlete who never stops.
            </p>
          </div>
        </div>
      </div>

      {/* GENDER TABS */}
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="flex items-center gap-8 border-b border-white/10">
          {["Men", "Women", "Unisex", "All"].map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`pb-3 text-[13px] font-medium uppercase tracking-[1px] border-b-2 transition-colors ${
                gender === g
                  ? "border-volt text-volt"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-[1440px] mx-auto px-20 py-8 flex gap-8 items-start">

        {/* SIDEBAR */}
        <aside className="w-[220px] flex-shrink-0 flex flex-col gap-0">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <span className="text-white font-medium text-[13px] uppercase tracking-[1px]">Filters</span>
            <button onClick={clearAll} className="text-volt text-[11px] font-medium uppercase tracking-[1px] hover:opacity-70 transition-opacity">
              Clear all
            </button>
          </div>

          <FilterGroup title="Category">
            {CATEGORIES.map((cat) => (
              <FilterCheckbox key={cat} label={cat} count={10}
                checked={checkedCats.includes(cat)} onChange={() => toggleCat(cat)} />
            ))}
          </FilterGroup>

          <FilterGroup title="Size">
            <div className="flex gap-2 flex-wrap">
              {SIZES.map((s) => (
                <button key={s} onClick={() => setActiveSize(s)}
                  className={`w-10 h-10 text-[12px] font-medium border transition-all ${
                    activeSize === s
                      ? "border-volt bg-volt/10 text-volt"
                      : "border-white/20 text-white/50 hover:border-white/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Color">
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setActiveColor(activeColor === color ? null : color)}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{
                    backgroundColor: color,
                    outline: activeColor === color ? "2px solid #C8FF00" : "2px solid transparent",
                    outlineOffset: "2px",
                  }}
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Price">
            <div className="relative pt-2 pb-4">
              <div className="relative h-1 bg-white/10 rounded-full">
                <div className="absolute h-full bg-volt rounded-full" style={{ left: "0%", right: "30%" }} />
                <div
                  className="absolute w-4 h-4 bg-white rounded-full top-1/2 -translate-y-1/2 cursor-pointer shadow-md"
                  style={{ left: "calc(70% - 8px)" }}
                />
              </div>
              <div className="flex justify-between mt-3 text-[11px] text-white/40 font-light">
                <span>$0</span>
                <span>$450</span>
              </div>
            </div>
          </FilterGroup>

          <FilterGroup title="Collection">
            {COLLECTIONS.map((col) => (
              <FilterCheckbox key={col} label={col}
                checked={checkedColls.includes(col)} onChange={() => toggleColl(col)} />
            ))}
          </FilterGroup>

          <FilterGroup title="Availability">
            <ToggleRow label="In stock only"    value={stockOnly} onChange={() => setStockOnly(p => !p)} />
            <ToggleRow label="Include pre-sale" value={preSale}   onChange={() => setPreSale(p => !p)} />
          </FilterGroup>
        </aside>

        {/* PRODUCTS */}
        <div className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <span className="text-white/40 text-[12px] font-light tracking-[0.5px]">
              Showing {filteredProducts.length} of {products.length} products
            </span>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent border border-white/20 text-white text-[12px] font-medium px-4 pr-8 h-9 cursor-pointer outline-none hover:border-white/40 transition-colors"
                >
                  {["Relevance", "Newest", "Price: Low to High", "Price: High to Low", "Best Rated"].map(o => (
                    <option key={o} value={o} className="bg-black">{o}</option>
                  ))}
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4L6 8L10 4" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex gap-1">
                {([
                  { mode: "grid4", icon: "M1 1h4v4H1zM7 1h4v4H7zM1 7h4v4H1zM7 7h4v4H7z" },
                  { mode: "grid2", icon: "M1 1h3v10H1zM5 1h3v10H5zM9 1h2v10H9z" },
                  { mode: "list",  icon: "M1 3h10M1 6h10M1 9h10" },
                ] as const).map(({ mode, icon }) => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={`w-9 h-9 flex items-center justify-center border transition-colors ${
                      viewMode === mode
                        ? "border-white/40 text-white"
                        : "border-white/10 text-white/30 hover:border-white/30 hover:text-white/60"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d={icon} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid / Empty state */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <p className="font-display font-bold text-[24px] uppercase text-white/20">
                No products found
              </p>
              <button onClick={clearAll} className="text-volt text-[12px] uppercase tracking-[2px] hover:opacity-70">
                Clear filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-4 ${gridClass}`}>
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                  <div className="relative aspect-[3/4] bg-[#111] overflow-hidden mb-3">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {product.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-[2px] ${
                          product.badge === "sale" ? "bg-volt text-black" : "bg-black text-white"
                        }`}>
                          {product.badge.toUpperCase()}
                        </span>
                      </div>
                    )}

                    <button
                      className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                      onClick={(e) => e.preventDefault()}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 12S1 8.5 1 5C1 3.3 2.3 2 4 2C5.1 2 6 2.6 7 3.5C8 2.6 8.9 2 10 2C11.7 2 13 3.3 13 5C13 8.5 7 12 7 12Z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                      <div className="w-full h-11 bg-volt flex items-center justify-center font-body font-semibold text-[11px] uppercase tracking-[2px] text-black">
                        View product
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-[2px] mb-1">{product.category}</p>
                      <h3 className="font-display font-bold text-[14px] uppercase text-white leading-tight mb-1.5">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-[15px] text-white">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-white/30 text-[12px] line-through">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1.5 mt-1 shrink-0">
                      {product.colors.map((color, i) => (
                        <span key={i} className="w-3 h-3 rounded-full border border-white/10"
                          style={{ backgroundColor: color.hex }} />
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="py-5 border-b border-white/10">
      <button onClick={() => setOpen(p => !p)} className="flex items-center justify-between w-full">
        <span className="text-white font-medium text-[13px] uppercase tracking-[1px]">{title}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M2 4L6 8L10 4" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>
      {open && <div className="mt-4 flex flex-col gap-2">{children}</div>}
    </div>
  )
}

function FilterCheckbox({ label, count, checked, onChange }: {
  label: string; count?: number; checked: boolean; onChange: () => void
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group" onClick={onChange}>
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
          checked ? "bg-volt border-volt" : "border-white/20 group-hover:border-white/50"
        }`}>
          {checked && (
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1 4L3 6L7 2" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span className={`text-[12px] font-light transition-colors ${
          checked ? "text-white" : "text-white/50 group-hover:text-white/80"
        }`}>
          {label}
        </span>
      </div>
      {count !== undefined && <span className="text-white/20 text-[11px]">{count}</span>}
    </label>
  )
}

function ToggleRow({ label, value, onChange }: {
  label: string; value: boolean; onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/50 text-[12px] font-light">{label}</span>
      <button
        onClick={onChange}
        className="relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0"
        style={{ backgroundColor: value ? "#C8FF00" : "rgba(255,255,255,0.1)" }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
          style={{ transform: value ? "translateX(18px)" : "translateX(2px)" }}
        />
      </button>
    </div>
  )
}