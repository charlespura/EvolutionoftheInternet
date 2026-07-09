import { Suspense, useEffect, useRef, lazy } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import './App.css'

const GlobeScene = lazy(() => import('./GlobeScene'))

function App() {
  const appRef = useRef(null)
  const cursorRef = useRef(null)

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
      if (appRef.current?.__cleanupThree) {
        appRef.current.__cleanupThree()
      }
    }
  }, [])

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

      {/* <div className="scroll-space" /> */}
    </div>
  )
}

export default App
