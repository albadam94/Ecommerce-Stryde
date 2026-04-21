import WebGLSlider from "@/components/ui/WebGLSlider"
import CategoryGrid from "@/components/sections/CategoryGrid"
import Trending from "@/components/sections/Trending"
import MemberBanner from "@/components/sections/MemberBanner"
import PromoSlider from "@/components/sections/PromoSlider"

const HERO_SLIDES = [
  {
    image: "/images/hero/hero-1.png",
    lines: ["BUILT", "FOR THE", "RELENTLESS"],
    subtitle: "",
  },
  {
    image: "/images/hero/hero-2.png",
    lines: ["EVERY", "STRIDE", "PERFECTED"],
    subtitle: "",
  },
  {
    image: "/images/hero/hero-3.png",
    lines: ["TRAIN IN", "SILENCE", "WIN LOUD"],
    subtitle: "",
  },
]

export default function HomePage() {
  return (
    <div>
      <WebGLSlider slides={HERO_SLIDES} autoPlay interval={5000}/>
               <CategoryGrid  />
                <Trending />
                <MemberBanner />
                <PromoSlider />

    </div>
  )
}