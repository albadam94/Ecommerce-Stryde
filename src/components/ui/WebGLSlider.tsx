"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"

interface Slide {
  image: string
  lines: string[]
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

  void main() {
    vec2 uv = vUv;
    float p = progress;
    
    // Liquid Distortion effect based on noise
    vec2 distortedUv1 = uv + vec2(sin(uv.y * 10.0 + p * 10.0) * p * 0.1, 0.0);
    vec2 distortedUv2 = uv - vec2(sin(uv.y * 10.0 + (1.0 - p) * 10.0) * (1.0 - p) * 0.1, 0.0);

    // Muestreo con un ligero desplazamiento RGB para toque moderno
    float r = texture2D(texture1, distortedUv1 + vec2(p * 0.02, 0.0)).r;
    float g = texture2D(texture1, distortedUv1).g;
    float b = texture2D(texture1, distortedUv1 - vec2(p * 0.02, 0.0)).b;
    vec4 f1 = vec4(r, g, b, 1.0);

    float r2 = texture2D(texture2, distortedUv2 + vec2((1.0 - p) * 0.02, 0.0)).r;
    float g2 = texture2D(texture2, distortedUv2).g;
    float b2 = texture2D(texture2, distortedUv2 - vec2((1.0 - p) * 0.02, 0.0)).b;
    vec4 f2 = vec4(r2, g2, b2, 1.0);

    gl_FragColor = mix(f1, f2, p);
  }
`

export default function LiquidSlider({
  slides,
  autoPlay = true,
  interval = 5000,
}: WebGLSliderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const currentRef = useRef(0)
  const isAnimating = useRef(false)

  const [displayIndex, setDisplayIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const texturesRef = useRef<THREE.Texture[]>([])

  // Carga de texturas con ClampToEdgeWrapping para solucionar la línea azul
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    let count = 0
    slides.forEach((slide, i) => {
      loader.load(slide.image, (tex) => {
        // CORRECCIÓN: Evita artefactos de bordes (como la línea azul) al distorsionar
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.minFilter = THREE.LinearFilter
        texturesRef.current[i] = tex
        count++
        if (count === slides.length) setLoaded(true)
      })
    })
  }, [slides])

  // Init Three.js
  useEffect(() => {
    if (!canvasRef.current || !loaded) return

    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        texture1: { value: texturesRef.current[0] },
        texture2: { value: texturesRef.current[0] },
        progress: { value: 0.0 },
      },
    })
    materialRef.current = material

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

    const loop = () => {
      requestAnimationFrame(loop)
      renderer.render(scene, camera)
    }
    loop()

    return () => renderer.dispose()
  }, [loaded])

  const goToSlide = useCallback((to: number) => {
    if (isAnimating.current || !materialRef.current) return
    const from = currentRef.current
    if (to === from) return

    isAnimating.current = true
    const mat = materialRef.current
    mat.uniforms.texture1.value = texturesRef.current[from]
    mat.uniforms.texture2.value = texturesRef.current[to]
    
    const DURATION = 1200
    const start = performance.now()

    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1)
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2

      mat.uniforms.progress.value = eased

      if (p < 1) {
        requestAnimationFrame(tick)
      } else {
        currentRef.current = to
        setDisplayIndex(to)
        isAnimating.current = false
        mat.uniforms.progress.value = 0
        mat.uniforms.texture1.value = texturesRef.current[to]
      }
    }
    requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (!autoPlay || !loaded) return
    const id = setInterval(() => goToSlide((currentRef.current + 1) % slides.length), interval)
    return () => clearInterval(id)
  }, [autoPlay, loaded, interval, slides.length, goToSlide])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Degradado inferior para difuminar y resaltar UI */}
      <div 
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)"
        }}
      />

      {/* UI ALINEADA */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="mx-auto h-full w-full max-w-[1440px] px-20 relative">
          <div className="absolute bottom-20 left-20 right-20 flex justify-between items-end pointer-events-auto">
            <div className="flex flex-col items-start gap-10">
              <h1 className="font-display font-extrabold text-[72px] uppercase leading-[0.9] tracking-[-2px] text-white">
                {slides[displayIndex].lines.map((line, i) => (
                  <span key={i} className="block last:text-volt">{line}</span>
                ))}
              </h1>
              
              {/* BOTÓN ORIGINAL RECTANGULAR REVERTIDO */}
              <button className="flex items-center justify-center gap-3 w-[193px] h-[44px] rounded-[8px] bg-volt text-black font-body font-semibold text-[16px] hover:bg-volt-dark transition-all duration-300">
                Buy Now
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7H13M8 2L13 7L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

      
            <div className="flex gap-4 mb-4">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`h-1 transition-all duration-700 ${i === displayIndex ? 'w-16 bg-volt' : 'w-6 bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}