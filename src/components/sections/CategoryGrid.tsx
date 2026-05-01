"use client"

import Image from "next/image"
import Link from "next/link"

const categories = [
  { id: 1, title: "RUNNING COLLECTION", tag: "Running", image: "/images/categories/Running.png", href: "/products?sport=running" },
  { id: 2, title: "TRAINING", tag: "Training", image: "/images/categories/Training.png", href: "/products?sport=training" },
  { id: 3, title: "OUTDOOR", tag: "Outdoor", image: "/images/categories/Outdoor.png", href: "/products?sport=outdoor" },
  { id: 4, title: "LIFESTYLE", tag: "Lifestyle", image: "/images/categories/Lifestyle.png", href: "/products?sport=lifestyle" },
  { id: 5, title: "ACCESSORIES", tag: "Accessories", image: "/images/categories/Accesories.png", href: "/products?cat=accessories" },
]

export default function CategoryGrid() {
  return (
    // Aumentamos pt-32 para que el header no "asfixie" el título
    <section className="bg-black w-full relative overflow-hidden pt-32 pb-24">

      {/* Decorative lines */}
      <Image
        src="/images/Linesection.svg"
        alt="Decorative Lines"
        width={800}
        height={200}
        className="absolute top-0 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none"
      />

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10">

        <div className="md:mb-16 ">
          <h2 className="font-display font-extrabold md:text-[48px] uppercase leading-[0.85] tracking-[-1px] text-white">
            Shop by <br /> <span className="text-volt">Category</span>
          </h2>
        </div>

       
        <div
          className="grid gap-4 h-[650px] md:h-[750px]"
          style={{
            gridTemplateColumns: "1.4fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
          }}
        >
    
          <CategoryCard 
            category={categories[0]} 
            className="row-span-2" 
            isLarge 
          />

        
          <CategoryCard category={categories[1]} />
          <CategoryCard category={categories[2]} />

        
          <CategoryCard category={categories[3]} />
          <CategoryCard category={categories[4]} />
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ category, className = "", isLarge = false }: { category: typeof categories[0]; className?: string; isLarge?: boolean }) {
  return (
    <Link
      href={category.href}
      className={`relative group overflow-hidden bg-[#111] rounded-sm flex ${className}`}
    >
      <Image
        src={category.image}
        alt={category.title}
        fill
        sizes={isLarge ? "50vw" : "25vw"}
        priority={isLarge}
        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

      <div className={`absolute left-6 md:left-8 z-10 ${isLarge ? 'bottom-10' : 'bottom-6'}`}>
        <p className="text-volt text-[10px] font-medium uppercase tracking-[3px] mb-2">
          {category.tag}
        </p>

        <h3 className={`text-white font-display font-bold uppercase leading-tight ${isLarge ? 'text-[24px] md:text-[32px]' : 'text-[16px] md:text-[18px]'}`}>
          {category.title}
        </h3>

        <div className="mt-4 h-[2px] bg-volt transition-all duration-500 w-0 group-hover:w-14" />
      </div>
    </Link>
  )
}