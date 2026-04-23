import type { Metadata } from "next"
import { Syne, DM_Sans } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Ticker from "@/components/sections/Ticker"
import Footer from "@/components/layout/Footer"

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "STRYDE — Built for the Relentless",
  description: "Premium technical apparel for serious athletes.",
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${syne.variable} ${dmSans.variable}`}>
        <Navbar />
        <Ticker />

        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}