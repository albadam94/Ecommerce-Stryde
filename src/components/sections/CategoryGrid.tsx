"use client"

import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    id: 1,
    title: "RUNNING COLLECTION",
    tag: "Running",
    image: "/images/categories/Running.png",
    gridClass: "md:col-span-1 md:row-span-2",
  },
  {
    id: 2,
    title: "TRAINING",
    tag: "Training",
    image: "/images/categories/Training.png",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    title: "OUTDOOR",
    tag: "Outdoor",
    image: "/images/categories/Outdoor.png",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    title: "LIFESTYLE",
    tag: "Lifestyle",
    image: "/images/categories/Lifestyle.png",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 5,
    title: "ACCESSORIES",
    tag: "Accessories",
    image: "/images/categories/Accesories.png",
    gridClass: "md:col-span-1 md:row-span-1",
  },
]

export default function CategoryGrid() {
  return (
    <section className="bg-black w-full font-dm-sans relative overflow-hidden">
      {/* Línea de fondo decorativa */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Image 
          src="/images/bg-wavy-line.svg" 
          alt="" 
          fill 
          className="object-contain translate-x-1/4"
        />
      </div>

      {/* CONTENEDOR DE ALINEACIÓN CRÍTICO:
          Usamos md:px-[80px] para que coincida exactamente con el 
          margin-left que tiene el botón "Buy Now" en el Slider.
      */}
      <div className="relative z-10 max-w-[1440px] mx-auto pt-[120px] pb-[100px] px-6 md:px-[80px]">
        
        {/* Título: Ajustado el leading y el tracking para que no se vea desordenado */}
        <div className="mb-16">
          <h2 className="text-white font-display font-extrabold text-[42px] md:text-[64px] uppercase leading-[0.85] tracking-[-3px]">
            Shop by <br />
            <span className="text-[#C8FF00]">Category</span>
          </h2>
        </div>

        {/* Grid de Imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-auto md:h-[780px]">
          {categories.map((cat) => (
            <Link
              href={`/category/${cat.tag.toLowerCase()}`}
              key={cat.id}
              className={`relative group overflow-hidden bg-[#0A0A0A] border border-white/5 ${cat.gridClass}`}
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 opacity-60 group-hover:opacity-90"
              />

              {/* Overlay Gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

              {/* Textos dentro de la card */}
              <div className="absolute bottom-10 left-10 z-10">
                <p className="text-[#C8FF00] text-[11px] font-bold uppercase tracking-[3px] mb-2">
                  {cat.tag}
                </p>
                <h3 className="text-white font-display font-bold text-2xl uppercase leading-none">
                  {cat.title}
                </h3>
                <div className="mt-4 overflow-hidden h-[1px] w-0 group-hover:w-full bg-[#C8FF00] transition-all duration-500" />
                <p className="text-gray-400 text-[10px] uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  View products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}