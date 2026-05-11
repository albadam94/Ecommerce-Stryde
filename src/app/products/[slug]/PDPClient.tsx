"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCartStore } from "@/store/cartStore"
import type { Product } from "@/types"

interface Props {
  product: Product
  related: Product[]
}

export default function PDPClient({ product, related }: Props) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize,  setSelectedSize]  = useState<string | null>(null)
  const [activeImage,   setActiveImage]   = useState(0)
  const [activeTab,     setActiveTab]     = useState("Description")
  const [wishlist,      setWishlist]      = useState(false)
  const [added,         setAdded]         = useState(false)

  const { addItem, openCart } = useCartStore()

  const handleAddToCart = () => {
    if (!selectedSize) return
    addItem({
      productId: product.id,
      name:      product.name,
      price:     product.price,
      size:      selectedSize,
      color:     selectedColor,
      quantity:  1,
      image:     product.images[0],
    })
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className="bg-black min-h-screen text-white" style={{ paddingTop: "100px" }}>

      {/* BREADCRUMB */}
      <div className="max-w-[1440px] mx-auto px-20 py-6">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[1.5px]">
          <Link href="/" className="text-white/40 hover:text-white transition-colors">Home</Link>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1L5 5L1 9" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round"/></svg>
          <Link href="/products?gender=men" className="text-white/40 hover:text-white transition-colors">Man</Link>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1L5 5L1 9" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round"/></svg>
          <Link href="/products?cat=running" className="text-white/40 hover:text-white transition-colors">Running</Link>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1L5 5L1 9" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round"/></svg>
          <span className="text-white/80">{product.name}</span>
        </div>
      </div>

      {/* MAIN — 2 columnas fijas */}
      <div className="max-w-[1440px] mx-auto px-20 pb-20">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "start",
          }}
        >

          {/* ── COLUMNA IZQUIERDA: GALERÍA ── */}
          <div style={{ display: "flex", gap: "16px" }}>

            {/* Thumbnails verticales */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "72px", flexShrink: 0 }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    position: "relative",
                    width: "72px",
                    height: "88px",
                    border: activeImage === i
                      ? "1.5px solid #C8FF00"
                      : "1px solid rgba(255,255,255,0.1)",
                    overflow: "hidden",
                    flexShrink: 0,
                    cursor: "pointer",
                    background: "#111",
                  }}
                >
                  <Image src={img} alt={`view ${i + 1}`} fill className="object-cover"/>
                  {i === 0 && product.badge && (
                    <div style={{ position: "absolute", top: 4, left: 4 }}>
                      <span style={{ padding: "2px 6px", fontSize: "8px", fontWeight: 700, textTransform: "uppercase", background: "#0A0A0A", color: "white" }}>
                        {product.badge.toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Imagen principal */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ position: "relative", aspectRatio: "3/4", background: "#111", overflow: "hidden" }}>
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  sizes="40vw"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Nav flechas */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                <button
                  onClick={() => setActiveImage(p => Math.max(0, p - 1))}
                  style={{ width: 32, height: 32, border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", cursor: "pointer", color: "white" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </button>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                  {activeImage + 1} / {product.images.length}
                </span>
                <button
                  onClick={() => setActiveImage(p => Math.min(product.images.length - 1, p + 1))}
                  style={{ width: 32, height: 32, border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", cursor: "pointer", color: "white" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── COLUMNA DERECHA: INFO ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Category + Share */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ color: "#C8FF00", fontSize: "11px", fontWeight: 500, letterSpacing: "3px", textTransform: "uppercase" }}>
                {product.category}
              </p>
              <button style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="14" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="4" cy="9" r="2" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="14" cy="14" r="2" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M6 8L12 5M6 10L12 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Nombre */}
            <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "40px", textTransform: "uppercase", letterSpacing: "-1px", lineHeight: 0.95, color: "white", margin: 0 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L8.5 5H13L9.5 7.5L11 11L7 8.5L3 11L4.5 7.5L1 5H5.5L7 1Z"
                      fill={star <= Math.round(product.rating) ? "#C8FF00" : "rgba(255,255,255,0.1)"}/>
                  </svg>
                ))}
              </div>
              <span style={{ color: "#C8FF00", fontSize: "13px", fontWeight: 500 }}>{product.rating}</span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>{product.reviewCount} reviews</span>
            </div>

            {/* Precio */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "36px", letterSpacing: "-1px", color: "white" }}>
                ${product.price} USD
              </span>
              {product.originalPrice && (
                <>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "18px", textDecoration: "line-through", fontWeight: 300 }}>
                    ${product.originalPrice}
                  </span>
                  <span style={{ padding: "4px 10px", background: "#FF4B4B", color: "white", fontSize: "11px", fontWeight: 700 }}>
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* COLORES */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", color: "white" }}>Colors</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{selectedColor.name}</span>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                {product.colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: color.hex,
                      border: "1px solid rgba(255,255,255,0.15)",
                      outline: selectedColor.hex === color.hex ? "2px solid #C8FF00" : "2px solid transparent",
                      outlineOffset: "3px",
                      cursor: "pointer",
                      transition: "outline 0.15s",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* TALLAS */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", color: "white" }}>Size</span>
                <button style={{ fontSize: "11px", color: "#C8FF00", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Size Guide
                </button>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {product.sizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => size.available && setSelectedSize(size.label)}
                    disabled={!size.available}
                    style={{
                      width: 48, height: 44,
                      border: selectedSize === size.label
                        ? "1.5px solid #C8FF00"
                        : size.available
                          ? "1px solid rgba(255,255,255,0.2)"
                          : "1px solid rgba(255,255,255,0.08)",
                      background: selectedSize === size.label ? "rgba(200,255,0,0.08)" : "transparent",
                      color: selectedSize === size.label
                        ? "#C8FF00"
                        : size.available ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                      fontSize: "12px", fontWeight: 500,
                      cursor: size.available ? "pointer" : "not-allowed",
                      textDecoration: !size.available ? "line-through" : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    {size.label}
                  </button>
                ))}
              </div>

              {/* Low stock */}
              {selectedSize && product.sizes.find(s => s.label === selectedSize)?.lowStock && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L13 12H1L7 1Z" stroke="#FFB800" strokeWidth="1.2" strokeLinejoin="round"/>
                    <path d="M7 5V8M7 10V10.5" stroke="#FFB800" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: "11px", color: "#FFB800" }}>
                    Only 2 units left in size {selectedSize}. Buy now.
                  </span>
                </div>
              )}
              {!selectedSize && (
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "8px" }}>
                  Please select a size
                </p>
              )}
            </div>

            {/* MEMBER BANNER */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px",
              backgroundColor: "rgba(200,255,0,0.06)",
              border: "0.5px solid rgba(200,255,0,0.2)",
              gap: "16px",
            }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: 300, flex: 1 }}>
                <span style={{ color: "#C8FF00", fontWeight: 500 }}>Stryde Elite members</span> get this product for{" "}
                <span style={{ color: "white", fontWeight: 500 }}>${Math.round(product.price * 0.8)} USD</span> — save an additional ${product.price - Math.round(product.price * 0.8)}
              </p>
              <Link
                href="/auth/register"
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#C8FF00", color: "#0A0A0A",
                  fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
                  textDecoration: "none", whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Join Free →
              </Link>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                style={{
                  width: "100%", height: "56px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  backgroundColor: selectedSize ? "#C8FF00" : "rgba(200,255,0,0.3)",
                  color: selectedSize ? "#0A0A0A" : "rgba(0,0,0,0.4)",
                  border: "none",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "13px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase",
                  cursor: selectedSize ? "pointer" : "not-allowed",
                  transition: "background 0.2s",
                }}
              >
                {added ? (
                  <>✓ Added to cart!</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 2H3.5L4.5 10H12L13.5 4H4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="5.5" cy="12.5" r="1" fill="currentColor"/>
                      <circle cx="11" cy="12.5" r="1" fill="currentColor"/>
                    </svg>
                    Add to cart →
                  </>
                )}
              </button>

              <button
                onClick={() => setWishlist(p => !p)}
                style={{
                  width: "100%", height: "48px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  backgroundColor: "transparent",
                  border: wishlist ? "1px solid rgba(200,255,0,0.4)" : "1px solid rgba(255,255,255,0.2)",
                  color: wishlist ? "#C8FF00" : "rgba(255,255,255,0.7)",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "12px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 14S1 10 1 5.5A3.5 3.5 0 0 1 8 3.3 3.5 3.5 0 0 1 15 5.5C15 10 8 14 8 14Z"
                    fill={wishlist ? "#C8FF00" : "none"}
                    stroke={wishlist ? "#C8FF00" : "currentColor"}
                    strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
                {wishlist ? "Added to wishlist" : "Add to wishlist"}
              </button>
            </div>

            {/* TRUST BADGES */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                { label: "100% Secure Payment", sub: "SSL Encryption",           icon: "M8 1L10 5H14L11 8L12 12L8 9.5L4 12L5 8L2 5H6L8 1Z" },
                { label: "Free Returns",        sub: "30 days no questions asked", icon: "M1 8H13M9 4L13 8L9 12" },
                { label: "Express Shipping",    sub: "Arrives in 1-2 days",        icon: "M1 8H10M10 8L7 5M10 8L7 11M13 5H15V11H13V5Z" },
                { label: "Real-time stock",     sub: "Updated instantly",           icon: "M8 2V8M8 8L5 5M8 8L11 5M2 12H14" },
              ].map((b) => (
                <div key={b.label} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "12px 14px",
                  backgroundColor: "#313131",
                  border: "0.5px solid rgba(255,255,255,0.06)",
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "#C8FF00", flexShrink: 0 }}>
                    <path d={b.icon} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 500, color: "white" }}>{b.label}</p>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* TABS */}
            <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)", paddingTop: "8px" }}>
              <div style={{ display: "flex", gap: "32px", borderBottom: "0.5px solid rgba(255,255,255,0.1)", marginBottom: "0" }}>
                {["Description", "Care", "Shipping"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      paddingBottom: "14px",
                      paddingTop: "8px",
                      fontSize: "12px",
                      fontWeight: 500,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      background: "none",
                      border: "none",
                      borderBottom: activeTab === tab ? "2px solid #C8FF00" : "2px solid transparent",
                      color: activeTab === tab ? "#C8FF00" : "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                      transition: "color 0.15s",
                      marginBottom: "-0.5px",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div style={{ paddingTop: "20px" }}>
                {activeTab === "Description" && (
                  <p style={{ fontSize: "14px", color: "rgb(255, 255, 255)", fontWeight: 300, lineHeight: 1.8 }}>
                    {product.description}
                  </p>
                )}
                {activeTab === "Care" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {["Machine wash cold", "Do not bleach", "Tumble dry low", "Do not iron print", "Do not dry clean"].map((item) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#C8FF00", flexShrink: 0, display: "inline-block" }}/>
                        {item}
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "Shipping" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {[
                      { method: "Standard", time: "3-5 business days", price: "Free over $150" },
                      { method: "Express",  time: "1-2 business days", price: "$9.99" },
                      { method: "Overnight",time: "Next business day",  price: "$19.99" },
                    ].map((s) => (
                      <div key={s.method} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                        fontSize: "13px",
                      }}>
                        <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{s.method}</span>
                        <span style={{ color: "rgba(255,255,255,0.4)" }}>{s.time}</span>
                        <span style={{ color: "#C8FF00", fontWeight: 500 }}>{s.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* SPECS — Built to Perform */}
      <div style={{ backgroundColor: "#F5F5F3", width: "100%", padding: "80px 0" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "64px", alignItems: "start" }}>

            {/* Título + barras */}
            <div>
              <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "48px", textTransform: "uppercase", lineHeight: 0.9, letterSpacing: "-1.5px", color: "#0A0A0A", marginBottom: "40px" }}>
                Built to <br />
                <span style={{ color: "#C8FF00" }}>Perform</span>
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { label: "Breathability",    value: product.specs.breathability, suffix: "Excellent" },
                  { label: "Elasticity",       value: product.specs.elasticity,    suffix: "4 Way" },
                  { label: "Water Resistance", value: 80,                          suffix: "DWR" },
                  { label: "Lightness",        value: 92,                          suffix: "Ultra" },
                  { label: "Durability",       value: product.specs.durability,    suffix: "High" },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", fontWeight: 500 }}>{bar.label}</span>
                      <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>{bar.suffix} {bar.value}/100</span>
                    </div>
                    <div style={{ height: "2px", backgroundColor: "rgba(0,0,0,0.1)", borderRadius: "99px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${bar.value}%`, backgroundColor: "#0A0A0A", borderRadius: "99px" }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Labels specs */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {["Main Material", "Technology", "Stretch", "Moisture Wicking", "Water Resistance", "Weight"].map((key) => (
                <div key={key} style={{ padding: "16px 0", borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "rgba(0,0,0,0.5)" }}>{key}</span>
                </div>
              ))}
            </div>

            {/* Valores specs */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                product.specs.material,
                product.specs.technology,
                product.specs.stretch,
                product.specs.moistureWicking,
                product.specs.waterResistance,
                product.specs.weight,
              ].map((val, i) => (
                <div key={i} style={{ padding: "16px 0", borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}>
                  <span style={{ fontSize: "13px", color: "rgba(0,0,0,0.7)", fontWeight: 300 }}>{val}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div style={{ backgroundColor: "#0A0A0A", padding: "80px 0" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 80px" }}>
            <div style={{ marginBottom: "40px" }}>
              <p style={{ color: "#C8FF00", fontSize: "10px", fontWeight: 500, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>
                You might also like
              </p>
              <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "40px", letterSpacing: "-1px", lineHeight: 0.95, color: "white" }}>
                Related <br />Products
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} style={{ textDecoration: "none", display: "block" }}
                  className="group"
                >
                  <div style={{ position: "relative", aspectRatio: "3/4", background: "#111", overflow: "hidden" }}>
                    <Image src={p.images[0]} alt={p.name} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-105"/>
                    {p.badge && (
                      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
                        <span style={{
                          padding: "4px 10px", fontSize: "9px", fontWeight: 700,
                          textTransform: "uppercase", letterSpacing: "2px",
                          backgroundColor: p.badge === "sale" ? "#C8FF00" : "#0A0A0A",
                          color: p.badge === "sale" ? "#0A0A0A" : "white",
                        }}>
                          {p.badge.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{
                    backgroundColor: "#F5F5F3", padding: "10px 20px",
                    minHeight: "90px", display: "flex", flexDirection: "column", justifyContent: "space-between",
                  }}>
                    <div>
                      <p style={{ color: "rgba(0,0,0,0.4)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>
                        {p.category}
                      </p>
                      <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "14px", textTransform: "uppercase", color: "#0A0A0A", lineHeight: 1.2 }}>
                        {p.name}
                      </h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                      <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "15px", color: "#0A0A0A" }}>
                        ${p.price}
                      </span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {p.colors.slice(0, 3).map((c, i) => (
                          <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: c.hex, border: "1px solid rgba(0,0,0,0.1)", display: "inline-block" }}/>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}