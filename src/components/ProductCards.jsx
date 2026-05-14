import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ProductCards.module.css'

const CARDS = [
  {
    icon: '◈',
    title: 'Transparent Interface NUI + VUI',
    body: ' הממשק "נעלם" לחלוטין. הגוף והקול הם כלי השליטה היחידים - מחוות גוף מחליפות תרגיל, פקודות קוליות מדווחות על כאב או מבקשות הפסקה.',
  },
  {
    icon: '⬡',
    title: 'Visible GUI',
    body: 'הממשק הגרפי פעיל - המטופל בוחר את מראה הגפה הווירטואלית, מגדיר תוכנית תרגילים ומגדיר רמת קושי.',

  },
  // {
  //   icon: '◉',
  //   title: 'Interface Selected',
  //   body: 'Hybrid Workflow: GUI → NUI + VUI. From 4 types (GUI, NUI, VUI, TUI), three combined across different session phases.',
  // },
  // {
  //   icon: '◧',
  //   title: 'Constraints',
  //   body: 'Audience: physical limitation → no screen touch mid-training. Environment: home/clinic, webcam only, no depth sensors. Language: Hebrew UI, minimal, large fonts, accessible. App: real-time AR requires transparent UI to maintain performance.',
  // },
]

export default function ProductCards() {
  const cardRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(
          card,
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: {
              trigger: card,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="section-02" className={styles.section}>
      <div className={styles.sectionNumber}>02</div>
      <div className={styles.inner}>
        {/* <h2 className={styles.heading}>Interface Definition</h2> */}
        <h2 className={styles.heading}>הגדרת מוצר</h2>
        <div className={styles.grid}>
          {CARDS.map((card, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className={styles.card}
            >
              <span className={styles.cardIcon}>{card.icon}</span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardBody} dir="rtl" lang="he">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
