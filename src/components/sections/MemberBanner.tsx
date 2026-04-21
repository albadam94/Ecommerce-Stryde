"use client";

import Image from "next/image"
import Link from "next/link"

const memberStats = [
  { label: "Points", value: "2.5k" },
  { label: "Orders", value: "15" },
  { label: "Total", value: "$1.1k" },
]

export default function MemberBanner() {
  return (
    <section className="bg-black w-full relative overflow-hidden py-32">
      

      <div className="absolute left-6 top-0 h-full z-10  pointer-events-none">
        <Image
          src="/images/Member/wavy-line.svg"
          alt=""
          width={60}
          height={700}
          className="h-full w-auto opacity-50"
        />
      </div>

      
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none overflow-hidden">
        <p
          className="font-syne font-extrabold uppercase text-center whitespace-nowrap select-none"
          style={{
            fontSize: "clamp(80px, 16vw, 200px)",
            letterSpacing: "-4px",
            color: "rgba(200,255,0,0.05)",
            lineHeight: 1,
          }}
        >
          MEMBER
        </p>
      </div>

      <div className="relative z-10 mx-auto px-20 w-full max-w-[1440px]">
        <div className="flex items-center justify-between gap-16">

          
          <div className="flex flex-col gap-8 max-w-lg ml-10">
            <h2 className="font-syne font-extrabold text-[42px] uppercase leading-[1.05] tracking-[-1px] text-white text-balance">
              Train in Silence.<br />
              <span className="text-volt">Win Loud.</span>
            </h2>

            <p className="font-syne text-white text-[16px] font-light leading-[1.85] max-w-md">
              Join the membership program to access exclusive discounts,
              early access to collections, and personalized training content.
            </p>

            <div>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-3 w-[193px] h-[44px] rounded-[8px] bg-volt text-black font-body font-semibold text-[15px] hover:bg-volt-dark transition-colors duration-200"
              >
                Join Free
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7H13M8 2L13 7L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

        
          <div className="flex-1 relative flex justify-center">
            <div className="relative" style={{ width: "302px", height: "440px" }}>
              
              <Image
                src="/images/member/athlete.png"
                alt="Stryde Elite Member"
                fill
                className="object-cover object-top"
                priority
              />
          
              {/* Green Card - Corrected Position */}
              <div
                className="absolute z-20 p-8 flex flex-col justify-between shadow-2xl"
                style={{
                  width: "411px",
                  height: "265px",
                  bottom: "-100px",    
                  right: "-250px", 
                  backgroundColor: "#2A3D00",
                  border: "0.5px solid rgba(200,255,0,0.2)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-volt" />

                <div>
                  <p className="font-syne text-volt text-[9px] font-medium tracking-[4px] uppercase mb-2">
                    Stryde Elite · Tier 3
                  </p>
                  <h3 className="font-syne font-extrabold text-[28px] uppercase text-white leading-[1.1]">
                    Alexa <br />Martinez
                  </h3>
                </div>

                <div
                  className="grid grid-cols-3 pt-5 gap-2"
                  style={{ borderTop: "0.5px solid rgba(200,255,0,0.15)" }}
                >
                  {memberStats.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-syne font-bold text-[20px] text-volt leading-none mb-1">
                        {stat.value}
                      </p>
                      <p className="text-white/30 text-[8px] uppercase tracking-[2px]">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div> 
        </div> 
      </div> 
    </section>
  )
}