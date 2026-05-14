import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './IntroDescription.module.css'

const HEBREW_TEXT = `מערכת מציאות רבודה המשלבת ראייה ממוחשבת וייצוג תלת-ממדי בזמן אמת,
 המיועדת להחלפת טיפול המראה המסורתי בפתרון דיגיטלי אקטיבי. המערכת סורקת את המטופל ומציגה גפה
  וירטואלית במקום הגפה החסרה, בזמן אמת - דרך מצלמת מחשב רגילה ללא ציוד מיוחד.`

export default function IntroDescription() {
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!textRef.current) return
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="section-01" className={styles.section}>
      <div className={styles.sectionNumber}>01</div>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Interface Description</h2>
        <p
          ref={textRef}
          className={styles.body}
          dir="rtl"
          lang="he"
        >
          {HEBREW_TEXT}
        </p>
      </div>
    </section>
  )
}
