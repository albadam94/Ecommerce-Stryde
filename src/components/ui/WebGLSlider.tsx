"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

interface Slide {
  image: string
  title: string
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
  uniform vec2 resolution;
  varying vec2 vUv;

  vec4 getFromColor(vec2 uv) {
    return texture2D(texture1, uv);
  }

  vec4 getToColor(vec2 uv) {
    return texture2D(texture2, uv);
  }

  vec4 transition(vec2 uv) {
    float x = progress;
    float mix1 = step(uv.x, x);
    float angleOffset = progress * 1.5707963;
    float xc = x - uv.x;
    float z = sin(angleOffset) * xc;
    float y = cos(angleOffset) * (uv.y - 0.5) + 0.5;
    vec2 newUV = vec2(uv.x + z * 2.0, y);
    if(mix1 == 0.0) {
      return getToColor(uv);
    } else {
      return getFromColor(newUV);
    }
  }

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
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const animFrameRef = useRef<number>(0)
  const progressRef = useRef(0)
  const isAnimatingRef = useRef(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const [loaded, setLoaded] = useState(false)

  const texturesRef = useRef<THREE.Texture[]>([])

  // Load all textures
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    let loadedCount = 0

    slides.forEach((slide, i) => {
      loader.load(slide.image, (texture) => {
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texturesRef.current[i] = texture
        loadedCount++
        if (loadedCount === slides.length) setLoaded(true)
      })
    })
  }, [slides])

  // Init Three.js
  useEffect(() => {
    if (!canvasRef.current || !loaded) return

    const canvas = canvasRef.current
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1
    sceneRef.current = scene
    cameraRef.current = camera

    // Plane geometry
    const geo = new THREE.PlaneGeometry(2, 2)

    // Shader material
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        texture1:   { value: texturesRef.current[0] },
        texture2:   { value: texturesRef.current[1] },
        progress:   { value: 0 },
        resolution: { value: new THREE.Vector2(W, H) },
      },
    })
    materialRef.current = material

    const mesh = new THREE.Mesh(geo, material)
    scene.add(mesh)

    // Render loop
    const renderLoop = () => {
      animFrameRef.current = requestAnimationFrame(renderLoop)
      renderer.render(scene, camera)
    }
    renderLoop()

    // Resize handler
    const handleResize = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      renderer.setSize(w, h)
      material.uniforms.resolution.value.set(w, h)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
    }
  }, [loaded])

  // Transition function
  const goToSlide = (to: number) => {
    if (isAnimatingRef.current || !materialRef.current) return

    const from = currentIndex
    setNextIndex(to)
    materialRef.current.uniforms.texture1.value = texturesRef.current[from]
    materialRef.current.uniforms.texture2.value = texturesRef.current[to]
    materialRef.current.uniforms.progress.value = 0
    progressRef.current = 0
    isAnimatingRef.current = true

    const duration = 1200 // ms
    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      // Ease in-out
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

      if (materialRef.current) {
        materialRef.current.uniforms.progress.value = eased
      }

      if (t < 1) {
        requestAnimationFrame(animate)
      } else {
        isAnimatingRef.current = false
        setCurrentIndex(to)
        if (materialRef.current) {
          materialRef.current.uniforms.progress.value = 0
          materialRef.current.uniforms.texture1.value = texturesRef.current[to]
        }
      }
    }
    requestAnimationFrame(animate)
  }

  // Autoplay
  useEffect(() => {
    if (!autoPlay || !loaded) return
    const timer = setInterval(() => {
      const next = (currentIndex + 1) % slides.length
      goToSlide(next)
    }, interval)
    return () => clearInterval(timer)
  }, [autoPlay, loaded, currentIndex, interval, slides.length])

  const activeIndex = isAnimatingRef.current ? nextIndex : currentIndex

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Loading state */}
      {!loaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="w-1 h-8 bg-volt animate-pulse" />
        </div>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/85 pointer-events-none" />

      {/* Content */}
      <div className="absolute bottom-20 left-20 right-20 z-10 flex justify-between items-end">
        <div>
          
          <h1 className="font-display font-extrabold text-[clamp(64px,8vw,100px)] uppercase leading-[0.9] tracking-[-3px] text-white mb-8">
            {slides[activeIndex].title.split(" ").map((word, i) => (
              <span key={i} className={i === 1 ? "text-volt" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>
          <div className="flex gap-4 items-center mt-10">
            <button className="flex items-center justify-center gap-3 w-[193px] h-[44px] rounded-[8px]  bg-volt text-black font-body font-semibold text-[16px] leading-[18px] tracking-[0.02em] px-[10px] hover:bg-volt-dark transition-colors duration-200">
              Buy Now
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7H13M8 2L13 7L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div>


          {/* Slide indicators */}
          <div className="flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`transition-all duration-300 ${
                  i === activeIndex
                    ? "w-8 h-0.5 bg-volt"
                    : "w-2 h-0.5 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

    
    </div>
  )
}