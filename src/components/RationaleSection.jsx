import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './RationaleSection.module.css'

const ICONS = {
  user: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="9" r="4.5" />
      <path d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10" />
    </svg>
  ),
  home: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13L14 3l11 10" />
      <path d="M6 10.5V24h5.5v-6h5v6H22V10.5" />
    </svg>
  ),
  speech: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z" />
      <line x1="9" y1="10.5" x2="19" y2="10.5" />
      <line x1="9" y1="14.5" x2="15" y2="14.5" />
    </svg>
  ),
  cpu: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="12" height="12" rx="1" />
      <line x1="11" y1="8" x2="11" y2="4" /><line x1="14" y1="8" x2="14" y2="4" /><line x1="17" y1="8" x2="17" y2="4" />
      <line x1="11" y1="20" x2="11" y2="24" /><line x1="14" y1="20" x2="14" y2="24" /><line x1="17" y1="20" x2="17" y2="24" />
      <line x1="8" y1="11" x2="4" y2="11" /><line x1="8" y1="14" x2="4" y2="14" /><line x1="8" y1="17" x2="4" y2="17" />
      <line x1="20" y1="11" x2="24" y2="11" /><line x1="20" y1="14" x2="24" y2="14" /><line x1="20" y1="17" x2="24" y2="17" />
    </svg>
  ),
}

export default function RationaleSection({ sectionId, sectionNumber, title, cards, variant }) {
  const cardRefs = useRef([])
  const isConstraints = variant === 'constraints'
  const isInterfaces = variant === 'interfaces'
  const isRationale = variant === 'rationale'

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(
          card,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            delay: i * 0.07,
            scrollTrigger: {
              trigger: card,
              start: 'top 87%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id={sectionId} className={styles.section}>
      <div className={styles.sectionNumber}>{sectionNumber}</div>
      <div className={styles.inner}>
        <h2 className={isConstraints ? styles.headingConstraints : isInterfaces ? styles.headingInterfaces : styles.heading}>{title}</h2>
        <div className={
          isConstraints ? styles.gridConstraints :
          isInterfaces ? styles.gridInterfaces :
          isRationale ? styles.listRationale :
          styles.grid
        }>
          {cards.map((card, i) => {
            if (isRationale) {
              return (
                <div
                  key={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className={styles.rowRationale}
                >
                  <span className={styles.rowCounter}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.rowContent}>
                    <h3 className={styles.rowTitle} dir="rtl" lang="he">{card.title}</h3>
                    <p className={styles.rowBody} dir="rtl" lang="he">{card.body}</p>
                  </div>
                </div>
              )
            }
            if (isInterfaces) {
              const [acronym, fullName] = card.title.split(' — ')
              return (
                <div
                  key={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className={styles.cardInterfaces}
                >
                  <span className={styles.cardAcronym}>{acronym}</span>
                  <p className={styles.cardFullName}>{acronym} — {fullName}</p>
                  <p className={styles.cardBodyInterfaces} dir="rtl" lang="he">{card.body}</p>
                </div>
              )
            }
            return (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                className={isConstraints ? styles.cardConstraints : styles.card}
              >
                {isConstraints ? (
                  <span className={styles.cardIconSvg}>{ICONS[card.icon]}</span>
                ) : (
                  <span className={styles.cardIcon}>◆</span>
                )}
                <h3 className={styles.cardTitle} dir="rtl" lang="he">{card.title}</h3>
                <p className={styles.cardBody} dir="rtl" lang="he">{card.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
