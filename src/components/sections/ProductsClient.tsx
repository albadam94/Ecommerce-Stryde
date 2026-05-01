"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import allProducts from "@/data/products.json"
import type { Product } from "@/types"

const GENDERS = ["Men", "Women", "Unisex", "All"]
const ALL_SIZES = ["XS", "S", "M", "L", "XL"]
const ALL_COLORS = [
  { name: "White",  hex: "#F5F5F3" },
  { name: "Volt",   hex: "#C8FF00" },
  { name: "Orange", hex: "#E85D04" },
  { name: "Navy",   hex: "#1A1F3C" },
  { name: "Gray",   hex: "#555555" },
  { name: "Teal",   hex: "#0D9488" },
  { name: "Red",    hex: "#DC2626" },
  { name: "Gold",   hex: "#D97706" },
]
const SUBCATEGORIES = [
  { key: "jackets",     label: "Jackets" },
  { key: "tshirts",     label: "T-shirts" },
  { key: "shorts",      label: "Shorts" },
  { key: "leggings",    label: "Leggings" },
  { key: "accessories", label: "Accessories" },
]
const COLLECTIONS = ["Core collection", "FW25", "SS25"]

interface Props {
  initialGender: string
  initialSport: string
}

export default function ProductsClient({ initialGender, initialSport }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const [gender, setGender] = useState(initialGender)
  const [openSections, setOpenSections] = useState({
    category: true, size: true, color: true, price: true, collection: true, availability: true,
  })
  const [selCats, setSelCats]         = useState<string[]>([])
  const [selSizes, setSelSizes]       = useState<string[]>([])
  const [selColors, setSelColors]     = useState<string[]>([])
  const [priceMax, setPriceMax]       = useState(450)
  const [selCollections, setSelCols]  = useState<string[]>(["Core collection"])
  const [inStockOnly, setInStock]     = useState(true)
  const [presSale, setPreSale]        = useState(false)
  const [sortBy, setSort]             = useState("relevance")
  const [viewMode, setView]           = useState<"2" | "4" | "list">("2")
  const [wishlist, setWishlist]       = useState<string[]>([])

  const products = allProducts as unknown as Product[]

  // Base pool filtered by sport (from URL)
  const sportPool = useMemo(() =>
    initialSport && initialSport !== "all"
      ? products.filter(p => p.sport === initialSport)
      : products,
  [initialSport])

  // Filtered products
  const filtered = useMemo(() => {
    let r = sportPool

    if (gender !== "all") {
      const g = gender.toLowerCase()
      r = r.filter(p => p.gender === g || p.gender === "unisex")
    }
    if (selCats.length)    r = r.filter(p => selCats.includes(p.subcategory))
    if (selSizes.length)   r = r.filter(p => p.sizes.some(s => selSizes.includes(s.label) && s.available))
    if (selColors.length)  r = r.filter(p => p.colors.some(c => selColors.includes(c.name)))
    r = r.filter(p => p.price <= priceMax)
    if (inStockOnly) r = r.filter(p => p.inStock)

    if (sortBy === "price-asc")  r = [...r].sort((a, b) => a.price - b.price)
    if (sortBy === "price-desc") r = [...r].sort((a, b) => b.price - a.price)
    if (sortBy === "newest")     r = [...r].reverse()

    return r
  }, [sportPool, gender, selCats, selSizes, selColors, priceMax, inStockOnly, sortBy])

  // Category counts based on current gender + sport (ignoring subcategory filter)
  const catCounts = useMemo(() => {
    const base = gender === "all"
      ? sportPool
      : sportPool.filter(p => p.gender === gender.toLowerCase() || p.gender === "unisex")
    return base.reduce<Record<string, number>>((acc, p) => {
      acc[p.subcategory] = (acc[p.subcategory] || 0) + 1
      return acc
    }, {})
  }, [sportPool, gender])

  const totalForHeader = Object.values(catCounts).reduce((a, b) => a + b, 0)

  const genderLabel = gender === "men" ? "Men's" : gender === "women" ? "Women's" : gender === "unisex" ? "Unisex" : ""
  const sportLabel  = initialSport
    ? initialSport.charAt(0).toUpperCase() + initialSport.slice(1)
    : "Collection"

  const handleGender = (g: string) => {
    const val = g === "All" ? "all" : g.toLowerCase()
    setGender(val)
    const params = new URLSearchParams()
    if (val !== "all") params.set("gender", val)
    if (initialSport) params.set("sport", initialSport)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const clearAll = () => {
    setSelCats([]); setSelSizes([]); setSelColors([])
    setPriceMax(450); setSelCols([]); setInStock(false); setPreSale(false)
  }

  const toggle = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#fff", paddingTop: "100px" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 48px 80px" }}>

        {/* Breadcrumb */}
        <nav style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "32px", fontSize: "13px", color: "#8C8C8C" }}>
          <Link href="/" style={{ color: "#8C8C8C", textDecoration: "none" }}>Home</Link>
          {gender !== "all" && (
            <>
              <span>›</span>
              <span style={{ textTransform: "capitalize" }}>{gender === "men" ? "Man" : gender === "women" ? "Woman" : gender}</span>
            </>
          )}
          {initialSport && (
            <>
              <span>›</span>
              <span style={{ color: "#fff", textTransform: "capitalize" }}>{initialSport}</span>
            </>
          )}
        </nav>

        {/* Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "var(--font-syne), Syne, sans-serif", fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 800, lineHeight: 1, margin: 0, textTransform: "uppercase" }}>
            {genderLabel && <span style={{ display: "block", color: "#fff" }}>{genderLabel}</span>}
            <span style={{ display: "block", color: "#C8FF00" }}>{sportLabel}</span>
          </h1>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>{totalForHeader} products</div>
            <div style={{ fontSize: "12px", color: "#8C8C8C", maxWidth: "260px" }}>High-performance technique for the athlete who never stops.</div>
          </div>
        </div>

        {/* Gender tabs */}
        <div style={{ display: "flex", gap: "32px", borderBottom: "1px solid #2A2A2A", marginBottom: "40px" }}>
          {GENDERS.map(g => {
            const isActive = g === "All" ? gender === "all" : g.toLowerCase() === gender
            return (
              <button
                key={g}
                onClick={() => handleGender(g)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "0 0 16px",
                  fontSize: "14px", fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#C8FF00" : "#8C8C8C",
                  borderBottom: isActive ? "2px solid #C8FF00" : "2px solid transparent",
                  marginBottom: "-1px", transition: "all 0.2s",
                }}
              >{g}</button>
            )
          })}
        </div>

        {/* Main layout */}
        <div style={{ display: "flex", gap: "48px" }}>

          {/* ── SIDEBAR ── */}
          <div style={{ width: "220px", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ fontWeight: 700, fontSize: "15px" }}>Filters</span>
              <button onClick={clearAll} style={{ background: "none", border: "none", cursor: "pointer", color: "#C8FF00", fontSize: "13px", padding: 0 }}>Clear all</button>
            </div>
            <div style={{ borderTop: "1px solid #2A2A2A" }} />

            {/* Category */}
            <FilterSection title="Category" open={openSections.category} onToggle={() => setOpenSections(p => ({ ...p, category: !p.category }))}>
              {SUBCATEGORIES.map(({ key, label }) => (
                <CheckRow
                  key={key}
                  checked={selCats.includes(key)}
                  onToggle={() => setSelCats(p => toggle(p, key))}
                  label={label}
                  count={catCounts[key] || 0}
                />
              ))}
            </FilterSection>

            <Divider />

            {/* Size */}
            <FilterSection title="Size" open={openSections.size} onToggle={() => setOpenSections(p => ({ ...p, size: !p.size }))}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {ALL_SIZES.map(s => {
                  const active = selSizes.includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() => setSelSizes(p => toggle(p, s))}
                      style={{
                        padding: "5px 10px", minWidth: "36px",
                        border: `1px solid ${active ? "#C8FF00" : "#3D3D3D"}`,
                        backgroundColor: active ? "#C8FF00" : "transparent",
                        color: active ? "#0A0A0A" : "#fff",
                        fontSize: "12px", fontWeight: 500, cursor: "pointer", borderRadius: "2px",
                        transition: "all 0.15s",
                      }}
                    >{s}</button>
                  )
                })}
              </div>
            </FilterSection>

            <Divider />

            {/* Color */}
            <FilterSection title="Color" open={openSections.color} onToggle={() => setOpenSections(p => ({ ...p, color: !p.color }))}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {ALL_COLORS.map(c => {
                  const active = selColors.includes(c.name)
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelColors(p => toggle(p, c.name))}
                      title={c.name}
                      style={{
                        width: "26px", height: "26px", borderRadius: "50%",
                        backgroundColor: c.hex,
                        border: `2px solid ${active ? "#C8FF00" : "transparent"}`,
                        outline: active ? "1px solid #C8FF00" : "1px solid #3D3D3D",
                        outlineOffset: "2px",
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    />
                  )
                })}
              </div>
            </FilterSection>

            <Divider />

            {/* Price */}
            <FilterSection title="Price" open={openSections.price} onToggle={() => setOpenSections(p => ({ ...p, price: !p.price }))}>
              <input
                type="range" min={0} max={450} value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#C8FF00", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#8C8C8C", marginTop: "6px" }}>
                <span>$0</span><span>${priceMax}</span>
              </div>
            </FilterSection>

            <Divider />

            {/* Collection */}
            <FilterSection title="Collection" open={openSections.collection} onToggle={() => setOpenSections(p => ({ ...p, collection: !p.collection }))}>
              {COLLECTIONS.map(col => (
                <CheckRow
                  key={col}
                  checked={selCollections.includes(col)}
                  onToggle={() => setSelCols(p => toggle(p, col))}
                  label={col}
                />
              ))}
            </FilterSection>

            <Divider />

            {/* Availability */}
            <FilterSection title="Availability" open={openSections.availability} onToggle={() => setOpenSections(p => ({ ...p, availability: !p.availability }))}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px" }}>In stock only</span>
                  <Toggle checked={inStockOnly} onChange={setInStock} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px" }}>Include pre-sale</span>
                  <Toggle checked={presSale} onChange={setPreSale} />
                </div>
              </div>
            </FilterSection>
          </div>

          {/* ── PRODUCT GRID ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Grid header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <span style={{ fontSize: "13px", color: "#8C8C8C" }}>
                Showing <strong style={{ color: "#fff" }}>{filtered.length}</strong> of <strong style={{ color: "#fff" }}>{totalForHeader}</strong> products
              </span>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                {/* Sort */}
                <div style={{ position: "relative" }}>
                  <select
                    value={sortBy}
                    onChange={e => setSort(e.target.value)}
                    style={{
                      backgroundColor: "#111", border: "1px solid #3D3D3D", color: "#fff",
                      padding: "8px 36px 8px 14px", fontSize: "13px", cursor: "pointer",
                      borderRadius: "2px", appearance: "none", outline: "none",
                    }}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#8C8C8C", fontSize: "10px" }}>▼</span>
                </div>
                {/* View icons */}
                <div style={{ display: "flex", gap: "4px" }}>
                  <ViewBtn active={viewMode === "2"} onClick={() => setView("2")} title="2 columns">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="0" width="7" height="7"/><rect x="9" y="0" width="7" height="7"/><rect x="0" y="9" width="7" height="7"/><rect x="9" y="9" width="7" height="7"/></svg>
                  </ViewBtn>
                  <ViewBtn active={viewMode === "4"} onClick={() => setView("4")} title="4 columns">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="0" width="3" height="7"/><rect x="4.3" y="0" width="3" height="7"/><rect x="8.7" y="0" width="3" height="7"/><rect x="13" y="0" width="3" height="7"/><rect x="0" y="9" width="3" height="7"/><rect x="4.3" y="9" width="3" height="7"/><rect x="8.7" y="9" width="3" height="7"/><rect x="13" y="9" width="3" height="7"/></svg>
                  </ViewBtn>
                  <ViewBtn active={viewMode === "list"} onClick={() => setView("list")} title="List">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="1" width="16" height="2"/><rect x="0" y="7" width="16" height="2"/><rect x="0" y="13" width="16" height="2"/></svg>
                  </ViewBtn>
                </div>
              </div>
            </div>

            {/* Products or empty state */}
            {filtered.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: viewMode === "list" ? "1fr" : `repeat(${viewMode}, 1fr)`,
                gap: viewMode === "list" ? "1px" : "16px",
              }}>
                {filtered.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    wishlisted={wishlist.includes(p.id)}
                    onWishlist={id => setWishlist(prev => toggle(prev, id))}
                    viewMode={viewMode}
                    gender={gender}
                    sport={initialSport}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function FilterSection({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div style={{ paddingTop: "20px", paddingBottom: "4px" }}>
      <button
        onClick={onToggle}
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "0 0 14px", color: "#fff",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 600 }}>{title}</span>
        <span style={{ color: "#555", fontSize: "11px", transition: "transform 0.2s", display: "inline-block", transform: open ? "rotate(0deg)" : "rotate(180deg)" }}>▲</span>
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}

function CheckRow({ checked, onToggle, label, count }: { checked: boolean; onToggle: () => void; label: string; count?: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", cursor: "pointer" }} onClick={onToggle}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "15px", height: "15px", flexShrink: 0, borderRadius: "3px",
          border: checked ? "none" : "1.5px solid #555",
          backgroundColor: checked ? "#C8FF00" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {checked && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3 5.5L8 1" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span style={{ fontSize: "13px", color: "#fff", userSelect: "none" }}>{label}</span>
      </div>
      {count !== undefined && <span style={{ fontSize: "12px", color: "#555" }}>{count}</span>}
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: "38px", height: "21px", borderRadius: "11px",
        backgroundColor: checked ? "#C8FF00" : "#3D3D3D",
        border: "none", cursor: "pointer", position: "relative", transition: "background-color 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: "3px",
        left: checked ? "19px" : "3px",
        width: "15px", height: "15px", borderRadius: "50%",
        backgroundColor: checked ? "#0A0A0A" : "#8C8C8C",
        transition: "left 0.2s",
      }} />
    </button>
  )
}

function Divider() {
  return <div style={{ borderTop: "1px solid #2A2A2A", marginTop: "8px" }} />
}

function ViewBtn({ active, onClick, title, children }: { active: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: "32px", height: "32px", border: `1px solid ${active ? "#C8FF00" : "#3D3D3D"}`,
        backgroundColor: active ? "#C8FF00" : "transparent",
        color: active ? "#0A0A0A" : "#8C8C8C",
        cursor: "pointer", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}
    >{children}</button>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "20px", textAlign: "center" }}>
      <div style={{
        width: "72px", height: "72px", borderRadius: "50%",
        backgroundColor: "#111", border: "1px solid #2A2A2A",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M4 8h24M10 8V6a2 2 0 012-2h8a2 2 0 012 2v2M14 14v8M18 14v8M6 8l2 18a2 2 0 002 2h12a2 2 0 002-2l2-18" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div>
        <p style={{ fontSize: "18px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>No products found</p>
        <p style={{ fontSize: "14px", color: "#8C8C8C", margin: 0 }}>Try adjusting your filters to find what you're looking for.</p>
      </div>
      <button
        onClick={onClear}
        style={{
          padding: "10px 24px", backgroundColor: "#C8FF00", color: "#0A0A0A",
          border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "1px", borderRadius: "2px",
        }}
      >Clear all filters</button>
    </div>
  )
}

function ProductCard({
  product, wishlisted, onWishlist, viewMode, gender, sport,
}: {
  product: Product; wishlisted: boolean; onWishlist: (id: string) => void
  viewMode: "2" | "4" | "list"; gender: string; sport: string
}) {
  const [hovered, setHovered] = useState(false)

  const categoryTag = [
    gender !== "all" ? (gender === "men" ? "Men's" : gender === "women" ? "Women's" : "Unisex") : "",
    sport ? sport.charAt(0).toUpperCase() + sport.slice(1) : "",
  ].filter(Boolean).join(" ")

  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "flex", gap: "24px", alignItems: "center",
            padding: "20px 0", borderBottom: "1px solid #2A2A2A",
            backgroundColor: hovered ? "#111" : "transparent", transition: "background-color 0.2s",
          }}
        >
          <div style={{ width: "100px", height: "100px", position: "relative", flexShrink: 0, backgroundColor: "#1A1A1A", overflow: "hidden" }}>
            <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "11px", color: "#555", margin: "0 0 4px", textTransform: "capitalize" }}>{categoryTag}</p>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff", margin: "0 0 6px" }}>{product.name}</p>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "15px", color: "#fff", fontWeight: 600 }}>${product.price}</span>
              {product.originalPrice && <span style={{ fontSize: "13px", color: "#555", textDecoration: "line-through" }}>${product.originalPrice}</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {product.colors.slice(0, 4).map(c => (
              <div key={c.hex} style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: c.hex, border: "1px solid #3D3D3D" }} />
            ))}
          </div>
          <button
            onClick={e => { e.preventDefault(); onWishlist(product.id) }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", color: wishlisted ? "#fff" : "#555" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill={wishlisted ? "white" : "none"}>
              <path d="M9 15.5S2 11 2 6.5A4 4 0 0 1 9 4.2 4 4 0 0 1 16 6.5C16 11 9 15.5 9 15.5Z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: "pointer" }}
      >
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#1A1A1A", marginBottom: "12px" }}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            style={{ objectFit: "cover", transition: "transform 0.5s", transform: hovered ? "scale(1.05)" : "scale(1)" }}
          />

          {/* Badge */}
          {product.badge && (
            <div style={{
              position: "absolute", top: "12px", left: "12px",
              backgroundColor: product.badge === "sale" ? "#C8FF00" : "#111",
              color: product.badge === "sale" ? "#0A0A0A" : "#fff",
              fontSize: "9px", fontWeight: 700, padding: "4px 8px",
              letterSpacing: "1.5px", textTransform: "uppercase",
            }}>
              {product.badge === "new" ? "NEW" : product.badge === "sale" ? "SALE" : product.badge.toUpperCase()}
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={e => { e.preventDefault(); onWishlist(product.id) }}
            style={{ position: "absolute", top: "10px", right: "10px", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill={wishlisted ? "white" : "none"}>
              <path d="M10 17S2 12 2 7a4.5 4.5 0 018-2.8A4.5 4.5 0 0118 7c0 5-8 10-8 10z" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* View product hover bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            backgroundColor: "#C8FF00",
            height: hovered ? "44px" : "0",
            overflow: "hidden", transition: "height 0.3s ease",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#0A0A0A", textTransform: "uppercase", letterSpacing: "2px", whiteSpace: "nowrap" }}>
              View product
            </span>
          </div>
        </div>

        {/* Info */}
        <p style={{ fontSize: "11px", color: "#555", margin: "0 0 4px", textTransform: "capitalize" }}>{categoryTag}</p>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff", margin: "0 0 8px" }}>{product.name}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#fff", fontWeight: 600 }}>${product.price}</span>
            {product.originalPrice && <span style={{ fontSize: "12px", color: "#555", textDecoration: "line-through" }}>${product.originalPrice}</span>}
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {product.colors.slice(0, 4).map(c => (
              <div key={c.hex} style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: c.hex, border: "1px solid #3D3D3D" }} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
