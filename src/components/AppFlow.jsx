import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './AppFlow.module.css'

// ─── Shared shape helpers ───

function GreenBox({ x, y, w = 180, h = 44, label }) {
  const rx = 6
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} ry={rx} fill="#3a6b10" stroke="#8CC840" strokeWidth="1.5" />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fill="#c8f07a" fontSize="12.5" fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
    </g>
  )
}

function BlueBox({ x, y, w = 160, h = 38, label }) {
  const rx = 6
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} ry={rx} fill="#1a4a6b" stroke="#5BAAD8" strokeWidth="1.5" />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fill="#a8d8f0" fontSize="12" fontFamily="Inter,sans-serif">{label}</text>
    </g>
  )
}

function Diamond({ cx, cy, w = 100, h = 52, label }) {
  const pts = `${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`
  return (
    <g>
      <polygon points={pts} fill="#1a4a6b" stroke="#5BAAD8" strokeWidth="1.5" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill="#a8d8f0" fontSize="11" fontFamily="Inter,sans-serif">{label}</text>
    </g>
  )
}

function CloudDB({ x, y, w = 150, h = 48, label }) {
  const mx = x + w / 2
  const my = y + h / 2
  return (
    <g>
      <ellipse cx={mx} cy={my} rx={w / 2} ry={h / 2} fill="#1a3050" stroke="#5899c0" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x={mx} y={my - 6} textAnchor="middle" fill="#7ac0e0" fontSize="10" fontFamily="Inter,sans-serif">☁</text>
      <text x={mx} y={my + 8} textAnchor="middle" fill="#7ac0e0" fontSize="11" fontFamily="Inter,sans-serif">{label}</text>
    </g>
  )
}

function Oval({ cx, cy, rx = 110, ry = 26, label }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#1a3a24" stroke="#8CC840" strokeWidth="1.5" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill="#c8f07a" fontSize="13" fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
    </g>
  )
}

function Arr({ d, dashed }) {
  return (
    <path
      d={d}
      stroke="rgba(255,255,255,0.28)"
      strokeWidth="1.4"
      fill="none"
      strokeDasharray={dashed ? '5,4' : undefined}
      markerEnd="url(#af-arrow)"
    />
  )
}

function Ln({ x1, y1, x2, y2, dashed, color }) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color || 'rgba(255,255,255,0.28)'}
      strokeWidth="1.4"
      strokeDasharray={dashed ? '5,4' : undefined}
      markerEnd="url(#af-arrow)"
    />
  )
}

// ─── Full flowchart SVG ───

export default function AppFlow() {
  const sectionRef = useRef()
  const svgRef = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const svg = svgRef.current
      if (!svg) return

      // Collect all stroke-able paths and lines for draw animation
      const elements = svg.querySelectorAll('path[stroke], line[stroke], polyline[stroke]')
      elements.forEach((el) => {
        try {
          const len = el.getTotalLength ? el.getTotalLength() : 100
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
        } catch {
          gsap.set(el, { strokeDasharray: 100, strokeDashoffset: 100 })
        }
      })

      gsap.to(elements, {
        strokeDashoffset: 0,
        duration: 3,
        stagger: 0.04,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          end: 'bottom 30%',
          scrub: 1,
        },
      })

      // Fade in fill boxes
      const rects = svg.querySelectorAll('rect, ellipse, polygon')
      gsap.fromTo(
        rects,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.025,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Fade in labels
      const texts = svg.querySelectorAll('text')
      gsap.fromTo(
        texts,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.35,
          stagger: 0.02,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  // ── Branch 1 x-centre: 150, Branch 2 x-centre: 425, Branch 3 x-centre: 700 ──
  const B1 = 150
  const B2 = 425
  const B3 = 700

  return (
    <section id="section-07" ref={sectionRef} className={styles.section}>
      <div className={styles.sectionNumber}>07</div>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Application Workflow</h2>

        <div className={styles.svgScroll}>
          <svg
            ref={svgRef}
            viewBox="0 0 850 1050"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            className={styles.diagram}
          >
            <defs>
              <marker id="af-arrow" markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
                <path d="M0,0 L7,3 L0,6 Z" fill="rgba(255,255,255,0.4)" />
              </marker>
            </defs>

            {/* ── Start oval ── */}
            <Oval cx={B2} cy={40} rx={120} ry={26} label="App Flow Start" />

            {/* Lines from start to 3 branches */}
            <Ln x1={B2 - 90} y1={60} x2={B1} y2={108} />
            <Ln x1={B2} y1={66} x2={B2} y2={108} />
            <Ln x1={B2 + 90} y1={60} x2={B3} y2={108} />

            {/* ════ BRANCH 1 — Start Session (x≈150) ════ */}
            <GreenBox x={B1 - 80} y={108} w={160} h={44} label="Start Session" />
            <Ln x1={B1} y1={152} x2={B1} y2={196} />

            <BlueBox x={B1 - 75} y={196} w={150} h={38} label="Profile Setup" />
            <Ln x1={B1} y1={234} x2={B1} y2={280} />

            <Diamond cx={B1} cy={306} w={120} h={52} label="First time?" />

            {/* Yes path → Create Profile */}
            <Arr d={`M ${B1 - 60},${306} L ${B1 - 120},${306} L ${B1 - 120},${382}`} />
            <text x={B1 - 98} y={302} fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="Inter,sans-serif">Yes</text>
            <BlueBox x={B1 - 165} y={382} w={130} h={38} label="Create Profile" />
            <Ln x1={B1 - 100} y1={420} x2={B1 - 50} y2={460} />

            {/* No path → Launch AR directly */}
            <Arr d={`M ${B1},${332} L ${B1},${460}`} />
            <text x={B1 + 6} y={350} fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="Inter,sans-serif">No</text>

            <GreenBox x={B1 - 80} y={460} w={160} h={44} label="Launch AR Session" />

            {/* ════ BRANCH 2 — Design Virtual Limb (x≈425) ════ */}
            <GreenBox x={B2 - 100} y={108} w={200} h={44} label="Design Virtual Limb" />
            <Ln x1={B2} y1={152} x2={B2} y2={196} />

            {/* Fork: Load Library | Create Custom */}
            <Arr d={`M ${B2},${196} L ${B2 - 80},${196} L ${B2 - 80},${230}`} />
            <Arr d={`M ${B2},${196} L ${B2 + 85},${196} L ${B2 + 85},${230}`} />

            <BlueBox x={B2 - 145} y={230} w={128} h={36} label="Load Library" />
            <BlueBox x={B2 + 22} y={230} w={135} h={36} label="Create Custom" />

            {/* Merge lines */}
            <Arr d={`M ${B2 - 80},${266} L ${B2 - 80},${290} L ${B2},${290}`} />
            <Arr d={`M ${B2 + 90},${266} L ${B2 + 90},${290} L ${B2},${290}`} />

            <BlueBox x={B2 - 85} y={290} w={170} h={40} label="Edit Limb" />
            <Ln x1={B2} y1={330} x2={B2} y2={372} />

            <Diamond cx={B2} cy={398} w={130} h={52} label="Limb selected?" />

            {/* No → loop back */}
            <Arr d={`M ${B2 - 65},${398} Q ${B2 - 180},${398} ${B2 - 180},${130} L ${B2 - 100},${130}`} dashed />
            <text x={B2 - 155} y={394} fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="Inter,sans-serif">No</text>

            {/* Yes → Confirm */}
            <Ln x1={B2} y1={424} x2={B2} y2={462} />
            <text x={B2 + 8} y={445} fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="Inter,sans-serif">Yes</text>

            <BlueBox x={B2 - 75} y={462} w={150} h={38} label="Confirm" />
            <Ln x1={B2} y1={500} x2={B2} y2={542} />

            <Diamond cx={B2} cy={568} w={110} h={50} label="Share?" />

            {/* No → Save to User DB */}
            <Arr d={`M ${B2 - 55},${568} L ${B2 - 130},${568} L ${B2 - 130},${618}`} />
            <text x={B2 - 118} y={562} fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="Inter,sans-serif">No</text>
            <CloudDB x={B2 - 210} y={618} w={160} h={48} label="Save to User DB" />
            {/* Loop back arrow */}
            <Arr d={`M ${B2 - 130},${666} L ${B2 - 130},${730} Q ${B2 - 130},${760} ${B2 - 190},${760} L ${B2 - 190},${128} L ${B2 - 100},${128}`} dashed />

            {/* Yes → Limb Details Form */}
            <Ln x1={B2} y1={593} x2={B2} y2={618} />
            <text x={B2 + 8} y={610} fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="Inter,sans-serif">Yes</text>
            <BlueBox x={B2 - 75} y={618} w={150} h={38} label="Limb Details Form" />
            <Ln x1={B2} y1={656} x2={B2} y2={695} />
            <CloudDB x={B2 - 90} y={695} w={180} h={48} label="Save to Library DB" />
            {/* Loop back */}
            <Arr d={`M ${B2 + 90},${719} Q ${B2 + 200},${719} ${B2 + 200},${130} L ${B2 + 100},${130}`} dashed />

            {/* ════ BRANCH 3 — User Settings (x≈700) ════ */}
            <GreenBox x={B3 - 80} y={108} w={160} h={44} label="User Settings" />
            <Ln x1={B3} y1={152} x2={B3} y2={196} />

            <BlueBox x={B3 - 75} y={196} w={150} h={38} label="VUI On/Off" />
            <Ln x1={B3} y1={234} x2={B3} y2={278} />

            <BlueBox x={B3 - 75} y={278} w={150} h={38} label="Exercise Settings" />
          </svg>
        </div>
      </div>
    </section>
  )
}
