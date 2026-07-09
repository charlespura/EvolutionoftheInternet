import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import './App.css'

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
    }, appRef)

    const moveCursor = (event) => {
      const cursor = cursorRef.current
      if (!cursor) return
      cursor.style.left = `${event.clientX}px`
      cursor.style.top = `${event.clientY}px`
    }

    window.addEventListener('mousemove', moveCursor)

    return () => {
      ctx.revert()
      window.removeEventListener('mousemove', moveCursor)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
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

      <div className="scroll-space" />
    </div>
  )
}

export default App
