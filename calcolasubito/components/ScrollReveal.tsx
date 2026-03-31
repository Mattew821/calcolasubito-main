'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface GsapModule {
  gsap: {
    registerPlugin: (...plugins: unknown[]) => void
    context: (callback: () => void) => { revert: () => void }
    fromTo: (target: unknown, fromVars: Record<string, unknown>, toVars: Record<string, unknown>) => void
    to: (target: unknown, vars: Record<string, unknown>) => void
  }
}

interface ScrollTriggerModule {
  ScrollTrigger: unknown
}

export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const parallaxElements = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    const staggerContainers = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal-stagger]'))
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (revealElements.length === 0 && parallaxElements.length === 0 && staggerContainers.length === 0) {
      return
    }

    const revealWithoutAnimation = () => {
      revealElements.forEach((element) => {
        element.classList.add('is-revealed')
      })
    }

    if (prefersReducedMotion) {
      root.classList.remove('motion-ready', 'motion-gsap', 'has-scrolled')
      revealWithoutAnimation()
      return
    }

    root.classList.add('motion-ready')

    let cleanup: (() => void) | undefined
    let cancelled = false

    const activateIntersectionFallback = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed')
              observer.unobserve(entry.target)
            }
          }
        },
        {
          root: null,
          threshold: 0.12,
          rootMargin: '0px 0px -8% 0px',
        }
      )

      revealElements.forEach((element) => observer.observe(element))
      cleanup = () => observer.disconnect()
    }

    const activateGsap = async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap') as Promise<GsapModule>,
          import('gsap/ScrollTrigger') as Promise<ScrollTriggerModule>,
        ])

        if (cancelled) {
          return
        }

        gsap.registerPlugin(ScrollTrigger)
        root.classList.add('motion-gsap')

        const context = gsap.context(() => {
          revealElements.forEach((element, index) => {
            gsap.fromTo(
              element,
              { y: 26, scale: 0.985 },
              {
                y: 0,
                scale: 1,
                duration: 0.72,
                delay: Math.min(index * 0.02, 0.14),
                ease: 'power3.out',
                overwrite: 'auto',
                scrollTrigger: {
                  trigger: element,
                  start: 'top 88%',
                  end: 'top 62%',
                  once: true,
                  fastScrollEnd: true,
                },
              }
            )
          })

          staggerContainers.forEach((container) => {
            const items = Array.from(container.querySelectorAll<HTMLElement>('[data-stagger-item]'))
            if (items.length === 0) {
              return
            }

            gsap.fromTo(
              items,
              { y: 18, scale: 0.99 },
              {
                y: 0,
                scale: 1,
                duration: 0.58,
                ease: 'power2.out',
                stagger: 0.07,
                overwrite: 'auto',
                scrollTrigger: {
                  trigger: container,
                  start: 'top 88%',
                  once: true,
                  fastScrollEnd: true,
                },
              }
            )
          })

          parallaxElements.forEach((element) => {
            const speed = Number(element.dataset.parallaxSpeed ?? '10')
            const clampedSpeed = Number.isFinite(speed) ? Math.min(Math.max(speed, 4), 26) : 10

            gsap.to(element, {
              yPercent: clampedSpeed * -1,
              ease: 'none',
              scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.65,
              },
            })
          })

          gsap.to(root, {
            '--scroll-progress': 1,
            ease: 'none',
            scrollTrigger: {
              trigger: document.body,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.2,
            },
          })

          gsap.fromTo(
            '.site-header',
            { y: 0, backdropFilter: 'blur(10px)' },
            {
              y: -2,
              backdropFilter: 'blur(18px)',
              ease: 'power1.out',
              scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: '+=120',
                scrub: true,
                onUpdate: (self: { progress: number }) => {
                  if (self.progress > 0.1) {
                    root.classList.add('has-scrolled')
                  } else {
                    root.classList.remove('has-scrolled')
                  }
                },
              },
            }
          )
        })

        cleanup = () => {
          context.revert()
          root.style.setProperty('--scroll-progress', '0')
          root.classList.remove('motion-gsap', 'has-scrolled')
        }
      } catch {
        root.classList.remove('motion-gsap')
        activateIntersectionFallback()
      }
    }

    void activateGsap()

    return () => {
      cancelled = true
      cleanup?.()
      root.style.setProperty('--scroll-progress', '0')
      root.classList.remove('motion-ready', 'motion-gsap', 'has-scrolled')
    }
  }, [pathname])

  return null
}
