import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Architecture.module.css'

const BOX_H = 54
const BOX_W_MD = 190

function Box({ cx, cy, w = BOX_W_MD, h = BOX_H, color, label, subLabel }) {
  const fill = `rgba(${color},0.08)`
  const stroke = `rgb(${color})`
  const x = cx - w / 2
  const y = cy - h / 2
  return (
    <g className={styles.box}>
      <rect x={x} y={y} width={w} height={h} rx="6" ry="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {subLabel ? (
        <>
          <text x={cx} y={cy - 4} textAnchor="middle" fill={stroke} fontSize="13" fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
          <text x={cx} y={cy + 13} textAnchor="middle" fill={stroke} fontSize="11" fontFamily="Inter,sans-serif" opacity="0.7">{subLabel}</text>
        </>
      ) : (
        <text x={cx} y={cy + 4} textAnchor="middle" fill={stroke} fontSize="13" fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
      )}
    </g>
  )
}

function ColumnContainer({ cx, w = 220, title }) {
  return (
    <g>
      <rect
        x={cx - w / 2}
        y="16"
        width={w}
        height={360}
        fill="rgba(255,255,255,0.015)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeDasharray="6,4"
        rx="10" ry="10"
      />
      <text
        x={cx}
        y="36"
        textAnchor="middle"
        fill="rgba(255,255,255,0.5)"
        fontSize="12"
        fontFamily="Inter,sans-serif"
        letterSpacing="0.02em"
      >
        {title}
      </text>
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

function getRowsY(count) {
  if (count === 4) return [80, 160, 240, 320]
  if (count === 3) return [100, 200, 300]
  if (count === 2) return [140, 260]
  if (count === 1) return [200]
  return []
}

export default function Architecture() {
  const sectionRef = useRef()
  const svgRef = useRef()

  const BEIGE = '210,200,190'
  const TEAL = '0,212,184'
  const PURPLE = '140,110,210'
  const BLUE = '74,160,232'

  const columns = [
    {
      title: 'הקשרי תצוגה',
      cx: 140,
      boxes: [
        { label: 'בית', sub: 'מסך מחשב + ווב-קאם', color: BEIGE },
        { label: 'קליניקה', sub: 'מסך אנכי + מצלמה', color: BEIGE },
      ]
    },
    {
      title: 'אפליקציית ווב — דפדפן',
      cx: 390,
      boxes: [
        { label: 'פורטל מטופל', sub: 'הרשמה - בחירת גפה - אימון ', color: PURPLE },
        { label: 'מצלמה חיה + תלת-ממד', sub: 'WebGL - שכבת גוף - קלט', color: TEAL },
        { label: 'תצוגת מטפל', sub: 'מעקב התקדמות', color: PURPLE },
      ]
    },
    {
      title: 'שירותי ליבה',
      cx: 640,
      boxes: [
        { label: 'מעקב גוף', sub: 'MediaPipe / Pose', color: TEAL },
        { label: 'ניהול סשן', sub: 'זרימת תרגילים', color: TEAL },
        { label: 'בקרת קול', sub: 'דיבור + תנועה', color: TEAL },
        { label: 'מעקב כאב', sub: 'ויומני מעקב VAS סולם', color: TEAL },
      ]
    },
    {
      title: 'שכבת נתונים',
      cx: 890,
      boxes: [
        { label: 'DB מטופלים', sub: 'פרופילים והעדפות', color: BLUE },
        { label: 'ספריית תלת-ממד', sub: 'גפיים וטקסטורות', color: BLUE },
        { label: 'ספריית תרגילים', sub: 'תוכניות וסטים', color: BLUE },
        { label: 'סשנים', sub: 'יומן כאב', color: BLUE },
      ]
    },
    {
      title: 'שירותים חיצוניים',
      cx: 1140,
      boxes: [
        { label: ' ML הסקת', sub: 'הערכת תנוחה', color: BEIGE },
        { label: 'Speech API', sub: 'פקודות קוליות', color: BEIGE },
        { label: 'אחסון ענן', sub: 'העדפות', color: BEIGE },
        { label: 'Auth & IAM', sub: 'מטופל ומטפל', color: BEIGE },
      ]
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in columns left to right
      const cols = svgRef.current.querySelectorAll('.arch-col')
      const arrows = svgRef.current.querySelectorAll('.arch-arrow')

      gsap.fromTo(svgRef.current, { opacity: 0 }, {
        opacity: 1, duration: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      })

      gsap.fromTo(cols,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      )

      gsap.fromTo(arrows,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.3,
          stagger: 0.15,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="section-06" ref={sectionRef} className={styles.section}>
      <div className={styles.sectionNumber}>06</div>
      <div className={styles.inner}>
        <h2 className={styles.heading}>System Architecture</h2>

        <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '20px', WebkitOverflowScrolling: 'touch' }}>
          <svg
            ref={svgRef}
            viewBox="0 0 1280 400"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            style={{ minWidth: '1000px', display: 'block', margin: '0 auto', opacity: 0 }}
          >
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill="rgba(255,255,255,0.3)" />
              </marker>
            </defs>

            {/* Render column containers & boxes */}
            {columns.map((col, i) => {
              const yPositions = getRowsY(col.boxes.length)
              return (
                <g key={i} className="arch-col">
                  <ColumnContainer cx={col.cx} title={col.title} />
                  {col.boxes.map((box, j) => (
                    <Box
                      key={j}
                      cx={col.cx}
                      cy={yPositions[j]}
                      label={box.label}
                      subLabel={box.sub}
                      color={box.color}
                    />
                  ))}
                </g>
              )
            })}

            {/* Render arrows between columns */}
            {[0, 1, 2, 3].map(i => {
              const x1 = columns[i].cx + 115
              const x2 = columns[i + 1].cx - 115
              return (
                <g key={`arrow-${i}`} className="arch-arrow">
                  <Arrow x1={x1} y1={196} x2={x2} y2={196} />
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </section>
  )
}
