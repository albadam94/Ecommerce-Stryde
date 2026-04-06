import WebGLSlider from "@/components/ui/WebGLSlider"

const HERO_SLIDES = [
  {
    image: "/images/hero/hero-1.png",
    title: "BUILT  FOR THE RELENTLESS",
    subtitle: "",
  },
  {
    image: "/images/hero/hero-2.png",
    title: "EVERY STRIDE PERFECTED",
    subtitle: "",
  },
  {
    image: "/images/hero/hero-3.png",
    title: "TRAIN IN SILENCE WIN LOUD",
    subtitle: "",
  },
]

export default function HomePage() {
  return (
    <div>
      <WebGLSlider slides={HERO_SLIDES} autoPlay interval={5000} />
    </div>
  )
}