"use client"

import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import Image from "next/image"

const NAV_LINKS = [
  { label: "Men",         href: "/products?gender=men"    },
  { label: "Women",       href: "/products?gender=women"  },
  { label: "Running",     href: "/products?cat=running"   },
  { label: "Training",    href: "/products?cat=training"  },
  { label: "Collections", href: "/collections"            },
  { label: "Sale",        href: "/products?badge=sale"    },
]

export default function Navbar() {
  const { openCart, getCount } = useCartStore()
  const count = getCount()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-[20px] border-b border-[#2A2A2A] bg-black/90 backdrop-blur-md">

      {/* LOGO */}
      <Link href="/">
          <Image
            src="/images/logo/Logo.svg"
            alt="STRYDE"
            width={120}
            height={36}
            priority
            className="object-contain"
          />
      </Link>

      {/* LINKS */}
      <ul className="flex gap-8 list-none">
  {NAV_LINKS.map((link) => (
    <li key={link.href}>
      <Link
        href={link.href}
        className="font-syne font-bold text-[14px] leading-[20px] tracking-normal uppercase text-white-2 hover:text-volt transition-colors duration-200"
      >
        {link.label}
      </Link>
    </li>
  ))}
</ul>

      {/* ICONS & CTA */}
      <div className="flex items-center gap-5">
        
        {/* Search */}
        <button className="opacity-60 hover:opacity-100 transition-opacity">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Wishlist */}
        <button className="opacity-60 hover:opacity-100 transition-opacity">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 15.5S2 11 2 6.5A4 4 0 0 1 9 4.2 4 4 0 0 1 16 6.5C16 11 9 15.5 9 15.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Account */}
        <Link href="/auth/login" className="opacity-60 hover:opacity-100 transition-opacity">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2C6.8 2 5 3.8 5 6C5 8.2 6.8 10 9 10C11.2 10 13 8.2 13 6C13 3.8 11.2 2 9 2Z" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M2 16C2 13.2 5.1 11 9 11C12.9 11 16 13.2 16 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </Link>

        {/* Cart */}
        <button
          onClick={openCart}
          className="relative opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 3H4.5L5.5 11H12.5L14 5H5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6.5" cy="13.5" r="1" fill="currentColor"/>
            <circle cx="11.5" cy="13.5" r="1" fill="currentColor"/>
          </svg>
          {count > 0 && (
            <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-volt text-black text-[9px] font-bold rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </button>

        {/* CTA - DM Sans font specs */}
        <Link
          href="/auth/register"
          className="flex items-center justify-center w-[145px] h-[38px] rounded-[8px] bg-volt text-black font-dm-sans font-semibold text-[16px] leading-[18px] tracking-[0.02em] hover:bg-volt-dark transition-colors duration-200"
        >
          Create account
        </Link>

      </div>
    </nav>
  )
}