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
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [gameHint, setGameHint] = useState('Use W to thrust and A / D to steer the rocket.')
  const [eraIndex, setEraIndex] = useState(0)
  const [timeWarpActive, setTimeWarpActive] = useState(false)
  const [fuelCells, setFuelCells] = useState(0)
  const [obstacles, setObstacles] = useState([])
  const gameRef = useRef(null)
  const playerRef = useRef(null)
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
  const animationFrameRef = useRef(null)
  const lastFrameRef = useRef(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Flip)

    const ctx = gsap.context(() => {
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
    }, appRef)

    // Marquee magnetic interaction (secret-sauce): responsive hover scaling
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
        '.page-shell, .sidebar-chip, .chrome-bar, .browser-mock, .hero-footer',
      )

      cursor.style.left = `${event.clientX}px`
      cursor.style.top = `${event.clientY}px`
      cursor.style.transform = hoverTarget
        ? 'translate(-50%, -50%) scale(1.45)'
        : 'translate(-50%, -50%) scale(1)'
      cursor.style.background = hoverTarget ? 'rgba(255, 255, 255, 0.16)' : 'transparent'
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
  }, [])

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

  useEffect(() => {
    const update = (time) => {
      if (!gameRef.current || !playerRef.current) {
        animationFrameRef.current = requestAnimationFrame(update)
        return
      }

      if (!gameActive) {
        lastFrameRef.current = time
        animationFrameRef.current = requestAnimationFrame(update)
        return
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
      const minY = -120
      const maxY = board.height - 80
      playerPosRef.current.x = gsap.utils.clamp(minX, maxX, playerPosRef.current.x)
      playerPosRef.current.y = gsap.utils.clamp(minY, maxY, playerPosRef.current.y)

      gsap.set(playerRef.current, {
        x: playerPosRef.current.x,
        y: playerPosRef.current.y,
        rotation: playerPosRef.current.vx * 0.04,
      })
      playerRef.current.classList.toggle('thrusting', keysRef.current.w || keysRef.current.arrowup)

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
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (warpTimeoutRef.current) window.clearTimeout(warpTimeoutRef.current)
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

  const beginGame = () => {
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
  }

  const resetGame = () => {
    setGameActive(false)
    setScore(0)
    scoreRef.current = 0
    lastScoreRef.current = 0
    boostRef.current = false
    setFuelCells(0)
    setTimeWarpActive(false)
    setEraIndex(0)
    setGameHint('Use W to thrust and A / D to steer the rocket.')

    if (gameRef.current) {
      const board = gameRef.current.getBoundingClientRect()
      lanePositionsRef.current = Array.from({ length: laneCount }, (_, index) => board.width / laneCount * (index + 0.5) - 22)
      if (playerRef.current) {
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
  }

  return (
    <div className="App" ref={appRef}>
      <div className="custom-cursor" ref={cursorRef} />
      <div className="hero">
        <div className="hero-background">
          <div className="orbit orbit--outer" />
          <div className="orbit orbit--inner" />
          <div className="pulse pulse--left" />
          <div className="pulse pulse--right" />
        </div>

        <div className="hero-grid">
          <aside className="sidebar">
            <div className="sidebar-chip">56k modem</div>
            <div className="sidebar-chip">static pages</div>
            <div className="sidebar-chip">shareware culture</div>
          </aside>

          <div className="page-shell">
            <div className="window-shell">
              <div className="chrome-bar">
                <div className="buttons">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="address">http://retro-net.local</div>
              </div>
              <div className="window-body">
                <div className="scene web1">
                  <span className="era-pill">WEB 1.0</span>
                  <h1>Dial-up gateway</h1>
                  <p>
                    Pixel fonts, clickable GIFs, and the first browser windows that
                    felt alive.
                  </p>
                  <div className="window-panel">
                    <div className="url-bar">Load page: 97%</div>
                    <div className="link-grid">
                      <span>Welcome</span>
                      <span>Guestbook</span>
                      <span>Under Construction</span>
                    </div>
                  </div>
                </div>

                <div className="scene web2">
                  <span className="era-pill">WEB 2.0</span>
                  <h1>Finish the sentence:</h1>
                  <p>
                    Social feeds, friends, and the page that grows as you scroll.
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
                    <span className="tag">Likes</span>
                    <span className="tag">Shares</span>
                    <span className="tag">Memes</span>
                  </div>

                  <div className="logo-grid">
                    <div className="logo-chip html">
                      <svg viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#e34f26" d="M8 4h32l-3.2 36.3L24 44l-12.8-3.7z" />
                        <path fill="#ef652a" d="M24 41.5l10.3-2.9L34 8H24z" />
                        <path fill="#fff" d="M24 21.6h5.6l.4-4.7H24v-4.7h10.2l-.1 1.1-1 11.1H24zm0 12.3l.1-.1 7.4-2.1.5-5.9H24v-4.7h8.4l-.1 1.1-1 11.1L24 33.9z" />
                      </svg>
                      <span>HTML</span>
                    </div>
                    <div className="logo-chip css">
                      <svg viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#1572b6" d="M8 4h32l-3.2 36.3L24 44l-12.8-3.7z" />
                        <path fill="#33a9dc" d="M24 41.5l10.3-2.9L34 8H24z" />
                        <path fill="#fff" d="M24 21.6h10.1l-.9 10.2L24 33.9l-9.2-1.1-.6-6.9h4.1l.3 3.3 5.4 1.4 5.4-1.4.5-5.5H24z" />
                      </svg>
                      <span>CSS</span>
                    </div>
                    <div className="logo-chip js">
                      <svg viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#f7df1e" d="M8 4h32l-3.2 36.3L24 44l-12.8-3.7z" />
                        <path fill="#000" d="M24 18.5h5.7v10.2l3.8 1.1.7-2.5-3.6-1.1V18.5H24zm-8.5 0h5.7v2.6h-3v1.8h2.4v2.6H18v4.1h-2.5v-7z" />
                      </svg>
                      <span>JS</span>
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
                      <span>React</span>
                    </div>
                    <div className="logo-chip node">
                      <svg viewBox="0 0 64 64" aria-hidden="true">
                        <polygon points="32 6 54 18 54 46 32 58 10 46 10 18" fill="#83cd29" />
                        <path d="M24 21h16v22H24z" fill="#fff" opacity="0.18" />
                        <text x="32" y="39" textAnchor="middle" fill="#0b0b0b" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">node</text>
                      </svg>
                      <span>Node</span>
                    </div>
                    <div className="logo-chip ai">
                      <svg viewBox="0 0 64 64" aria-hidden="true">
                        <circle cx="32" cy="32" r="18" fill="#ff73f6" opacity="0.9" />
                        <circle cx="24" cy="26" r="4" fill="#fff" />
                        <circle cx="40" cy="26" r="4" fill="#fff" />
                        <path d="M24 40c2-3 8-3 8-3s6 0 8 3" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      <span>AI</span>
                    </div>
                  </div>
                </div>

                <div className="scene mobile">
                  <span className="era-pill">MOBILE ERA</span>
                  <h1>Tap, swipe, launch</h1>
                  <p>
                    The web became a pocket universe with motion, gestures, and
                    liquid layouts.
                  </p>
                  <div className="device">
                    <div className="screen-grid">
                      <div className="pill" />
                      <div className="pill" />
                      <div className="pill" />
                      <div className="pill" />
                    </div>
                  </div>
                </div>

                <div className="scene ai">
                  <span className="era-pill">AI ERA</span>
                  <h1>The page now thinks for itself</h1>
                  <p>
                    Dynamic stories, smart layers, and immersive code that evolves
                    with every scroll.
                  </p>
                  <div className="neon-grid">
                    <div className="neon-node" />
                    <div className="neon-node" />
                    <div className="neon-node" />
                    <div className="neon-node" />
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
          <span>Scroll to morph the page through time</span>
        </div>
      </div>

      <section className="timeline-section">
        <div className="timeline-intro">
          <span>Evolution of the Internet</span>
          <h2>From static pages to connected worlds</h2>
          <p>
            Experience the next chapter in the evolution theme with a 3D network
            object and timeline cards that animate into view.
          </p>
        </div>

        <div className="timeline-marquee">
          <div className="marquee-track">
            <div className="marquee-group">
              <div className="marquee-item">
                <h3>WEB 1.0</h3>
                <p>Slow dial-up, basic HTML, and the first digital footprints.</p>
              </div>
              <div className="marquee-item">
                <h3>WEB 2.0</h3>
                <p>Communities, social sharing, and the rise of dynamic content.</p>
              </div>
              <div className="marquee-item">
                <h3>MOBILE ERA</h3>
                <p>Responsive flows, touch interfaces, and the network in your pocket.</p>
              </div>
              <div className="marquee-item">
                <h3>AI FUTURE</h3>
                <p>Intelligent web layers, adaptive experiences, and immersive interaction.</p>
              </div>
            </div>
            <div className="marquee-group" aria-hidden="true">
              <div className="marquee-item">
                <h3>WEB 1.0</h3>
                <p>Slow dial-up, basic HTML, and the first digital footprints.</p>
              </div>
              <div className="marquee-item">
                <h3>WEB 2.0</h3>
                <p>Communities, social sharing, and the rise of dynamic content.</p>
              </div>
              <div className="marquee-item">
                <h3>MOBILE ERA</h3>
                <p>Responsive flows, touch interfaces, and the network in your pocket.</p>
              </div>
              <div className="marquee-item">
                <h3>AI FUTURE</h3>
                <p>Intelligent web layers, adaptive experiences, and immersive interaction.</p>
              </div>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="three-fallback">Loading globe...</div>}>
          <GlobeScene />
        </Suspense>
      </section>

      <section className="game-section">
        <div className="game-panel">
          <div className="game-heading">
            <div>
              <span className="game-label">Space Command</span>
              <h2>Rocket Run</h2>
              <p className="game-subtitle">{gameHint}</p>
            </div>
            <div className="game-actions">
              <button type="button" onClick={beginGame} className="game-button">
                {gameActive ? 'Restart Sprint' : 'Start Sprint'}
              </button>
              <button type="button" onClick={resetGame} className="game-button game-button--ghost">
                Reset
              </button>
            </div>
          </div>

          <div className="game-board" ref={gameRef} tabIndex={0}>
            <div className="game-control-strip" aria-hidden="true">
              <span><b>W</b> Thrust</span>
              <span><b>A</b> Left</span>
              <span><b>D</b> Right</span>
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
              <span>{eras[eraIndex]}</span>
              <span>Score: {score}</span>
              <span>Fuel Cells: {fuelCells}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="scroll-space" />
    </div>
  )
}

export default App
