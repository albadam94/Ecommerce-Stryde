"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const slides = [
  {
    id: 1,
    name: "Aero Jacket Pro",
    category: "Men's Running",
    price: 189,
    image: "/images/products/Tennis.png",
    season: "SPRING",
    seasonAccent: "SUMMER",
  },
  {
    id: 2,
    name: "Volt Speed Tee",
    category: "Women's Running",
    price: 80,
    image: "/images/products/Tennis2.png",
    season: "Tennis",
    seasonAccent: "Running",
  },
  {
    id: 3,
    name: "Race Shorts Elite",
    category: "Gym Clothes",
    price: 99,
    image: "/images/products/Ropagym.png",
    season: "Gym",
    seasonAccent: "Clothes",
  },
  {
    id: 4,
    name: "Compression Leggings",
    category: "shorts gym",
    price: 115,
    image: "/images/products/Shortsgym.png",
    season: "Shorts",
    seasonAccent: "Gym",
  },
]

export default function PromoSlider() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="bg-[#F5F5F3] w-full relative overflow-hidden">

     
      <div className="absolute right-16 top-0 h-full z-0 pointer-events-none">
        <svg
          width="80"
          height="100%"
          viewBox="0 0 80 900"
          fill="none"
          preserveAspectRatio="none"
          className="h-full opacity-50"
        >
          <path
            d="M40 0
               C40 0, 75 150, 40 300
               C5 450, 75 600, 40 750
               C5 850, 75 880, 40 900"
            stroke="#C8FF00"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-20 py-20">
        <div className="grid grid-cols-12 gap-10 items-start">

     
          <div className="col-span-4 flex flex-col justify-between h-full pt-2">
            <div>
              <h2 className="font-display font-extrabold text-[48px] uppercase leading-[0.95] tracking-[-1.5px] text-black mb-6">
                Beyond the <br />
                <span className="text-volt">Finish Line</span>
              </h2>
              <p className="text-black text-[14px] font-light leading-[1.8] mb-10 max-w-[300px]">
                This collection was born on the training track. Designed for athletes who don't distinguish between training and life.
              </p>

         
              <div className="border-t border-black/10 pt-6">
                <p className="text-black/40 text-[10px] uppercase tracking-[2px] mb-1">
                  {slides[activeIndex].category}
                </p>
                <h3 className="font-display font-bold text-[22px] uppercase text-black leading-tight mb-2">
                  {slides[activeIndex].name}
                </h3>
                <p className="font-display font-bold text-[20px] text-black mb-6">
                  ${slides[activeIndex].price}
                </p>
                <button className="flex items-center gap-3 h-[44px] px-6 bg-black text-white font-body font-medium text-[11px] uppercase tracking-[2px] hover:bg-volt hover:text-black transition-colors duration-200 rounded-[8px]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2H3.5L4.5 10H11.5L13 5H4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="5.5" cy="12" r="0.8" fill="currentColor"/>
                    <circle cx="10.5" cy="12" r="0.8" fill="currentColor"/>
                  </svg>
                  Quick Add
                </button>
              </div>
            </div>

     
            <div className="flex items-center gap-2 mt-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="transition-all duration-300"
                  style={{
                    width: i === activeIndex ? "28px" : "6px",
                    height: "2px",
                    backgroundColor: i === activeIndex
                      ? "#0A0A0A"
                      : "rgba(0,0,0,0.2)",
                    borderRadius: "99px",
                  }}
                />
              ))}
            </div>
          </div>

         
          <div className="col-span-8 flex gap-2 h-[580px]">
            {slides.map((slide, i) => {
              const isActive = i === activeIndex

              return (
                <div
                  key={slide.id}
                  onClick={() => setActiveIndex(i)}
                  className="relative overflow-hidden cursor-pointer flex-shrink-0 group"
                  style={{
                    width: isActive ? "55%" : "15%",
                    transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRadius: "4px",
                  }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.name}
                    fill
                    sizes="40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{
                      objectPosition: isActive ? "center" : "top center",
                    }}
                  />

                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: isActive
                        ? "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)"
                        : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)",
                    }}
                  />

                
                  {isActive && (
                    <div className="absolute bottom-6 left-6 z-10">
                      
                      <h3 className="font-display font-extrabold text-[32px] uppercase text-white leading-[1] tracking-[-1px]">
                        {slide.season} <br />
                        <span className="text-volt">{slide.seasonAccent}</span>
                      </h3>
                    </div>
                  )}

                 
                  {!isActive && (
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                      <p
                        className="font-display font-bold text-[11px] uppercase text-white/60 tracking-[3px]"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                        }}
                      >
                        {slide.season} {slide.seasonAccent}
                      </p>
                    </div>
                  )}

                  
                  <div className="absolute top-4 right-4 z-10">
                    <span className="font-display font-bold text-[11px] text-white/40 tracking-[2px]">
                      0{i + 1}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}