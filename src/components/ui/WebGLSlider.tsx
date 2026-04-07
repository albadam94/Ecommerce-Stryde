"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { peelXShader } from "@/lib/shaders/peelX"


interface Slide {
  image: string
  lines: string[]
  subtitle: string
}

interface WebGLSliderProps {
  slides: Slide[]
  autoPlay?: boolean
  interval?: number
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAGMENT_SHADER = `
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform float progress;
  varying vec2 vUv;

  vec4 getFromColor(vec2 uv) {
    return texture2D(texture1, uv);
  }

  vec4 getToColor(vec2 uv) {
    return texture2D(texture2, uv);
  }

  ${peelXShader} // Inyectamos tu código aquí

  void main() {
    gl_FragColor = transition(vUv);
  }
`

export default function WebGLSlider({
  slides,
  autoPlay = true,
  interval = 5000,
}: WebGLSliderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const isAnimatingRef = useRef(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const texturesRef = useRef<THREE.Texture[]>([])

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    let loadedCount = 0
    slides.forEach((slide, i) => {
      loader.load(slide.image, (texture) => {
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        // Importante para que el peel no repita bordes
        texture.wrapS = THREE.ClampToEdgeWrapping 
        texture.wrapT = THREE.ClampToEdgeWrapping
        texturesRef.current[i] = texture
        loadedCount++
        if (loadedCount === slides.length) setLoaded(true)
      })
    })
  }, [slides])

  useEffect(() => {
    if (!canvasRef.current || !loaded) return

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true })
    renderer.setSize(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight)
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        texture1: { value: texturesRef.current[0] },
        texture2: { value: texturesRef.current[0] },
        progress: { value: 0 },
      },
    })
    materialRef.current = material
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

    const renderLoop = () => {
      requestAnimationFrame(renderLoop)
      renderer.render(scene, camera)
    }
    renderLoop()

    return () => renderer.dispose()
  }, [loaded])

  const goToSlide = (to: number) => {
    if (isAnimatingRef.current || !materialRef.current || to === currentIndex) return

    isAnimatingRef.current = true
    setNextIndex(to)

    materialRef.current.uniforms.texture1.value = texturesRef.current[currentIndex]
    materialRef.current.uniforms.texture2.value = texturesRef.current[to]
    materialRef.current.uniforms.progress.value = 0

    const duration = 1200
    const start = performance.now()

    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // Ease Out Expo para que el "peel" sea rápido al final como Swiper
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

      if (materialRef.current) {
        materialRef.current.uniforms.progress.value = eased
      }

      if (t < 1) {
        requestAnimationFrame(animate)
      } else {
        if (materialRef.current) {
          materialRef.current.uniforms.texture1.value = texturesRef.current[to]
          materialRef.current.uniforms.progress.value = 0
        }
        setCurrentIndex(to)
        isAnimatingRef.current = false
      }
    }
    requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (!autoPlay || !loaded || isAnimatingRef.current) return
    const timer = setInterval(() => {
      goToSlide((currentIndex + 1) % slides.length)
    }, interval)
    return () => clearInterval(timer)
  }, [autoPlay, loaded, currentIndex])

  const activeIndex = isAnimatingRef.current ? nextIndex : currentIndex

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-dm-sans">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* UI layer */}
      <div className="absolute bottom-20 left-20 right-20 z-10 flex justify-between items-end">
        <div className="flex flex-col items-start">
          <h1 className="font-display font-extrabold text-[72px] uppercase leading-[0.9] tracking-[-2px] text-white">
            {slides[activeIndex].lines.map((line, i) => (
              <span 
                key={i} 
                className="block"
                style={{ color: ["RELENTLESS", "PERFECTED", "WIN LOUD"].some(word => line.includes(word)) ? "var(--color-volt)" : "white" }}
              >
                {line}
              </span>
            ))}
          </h1>

          <div style={{ height: '45px' }} />

          <button 
            className="flex items-center justify-center gap-3 w-[193px] h-[44px] rounded-[8px] font-semibold text-[16px] cursor-pointer"
            style={{ backgroundColor: 'var(--color-volt)', color: 'black' }}
          >
            Buy Now
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7H13M8 2L13 7L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="h-0.5 transition-all duration-300 cursor-pointer"
              style={{ 
                width: i === activeIndex ? '32px' : '8px',
                backgroundColor: i === activeIndex ? 'var(--color-volt)' : 'rgba(255,255,255,0.3)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}