import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Demonstration.module.css'

export default function Demonstration() {
  const sectionRef = useRef()
  const btnRef = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(btnRef.current, 
        { opacity: 0, y: 30 },
        {
          opacity: 1, 
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="section-08" ref={sectionRef} className={styles.section}>
      <div className={styles.sectionNumber}>08</div>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Demonstration</h2>
        <div className={styles.buttonContainer}>
          <a 
            href="/Demo_Liminal.html" 
            target="_blank" 
            rel="noopener noreferrer" 
            ref={btnRef} 
            className={styles.demoButton}
          >
            Live Demo
          </a>
        </div>
      </div>
    </section>
  )
}
