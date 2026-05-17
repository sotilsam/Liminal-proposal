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
            viewBox="0 0 1300 1100"
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
            <Oval cx={800} cy={60} rx={140} ry={26} label="מסך פתיחה למערכת" />

            <Arr d="M 750,86 L 750,110 L 250,110 L 250,150" />
            <text x={500} y={100} fill="rgba(255,255,255,0.6)" fontSize="13" fontFamily="Inter,sans-serif">מסלול מטפל</text>

            <Arr d="M 800,86 L 800,150" />
            <text x={815} y={125} fill="rgba(255,255,255,0.6)" fontSize="13" fontFamily="Inter,sans-serif">מסלול מטופל</text>

            {/* ════ Therapist Track (Center x=250) ════ */}
            <OrangeBox x={150} y={150} w={200} h={60} label="התחברות " sublabel="אימות" />

            {/* Parallel Branches from Login */}
            <Arr d="M 250,210 L 250,250 L 140,250 L 140,290" />
            <Arr d="M 250,210 L 250,250 L 360,250 L 360,290" />

            <OrangeBox x={40} y={290} w={200} h={60} label="לוח בקרת מטופלים" sublabel="צפייה בכל המטופלים המשויכים" />
            <OrangeBox x={260} y={290} w={200} h={60} label="ניהול תיק מטופל" sublabel="דוחות, נתונים, ותוכניות מרחוק" />

            {/* ════ Patient Track Top (Center x=800) ════ */}
            <Diamond cx={800} cy={180} w={160} h={60} label="פעם ראשונה במערכת?" />

            <Arr d="M 720,180 L 690,180 L 690,294" />
            <text x={665} y={170} fill="rgba(255,255,255,0.6)" fontSize="13" fontFamily="Inter,sans-serif">כן</text>

            <Arr d="M 880,180 L 910,180 L 910,290" />
            <text x={925} y={170} fill="rgba(255,255,255,0.6)" fontSize="13" fontFamily="Inter,sans-serif">לא</text>

            {/* ════ First-Time (Center x=690) ════ */}
            <GreenBox x={590} y={294} w={200} h={52} label="מסך יצירת פרופיל" sublabel="פרטים אישיים וסוג קטיעה" />
            <Arr d="M 690,346 L 690,430" />

            <Diamond cx={690} cy={460} w={150} h={60} label="בחירת מסלול" />

            <Arr d="M 615,460 L 450,460 L 450,560" />
            <text x={530} y={450} fill="rgba(255,255,255,0.6)" fontSize="13" fontFamily="Inter,sans-serif">התנסות</text>

            <Arr d="M 765,460 L 910,460 L 910,560" />
            <text x={840} y={450} fill="rgba(255,255,255,0.6)" fontSize="13" fontFamily="Inter,sans-serif">שיקום</text>

            {/* ════ Returning (Center x=910) ════ */}
            <Diamond cx={910} cy={320} w={150} h={60} label="היסטוריית משתמש" />

            <Arr d="M 835,320 L 800,320 L 800,520 L 690,520 L 690,560" />
            <text x={745} y={510} fill="rgba(255,255,255,0.6)" fontSize="13" fontFamily="Inter,sans-serif">התנסות</text>

            <Arr d="M 985,320 L 1150,320 L 1150,560" />
            <text x={1060} y={310} fill="rgba(255,255,255,0.6)" fontSize="13" fontFamily="Inter,sans-serif">שיקום</text>

            {/* ════ C1: First Time Exp (Center x=450) ════ */}
            <BlueBox x={360} y={560} w={180} h={54} label="ממשק יצירה ועיצוב" sublabel="בחירת גפה מקטלוג ויזואלי" />
            <Arr d="M 450,614 L 450,660" />

            <TealBox x={360} y={660} w={180} h={54} label=" MediaPipe / כיול אנטומי " sublabel="מיפוי שלד מבוסס ראייה ממוחשבת" />
            <Arr d="M 450,714 L 450,740 L 570,740 L 570,780" />

            {/* ════ C2: Returning Exp (Center x=690) ════ */}
            <BlueBox x={600} y={560} w={180} h={54} label="בחירת גפה קודמת או יצירת חדשה" />
            <Arr d="M 690,614 L 690,740 L 570,740 L 570,780" />

            {/* ════ Merge Exp (Center x=570) ════ */}
            <PurpleBox x={470} y={780} w={200} h={54} label="תצוגת שכבה דיגיטלית" sublabel="השתקפות מרחבית בזמן אמת" />
            <Arr d="M 570,834 L 570,894" />
            <Oval cx={570} cy={920} rx={110} ry={26} label="סיום סשן" />

            {/* ════ C3: First Time Rehab (Center x=910) ════ */}
            <BlueBox x={820} y={560} w={180} h={54} label="בחירת גפה ותוכנית" sublabel="עיצוב פרוטזה ויעדי אימון" />
            <Arr d="M 910,614 L 910,660" />

            <TealBox x={820} y={660} w={180} h={54} label="כיול גוף ומציאות רבודה" sublabel="שכבת מיפוי שלד" />
            <Arr d="M 910,714 L 910,740 L 1030,740 L 1030,780" />

            {/* ════ C4: Returning Rehab (Center x=1150) ════ */}
            <BlueBox x={1060} y={560} w={180} h={54} label="המשך תוכנית" sublabel="דילוג ישירות לביצוע אימון" />
            <Arr d="M 1150,614 L 1150,740 L 1030,740 L 1030,780" />

            {/* ════ Merge Rehab (Center x=1030) ════ */}
            <PurpleBox x={910} y={780} w={240} h={64} label="ביצוע אימון פעיל" sublabel=" (NUI/VUI) ללא מגע AR" />
            <Arr d="M 1030,844 L 1030,893" />

            <CloudDB x={940} y={893} w={180} h={54} label="שמירת נתונים בתיק המטופל" />
            <Arr d="M 1030,947 L 1030,994" />
            <Oval cx={1030} cy={1020} rx={110} ry={26} label="סיום סשן" />

            {/* ════ Cross-Track Link: Data Logging to Dashboard ════ */}
            <Arr d="M 940,920 L 900,920 L 900,1060 L 320,1060 L 320,350" dashed color="#d87a3b" />
          </svg>
        </div>
      </div>
    </section>
  )
}
