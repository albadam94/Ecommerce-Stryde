"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const footerLinks = {
  Shop: [
    { label: "Men",       href: "/products?gender=men"     },
    { label: "Women",     href: "/products?gender=women"   },
    { label: "Running",   href: "/products?cat=running"    },
    { label: "Training",  href: "/products?cat=training"   },
    { label: "Lifestyle", href: "/products?cat=lifestyle"  },
    { label: "Sale",      href: "/products?badge=sale"     },
  ],
  Support: [
    { label: "Help Center",  href: "/help"      },
    { label: "Size Guide",   href: "/size-guide"},
    { label: "Shipping",     href: "/shipping"  },
    { label: "Returns",      href: "/returns"   },
    { label: "Track Order",  href: "/track"     },
  ],
  Brand: [
    { label: "Our Story",      href: "/about"           },
    { label: "Athletes",       href: "/athletes"        },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Blog",           href: "/blog"           },
    { label: "Press",          href: "/press"           },
  ],
  "Stryde Elite": [
    { label: "Join",             href: "/auth/register" },
    { label: "Benefits",         href: "/elite/benefits"},
    { label: "Points & Rewards", href: "/elite/rewards" },
    { label: "Referrals",        href: "/elite/referrals"},
  ],
}

export default function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (email) setSubscribed(true)
  }

  return (
    <footer className="bg-black w-full">
      
      <div className="max-w-360 mx-auto px-20 py-16">
        <div className="flex items-center justify-between gap-16">
          <div>
            <h3 className="font-display font-extrabold text-[32px] text-white uppercase leading-none tracking-[-0.5px] mb-2">
              Be the first to know
            </h3>
            <p className="text-white/40 text-[14px] font-light">
              Drops, exclusive collections, and member offers
            </p>
          </div>

          <div className="flex flex-1 max-w-155">
            {subscribed ? (
              <div className="flex items-center gap-3 h-13 px-6 bg-volt/10 border border-volt/20 flex-1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7L5 10L12 3" stroke="#C8FF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-volt text-[13px] font-medium tracking-[1px]">
                  Subscribed successfully!
                </span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  placeholder="Enter your email address"
                  className="flex-1 h-13 px-5 bg-white text-black text-[13px] font-light placeholder:text-black/40 outline-none border-none"
                />
                <button
                  onClick={handleSubscribe}
                  className="h-13 px-10 bg-volt text-black font-body font-semibold text-[13px] uppercase tracking-[2px] hover:bg-volt-dark transition-colors duration-200 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-volt/20" />


      <div className="max-w-360 mx-auto px-20 py-16">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4 flex flex-col gap-6">
            <Link href="/">
              <Image
                src="/images/logo/Logo.svg"
                alt="STRYDE"
                width={130}
                height={40}
                className="object-contain"
              />
            </Link>
            <p className="text-white/40 text-[13px] font-light leading-[1.7] max-w-60">
              Premium technical apparel for serious athletes.{" "}
              Every <span className="text-volt">stride</span>, perfected.
            </p>

            <div className="flex items-center gap-4">
              <a href="https://facebook.com" className="text-white hover:text-volt transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M18 10C18 5.6 14.4 2 10 2C5.6 2 2 5.6 2 10C2 14 4.9 17.3 8.7 17.9V12.4H6.8V10H8.7V8.3C8.7 6.4 9.8 5.4 11.6 5.4C12.4 5.4 13.3 5.5 14.1 5.7V7.5H13.1C12.2 7.5 11.9 8 11.9 8.6V10H14L13.7 12.4H11.9V17.9C15.7 17.3 18 14 18 10Z"/>
                </svg>
              </a>
              <a href="https://instagram.com" className="text-white hover:text-volt transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <rect x="2" y="2" width="16" height="16" rx="5" strokeWidth="1.5"/>
                  <circle cx="10" cy="10" r="3.5" strokeWidth="1.5"/>
                  <circle cx="14.5" cy="5.5" r="0.75" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://twitter.com" className="text-white hover:text-volt transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15.2 3H17.9L12.1 9.6L18.9 17H13.6L9.4 11.6L4.6 17H1.9L8.1 10L1.5 3H6.9L10.8 7.9L15.2 3ZM14.3 15.4H15.8L6.2 4.6H4.6L14.3 15.4Z"/>
                </svg>
              </a>
            </div>

       
            <div className="flex flex-col gap-3">
              <a href="https://apple.com/app-store" className="flex items-center gap-3 w-45 h-13 px-4 rounded-[10px] border border-white/20 hover:border-white/40 transition-colors">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="white">
                  <path d="M16.2 11.6C16.1 9.5 17.8 8.5 17.9 8.4C16.9 6.9 15.4 6.7 14.8 6.7C13.5 6.6 12.3 7.5 11.6 7.5C10.9 7.5 9.9 6.7 8.8 6.7C7.3 6.7 5.9 7.6 5.1 9C3.5 11.8 4.7 16 6.2 18.3C7 19.4 7.9 20.7 9.1 20.6C10.3 20.5 10.7 19.9 12.1 19.9C13.5 19.9 13.8 20.6 15.1 20.6C16.4 20.6 17.2 19.4 18 18.3C18.9 17 19.3 15.8 19.3 15.7C19.2 15.7 16.3 14.6 16.2 11.6ZM13.8 5.1C14.5 4.2 14.9 3 14.8 1.8C13.7 1.9 12.4 2.6 11.7 3.5C11 4.3 10.5 5.5 10.7 6.6C11.9 6.7 13.1 6 13.8 5.1Z"/>
                </svg>
                <div>
                  <p className="text-white/40 text-[9px] leading-none mb-0.5">Download on the</p>
                  <p className="text-white text-[13px] font-semibold leading-none">App Store</p>
                </div>
              </a>
              <a href="https://play.google.com" className="flex items-center gap-3 w-45 h-13 px-4 rounded-[10px] border border-white/20 hover:border-white/40 transition-colors">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M4 2.5L13.5 11L4 19.5" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M4 2.5L18 8.5L13.5 11" stroke="#2196F3" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M4 19.5L18 13.5L13.5 11" stroke="#F44336" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div>
                  <p className="text-white/40 text-[9px] leading-none mb-0.5">GET IT ON</p>
                  <p className="text-white text-[13px] font-semibold leading-none">Google Play</p>
                </div>
              </a>
            </div>
          </div>

          <div className="col-span-8 grid grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white font-body font-semibold text-[13px] mb-6 tracking-[0.5px]">
                  {title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/40 text-[13px] font-light hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-volt/20" />

      
      <div className="max-w-360 mx-auto px-20 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L17 5V10C17 13.9 13.9 17.5 10 18C6.1 17.5 3 13.9 3 10V5L10 2Z" fill="#C8FF00"/>
              <path d="M7 10L9 12L13 8" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-white/50 text-[13px] font-light">Buy safely</span>
          </div>

          <div className="flex items-center gap-2 text-white/50 text-[13px] font-light">
            <span>Created by</span>
            <a href="https://brayanalbadam.com" target="_blank" className="text-volt hover:text-volt-dark transition-colors mr-2">
              Brayan Albadam
            </a>
            
            <span className="text-white/10 mx-1">|</span>
            
            <div className="flex items-center gap-4 ml-2">
              <div className="flex items-center gap-2">
                <span>Designed in</span>
                <a href="https://www.figma.com/design/krv7lWNAT4CagaBowPigQ2/Stryde-Ecommerce?m=auto&t=VY5wB995vsZAD8to-6" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <svg width="14" height="19" viewBox="0 0 38 57" fill="none" className="inline-block">
                    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
                    <path d="M0 47.5C0 42.2533 4.2533 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.2533 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
                    <path d="M19 0H28.5C33.7467 0 38 4.2533 38 9.5C38 14.7467 33.7467 19 28.5 19H19V0Z" fill="#FF7262"/>
                    <path d="M0 9.5C0 4.2533 4.2533 0 9.5 0H19V19H9.5C4.2533 19 0 14.7467 0 9.5Z" fill="#F24E1E"/>
                    <path d="M0 28.5C0 23.2533 4.2533 19 9.5 19H19V38H9.5C4.2533 38 0 33.7467 0 28.5Z" fill="#A259FF"/>
                  </svg>
                </a>
              </div>

              <span className="text-white/10">|</span>

              <div className="flex items-center gap-2">
                <span>Built in</span>
                <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex items-center">
                  <svg width="18" height="18" viewBox="0 0 128 128" fill="none">
                    <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z" fill="white" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}