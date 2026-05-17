import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './AppFlow.module.css'

// ─── Shared shape helpers ───

function GreenBox({ x, y, w = 180, h = 44, label, sublabel }) {
  const rx = 6
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} ry={rx} fill="#3a6b10" stroke="#8CC840" strokeWidth="1.5" />
      <text x={x + w / 2} y={y + h / 2 + (sublabel ? -4 : 4)} textAnchor="middle" fill="#c8f07a" fontSize="12.5" fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
      {sublabel && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fill="#a8d05a" fontSize="10.5" fontFamily="Inter,sans-serif">{sublabel}</text>}
    </g>
  )
}

function BlueBox({ x, y, w = 180, h = 44, label, sublabel }) {
  const rx = 6
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} ry={rx} fill="#1a4a6b" stroke="#5BAAD8" strokeWidth="1.5" />
      <text x={x + w / 2} y={y + h / 2 + (sublabel ? -4 : 4)} textAnchor="middle" fill="#a8d8f0" fontSize="12" fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
      {sublabel && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fill="#7ab0d0" fontSize="10" fontFamily="Inter,sans-serif">{sublabel}</text>}
    </g>
  )
}

function PurpleBox({ x, y, w = 180, h = 44, label, sublabel }) {
  const rx = 6
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} ry={rx} fill="#2c1a4d" stroke="#7a4db8" strokeWidth="1.5" />
      <text x={x + w / 2} y={y + h / 2 + (sublabel ? -4 : 4)} textAnchor="middle" fill="#d1b3ff" fontSize="12" fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
      {sublabel && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fill="#a080d0" fontSize="10" fontFamily="Inter,sans-serif">{sublabel}</text>}
    </g>
  )
}

function OrangeBox({ x, y, w = 180, h = 44, label, sublabel }) {
  const rx = 6
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} ry={rx} fill="#4d2b1a" stroke="#d87a3b" strokeWidth="1.5" />
      <text x={x + w / 2} y={y + h / 2 + (sublabel ? -4 : 4)} textAnchor="middle" fill="#ffcfa8" fontSize="12" fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
      {sublabel && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fill="#d09a70" fontSize="10" fontFamily="Inter,sans-serif">{sublabel}</text>}
    </g>
  )
}

function TealBox({ x, y, w = 180, h = 44, label, sublabel }) {
  const rx = 6
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} ry={rx} fill="#1a4d4d" stroke="#3bb8b8" strokeWidth="1.5" />
      <text x={x + w / 2} y={y + h / 2 + (sublabel ? -4 : 4)} textAnchor="middle" fill="#a8ffff" fontSize="12" fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
      {sublabel && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fill="#70d0d0" fontSize="10" fontFamily="Inter,sans-serif">{sublabel}</text>}
    </g>
  )
}

function Diamond({ cx, cy, w = 120, h = 52, label }) {
  const pts = `${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`
  return (
    <g>
      <polygon points={pts} fill="#1a4a6b" stroke="#5BAAD8" strokeWidth="1.5" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#a8d8f0" fontSize="11" fontFamily="Inter,sans-serif">{label}</text>
    </g>
  )
}

function CloudDB({ x, y, w = 150, h = 50, label, sublabel }) {
  const mx = x + w / 2
  const my = y + h / 2
  return (
    <g>
      <ellipse cx={mx} cy={my} rx={w / 2} ry={h / 2} fill="#1a3050" stroke="#5899c0" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x={mx} y={my - 8} textAnchor="middle" fill="#7ac0e0" fontSize="12" fontFamily="Inter,sans-serif">☁</text>
      <text x={mx} y={my + 6} textAnchor="middle" fill="#7ac0e0" fontSize="11" fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
      {sublabel && <text x={mx} y={my + 18} textAnchor="middle" fill="#5899c0" fontSize="9" fontFamily="Inter,sans-serif">{sublabel}</text>}
    </g>
  )
}

function Oval({ cx, cy, rx = 110, ry = 26, label }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#1a3a24" stroke="#8CC840" strokeWidth="1.5" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#c8f07a" fontSize="13" fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
    </g>
  )
}

function Arr({ d, dashed, color }) {
  return (
    <path
      d={d}
      stroke={color || "rgba(255,255,255,0.28)"}
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

      // Simple fade in for all top-level elements instead of drawing lines
      // This addresses the requested removal of the broken arrow animations
      const children = Array.from(svg.children).filter(el => el.tagName !== 'defs')
      gsap.fromTo(
        children,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.02,
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

  return (
    <section id="section-07" ref={sectionRef} className={styles.section}>
      <div className={styles.sectionNumber}>07</div>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Application Workflow</h2>

        <div className={styles.svgScroll}>
          <svg
            ref={svgRef}
            viewBox="0 0 1300 950"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            className={styles.diagram}
          >
            <defs>
              <marker id="af-arrow" markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
                <path d="M0,0 L7,3 L0,6 Z" fill="rgba(255,255,255,0.4)" />
              </marker>
            </defs>

            {/* ── Start Welcome ── */}
            <Oval cx={800} cy={50} rx={140} ry={26} label="מסך פתיחה למערכת" />

            <Ln x1={750} y1={76} x2={250} y2={130} />
            <text x={450} y={95} fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="Inter,sans-serif">מסלול מטפל</text>

            <Ln x1={800} y1={76} x2={800} y2={130} />
            <text x={815} y={105} fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="Inter,sans-serif">מסלול מטופל</text>

            {/* ════ Therapist Track (Center x=250) ════ */}
            <OrangeBox x={150} y={130} w={200} h={60} label="התחברות " sublabel="אימות" />
            
            {/* Parallel Branches from Login */}
            <Ln x1={250} y1={190} x2={140} y2={230} />
            <Ln x1={250} y1={190} x2={360} y2={230} />

            <OrangeBox x={40} y={230} w={200} h={60} label="לוח בקרת מטופלים" sublabel="צפייה בכל המטופלים המשויכים" />
            <OrangeBox x={260} y={230} w={200} h={60} label="ניהול תיק מטופל" sublabel="דוחות, נתונים, ותוכניות מרחוק" />

            {/* ════ Patient Track Top (Center x=800) ════ */}
            <Diamond cx={800} cy={160} w={160} h={60} label="פעם ראשונה במערכת?" />

            <Ln x1={720} y1={160} x2={690} y2={220} />
            <text x={705} y={185} fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="Inter,sans-serif">כן</text>

            <Ln x1={880} y1={160} x2={910} y2={220} />
            <text x={895} y={185} fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="Inter,sans-serif">לא</text>

            {/* ════ First-Time (Center x=690) ════ */}
            <GreenBox x={590} y={220} w={200} h={52} label="מסך יצירת פרופיל" sublabel="פרטים אישיים וסוג קטיעה" />
            <Ln x1={690} y1={274} x2={690} y2={310} />

            <Diamond cx={690} cy={340} w={150} h={60} label="בחירת מסלול" />

            <Ln x1={615} y1={340} x2={450} y2={400} />
            <text x={530} y={360} fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="Inter,sans-serif">חוויה</text>

            <Ln x1={765} y1={340} x2={910} y2={400} />
            <text x={840} y={360} fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="Inter,sans-serif">שיקום</text>

            {/* ════ Returning (Center x=910) ════ */}
            <Diamond cx={910} cy={246} w={150} h={60} label="היסטוריית משתמש" />

            <Ln x1={835} y1={246} x2={690} y2={400} />
            <text x={760} y={310} fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="Inter,sans-serif">חוויה</text>

            <Ln x1={985} y1={246} x2={1150} y2={400} />
            <text x={1060} y={310} fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="Inter,sans-serif">שיקום</text>

            {/* ════ C1: First Time Exp (Center x=450) ════ */}
            <BlueBox x={360} y={400} w={180} h={54} label="ממשק יצירה ועיצוב" sublabel="בחירת גפה מקטלוג ויזואלי" />
            <Ln x1={450} y1={454} x2={450} y2={490} />

            <TealBox x={360} y={490} w={180} h={54} label=" MediaPipe / כיול אנטומי " sublabel="מיפוי שלד מבוסס ראייה ממוחשבת" />
            <Ln x1={450} y1={544} x2={570} y2={600} />

            {/* ════ C2: Returning Exp (Center x=690) ════ */}
            <BlueBox x={600} y={400} w={180} h={54} label="בחירת גפה קודמת או יצירת חדשה" />
            <Ln x1={690} y1={454} x2={570} y2={600} />

            {/* ════ Merge Exp (Center x=570) ════ */}
            <PurpleBox x={470} y={600} w={200} h={54} label="תצוגת שכבה דיגיטלית" sublabel="השתקפות מרחבית בזמן אמת" />
            <Ln x1={570} y1={654} x2={570} y2={700} />
            <Oval cx={570} cy={720} rx={110} ry={26} label="סיום סשן" />

            {/* ════ C3: First Time Rehab (Center x=910) ════ */}
            <BlueBox x={820} y={400} w={180} h={54} label="בחירת גפה ותוכנית" sublabel="עיצוב פרוטזה ויעדי אימון" />
            <Ln x1={910} y1={454} x2={910} y2={490} />

            <TealBox x={820} y={490} w={180} h={54} label="כיול גוף ומציאות רבודה" sublabel="שכבת מיפוי שלד" />
            <Ln x1={910} y1={544} x2={1030} y2={600} />

            {/* ════ C4: Returning Rehab (Center x=1150) ════ */}
            <BlueBox x={1060} y={400} w={180} h={54} label="המשך תוכנית" sublabel="דילוג ישירות לביצוע אימון" />
            <Ln x1={1150} y1={454} x2={1030} y2={600} />

            {/* ════ Merge Rehab (Center x=1030) ════ */}
            <PurpleBox x={910} y={600} w={240} h={64} label="ביצוע אימון פעיל" sublabel="משחוק AR ושליטה ללא מגע (NUI/VUI)" />
            <Ln x1={1030} y1={664} x2={1030} y2={710} />

            <CloudDB x={940} y={710} w={180} h={54} label="שמירת נתונים בתיק המטופל" />
            <Ln x1={1030} y1={764} x2={1030} y2={810} />
            <Oval cx={1030} cy={830} rx={110} ry={26} label="סיום סשן" />

            {/* ════ Cross-Track Link: Data Logging to Dashboard ════ */}
            <Arr d="M 940,737 L 360,737 L 360,290" dashed color="#d87a3b" />

          </svg>
        </div>
      </div>
    </section>
  )
}
