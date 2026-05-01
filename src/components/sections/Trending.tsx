"use client"

import Image from "next/image"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Aero Jacket Pro",
    category: "Men's Running",
    price: 189,
    image: "/images/products/BJacket.png",
    badge: "NEW",
    badgeType: "dark",
    colors: ["#0A0A0A", "#C8FF00", "#FFD700"],
  },
  {
    id: 2,
    name: "Compression Leggings",
    category: "Women's Training",
    price: 115,
    image: "/images/products/Leggins.png",
    badge: "EXCLUSIVE",
    badgeType: "dark",
    colors: ["#0A0A0A", "#FF1493"],
  },
  {
    id: 3,
    name: "Volt Speed Tee",
    category: "Men's T-Shirt",
    price: 80,
    originalPrice: 100,
    badge: "-20%",
    badgeType: "volt",
    image: "/images/products/Tshirt.png",
    colors: ["#0A0A0A", "#808000"],
  },
  {
    id: 4,
    name: "Race Shorts Elite",
    category: "Men's Running",
    price: 99,
    badge: "NEW",
    badgeType: "dark",
    image: "/images/products/Shorts.png",
    colors: ["#0A0A0A", "#808000"],
  },
]

export default function TrendingSection() {
  return (
    <section className="bg-white w-full py-24">

      <div className="max-w-360 mx-auto px-20">


        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display font-extrabold text-[48px] uppercase leading-[0.9] tracking-[-1px] text-black">
              Trending <br />
              <span className="text-volt">For You</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="text-[11px] font-bold tracking-[2px] uppercase text-black/50 hover:text-black transition-colors flex items-center gap-2"
          >
            Ver todo
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7H13M8 2L13 7L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>


        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">

           
              <div className="relative aspect-3/4 bg-[#E8E8E6] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />

              
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[1px] rounded-sm ${
                      product.badgeType === "volt"
                        ? "bg-volt text-black"
                        : "bg-black text-white"
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                )}

               
                <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 12S1 8.5 1 5C1 3.3 2.3 2 4 2C5.1 2 6 2.6 7 3.5C8 2.6 8.9 2 10 2C11.7 2 13 3.3 13 5C13 8.5 7 12 7 12Z" stroke="#0A0A0A" strokeWidth="1.2" strokeLinejoin="round"/>
                  </svg>
                </button>

               
                <div className="absolute inset-0 bg-volt/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-2" />

          
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-5 translate-y-2 group-hover:translate-y-0">
                  <button className="w-48.25 h-11 bg-volt flex items-center justify-center gap-2 font-body font-bold text-[12px] uppercase tracking-[1px] text-black shadow-xl hover:scale-105 transition-transform">
                    Quick Add
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 2H3.5L4.5 10H11.5L13 5H4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="5.5" cy="12" r="0.8" fill="currentColor"/>
                      <circle cx="10.5" cy="12" r="0.8" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>

            
              <div className="bg-[#F5F5F3] p-5 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[10px] text-black/50 font-bold uppercase tracking-[1px] mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-display font-extrabold text-[15px] text-black uppercase leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-display font-bold text-[16px] text-black">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="font-body text-[13px] text-black/30 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                
                <div className="flex gap-1.5 mt-1 shrink-0">
                  {product.colors.map((color, i) => (
                    <span
                      key={i}
                      className="w-3 h-3 rounded-full border border-black/5 cursor-pointer hover:scale-125 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}