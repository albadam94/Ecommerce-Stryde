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

interface Props { products: Product[] }

export default function ProductsClient({ products }: Props) {
  const searchParams = useSearchParams()
  const genderParam  = searchParams.get("gender")
  const catParam     = searchParams.get("cat")
  const badgeParam   = searchParams.get("badge")

  const [gender,       setGender]       = useState(() =>
    genderParam ? genderParam.charAt(0).toUpperCase() + genderParam.slice(1) : "Men"
  )
  const [activeSize,   setActiveSize]   = useState("M")
  const [activeColor,  setActiveColor]  = useState<string | null>(null)
  const [checkedCats,  setCheckedCats]  = useState<string[]>(["Jackets"])
  const [checkedColls, setCheckedColls] = useState<string[]>(["Core collection"])
  const [stockOnly,    setStockOnly]    = useState(true)
  const [preSale,      setPreSale]      = useState(false)
  const [priceMax,     setPriceMax]     = useState(450)
  const [sortBy,       setSortBy]       = useState("Relevance")
  const [viewMode,     setViewMode]     = useState<"grid3" | "grid2" | "list">("grid3")

 const filteredProducts = products
  .filter((p) => {
    if (gender !== "All") {
      const g = gender.toLowerCase()
      if (p.gender !== g && p.gender !== "unisex") return false
    }
    if (badgeParam && p.badge !== badgeParam) return false
    if (p.price > priceMax) return false
    if (stockOnly && !p.inStock) return false
    return true
  })
  .sort((a, b) => {
    switch (sortBy) {
      case "Price: Low to High":
        return a.price - b.price
      case "Price: High to Low":
        return b.price - a.price
      case "Best Rated":
        return b.rating - a.rating
      case "Newest":
        // Ordena por id descendente asumiendo que ids más altos son más nuevos
        return Number(b.id) - Number(a.id)
      case "Relevance":
      default:
        return 0
    }
  })

  const toggleCat  = (c: string) => setCheckedCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])
  const toggleColl = (c: string) => setCheckedColls(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])
  const clearAll   = () => {
    setCheckedCats([])
    setCheckedColls([])
    setActiveColor(null)
    setActiveSize("")
    setPriceMax(450)
    setStockOnly(false)
    setPreSale(false)
  }

  const sportLabel = catParam
    ? catParam.charAt(0).toUpperCase() + catParam.slice(1)
    : "Running"

  const gridClass = {
    grid3: "grid-cols-3",
    grid2: "grid-cols-2",
    list:  "grid-cols-1",
  }[viewMode]

  return (
    /* navbar 64px + ticker 36px + extra margen = 148px */
    <div className="bg-black min-h-screen text-white" style={{ paddingTop: "148px" }}>

      {/* BREADCRUMB */}
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[1.5px]">
          <Link href="/" className="text-white/40 hover:text-white transition-colors">
            Home
          </Link>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="text-white/40">{gender}</span>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="text-white/80">{sportLabel}</span>
        </div>
      </div>

      {/* PAGE HEADER */}
      <div className="max-w-[1440px] mx-auto px-20 pt-8 pb-6">
        <div className="flex items-end justify-between">
          <h1 className="font-display font-extrabold text-[56px] uppercase leading-[0.9] tracking-[-2px]">
            {gender}&apos;s <br />
            <span className="text-volt">{sportLabel}</span>
          </h1>
          <div className="text-right">
            <p className="text-white font-medium text-[13px] tracking-[0.5px]">
              {filteredProducts.length} products
            </p>
            <p className="text-white/30 text-[12px] font-light mt-1 max-w-[300px] text-right leading-relaxed">
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
      <div className="max-w-[1440px] mx-auto px-20 py-10 flex gap-10 items-start">

        {/* SIDEBAR */}
        <aside
          className="w-[240px] shrink-0 flex flex-col"
          style={{ borderRight: "0.5px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center justify-between pb-5 pr-8 border-b border-white/10">
            <span className="text-white font-medium text-[13px] uppercase tracking-[1px]">
              Filters
            </span>
            <button
              onClick={clearAll}
              className="text-volt text-[11px] font-medium uppercase tracking-[1px] hover:opacity-70 transition-opacity"
            >
              Clear all
            </button>
          </div>

          <FilterGroup title="Category">
            {CATEGORIES.map((cat) => (
              <FilterCheckbox
                key={cat} label={cat} count={10}
                checked={checkedCats.includes(cat)}
                onChange={() => toggleCat(cat)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Size">
            <div className="flex gap-2 flex-wrap">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSize(s)}
                  className={`text-[12px] font-medium border transition-all ${
                    activeSize === s
                      ? "border-volt bg-volt/10 text-volt"
                      : "border-white/20 text-white/50 hover:border-white/50"
                  }`}
                  style={{ width: 42, height: 39 }}
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
            <div className="pt-1 pb-2 pr-8">
              <style>{`
                input[type=range].price-slider {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 100%;
                  height: 3px;
                  border-radius: 99px;
                  background: linear-gradient(
                    to right,
                    #C8FF00 0%,
                    #C8FF00 ${(priceMax / 450) * 100}%,
                    rgba(255,255,255,0.1) ${(priceMax / 450) * 100}%,
                    rgba(255,255,255,0.1) 100%
                  );
                  outline: none;
                  cursor: pointer;
                }
                input[type=range].price-slider::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: #ffffff;
                  cursor: pointer;
                  border: 2px solid #C8FF00;
                  box-shadow: 0 0 0 2px rgba(200,255,0,0.2);
                }
                input[type=range].price-slider::-moz-range-thumb {
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: #ffffff;
                  cursor: pointer;
                  border: 2px solid #C8FF00;
                }
              `}</style>
              <input
                type="range" min={0} max={450} step={5}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="price-slider w-full"
              />
              <div className="flex justify-between mt-2 text-[11px]">
                <span className="text-white/40">$0</span>
                <span className="text-volt font-medium">${priceMax}</span>
              </div>
            </div>
          </FilterGroup>

          <FilterGroup title="Collection">
            {COLLECTIONS.map((col) => (
              <FilterCheckbox
                key={col} label={col}
                checked={checkedColls.includes(col)}
                onChange={() => toggleColl(col)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Availability">
            <div className="flex flex-col gap-5">
              <ToggleRow label="In stock only"    value={stockOnly} onChange={() => setStockOnly(p => !p)} />
              <ToggleRow label="Include pre-sale" value={preSale}   onChange={() => setPreSale(p => !p)} />
            </div>
          </FilterGroup>
        </aside>

        {/* PRODUCTS */}
        <div className="flex-1 min-w-0 pl-6">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <span className="text-white/40 text-[12px] font-light">
              Showing{" "}
              <span className="text-white">{filteredProducts.length}</span>
              {" "}of{" "}
              <span className="text-white">{products.length}</span>
              {" "}products
            </span>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-black border border-white/20 text-white text-[12px] px-4 pr-8 h-9 cursor-pointer outline-none hover:border-white/40 transition-colors"
                >
                  {["Relevance","Newest","Price: Low to High","Price: High to Low","Best Rated"].map(o => (
                    <option key={o} value={o} className="bg-black">{o}</option>
                  ))}
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4L6 8L10 4" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>

              {/* VIEW MODE BUTTONS */}
              <div className="flex gap-1">
                {([
                  {
                    mode: "grid3" as const,
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="1" y="1" width="4" height="6" stroke="currentColor" strokeWidth="1.2"/>
                        <rect x="6" y="1" width="4" height="6" stroke="currentColor" strokeWidth="1.2"/>
                        <rect x="11" y="1" width="4" height="6" stroke="currentColor" strokeWidth="1.2"/>
                        <rect x="1" y="9" width="4" height="6" stroke="currentColor" strokeWidth="1.2"/>
                        <rect x="6" y="9" width="4" height="6" stroke="currentColor" strokeWidth="1.2"/>
                        <rect x="11" y="9" width="4" height="6" stroke="currentColor" strokeWidth="1.2"/>
                      </svg>
                    ),
                  },
                
                  {
                    mode: "list" as const,
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1 4H15M1 8H15M1 12H15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    ),
                  },
                ]).map(({ mode, icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`w-9 h-9 flex items-center justify-center border transition-colors ${
                      viewMode === mode
                        ? "border-white/50 text-white bg-white/5"
                        : "border-white/10 text-white/30 hover:border-white/30 hover:text-white/60"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid / Empty */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <p className="font-display font-bold text-[20px] uppercase text-white/20">
                No products found
              </p>
              <p className="text-white/30 text-[13px]">Try adjusting your filters</p>
              <button
                onClick={clearAll}
                className="mt-2 px-6 py-2.5 bg-volt text-black text-[11px] font-bold uppercase tracking-[2px]"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-x-6 gap-y-10 ${gridClass}`}>
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className={`group ${viewMode === "list" ? "flex gap-0" : "block"}`}
                >
                  {/* IMAGEN */}
                  <div
                    className="relative overflow-hidden bg-[#1A1A1A] shrink-0"
                    style={{
                      aspectRatio: viewMode === "list" ? "1/1" : "3/4",
                      width: viewMode === "list" ? "180px" : "100%",
                    }}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes={
                        viewMode === "grid3" ? "30vw" :
                        viewMode === "grid2" ? "45vw" :
                        "180px"
                      }
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[2px] ${
                          product.badge === "sale" ? "bg-volt text-black" : "bg-black text-white"
                        }`}>
                          {product.badge.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Wishlist */}
                    <button
                      className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center"
                      onClick={(e) => e.preventDefault()}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M10 17.5S2 12.5 2 7C2 4.8 3.8 3 6 3C7.5 3 8.8 3.8 10 5C11.2 3.8 12.5 3 14 3C16.2 3 18 4.8 18 7C18 12.5 10 17.5 10 17.5Z"
                          fill="#1A1F3C"
                          stroke="#1A1F3C"
                          strokeWidth="1.2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* View product — solo en hover, oculto en lista */}
                    {viewMode !== "list" && (
                      <div
                        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
                        style={{
                          transform: "translateY(100%)",
                          transition: "transform 0.3s ease",
                        }}
                        ref={(el) => {
                          if (!el) return
                          const parent = el.closest(".group")
                          if (!parent) return
                          const show = () => (el.style.transform = "translateY(0%)")
                          const hide = () => (el.style.transform = "translateY(100%)")
                          parent.addEventListener("mouseenter", show)
                          parent.addEventListener("mouseleave", hide)
                        }}
                      >
                        <div className="w-full h-11 bg-volt flex items-center justify-center font-body font-semibold text-[12px] uppercase tracking-[2px] text-black pointer-events-auto">
                          View product
                        </div>
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div
                    style={{
                      backgroundColor: "#F5F5F3",
                      padding: viewMode === "list" ? "16px 24px" : "10px 20px",
                      minHeight: "90px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      flex: viewMode === "list" ? 1 : "unset",
                    }}
                  >
                    <div>
                      <p style={{
                        color: "rgba(0,0,0,0.4)",
                        fontSize: "10px",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}>
                        {product.category}
                      </p>
                      <h3 style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 700,
                        fontSize: viewMode === "list" ? "18px" : "14px",
                        textTransform: "uppercase",
                        color: "#0A0A0A",
                        lineHeight: 1.2,
                        marginBottom: viewMode === "list" ? "8px" : "0",
                      }}>
                        {product.name}
                      </h3>
                      {/* Descripción solo en lista */}
                      {viewMode === "list" && (
                        <p style={{
                          fontSize: "13px",
                          color: "rgba(0,0,0,0.5)",
                          fontWeight: 300,
                          lineHeight: 1.6,
                          maxWidth: "480px",
                        }}>
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "8px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{
                          fontFamily: "var(--font-syne)",
                          fontWeight: 700,
                          fontSize: "15px",
                          color: "#0A0A0A",
                        }}>
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span style={{
                            fontSize: "12px",
                            color: "rgba(0,0,0,0.3)",
                            textDecoration: "line-through",
                          }}>
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {/* Color dots */}
                        <div style={{ display: "flex", gap: "6px" }}>
                          {product.colors.slice(0, 4).map((color, i) => (
                            <span
                              key={i}
                              style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                backgroundColor: color.hex,
                                border: "1px solid rgba(0,0,0,0.1)",
                                display: "inline-block",
                              }}
                            />
                          ))}
                        </div>
                        {/* Botón ver en lista */}
                        {viewMode === "list" && (
                          <span style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            color: "#0A0A0A",
                            padding: "8px 20px",
                            backgroundColor: "#C8FF00",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            marginLeft: "12px",
                          }}>
                            View product
                          </span>
                        )}
                      </div>
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

/* ── SUB-COMPONENTES ── */

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="py-6 border-b border-white/10 pr-8">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center justify-between w-full"
      >
        <span className="text-white font-medium text-[13px] uppercase tracking-[1px]">
          {title}
        </span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path d="M2 4L6 8L10 4" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>
      {open && <div className="mt-5 flex flex-col gap-4">{children}</div>}
    </div>
  )
}

function FilterCheckbox({ label, count, checked, onChange }: {
  label: string; count?: number; checked: boolean; onChange: () => void
}) {
  return (
    <div
      className="flex items-center justify-between cursor-pointer group py-1"
      onClick={onChange}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center shrink-0 transition-all"
          style={{
            width: 16, height: 16,
            border: "1.5px solid #C8FF00",
            backgroundColor: checked ? "#C8FF00" : "transparent",
            borderRadius: 2,
          }}
        >
          {checked && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3 5.5L8 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span className={`text-[12px] font-light transition-colors ${
          checked ? "text-white" : "text-white/50 group-hover:text-white/80"
        }`}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-white/20 text-[11px]">{count}</span>
      )}
    </div>
  )
}

function ToggleRow({ label, value, onChange }: {
  label: string; value: boolean; onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/50 text-[12px] font-light">{label}</span>
      <button
        onClick={onChange}
        style={{
          position: "relative",
          width: 38, height: 22,
          borderRadius: 11,
          border: "none",
          cursor: "pointer",
          flexShrink: 0,
          backgroundColor: value ? "#C8FF00" : "#2A2A2A",
          transition: "background-color 0.2s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: value ? 19 : 3,
            width: 16, height: 16,
            borderRadius: "50%",
            backgroundColor: value ? "#0A0A0A" : "#8C8C8C",
            transition: "left 0.2s, background-color 0.2s",
          }}
        />
      </button>
    </div>
  )
}