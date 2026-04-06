"use client"

import { motion } from "framer-motion"

const TICKER_ITEMS = [
  "New sneaker collection",
  "Free shipping on orders over $50",
  "Stryde Elite — Join today",
  "New sneaker collection",
  "Free shipping on orders over $50",
  "Stryde Elite — Join today",
]

export default function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-9 bg-volt overflow-hidden flex items-center">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 28,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-5 px-10 font-syne font-bold text-[10px] tracking-[3px] uppercase text-black"
          >
            {item}
            <span className="w-1 h-1 rounded-full bg-black/30 flex-shrink-0" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}