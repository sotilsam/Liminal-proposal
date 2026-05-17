import React, { useRef, useEffect, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useEnvironment } from '@react-three/drei'
import { gsap } from 'gsap'
import styles from './HeroScene.module.css'

class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

function LimbModel({ path, brighten }) {
  const { scene } = useGLTF(path)
  const envMap = useEnvironment({ preset: 'studio' })

  const cloned = useMemo(() => {
    const c = scene.clone(true)
    if (brighten) {
      c.traverse(obj => {
        if (obj.isMesh) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((mat, idx) => {
            const m = mat.clone()
            m.envMap = envMap
            m.envMapIntensity = 2.0
            m.needsUpdate = true
            if (Array.isArray(obj.material)) obj.material[idx] = m
            else obj.material = m
          })
        }
      })
    }
    return c
  }, [scene, brighten, envMap])

  return <primitive object={cloned} />
}


const DARK_MODELS = new Set([0, 5, 6, 11]) // limb_01, limb_06, limb_07, limb_12 (0-indexed)
const COUNT = 12
const SPACING = 4.5
// 5 objects visible at a time; initial visible set is i=7..11, center at i=9 (worldX=0).
// Formula: localX = (i - 9) * SPACING
//   i=7 → -9, i=8 → -4.5, i=9 → 0, i=10 → 4.5, i=11 → 9   (all visible)
//   i=0..6 are off-screen to the left
const OFFSET = 9
const SCROLL_TRAVEL = 7 * SPACING           // 31.5 — slides all 7 hidden objects through view
const MIN_SCALE = 2.3
const MAX_SCALE = 4.3
const FALLOFF = SPACING * 2                 // 9.0 — gradient spans full visible width
// Visibility gate: objects outside GATE_X are scale=0 (invisible).
const GATE_X = SPACING * 2.5               // 11.25 — outer boundary, clears objects at ±9
const GATE_MARGIN = SPACING * 0.3          // 1.35 — short ramp for sharp "appear from nowhere"

function Scene({ heroRef }) {
  const groupRef = useRef()
  const itemRefs = useRef([])
  const mouseRef = useRef([0, 0])
  const yOffsetsRef = useRef(Array(COUNT).fill(0))
  const rotRef = useRef(Array.from({ length: COUNT }, () => ({ x: 0, y: 0 })))
  const dragRef = useRef(null) // { index, lastX, lastY }

  const localPositions = useMemo(() => Array.from({ length: COUNT }, (_, i) => [
    (i - OFFSET) * SPACING,
    Math.sin(i * 0.85) * 0.3 + 0.4,
    0,
  ]), [])

  const modelPaths = useMemo(() => Array.from({ length: COUNT }, (_, i) =>
    `/models/limb_${String(i + 1).padStart(2, '0')}.glb`
  ), [])

  useEffect(() => {
    const handleMove = (e) => {
      const hero = heroRef.current
      if (!hero) return
      const { left, top, width, height } = hero.getBoundingClientRect()
      mouseRef.current = [
        ((e.clientX - left) / width) * 2 - 1,
        -((e.clientY - top) / height) * 2 + 1,
      ]
      if (dragRef.current !== null) {
        const { index, lastX, lastY } = dragRef.current
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        rotRef.current[index].y += dx * 0.008
        rotRef.current[index].x += dy * 0.008
        dragRef.current.lastX = e.clientX
        dragRef.current.lastY = e.clientY
      }
    }
    const handleUp = () => {
      dragRef.current = null
      document.body.style.cursor = 'auto'
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('pointerup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
  }, [heroRef])

  useEffect(() => {
    const group = groupRef.current
    const hero = heroRef.current
    if (!group || !hero) return

    const ctx = gsap.context(() => {
      gsap.to(group.position, {
        x: '+=' + SCROLL_TRAVEL,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=2400',
          pin: true,
          scrub: 1.5,
        },
      })
    })

    return () => ctx.revert()
  }, [heroRef])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const gx = groupRef.current.position.x

    itemRefs.current.forEach((item, i) => {
      if (!item) return
      const baseX = localPositions[i][0]
      const baseY = localPositions[i][1]
      const dist = Math.abs(baseX + gx)

      const visRaw = (GATE_X - dist) / GATE_MARGIN
      const vis = Math.max(0, Math.min(1, visRaw))
      const smoothVis = vis * vis * (3 - 2 * vis)
      const spotT = Math.max(0, 1 - dist / FALLOFF)
      const rawScale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * spotT * spotT
      item.scale.setScalar(rawScale * smoothVis)

      const rot = rotRef.current[i]
      const isDragging = dragRef.current?.index === i

      if (!isDragging) {
        rot.y += delta * 0.4
        const amp = 0.25 + (i % 5) * 0.12
        const speed = 0.04 + (i % 3) * 0.02
        yOffsetsRef.current[i] += (mouseRef.current[1] * amp - yOffsetsRef.current[i]) * speed
      }

      item.rotation.x = rot.x
      item.rotation.y = rot.y
      item.position.x = baseX
      item.position.y = baseY + yOffsetsRef.current[i]
    })
  })

  const startDrag = (i, e) => {
    e.stopPropagation()
    dragRef.current = { index: i, lastX: e.clientX, lastY: e.clientY }
    document.body.style.cursor = 'grabbing'
  }

  return (
    <>
      <ambientLight intensity={2.5} />
      <directionalLight position={[4, 6, 5]} color="#ffffff" intensity={1.5} />
      <directionalLight position={[-4, -2, 3]} color="#ffffff" intensity={0.8} />

      <group ref={groupRef}>
        {localPositions.map((pos, i) => (
          <group
            key={i}
            ref={el => (itemRefs.current[i] = el)}
            position={pos}
            onPointerDown={(e) => startDrag(i, e)}
            onPointerEnter={() => { if (!dragRef.current) document.body.style.cursor = 'grab' }}
            onPointerLeave={() => { if (!dragRef.current) document.body.style.cursor = 'auto' }}
          >
            <mesh visible={false}>
              <boxGeometry args={[2, 4, 2]} />
              <meshBasicMaterial />
            </mesh>
            <ModelErrorBoundary>
              <Suspense fallback={null}>
                <LimbModel path={modelPaths[i]} brighten={!DARK_MODELS.has(i)} />
              </Suspense>
            </ModelErrorBoundary>
          </group>
        ))}
      </group>
    </>
  )
}

export default function HeroScene() {
  const heroRef = useRef()

  const scrollToSection01 = () => {
    const el = document.getElementById('section-01')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.dotGrid} />

      <div className={styles.textBlock}>
        <h1 className={styles.title}>Liminal</h1>
        <div className={styles.textRight}>
          <p className={styles.tagline}>Where the missing becomes visible</p>
          <p className={styles.description}>
            An AR system combining real-time 3D rendering, motion tracking and voice control - for those living with phantom limb pain, and those who've never had a limb but want to experience one.
          </p>
        </div>
      </div>

      <div className={styles.canvasWrapper}>
        <Canvas
          camera={{ position: [0, 0, 9], fov: 65 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
          style={{ background: 'transparent' }}
        >
          <Scene heroRef={heroRef} />
        </Canvas>
      </div>

      <button className={styles.cta} onClick={scrollToSection01}>
        Explore the system ↓
      </button>
    </section>
  )
}
