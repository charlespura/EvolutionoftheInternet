// App.jsx - Enhanced with historical accuracy, dates, and trivia
import { Suspense, useEffect, useRef, useState, lazy } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import './App.css'

const GlobeScene = lazy(() => import('./GlobeScene'))

function App() {
  const laneCount = 5
  const eras = ['Orbit Zone', 'Meteor Belt', 'Comet Run', 'Nebula Path']
  const eraThresholds = [0, 260, 520, 840]
  const appRef = useRef(null)
  const cursorRef = useRef(null)
  const gameSectionRef = useRef(null)
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [gameHint, setGameHint] = useState('Use W to thrust and A / D to steer the rocket.')
  const [eraIndex, setEraIndex] = useState(0)
  const [timeWarpActive, setTimeWarpActive] = useState(false)
  const [fuelCells, setFuelCells] = useState(0)
  const [obstacles, setObstacles] = useState([])
  const [isRocketVisible, setIsRocketVisible] = useState(true)
  const gameRef = useRef(null)
  const pageRocketRef = useRef(null)
  const playerRef = useRef(null)
  const aiHeadingRef = useRef(null)
  const obstacleRefs = useRef([])
  const obstaclesRef = useRef([])
  const collectibleRefs = useRef([])
  const collectibleDefsRef = useRef([])
  const lanePositionsRef = useRef(Array.from({ length: laneCount }, () => 0))
  const keysRef = useRef({ w: false, a: false, s: false, d: false })
  const scoreRef = useRef(0)
  const lastScoreRef = useRef(0)
  const warpTimeoutRef = useRef(null)
  const playerPosRef = useRef({ x: 24, y: 24, vx: 0, vy: 0 })
  const playerInitializedRef = useRef(false)
  const animationFrameRef = useRef(null)
  const lastFrameRef = useRef(0)
  const isGameStartingRef = useRef(false)
  const isResettingRef = useRef(false)
  const rocketAngleRef = useRef(0)
  const cursorPositionRef = useRef({ x: 0, y: 0 })
  const rocketPositionRef = useRef({ x: 0, y: 0 })
  const rafIdRef = useRef(null)

  // Functions to control rocket visibility using GSAP
  const hideRocket = () => {
    setIsRocketVisible(false)
    if (pageRocketRef.current) {
      gsap.to(pageRocketRef.current, {
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }

  const showRocket = () => {
    setIsRocketVisible(true)
    if (pageRocketRef.current) {
      gsap.to(pageRocketRef.current, {
        autoAlpha: 1,
        duration: 0.5,
        ease: 'power2.inOut'
      })
    }
  }

  // Simple scroll to game section without interfering with ScrollTrigger
  const scrollToGame = () => {
    if (gameSectionRef.current) {
      const rect = gameSectionRef.current.getBoundingClientRect()
      const absoluteTop = rect.top + window.pageYOffset
      const targetY = absoluteTop - 100
      
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      })
    }
  }

  // ACCURATE: Update rocket position and angle using RAF
  const updateRocketRotation = () => {
    const rocket = pageRocketRef.current
    if (!rocket) return
    
    const opacity = parseFloat(rocket.style.opacity) || 0
    if (opacity < 0.1) {
      rafIdRef.current = requestAnimationFrame(updateRocketRotation)
      return
    }
    
    const rect = rocket.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    rocketPositionRef.current = { x: centerX, y: centerY }
    
    const dx = cursorPositionRef.current.x - centerX
    const dy = cursorPositionRef.current.y - centerY
    const angle = Math.atan2(dy, dx) * (50 / Math.PI)
    
    const currentTransform = rocket.style.transform || ''
    const cleanTransform = currentTransform.replace(/rotate\([^)]*\)\s*/g, '').trim()
    rocket.style.transform = cleanTransform ? `${cleanTransform} rotate(${angle}deg)` : `rotate(${angle}deg)`
    
    rocketAngleRef.current = angle
    
    rafIdRef.current = requestAnimationFrame(updateRocketRotation)
  }

  // Start/stop RAF for rocket rotation
  useEffect(() => {
    rafIdRef.current = requestAnimationFrame(updateRocketRotation)
    
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Flip)

    const ctx = gsap.context(() => {
      const pageRocket = pageRocketRef.current
      if (pageRocket) {
        gsap.set(pageRocket, {
          left: '72vw',
          top: '26vh',
          xPercent: -50,
          yPercent: -50,
          rotate: 12,
          scale: 1.02,
          autoAlpha: 0,
          zIndex: 9000,
        })

        // Hero section rocket animation
        ScrollTrigger.create({
          trigger: '.hero',
          start: 'top top',
          end: '+=3800',
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const aiStart = 0.68
            const aiEnd = 1
            const raw = (self.progress - aiStart) / (aiEnd - aiStart)
            const progress = gsap.utils.clamp(0, 1, raw)
            const visible = raw >= 0 && isRocketVisible

            const currentRotation = rocketAngleRef.current || 12
            
            gsap.set(pageRocket, {
              autoAlpha: visible ? 1 : 0,
              left: `${gsap.utils.interpolate(72, 54, progress)}vw`,
              top: `${gsap.utils.interpolate(26, 82, progress)}vh`,
              rotate: currentRotation,
              scale: gsap.utils.interpolate(1.02, 1.08, progress),
              zIndex: 9000,
            })
          },
        })

        // Timeline section - rocket COMPLETELY HIDDEN
        ScrollTrigger.create({
          trigger: '.timeline-section',
          start: 'top bottom',
          endTrigger: '.game-section',
          end: 'top center',
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress
            
            let opacity = 0
            let zIndex = 1
            
            if (progress < 0.15) {
              const fadeOut = progress / 0.15
              opacity = gsap.utils.interpolate(1, 0, fadeOut)
              zIndex = 1
            } else if (progress < 0.85) {
              opacity = 0
              zIndex = 1
            } else {
              const fadeIn = (progress - 0.85) / 0.15
              opacity = gsap.utils.interpolate(0, 1, fadeIn)
              zIndex = 9000
            }
            
            const finalOpacity = isRocketVisible ? opacity : 0
            
            const posProgress = gsap.utils.clamp(0, 1, progress)
            const left = gsap.utils.interpolate(54, 48, posProgress)
            const top = gsap.utils.interpolate(82, 60, posProgress)
            
            const currentRotation = rocketAngleRef.current || 0
            
            gsap.set(pageRocket, {
              autoAlpha: finalOpacity,
              left: `${left}vw`,
              top: `${top}vh`,
              rotate: currentRotation,
              scale: gsap.utils.interpolate(1.08, 0.9, posProgress),
              zIndex: zIndex,
            })
          },
        })

        // Final approach to game section - rocket appears
        ScrollTrigger.create({
          trigger: '.game-section',
          start: 'top bottom',
          end: 'top center',
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = gsap.utils.clamp(0, 1, self.progress * 2)
            
            const opacity = progress < 0.1 ? 0 : gsap.utils.interpolate(0, 0.9, (progress - 0.1) / 0.7)
            const finalOpacity = isRocketVisible ? opacity : 0
            
            const currentRotation = rocketAngleRef.current || 0
            
            gsap.set(pageRocket, {
              autoAlpha: finalOpacity,
              left: `${gsap.utils.interpolate(48, 44, progress)}vw`,
              top: `${gsap.utils.interpolate(60, 48, progress)}vh`,
              rotate: currentRotation,
              scale: gsap.utils.interpolate(0.9, 0.7, progress),
              zIndex: 9000,
            })
          },
        })
      }

      // ===== ORIGINAL SCROLL ANIMATIONS (FROM VERSION 1) =====
      const hero = '.hero'
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=3800',
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      })

      timeline
        .to('.window-shell', {
          rotateX: 8,
          rotateY: -6,
          scale: 1.03,
          duration: 1.2,
          ease: 'power1.out',
        })
        .to(
          '.scene.web1',
          {
            autoAlpha: 0,
            y: -60,
            duration: 1,
            ease: 'power1.out',
          },
          0,
        )
        .to(
          '.scene.web2',
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power1.out',
          },
          0,
        )
        .to(
          '.window-shell',
          {
            borderColor: '#4856ff',
            boxShadow: '0 48px 140px rgba(0, 41, 119, 0.3)',
            duration: 1,
          },
          0,
        )
        .to(
          '.chrome-bar',
          {
            background: 'linear-gradient(90deg,#e7e8ff 0%,#5b7dff 100%)',
            color: '#1b1f3c',
            duration: 1,
          },
          0.2,
        )
        .to(
          '.browser-mock .shape',
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 1,
          },
          0.2,
        )
        .to(
          '.scene.web2 .spark',
          {
            opacity: 1,
            x: 0,
            duration: 1,
            stagger: 0.12,
          },
          0,
        )
        .to(
          '.scene.web2 .bubble',
          {
            scale: 1,
            opacity: 1,
            duration: 1,
          },
          0.2,
        )
        .to(
          '.scene.web2 .tag',
          {
            y: 0,
            opacity: 1,
            duration: 1,
          },
          0.3,
        )
        .to(
          '.scene.web2',
          {
            autoAlpha: 0,
            y: -60,
            duration: 1,
            ease: 'power1.out',
          },
          1.2,
        )
        .to(
          '.scene.mobile',
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power1.out',
          },
          1.2,
        )
        .to(
          '.page-shell',
          {
            rotateX: -6,
            rotateY: 10,
            scale: 1.05,
            duration: 1,
          },
          1.2,
        )
        .to(
          '.window-shell',
          {
            borderColor: '#1fc0ff',
            backgroundColor: '#071118',
            boxShadow: '0 52px 150px rgba(2, 82, 123, 0.28)',
            duration: 1,
          },
          1.2,
        )
        .to(
          '.scene.mobile .device',
          {
            y: 0,
            opacity: 1,
            duration: 1,
          },
          1.4,
        )
        .to(
          '.scene.mobile .pill',
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
          },
          1.4,
        )
        .to(
          '.scene.mobile',
          {
            autoAlpha: 0,
            y: -60,
            duration: 1,
            ease: 'power1.out',
          },
          2.6,
        )
        .to(
          '.scene.ai',
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power1.out',
          },
          2.6,
        )
        .to(
          '.window-shell',
          {
            borderColor: '#c64cff',
            backgroundColor: '#09050f',
            boxShadow: '0 62px 190px rgba(145, 0, 190, 0.35)',
            duration: 1,
          },
          2.6,
        )
        .to(
          '.page-shell',
          {
            rotateX: 3,
            rotateY: -8,
            scale: 1.06,
            duration: 1,
          },
          2.6,
        )
        .to(
          '.hero-footer',
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          2.6,
        )

      gsap.to('.hero-background', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.sidebar', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.hero-background .orbit--outer', {
        rotation: 360,
        duration: 52,
        repeat: -1,
        ease: 'none',
      })

      gsap.to('.hero-background .orbit--inner', {
        rotation: -360,
        duration: 68,
        repeat: -1,
        ease: 'none',
      })

      gsap.to('.pulse', {
        scale: 1.12,
        opacity: 0.86,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.2,
      })

      gsap.to('.sidebar-chip', {
        y: 5,
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: 'sine.inOut',
        stagger: 0.15,
      })

      // ===== NEW SCROLLTRIGGER ANIMATIONS (FROM VERSION 2) =====

      // 1. Timeline items stagger animation with 3D effect
      const timelineItems = document.querySelectorAll('.timeline-item')
      if (timelineItems.length) {
        timelineItems.forEach((item, index) => {
          gsap.from(item, {
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 1,
              toggleActions: 'play none none reverse',
            },
            y: 80,
            opacity: 0,
            rotationX: 15,
            scale: 0.92,
            duration: 1.2,
            ease: 'power3.out',
            delay: index * 0.15,
          })
        })
      }

      // 2. Enhanced marquee items with individual hover and scroll effects
      const marqueeItems = document.querySelectorAll('.marquee-item')
      if (marqueeItems.length) {
        marqueeItems.forEach((item, index) => {
          gsap.from(item, {
            scrollTrigger: {
              trigger: '.timeline-marquee',
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1.5,
              toggleActions: 'play none none reverse',
            },
            y: 40,
            opacity: 0,
            scale: 0.88,
            duration: 1,
            ease: 'power2.out',
            delay: index * 0.08,
          })
        })
      }

      // 3. Three.js globe fade-in with glow - SAFE
      const threeWrapper = document.querySelector('.three-wrapper')
      if (threeWrapper) {
        gsap.from(threeWrapper, {
          scrollTrigger: {
            trigger: threeWrapper,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1.2,
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          scale: 0.92,
          duration: 1.5,
          ease: 'power3.out',
        })
        
        gsap.to(threeWrapper, {
          scrollTrigger: {
            trigger: threeWrapper,
            start: 'top 70%',
            end: 'bottom 20%',
            scrub: 2,
          },
          boxShadow: '0 42px 130px rgba(100, 150, 255, 0.25)',
          duration: 1,
          ease: 'power1.inOut',
        })
      }

      // 4. Scene transition effects with perspective
      const scenes = document.querySelectorAll('.scene')
      if (scenes.length) {
        scenes.forEach((scene) => {
          gsap.from(scene, {
            scrollTrigger: {
              trigger: scene.closest('.window-shell') || scene,
              start: 'top 90%',
              end: 'top 30%',
              scrub: 1.5,
              toggleActions: 'play none none reverse',
            },
            opacity: 0.2,
            scale: 0.85,
            rotationY: 20,
            duration: 1.2,
            ease: 'power2.out',
          })

          const headings = scene.querySelectorAll('h1')
          if (headings.length) {
            gsap.from(headings, {
              scrollTrigger: {
                trigger: scene,
                start: 'top 70%',
                end: 'top 20%',
                scrub: 1,
                toggleActions: 'play none none reverse',
              },
              y: 30,
              opacity: 0,
              duration: 1,
              ease: 'power2.out',
            })
          }
          
          const paragraphs = scene.querySelectorAll('p')
          if (paragraphs.length) {
            gsap.from(paragraphs, {
              scrollTrigger: {
                trigger: scene,
                start: 'top 70%',
                end: 'top 20%',
                scrub: 1,
                toggleActions: 'play none none reverse',
              },
              y: 20,
              opacity: 0,
              duration: 0.8,
              delay: 0.2,
              ease: 'power2.out',
            })
          }
          
          const badges = scene.querySelectorAll('.trivia-badge')
          if (badges.length) {
            gsap.from(badges, {
              scrollTrigger: {
                trigger: scene,
                start: 'top 65%',
                end: 'top 15%',
                scrub: 1,
                toggleActions: 'play none none reverse',
              },
              scale: 0.9,
              opacity: 0,
              duration: 0.8,
              delay: 0.4,
              ease: 'back.out(1.7)',
            })
          }
        })
      }

      // 5. Logo chips with floating animation
      const logoChips = document.querySelectorAll('.logo-chip')
      if (logoChips.length) {
        logoChips.forEach((chip, index) => {
          gsap.from(chip, {
            scrollTrigger: {
              trigger: chip.closest('.scene.web2') || chip,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1,
              toggleActions: 'play none none reverse',
            },
            y: 40,
            opacity: 0,
            scale: 0.7,
            rotation: 15,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'back.out(1.7)',
          })
        })
      }

      // 6. Social bubbles with wave effect
      const bubbles = document.querySelectorAll('.bubble')
      if (bubbles.length) {
        bubbles.forEach((bubble, index) => {
          gsap.from(bubble, {
            scrollTrigger: {
              trigger: bubble.closest('.scene.web2') || bubble,
              start: 'top 75%',
              end: 'top 15%',
              scrub: 1,
              toggleActions: 'play none none reverse',
            },
            y: 60,
            opacity: 0,
            scale: 0.5,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'elastic.out(1, 0.5)',
          })
        })
      }

      // 7. Neon nodes with pulse
      const neonNodes = document.querySelectorAll('.neon-node')
      if (neonNodes.length) {
        neonNodes.forEach((node, index) => {
          gsap.from(node, {
            scrollTrigger: {
              trigger: node.closest('.scene.ai') || node,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1,
              toggleActions: 'play none none reverse',
            },
            scale: 0.2,
            opacity: 0,
            duration: 1,
            delay: index * 0.1,
            ease: 'power3.out',
          })
          
          gsap.to(node, {
            scrollTrigger: {
              trigger: node.closest('.scene.ai') || node,
              start: 'top 70%',
              end: 'bottom 20%',
              scrub: 2,
              toggleActions: 'play none none reverse',
            },
            boxShadow: '0 0 60px rgba(176, 98, 255, 0.4)',
            duration: 2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
        })
      }

      // 8. Browser shapes with staggered entrance
      const shapes = document.querySelectorAll('.shape')
      if (shapes.length) {
        shapes.forEach((shape, index) => {
          gsap.from(shape, {
            scrollTrigger: {
              trigger: shape.closest('.browser-mock') || shape,
              start: 'top 85%',
              end: 'top 30%',
              scrub: 1,
              toggleActions: 'play none none reverse',
            },
            y: 60,
            opacity: 0,
            scale: 0.6,
            rotation: 30,
            duration: 0.8,
            delay: index * 0.12,
            ease: 'back.out(1.7)',
          })
        })
      }

      // 9. Sidebar chips with magnetic effect
      const sidebarChips = document.querySelectorAll('.sidebar-chip')
      if (sidebarChips.length) {
        sidebarChips.forEach((chip, index) => {
          gsap.from(chip, {
            scrollTrigger: {
              trigger: chip,
              start: 'top 90%',
              end: 'top 40%',
              scrub: 1.2,
              toggleActions: 'play none none reverse',
            },
            x: index % 2 === 0 ? -80 : 80,
            opacity: 0,
            duration: 1,
            delay: index * 0.1,
            ease: 'power3.out',
          })
        })
      }

      // 10. Hero footer with typewriter effect
      const heroFooter = document.querySelector('.hero-footer')
      if (heroFooter) {
        gsap.from(heroFooter, {
          scrollTrigger: {
            trigger: heroFooter,
            start: 'top 90%',
            end: 'top 40%',
            scrub: 1,
            toggleActions: 'play none none reverse',
          },
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
        })
      }

      // 11. Game panel entrance
      const gamePanel = document.querySelector('.game-panel')
      if (gamePanel) {
        gsap.from(gamePanel, {
          scrollTrigger: {
            trigger: gamePanel,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1.5,
            toggleActions: 'play none none reverse',
          },
          y: 80,
          opacity: 0,
          scale: 0.95,
          duration: 1.5,
          ease: 'power3.out',
        })
      }

      // 12. Game controls stagger
      const controls = document.querySelectorAll('.game-control-strip span')
      if (controls.length) {
        controls.forEach((control, index) => {
          gsap.from(control, {
            scrollTrigger: {
              trigger: '.game-control-strip',
              start: 'top 85%',
              end: 'top 30%',
              scrub: 1,
              toggleActions: 'play none none reverse',
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out',
          })
        })
      }

      // 13. Game status with glow pulse
      const gameStatus = document.querySelector('.game-status')
      if (gameStatus) {
        gsap.from(gameStatus, {
          scrollTrigger: {
            trigger: gameStatus,
            start: 'top 90%',
            end: 'top 40%',
            scrub: 1,
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
        })
      }

      // 14. Rocket landing section with parallax
      const landingSection = document.querySelector('.rocket-landing-section')
      if (landingSection) {
        const landingRocket = document.querySelector('.landing-rocket-container')
        if (landingRocket) {
          gsap.from(landingRocket, {
            scrollTrigger: {
              trigger: landingSection,
              start: 'top 85%',
              end: 'top 20%',
              scrub: 1.5,
              toggleActions: 'play none none reverse',
            },
            y: 120,
            opacity: 0,
            scale: 0.7,
            rotation: 20,
            duration: 1.5,
            ease: 'power3.out',
          })
        }

        const landingText = document.querySelector('.landing-text')
        if (landingText) {
          gsap.from(landingText, {
            scrollTrigger: {
              trigger: landingSection,
              start: 'top 85%',
              end: 'top 20%',
              scrub: 1.5,
              toggleActions: 'play none none reverse',
            },
            y: 60,
            opacity: 0,
            duration: 1.5,
            delay: 0.3,
            ease: 'power3.out',
          })
        }

        const stats = document.querySelectorAll('.landing-stats span')
        if (stats.length) {
          stats.forEach((stat, index) => {
            gsap.from(stat, {
              scrollTrigger: {
                trigger: landingSection,
                start: 'top 80%',
                end: 'top 15%',
                scrub: 1,
                toggleActions: 'play none none reverse',
              },
              y: 30,
              opacity: 0,
              scale: 0.8,
              duration: 0.8,
              delay: index * 0.1 + 0.5,
              ease: 'back.out(1.7)',
            })
          })
        }
      }

      // 15. Footer with slide up
      const footer = document.querySelector('.landing-footer')
      if (footer) {
        gsap.from(footer, {
          scrollTrigger: {
            trigger: footer,
            start: 'top 95%',
            end: 'top 40%',
            scrub: 1,
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
        })
      }

      // 16. Timeline intro with float
      const timelineIntro = document.querySelector('.timeline-intro')
      if (timelineIntro) {
        gsap.from(timelineIntro, {
          scrollTrigger: {
            trigger: timelineIntro,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1.2,
            toggleActions: 'play none none reverse',
          },
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
        })
      }

      // 17. Rocket trail particles
      const trail = document.querySelector('.page-rocket__trail')
      if (trail) {
        gsap.to(trail, {
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          },
          scaleX: 1.4,
          scaleY: 1.6,
          duration: 1,
          ease: 'sine.inOut',
          yoyo: true,
        })
      }

      // 18. Background orbit with scroll parallax
      const outerOrbit = document.querySelector('.orbit--outer')
      if (outerOrbit) {
        gsap.to(outerOrbit, {
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 3,
          },
          scale: 1.3,
          opacity: 0.3,
          duration: 1,
          ease: 'power1.inOut',
        })
      }
      
      const innerOrbit = document.querySelector('.orbit--inner')
      if (innerOrbit) {
        gsap.to(innerOrbit, {
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 3,
          },
          scale: 0.7,
          opacity: 0.2,
          x: 100,
          duration: 1,
          ease: 'power1.inOut',
        })
      }

      // 19. Window shell with parallax depth
      const windowShell = document.querySelector('.window-shell')
      if (windowShell) {
        gsap.to(windowShell, {
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          },
          y: 30,
          duration: 1,
          ease: 'power1.inOut',
        })
      }

      // 20. Address bar with typewriter animation on scroll
      const addressBar = document.querySelector('.address')
      if (addressBar) {
        gsap.from(addressBar, {
          scrollTrigger: {
            trigger: '.chrome-bar',
            start: 'top 90%',
            end: 'top 30%',
            scrub: 1,
            toggleActions: 'play none none reverse',
          },
          opacity: 0.2,
          x: -30,
          duration: 1,
          ease: 'power2.out',
        })
      }

      // 21. Era pills with glow pulse
      const eraPills = document.querySelectorAll('.era-pill')
      if (eraPills.length) {
        eraPills.forEach((pill) => {
          gsap.to(pill, {
            scrollTrigger: {
              trigger: pill,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
            boxShadow: '0 0 30px rgba(98, 155, 255, 0.2)',
            duration: 2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
        })
      }

      // 22. Background gradient shifts - SAFE
      const appElement = document.querySelector('.App')
      if (appElement) {
        gsap.to(appElement, {
          scrollTrigger: {
            trigger: '.timeline-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
          background: 'radial-gradient(circle at 60% 40%, rgba(71, 92, 255, 0.25), rgba(241, 99, 255, 0.15), transparent 30%), radial-gradient(circle at 20% 80%, rgba(100, 200, 255, 0.12), transparent 25%), linear-gradient(180deg, #09070f 0%, #0d1125 40%, #1a0a2e 70%, #09070f 100%)',
          duration: 1,
          ease: 'power1.inOut',
        })
      }

      // 23. Game board with subtle hover reveal on scroll
      const gameBoard = document.querySelector('.game-board')
      if (gameBoard) {
        gsap.from(gameBoard, {
          scrollTrigger: {
            trigger: gameBoard,
            start: 'top 85%',
            end: 'top 20%',
            scrub: 1.5,
            toggleActions: 'play none none reverse',
          },
          y: 60,
          opacity: 0.6,
          duration: 1.5,
          ease: 'power3.out',
        })
      }

    }, appRef)

    // Marquee magnetic interaction
    const marquee = document.querySelector('.timeline-marquee')
    let marqueeItems = []
    let mqMove = null
    if (marquee) {
      marqueeItems = Array.from(marquee.querySelectorAll('.marquee-item'))
      const onMove = (e) => {
        const rect = marquee.getBoundingClientRect()
        const x = e.clientX - rect.left
        marqueeItems.forEach((it) => {
          const itRect = it.getBoundingClientRect()
          const itCenter = (itRect.left - rect.left) + itRect.width / 2
          const dist = Math.abs(x - itCenter)
          const scale = Math.max(0.9, 1.12 - dist / 600)
          gsap.to(it, { scale, duration: 0.45, ease: 'power3.out' })
        })
      }

      const onLeave = () => {
        marqueeItems.forEach((it) => gsap.to(it, { scale: 1, duration: 0.6, ease: 'power3.out' }))
      }

      marquee.addEventListener('mousemove', onMove)
      marquee.addEventListener('mouseleave', onLeave)
      mqMove = { onMove, onLeave }
    }

    const moveCursor = (event) => {
      const cursor = cursorRef.current
      if (!cursor) return
      const hoverTarget = event.target.closest(
        '.page-shell, .sidebar-chip, .chrome-bar, .browser-mock, .hero-footer, .marquee-item, .game-button, .logo-chip',
      )

      cursor.style.left = `${event.clientX}px`
      cursor.style.top = `${event.clientY}px`
      cursor.style.transform = hoverTarget
        ? 'translate(-50%, -50%) scale(1.45)'
        : 'translate(-50%, -50%) scale(1)'
      cursor.style.background = hoverTarget ? 'rgba(255, 255, 255, 0.16)' : 'transparent'
      
      cursorPositionRef.current = { x: event.clientX, y: event.clientY }
    }

    window.addEventListener('mousemove', moveCursor)

    return () => {
      ctx.revert()
      window.removeEventListener('mousemove', moveCursor)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      if (mqMove && marquee) {
        marquee.removeEventListener('mousemove', mqMove.onMove)
        marquee.removeEventListener('mouseleave', mqMove.onLeave)
      }
      if (appRef.current?.__cleanupThree) {
        appRef.current.__cleanupThree()
      }
    }
  }, [isRocketVisible])

  // ... (rest of the game logic - unchanged)
  const activateTimeWarp = (message) => {
    if (timeWarpActive) return
    setTimeWarpActive(true)
    setGameHint(message || 'Time Warp engaged! Speed surges through the next era.')
    if (warpTimeoutRef.current) window.clearTimeout(warpTimeoutRef.current)
    warpTimeoutRef.current = window.setTimeout(() => {
      setTimeWarpActive(false)
      setGameHint(`Now in ${eras[eraIndex]} — dodge the evolving traffic.`)
    }, 1600)
  }

  const updateEra = () => {
    const nextEra = eraThresholds.reduce((match, threshold, index) => (scoreRef.current >= threshold ? index : match), 0)
    if (nextEra !== eraIndex) {
      setEraIndex(nextEra)
      setGameHint(`Sector shift: ${eras[nextEra]} — dodge new asteroid patterns.`)
      activateTimeWarp(`Time Warp! Entering ${eras[nextEra]}.`)
    }
  }

  const updateCollectibles = (board, delta, playerRect) => {
    collectibleDefsRef.current.forEach((item, idx) => {
      if (!collectibleRefs.current[idx]) return
      item.y += delta * 100
      if (item.y > board.height + 24) {
        item.y = -Math.random() * board.height * 0.5 - 80
        item.lane = Math.floor(Math.random() * laneCount)
      }
      const collectibleEl = collectibleRefs.current[idx]
      gsap.set(collectibleEl, {
        x: lanePositionsRef.current[item.lane],
        y: item.y,
      })
      const collectibleRect = collectibleEl.getBoundingClientRect()
      const collision = !(playerRect.right < collectibleRect.left || playerRect.left > collectibleRect.right || playerRect.bottom < collectibleRect.top || playerRect.top > collectibleRect.bottom)
      if (collision) {
        item.y = -Math.random() * board.height * 0.8 - 120
        item.lane = Math.floor(Math.random() * laneCount)
        setFuelCells((count) => count + 1)
        activateTimeWarp('Fuel cell collected! Time Warp unlocked.')
      }
    })
  }

  // Clean up game state
  const cleanupGame = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    if (warpTimeoutRef.current) {
      window.clearTimeout(warpTimeoutRef.current)
      warpTimeoutRef.current = null
    }
    
    playerInitializedRef.current = false
    playerPosRef.current = { x: 24, y: 24, vx: 0, vy: 0 }
    keysRef.current = { w: false, a: false, s: false, d: false }
    obstaclesRef.current = []
    collectibleDefsRef.current = []
    obstacleRefs.current = []
    collectibleRefs.current = []
    scoreRef.current = 0
    lastScoreRef.current = 0
    setObstacles([])
    setScore(0)
    setFuelCells(0)
    setEraIndex(0)
    setTimeWarpActive(false)
    
    if (playerRef.current) {
      gsap.set(playerRef.current, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1
      })
      playerRef.current.classList.remove('thrusting')
    }
  }

  useEffect(() => {
    const update = (time) => {
      if (!gameActive) {
        lastFrameRef.current = time
        animationFrameRef.current = requestAnimationFrame(update)
        return
      }

      if (!gameRef.current || !playerRef.current) {
        animationFrameRef.current = requestAnimationFrame(update)
        return
      }

      if (!playerInitializedRef.current) {
        const board = gameRef.current.getBoundingClientRect()
        playerPosRef.current = {
          x: board.width / 2 - 26,
          y: board.height - 124,
          vx: 0,
          vy: 0,
        }
        gsap.set(playerRef.current, {
          x: playerPosRef.current.x,
          y: playerPosRef.current.y,
          rotation: 0,
          scale: 1,
        })
        playerInitializedRef.current = true
      }

      const board = gameRef.current.getBoundingClientRect()
      const delta = lastFrameRef.current ? Math.min((time - lastFrameRef.current) / 1000, 0.05) : 0
      lastFrameRef.current = time

      const laneWidth = board.width / laneCount
      lanePositionsRef.current = Array.from({ length: laneCount }, (_, index) => laneWidth * (index + 0.5) - 22)

      const accel = 980
      const gravity = 720
      const damping = Math.pow(0.91, delta * 60)
      const lateralLimit = 210
      const verticalLimit = 250

      if (keysRef.current.a || keysRef.current.arrowleft) playerPosRef.current.vx -= accel * delta
      if (keysRef.current.d || keysRef.current.arrowright) playerPosRef.current.vx += accel * delta
      if (keysRef.current.w || keysRef.current.arrowup) {
        playerPosRef.current.vy -= accel * delta * 0.9
      } else {
        playerPosRef.current.vy += gravity * delta
      }
      if (keysRef.current.s || keysRef.current.arrowdown) playerPosRef.current.vy += accel * delta * 0.7

      playerPosRef.current.vx *= damping
      playerPosRef.current.vy *= damping
      playerPosRef.current.vx = gsap.utils.clamp(-lateralLimit, lateralLimit, playerPosRef.current.vx)
      playerPosRef.current.vy = gsap.utils.clamp(-verticalLimit, verticalLimit, playerPosRef.current.vy)

      playerPosRef.current.x += playerPosRef.current.vx * delta
      playerPosRef.current.y += playerPosRef.current.vy * delta

      const minX = 0
      const maxX = board.width - 52
      const minY = -220
      const maxY = board.height + 1400
      playerPosRef.current.x = gsap.utils.clamp(minX, maxX, playerPosRef.current.x)
      playerPosRef.current.y = gsap.utils.clamp(minY, maxY, playerPosRef.current.y)

      gsap.set(playerRef.current, {
        x: playerPosRef.current.x,
        y: playerPosRef.current.y,
        rotation: playerPosRef.current.vx * 0.04,
      })
      
      if (playerRef.current) {
        playerRef.current.classList.toggle('thrusting', keysRef.current.w || keysRef.current.arrowup)
      }

      scoreRef.current += delta * (timeWarpActive ? 48 : 18)
      const displayedScore = Math.floor(scoreRef.current)
      if (lastScoreRef.current !== displayedScore) {
        lastScoreRef.current = displayedScore
        setScore(displayedScore)
      }

      updateEra()

      const era = eraIndex
      obstaclesRef.current.forEach((obs, idx) => {
        const element = obstacleRefs.current[idx]
        if (!element) return
        const baseSpeed = era === 0 ? 70 : era === 1 ? 170 : era === 2 ? 130 : 190
        obs.y += (baseSpeed + obs.speedOffset) * delta

        if (era === 3 && Math.random() < delta * 0.6) {
          obs.lane = Math.max(0, Math.min(laneCount - 1, obs.lane + (Math.random() > 0.5 ? 1 : -1)))
        }

        if (obs.y > board.height + obs.size) {
          obs.y = -obs.size - Math.random() * board.height * 0.3
          obs.lane = Math.floor(Math.random() * laneCount)
          obs.size = era === 0 ? 42 : era === 1 ? 34 : era === 2 ? 30 : 36
          obs.speedOffset = Math.random() * 120
          obs.type = ['asteroid', 'comet', 'debris'][Math.floor(Math.random() * 3)]
        }

        gsap.set(element, {
          x: lanePositionsRef.current[obs.lane],
          y: obs.y,
          rotation: obs.rotation,
        })

        const playerRect = playerRef.current.getBoundingClientRect()
        const obstacleRect = element.getBoundingClientRect()
        const collision = !(playerRect.right < obstacleRect.left || playerRect.left > obstacleRect.right || playerRect.bottom < obstacleRect.top || playerRect.top > obstacleRect.bottom)
        if (collision) {
          setGameActive(false)
          setGameHint('Protocol interrupted! Restart to continue your journey.')
          hideRocket()
        }
      })

      const playerRect = playerRef.current.getBoundingClientRect()
      updateCollectibles(board, delta, playerRect)
      animationFrameRef.current = requestAnimationFrame(update)
    }

    const handleKeyDown = (event) => {
      if (!gameActive) return
      const key = event.key.toLowerCase()
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) {
        event.preventDefault()
        keysRef.current[key] = true
      }
    }

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase()
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) keysRef.current[key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    animationFrameRef.current = requestAnimationFrame(update)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      if (warpTimeoutRef.current) {
        window.clearTimeout(warpTimeoutRef.current)
        warpTimeoutRef.current = null
      }
    }
  }, [gameActive, eraIndex, timeWarpActive])

  const createObstacles = (board) => {
    const obstacleTypes = ['asteroid', 'comet', 'debris']
    const generated = Array.from({ length: 7 }, () => ({
      lane: Math.floor(Math.random() * laneCount),
      y: Math.random() * board.height * -1,
      size: 28 + Math.random() * 18,
      speedOffset: Math.random() * 120,
      rotation: Math.random() * 360,
      type: obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)],
    }))
    obstaclesRef.current = generated
    setObstacles(generated)

    const collectibles = Array.from({ length: 3 }, () => ({
      lane: Math.floor(Math.random() * laneCount),
      y: Math.random() * board.height * -0.8 - 120,
      id: Math.random().toString(36).slice(2),
    }))
    collectibleDefsRef.current = collectibles
  }

  const beginGame = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (isGameStartingRef.current) return
    isGameStartingRef.current = true
    
    cleanupGame()
    hideRocket()
    
    setTimeout(() => {
      scrollToGame()
    }, 100)
    
    setTimeout(() => {
      setScore(0)
      scoreRef.current = 0
      lastScoreRef.current = 0
      keysRef.current = { w: false, a: false, s: false, d: false }
      setFuelCells(0)
      setTimeWarpActive(false)
      setEraIndex(0)
      setGameHint('Launch sequence start — dodge asteroids and collect fuel cells.')
      setGameActive(true)

      if (gameRef.current) {
        const board = gameRef.current.getBoundingClientRect()
        createObstacles(board)
        lanePositionsRef.current = Array.from({ length: laneCount }, (_, index) => board.width / laneCount * (index + 0.5) - 22)
        if (playerRef.current) {
          playerInitializedRef.current = true
          playerPosRef.current = {
            x: board.width / 2 - 26,
            y: board.height - 124,
            vx: 0,
            vy: 0,
          }
          gsap.set(playerRef.current, {
            x: playerPosRef.current.x,
            y: playerPosRef.current.y,
            rotation: 0,
            scale: 1,
          })
        }
        obstaclesRef.current.forEach((obs, idx) => {
          const el = obstacleRefs.current[idx]
          if (el) gsap.set(el, { x: lanePositionsRef.current[obs.lane], y: obs.y, rotation: obs.rotation })
        })
        collectibleDefsRef.current.forEach((item, idx) => {
          const el = collectibleRefs.current[idx]
          if (el) gsap.set(el, { x: lanePositionsRef.current[item.lane], y: item.y })
        })
      }
      
      isGameStartingRef.current = false
    }, 300)
  }

  const resetGame = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (isResettingRef.current) return
    isResettingRef.current = true
    
    cleanupGame()
    setGameActive(false)
    setGameHint('Use W to thrust and A / D to steer the rocket.')
    showRocket()
    
    setTimeout(() => {
      scrollToGame()
    }, 100)
    
    setTimeout(() => {
      if (gameRef.current) {
        const board = gameRef.current.getBoundingClientRect()
        lanePositionsRef.current = Array.from({ length: laneCount }, (_, index) => board.width / laneCount * (index + 0.5) - 22)
        
        if (playerRef.current) {
          playerInitializedRef.current = true
          playerPosRef.current = {
            x: board.width / 2 - 26,
            y: board.height - 124,
            vx: 0,
            vy: 0,
          }
          gsap.set(playerRef.current, {
            x: playerPosRef.current.x,
            y: playerPosRef.current.y,
            rotation: 0,
            scale: 1,
          })
          playerRef.current.classList.remove('thrusting')
        }
        
        createObstacles(board)
        
        obstaclesRef.current.forEach((obs, idx) => {
          const el = obstacleRefs.current[idx]
          if (el) gsap.set(el, { x: lanePositionsRef.current[obs.lane], y: obs.y, rotation: obs.rotation })
        })
        
        collectibleDefsRef.current.forEach((item, idx) => {
          const el = collectibleRefs.current[idx]
          if (el) gsap.set(el, { x: lanePositionsRef.current[item.lane], y: item.y })
        })
      }
      
      isResettingRef.current = false
    }, 300)
  }

  return (
    <div className="App" ref={appRef}>
      <div className="custom-cursor" ref={cursorRef} />
      <div className="page-rocket" ref={pageRocketRef} aria-hidden="true">
        <div className="page-rocket__body">
          <span className="page-rocket__window" />
          <span className="page-rocket__fin page-rocket__fin--left" />
          <span className="page-rocket__fin page-rocket__fin--right" />
        </div>
        <span className="page-rocket__trail" />
      </div>
      <div className="hero">
        <div className="hero-background">
          <div className="orbit orbit--outer" />
          <div className="orbit orbit--inner" />
          <div className="pulse pulse--left" />
          <div className="pulse pulse--right" />
        </div>

        <div className="hero-grid">
          <aside className="sidebar">
            <div className="sidebar-chip">📡 56k modem (1992)</div>
            <div className="sidebar-chip">🖥️ Static pages (1994)</div>
            <div className="sidebar-chip">💾 Shareware culture (1990s)</div>
          </aside>

          <div className="page-shell">
            <div className="window-shell">
              <div className="chrome-bar">
                <div className="buttons">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="address">🌐 https://evolutionoftheinternet.com</div>
              </div>
              <div className="window-body">
                <div className="scene web1">
                  <span className="era-pill">📘 WEB 1.0 · 1990–2004</span>
                  <h1>The Dial-Up Gateway</h1>
                  <p>
                    Pixel fonts, clickable GIFs, and the first browser windows that
                    felt alive. The Internet was a digital library — static, 
                    informative, and revolutionary.
                  </p>
                  <div className="window-panel">
                    <div className="url-bar">📶 Loading page: 97% • 14.4kbps</div>
                    <div className="link-grid">
                      <span>🏠 Welcome</span>
                      <span>📝 Guestbook</span>
                      <span>🚧 Under Construction</span>
                    </div>
                  </div>
                  <div className="trivia-badge">
                    <span>💡 Did you know? The first website went live in 1991!</span>
                  </div>
                </div>

                <div className="scene web2">
                  <span className="era-pill">💬 WEB 2.0 · 2004–2010</span>
                  <h1>Finish the sentence:</h1>
                  <p>
                    Social feeds, friends, and the page that grows as you scroll.
                    The Internet became a conversation — interactive, collaborative,
                    and community-driven.
                  </p>
                  <div className="spark-grid">
                    <span className="spark" />
                    <span className="spark" />
                    <span className="spark" />
                  </div>
                  <div className="social-row">
                    <div className="bubble" />
                    <div className="bubble" />
                    <div className="bubble" />
                  </div>
                  <div className="metrics">
                    <span className="tag">👍 Likes (2006)</span>
                    <span className="tag">🔄 Shares (2007)</span>
                    <span className="tag">😎 Memes (2008)</span>
                  </div>
                  <div className="trivia-badge">
                    <span>💡 Facebook launched in 2004, YouTube in 2005!</span>
                  </div>

                  <div className="logo-grid">
                    <div className="logo-chip html">
                      <svg viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#e34f26" d="M8 4h32l-3.2 36.3L24 44l-12.8-3.7z" />
                        <path fill="#ef652a" d="M24 41.5l10.3-2.9L34 8H24z" />
                        <path fill="#fff" d="M24 21.6h5.6l.4-4.7H24v-4.7h10.2l-.1 1.1-1 11.1H24zm0 12.3l.1-.1 7.4-2.1.5-5.9H24v-4.7h8.4l-.1 1.1-1 11.1L24 33.9z" />
                      </svg>
                      <span>HTML5 (2008)</span>
                    </div>
                    <div className="logo-chip css">
                      <svg viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#1572b6" d="M8 4h32l-3.2 36.3L24 44l-12.8-3.7z" />
                        <path fill="#33a9dc" d="M24 41.5l10.3-2.9L34 8H24z" />
                        <path fill="#fff" d="M24 21.6h10.1l-.9 10.2L24 33.9l-9.2-1.1-.6-6.9h4.1l.3 3.3 5.4 1.4 5.4-1.4.5-5.5H24z" />
                      </svg>
                      <span>CSS3 (2009)</span>
                    </div>
                    <div className="logo-chip js">
                      <svg viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#f7df1e" d="M8 4h32l-3.2 36.3L24 44l-12.8-3.7z" />
                        <path fill="#000" d="M24 18.5h5.7v10.2l3.8 1.1.7-2.5-3.6-1.1V18.5H24zm-8.5 0h5.7v2.6h-3v1.8h2.4v2.6H18v4.1h-2.5v-7z" />
                      </svg>
                      <span>JavaScript (1995)</span>
                    </div>
                    <div className="logo-chip react">
                      <svg viewBox="0 0 64 64" aria-hidden="true">
                        <circle cx="32" cy="32" r="6" fill="#61dafb" />
                        <g fill="none" stroke="#61dafb" strokeWidth="4">
                          <ellipse cx="32" cy="32" rx="20" ry="6" />
                          <ellipse cx="32" cy="32" rx="6" ry="20" transform="rotate(60 32 32)" />
                          <ellipse cx="32" cy="32" rx="6" ry="20" transform="rotate(-60 32 32)" />
                        </g>
                      </svg>
                      <span>React (2013)</span>
                    </div>
                    <div className="logo-chip node">
                      <svg viewBox="0 0 64 64" aria-hidden="true">
                        <polygon points="32 6 54 18 54 46 32 58 10 46 10 18" fill="#83cd29" />
                        <path d="M24 21h16v22H24z" fill="#fff" opacity="0.18" />
                        <text x="32" y="39" textAnchor="middle" fill="#0b0b0b" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">node</text>
                      </svg>
                      <span>Node.js (2009)</span>
                    </div>
                    <div className="logo-chip ai">
                      <svg viewBox="0 0 64 64" aria-hidden="true">
                        <circle cx="32" cy="32" r="18" fill="#ff73f6" opacity="0.9" />
                        <circle cx="24" cy="26" r="4" fill="#fff" />
                        <circle cx="40" cy="26" r="4" fill="#fff" />
                        <path d="M24 40c2-3 8-3 8-3s6 0 8 3" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      <span>AI (2022)</span>
                    </div>
                  </div>
                </div>

                <div className="scene mobile">
                  <span className="era-pill">📱 MOBILE ERA · 2010–2022</span>
                  <h1>Tap, swipe, launch</h1>
                  <p>
                    The web became a pocket universe with motion, gestures, and
                    liquid layouts. Smartphones redefined how we connect — 
                    responsive, accessible, and always on.
                  </p>
                  <div className="device">
                    <div className="screen-grid">
                      <div className="pill" />
                      <div className="pill" />
                      <div className="pill" />
                      <div className="pill" />
                    </div>
                  </div>
                  <div className="trivia-badge">
                    <span>📱 The first iPhone launched in 2007, App Store in 2008!</span>
                  </div>
                </div>

                <div className="scene ai">
                  <span className="era-pill">🤖 AI ERA · 2022–Present</span>
                  <h1 ref={aiHeadingRef}>The page now thinks for itself</h1>
                  <p>
                    Dynamic stories, smart layers, and immersive code that evolves
                    with every scroll. AI is transforming the web from static 
                    to intelligent, adaptive experiences.
                  </p>
                  <div className="neon-grid">
                    <div className="neon-node" />
                    <div className="neon-node" />
                    <div className="neon-node" />
                    <div className="neon-node" />
                  </div>
                  <div className="trivia-badge">
                    <span>🧠 ChatGPT launched in 2022, marking a new era of AI!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="browser-mock">
              <div className="shape shape--square" />
              <div className="shape shape--circle" />
              <div className="shape shape--triangle" />
              <div className="shape shape--pill" />
            </div>
          </div>
        </div>

        <div className="hero-footer">
          <span>✨ Scroll to morph the page through time · 1990 → Present</span>
        </div>
      </div>

      <section className="timeline-section">
        <div className="timeline-intro">
          <span>⏳ Evolution of the Internet</span>
          <h2>From static pages to connected worlds</h2>
          <p>
            Experience the next chapter in the evolution theme with a 3D network
            object and timeline cards that animate into view. Each era brought 
            new technologies, new ways to connect, and new possibilities.
          </p>
        </div>

        <div className="timeline-marquee">
          <div className="marquee-track">
            <div className="marquee-group">
              <div className="marquee-item">
                <h3>📘 WEB 1.0 · 1990–2004</h3>
                <p>Slow dial-up, basic HTML, and the first digital footprints. The Internet as a library.</p>
                <span className="marquee-year">1991: First website</span>
              </div>
              <div className="marquee-item">
                <h3>💬 WEB 2.0 · 2004–2010</h3>
                <p>Communities, social sharing, and the rise of dynamic content. The Internet as a conversation.</p>
                <span className="marquee-year">2004: Facebook, 2005: YouTube</span>
              </div>
              <div className="marquee-item">
                <h3>📱 MOBILE ERA · 2010–2022</h3>
                <p>Responsive flows, touch interfaces, and the network in your pocket. The Internet everywhere.</p>
                <span className="marquee-year">2007: First iPhone</span>
              </div>
              <div className="marquee-item">
                <h3>🤖 AI FUTURE · 2022–Present</h3>
                <p>Intelligent web layers, adaptive experiences, and immersive interaction. The Internet that thinks.</p>
                <span className="marquee-year">2022: ChatGPT launches</span>
              </div>
            </div>
            <div className="marquee-group" aria-hidden="true">
              <div className="marquee-item">
                <h3>📘 WEB 1.0 · 1990–2004</h3>
                <p>Slow dial-up, basic HTML, and the first digital footprints. The Internet as a library.</p>
                <span className="marquee-year">1991: First website</span>
              </div>
              <div className="marquee-item">
                <h3>💬 WEB 2.0 · 2004–2010</h3>
                <p>Communities, social sharing, and the rise of dynamic content. The Internet as a conversation.</p>
                <span className="marquee-year">2004: Facebook, 2005: YouTube</span>
              </div>
              <div className="marquee-item">
                <h3>📱 MOBILE ERA · 2010–2022</h3>
                <p>Responsive flows, touch interfaces, and the network in your pocket. The Internet everywhere.</p>
                <span className="marquee-year">2007: First iPhone</span>
              </div>
              <div className="marquee-item">
                <h3>🤖 AI FUTURE · 2022–Present</h3>
                <p>Intelligent web layers, adaptive experiences, and immersive interaction. The Internet that thinks.</p>
                <span className="marquee-year">2022: ChatGPT launches</span>
              </div>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="three-fallback">Loading globe...</div>}>
          <GlobeScene />
        </Suspense>
      </section>

      <section 
        className="game-section" 
        ref={gameSectionRef}
        tabIndex={-1}
      >
        <div className="game-panel">
          <div className="game-heading">
            <div>
              <span className="game-label">🚀 Space Command</span>
              <h2>Rocket Run</h2>
              <p className="game-subtitle">{gameHint}</p>
            </div>
            <div className="game-actions">
              <button 
                type="button" 
                onClick={beginGame} 
                className="game-button"
              >
                {gameActive ? '🔄 Restart Sprint' : '🚀 Start Sprint'}
              </button>
              <button 
                type="button" 
                onClick={resetGame} 
                className="game-button game-button--ghost"
              >
                ↩️ Reset
              </button>
            </div>
          </div>

          <div className="game-board" ref={gameRef} tabIndex={0}>
            <div className="game-control-strip" aria-hidden="true">
              <span><b>W</b> ⬆️ Thrust</span>
              <span><b>A</b> ⬅️ Left</span>
              <span><b>D</b> ➡️ Right</span>
            </div>
            {Array.from({ length: laneCount }, (_, lane) => (
              <div key={lane} className="game-lane" style={{ left: `${(100 / laneCount) * lane}%`, width: `${100 / laneCount}%` }} />
            ))}
            <div className="game-player" ref={playerRef}>
              <span className="rocket-window" />
              <span className="rocket-fin rocket-fin--left" />
              <span className="rocket-fin rocket-fin--right" />
              <span className="rocket-core-glow" />
              <span className="rocket-exhaust rocket-exhaust--outer" />
              <span className="rocket-exhaust rocket-exhaust--inner" />
              <span className="rocket-flame" />
            </div>
            {obstacles.map((obs, index) => (
              <div
                key={index}
                className={`game-obstacle game-obstacle--${obs.type}`}
                ref={(el) => {
                  obstacleRefs.current[index] = el
                }}
                style={{ width: `${obs.size}px`, height: `${obs.size}px` }}
              />
            ))}
            {collectibleDefsRef.current.map((item, index) => (
              <div
                key={item.id}
                className="game-collectible"
                ref={(el) => {
                  collectibleRefs.current[index] = el
                }}
              />
            ))}
            <div className="game-status">
              <span>🌌 {eras[eraIndex]}</span>
              <span>⭐ Score: {score}</span>
              <span>⚡ Fuel Cells: {fuelCells}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rocket Landing Section */}
      <section className="rocket-landing-section">
        <div className="rocket-landing-content">
          <div className="landing-rocket-container">
            <div className="landing-rocket">
              <div className="landing-rocket__body">
                <span className="landing-rocket__window" />
                <span className="landing-rocket__fin landing-rocket__fin--left" />
                <span className="landing-rocket__fin landing-rocket__fin--right" />
                <span className="landing-rocket__flame" />
              </div>
              <div className="landing-particles">
                <span className="particle particle--1" />
                <span className="particle particle--2" />
                <span className="particle particle--3" />
                <span className="particle particle--4" />
                <span className="particle particle--5" />
              </div>
            </div>
          </div>
          <div className="landing-text">
            <h2>🌐 Mission Complete</h2>
            <p>Your journey through the evolution of the web has landed safely. 
            From dial-up to AI, the Internet continues to transform how we live, 
            work, and connect.</p>
            <div className="landing-stats">
              <span>📘 Web 1.0 (1990)</span>
              <span>💬 Web 2.0 (2004)</span>
              <span>📱 Mobile (2010)</span>
              <span>🤖 AI Era (2022)</span>
            </div>
          </div>
        </div>
        <footer className="landing-footer">
          <div className="footer-content">
            <span className="footer-copyright">
              © {new Date().getFullYear()} Charles Pura. All rights reserved.
            </span>
            <span className="footer-tagline">🚀 Built with ❤️ for the future of the web</span>
            <div className="footer-links">
              <a href="https://github.com/charlespura/EvolutionoftheInternet" className="footer-link">📦 GitHub</a>
              <a href="https://www.linkedin.com/in/charlespura/" className="footer-link">💼 LinkedIn</a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  )
}

export default App