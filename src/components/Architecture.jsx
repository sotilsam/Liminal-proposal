import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Architecture.module.css'

const BOX_H = 48
const BOX_W_SM = 148
const BOX_W_MD = 172

// Row vertical centres
const ROW_Y = [72, 168, 264]

// Column X positions (left edge of each box set)
const LEFT_X = 22
const CTR_X = 282
const RIGHT_X = 718

const SVG_W = 900
const SVG_H = 338

function Box({ x, y, w = BOX_W_SM, h = BOX_H, color, label, subLabel }) {
  const fill = `rgba(${color},0.12)`
  const stroke = `rgb(${color})`
  const cy = y + h / 2
  return (
    <g className={styles.box}>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth="1.5" />
      {subLabel ? (
        <>
          <text x={x + w / 2} y={cy - 7} textAnchor="middle" fill={stroke} fontSize="13" fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
          <text x={x + w / 2} y={cy + 9} textAnchor="middle" fill={stroke} fontSize="11" fontFamily="Inter,sans-serif" opacity="0.7">{subLabel}</text>
        </>
      ) : (
        <text x={x + w / 2} y={cy + 5} textAnchor="middle" fill={stroke} fontSize="13" fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
      )}
    </g>
  )
}

function Arrow({ x1, y1, x2, y2, dashed, color = 'rgba(255,255,255,0.3)', markerId = 'arrow' }) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color}
      strokeWidth="1.5"
      strokeDasharray={dashed ? '6,4' : undefined}
      markerEnd={`url(#${markerId})`}
    />
  )
}

export default function Architecture() {
  const sectionRef = useRef()
  const svgRef = useRef()
  const leftRef = useRef()
  const centerRef = useRef()
  const rightRef = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.fromTo(svgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45 })
        .fromTo(leftRef.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, '-=0.15')
        .fromTo(centerRef.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, '-=0.3')
        .fromTo(rightRef.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, '-=0.3')
    })

    return () => ctx.revert()
  }, [])

  const TEAL = '0,212,184'
  const PURPLE = '124,92,191'
  const CORAL = '232,120,74'

  const leftRightX = LEFT_X + BOX_W_SM
  const ctrRightX = CTR_X + BOX_W_MD
  const ctrLeftX = CTR_X
  const containerW = BOX_W_MD + 40

  return (
    <section id="section-06" ref={sectionRef} className={styles.section}>
      <div className={styles.sectionNumber}>06</div>
      <div className={styles.inner}>
        <h2 className={styles.heading}>System Architecture</h2>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          className={styles.diagram}
          style={{ opacity: 0 }}
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="rgba(255,255,255,0.35)" />
            </marker>
            <marker id="arrow-coral" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="rgb(232,120,74)" />
            </marker>
            <filter id="glow-teal" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#00d4b8" floodOpacity="0.55" />
            </filter>
            <filter id="glow-purple" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#7c5cbf" floodOpacity="0.55" />
            </filter>
            <filter id="glow-coral" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#e8784a" floodOpacity="0.55" />
            </filter>
          </defs>

          {/* Core Engine dashed container */}
          <g ref={centerRef} style={{ opacity: 0 }}>
            <rect
              x={CTR_X - 20}
              y="12"
              width={containerW}
              height={SVG_H - 24}
              fill="rgba(124,92,191,0.04)"
              stroke="#7c5cbf"
              strokeWidth="1.2"
              strokeDasharray="8,4"
            />
            <text
              x={CTR_X - 20 + containerW / 2}
              y="32"
              textAnchor="middle"
              fill="rgba(124,92,191,0.7)"
              fontSize="10"
              fontFamily="Inter,sans-serif"
              letterSpacing="0.18em"
            >
              CORE ENGINE
            </text>

            <Box x={CTR_X} y={ROW_Y[0] - BOX_H / 2} w={BOX_W_MD} color={PURPLE} label="Motion Detection" />
            <Box x={CTR_X} y={ROW_Y[1] - BOX_H / 2} w={BOX_W_MD} color={PURPLE} label="Voice Recognition" />
            <Box x={CTR_X} y={ROW_Y[2] - BOX_H / 2} w={BOX_W_MD} color={PURPLE} label="3D Model Engine" />
          </g>

          {/* Left column */}
          <g ref={leftRef} style={{ opacity: 0 }}>
            <Box x={LEFT_X} y={ROW_Y[0] - BOX_H / 2} color={TEAL} label="Camera" />
            <Box x={LEFT_X} y={ROW_Y[1] - BOX_H / 2} color={TEAL} label="Microphone" />
            <Box x={LEFT_X} y={ROW_Y[2] - BOX_H / 2} color={TEAL} label="Patient Profile" />
          </g>

          {/* Right column */}
          <g ref={rightRef} style={{ opacity: 0 }}>
            <Box x={RIGHT_X} y={ROW_Y[0] - BOX_H / 2} color={CORAL} label="AR Display" />
            <Box x={RIGHT_X} y={ROW_Y[1] - BOX_H / 2} color={CORAL} label="Exercise Manager" />
            <Box x={RIGHT_X} y={ROW_Y[2] - BOX_H / 2} color={CORAL} label="Progress Dashboard" />
          </g>

          {/* Arrows: Left → Center */}
          {ROW_Y.map((y) => (
            <Arrow key={`lc${y}`} x1={leftRightX} y1={y} x2={ctrLeftX} y2={y} />
          ))}

          {/* Arrows: Center → Right */}
          {ROW_Y.map((y) => (
            <Arrow key={`cr${y}`} x1={ctrRightX} y1={y} x2={RIGHT_X} y2={y} />
          ))}

          {/* Dashed cross-arrow: 3D Model Engine → AR Display */}
          <path
            d={`M ${ctrRightX},${ROW_Y[2]} C ${(ctrRightX + RIGHT_X) / 2},${ROW_Y[2]} ${(ctrRightX + RIGHT_X) / 2},${ROW_Y[0]} ${RIGHT_X},${ROW_Y[0]}`}
            stroke="rgb(232,120,74)"
            strokeWidth="1.5"
            strokeDasharray="6,4"
            fill="none"
            markerEnd="url(#arrow-coral)"
          />
        </svg>
      </div>
    </section>
  )
}
