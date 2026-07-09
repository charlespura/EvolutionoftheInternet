import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

export default function GlobeScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 13)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    // ensure the WebGL canvas is transparent so the page background shows through
    renderer.setClearColor(0x000000, 0)
    renderer.setClearAlpha(0)
    if (renderer.domElement && renderer.domElement.style) {
      renderer.domElement.style.background = 'transparent'
    }
    if (canvas && canvas.style) canvas.style.background = 'transparent'

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.76)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x7a8cff, 1.4, 80)
    pointLight.position.set(12, 14, 10)
    scene.add(pointLight)

    const createEarthCanvas = () => {
      const size = 1024
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) return canvas

      const oceanGradient = ctx.createLinearGradient(0, 0, 0, size)
      oceanGradient.addColorStop(0, '#0b1d3c')
      oceanGradient.addColorStop(1, '#102d5f')
      ctx.fillStyle = oceanGradient
      ctx.fillRect(0, 0, size, size)

      ctx.fillStyle = 'rgba(37, 120, 192, 0.35)'
      ctx.beginPath()
      ctx.ellipse(size * 0.45, size * 0.38, size * 0.12, size * 0.08, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(size * 0.70, size * 0.52, size * 0.08, size * 0.05, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(size * 0.24, size * 0.60, size * 0.14, size * 0.09, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalAlpha = 0.9
      ctx.fillStyle = '#c3d8ff'
      ctx.beginPath()
      ctx.moveTo(size * 0.34, size * 0.30)
      ctx.bezierCurveTo(size * 0.30, size * 0.35, size * 0.36, size * 0.42, size * 0.42, size * 0.38)
      ctx.bezierCurveTo(size * 0.48, size * 0.34, size * 0.54, size * 0.46, size * 0.50, size * 0.54)
      ctx.bezierCurveTo(size * 0.44, size * 0.62, size * 0.34, size * 0.58, size * 0.31, size * 0.50)
      ctx.closePath()
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(size * 0.60, size * 0.60)
      ctx.bezierCurveTo(size * 0.66, size * 0.58, size * 0.72, size * 0.64, size * 0.74, size * 0.72)
      ctx.bezierCurveTo(size * 0.76, size * 0.80, size * 0.70, size * 0.84, size * 0.64, size * 0.80)
      ctx.bezierCurveTo(size * 0.58, size * 0.76, size * 0.56, size * 0.70, size * 0.60, size * 0.60)
      ctx.closePath()
      ctx.fill()

      ctx.globalAlpha = 0.1
      ctx.strokeStyle = '#a9c5ff'
      ctx.lineWidth = 2
      for (let i = 0; i < 6; i += 1) {
        const y = size * 0.18 + (i * size) / 7
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(size, y)
        ctx.stroke()
      }
      for (let i = 0; i < 8; i += 1) {
        const x = size * 0.12 + (i * size) / 9
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, size)
        ctx.stroke()
      }

      return canvas
    }

    const globeGeometry = new THREE.SphereGeometry(3.4, 64, 64)
    const earthTexture = new THREE.CanvasTexture(createEarthCanvas())
    earthTexture.needsUpdate = true
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.76,
      metalness: 0.08,
      emissive: 0x0a1632,
      emissiveIntensity: 0.18,
      envMapIntensity: 0.9,
    })
    const globe = new THREE.Mesh(globeGeometry, globeMaterial)
    scene.add(globe)

    const lineGeometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(3.42, 32, 32))
    const gridLines = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({ color: 0x8db8ff, transparent: true, opacity: 0.14 }),
    )
    scene.add(gridLines)

    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(4.4, 0.025, 16, 120),
      new THREE.MeshBasicMaterial({ color: 0x8db8ff, transparent: true, opacity: 0.12 }),
    )
    orbitRing.rotation.x = Math.PI / 3.4
    scene.add(orbitRing)

    const logoLabels = [
      {
        text: 'HTML',
        lat: 22,
        lon: 12,
        scale: 1.1,
        svg: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" rx="40" fill="#e34f26" />
            <path fill="#fff" d="M73 76h42l4-46 42 0 4 46h42l-10 110-78 22-78-22z" opacity="0.12" />
            <path fill="#fff" d="M128 172l62-17 8-89H128v106z" opacity="0.16" />
            <path fill="#fff" d="M90 110h18v26h30v-26h18v60l-34 10-34-10z" />
          </svg>
        `,
      },
      {
        text: 'THTML',
        lat: 10,
        lon: -22,
        scale: 1,
        svg: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" rx="40" fill="#ff6a00" />
            <path fill="#fff" d="M80 76h96v20H80zM80 114h96v20H80zM80 152h96v20H80z" opacity="0.9" />
            <text x="128" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="44" font-weight="800" fill="#0b0b0b">T</text>
          </svg>
        `,
      },
      {
        text: 'CSS',
        lat: -6,
        lon: 56,
        scale: 1,
        svg: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" rx="40" fill="#1572b6" />
            <path fill="#33a9dc" d="M76 80h42l4-46 42 0 4 46h42l-10 110-78 22-78-22z" opacity="0.16" />
            <path fill="#fff" d="M128 172l62-17 8-89H128v106z" opacity="0.12" />
            <path fill="#fff" d="M98 108h60l-4 44-26 7-26-7-2-23h30v-16H98z" />
          </svg>
        `,
      },
      {
        text: 'JS',
        lat: 38,
        lon: -76,
        scale: 1.1,
        svg: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" rx="40" fill="#f7df1e" />
            <path d="M80 80h22v94h-22zM154 95c-6 0-10 3-10 9 0 5 3 8 8 10l12 4c8 2 12 6 12 13 0 8-6 13-15 13-9 0-15-4-18-9l-21 11c6 12 18 21 40 21 23 0 38-12 38-30 0-14-9-22-23-26l-9-3c-2-1-3-2-3-4 0-2 1-3 3-4 3-1 8-2 14-2 11 0 19 3 23 8l18-15c-7-10-18-16-41-16z" fill="#000" />
          </svg>
        `,
      },
      {
        text: 'React',
        lat: 12,
        lon: -34,
        scale: 1,
        svg: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" rx="40" fill="#61dafb" />
            <circle cx="128" cy="128" r="24" fill="#fff" />
            <g fill="none" stroke="#fff" stroke-width="16">
              <ellipse cx="128" cy="128" rx="72" ry="28" />
              <ellipse cx="128" cy="128" rx="28" ry="72" transform="rotate(60 128 128)" />
              <ellipse cx="128" cy="128" rx="28" ry="72" transform="rotate(-60 128 128)" />
            </g>
          </svg>
        `,
      },
      {
        text: 'Node',
        lat: -28,
        lon: 102,
        scale: 0.95,
        svg: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" rx="40" fill="#83cd29" />
            <path d="M128 56l82 47v94l-82 47-82-47V103z" fill="#6caf1b" />
            <text x="128" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="64" font-weight="700" fill="#fff">N</text>
          </svg>
        `,
      },
      {
        text: 'AI',
        lat: 48,
        lon: 130,
        scale: 0.95,
        svg: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" rx="40" fill="#ff73f6" />
            <circle cx="128" cy="128" r="64" fill="rgba(255,255,255,0.18)" />
            <path d="M96 92h64v14H96zM96 150h64v14H96z" fill="#fff" />
            <circle cx="92" cy="128" r="10" fill="#fff" />
            <circle cx="164" cy="128" r="10" fill="#fff" />
          </svg>
        `,
      },
      {
        text: 'ChatGPT',
        lat: -20,
        lon: -38,
        scale: 1.1,
        svg: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" rx="40" fill="#10a37f" />
            <circle cx="128" cy="128" r="72" fill="rgba(255,255,255,0.16)" />
            <path d="M100 92l56 36-56 36V92z" fill="#fff" opacity="0.9" />
          </svg>
        `,
      },
      {
        text: 'Gemini',
        lat: 40,
        lon: 60,
        scale: 1,
        svg: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" rx="40" fill="#8c4cff" />
            <path d="M88 72h80v20H88zM88 132h80v20H88z" fill="#fff" />
            <path d="M104 92v72M152 92v72" stroke="#fff" stroke-width="18" stroke-linecap="round" />
          </svg>
        `,
      },
      {
        text: 'Web2',
        lat: -32,
        lon: 24,
        scale: 0.95,
        svg: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" rx="40" fill="#6e91ff" />
            <circle cx="128" cy="128" r="54" fill="rgba(255,255,255,0.18)" />
            <path d="M94 110h68v12H94zm0 24h68v12H94z" fill="#fff" />
          </svg>
        `,
      },
      {
        text: 'Mobile',
        lat: 6,
        lon: -130,
        scale: 1,
        svg: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect x="76" y="44" width="104" height="168" rx="28" fill="#ff9c3f" />
            <rect x="92" y="72" width="72" height="98" rx="14" fill="#fff" opacity="0.92" />
            <circle cx="128" cy="174" r="10" fill="#fff" opacity="0.8" />
          </svg>
        `,
      },
    ]

    const makeLogoSprite = (label) => {
      const material = new THREE.SpriteMaterial({ transparent: true, depthWrite: false, alphaTest: 0.01 })
      const sprite = new THREE.Sprite(material)
      sprite.scale.set(label.scale * 1.4, label.scale * 1.4, 1)

      if (label.svg) {
        const img = new Image()
        img.onload = () => {
          const svgTexture = new THREE.Texture(img)
          svgTexture.flipY = false
          svgTexture.needsUpdate = true
          sprite.material.map = svgTexture
          sprite.material.needsUpdate = true
        }
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(label.svg)
      }

      const glowCanvas = document.createElement('canvas')
      glowCanvas.width = 256
      glowCanvas.height = 256
      const glowCtx = glowCanvas.getContext('2d')
      if (glowCtx) {
        const gradient = glowCtx.createRadialGradient(128, 128, 32, 128, 128, 88)
        gradient.addColorStop(0, 'rgba(255,255,255,0.32)')
        gradient.addColorStop(0.28, 'rgba(255,255,255,0.10)')
        gradient.addColorStop(1, 'rgba(255,255,255,0)')
        glowCtx.fillStyle = gradient
        glowCtx.fillRect(0, 0, 256, 256)
      }
      const glowTexture = new THREE.CanvasTexture(glowCanvas)
      glowTexture.needsUpdate = true
      const glowMaterial = new THREE.SpriteMaterial({ map: glowTexture, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false })
      const glowSprite = new THREE.Sprite(glowMaterial)
      glowSprite.scale.set(label.scale * 1.6, label.scale * 1.6, 1)
      glowSprite.renderOrder = 5
      sprite.add(glowSprite)

      return sprite
    }
    const logoGroup = new THREE.Group()
    logoLabels.forEach((label) => {
      const sprite = makeLogoSprite(label)
      const phi = (90 - label.lat) * (Math.PI / 180)
      const theta = (label.lon + 180) * (Math.PI / 180)
      const radius = 4.6
      sprite.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      )
      sprite.material.depthTest = false
      logoGroup.add(sprite)
    })
    scene.add(logoGroup)

    const cloudCanvas = document.createElement('canvas')
    cloudCanvas.width = 1024
    cloudCanvas.height = 1024
    const cloudCtx = cloudCanvas.getContext('2d')
    if (cloudCtx) {
      cloudCtx.clearRect(0, 0, 1024, 1024)
      cloudCtx.fillStyle = 'rgba(255, 255, 255, 0.18)'
      const drawCloud = (x, y, w, h) => {
        cloudCtx.beginPath()
        cloudCtx.ellipse(x, y, w, h, 0, 0, Math.PI * 2)
        cloudCtx.fill()
      }
      drawCloud(420, 260, 140, 72)
      drawCloud(680, 360, 100, 56)
      drawCloud(260, 520, 130, 68)
      drawCloud(520, 620, 110, 60)
      cloudCtx.globalCompositeOperation = 'lighter'
      drawCloud(360, 360, 90, 50)
    }
    const cloudTexture = new THREE.CanvasTexture(cloudCanvas)
    cloudTexture.needsUpdate = true
    const cloudLayer = new THREE.Mesh(
      new THREE.SphereGeometry(3.46, 64, 64),
      new THREE.MeshStandardMaterial({ map: cloudTexture, transparent: true, opacity: 0.22, depthWrite: false }),
    )
    scene.add(cloudLayer)

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(3.48, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x6db8ff, transparent: true, opacity: 0.12, side: THREE.BackSide }),
    )
    scene.add(atmosphere)

    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 420
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i += 1) {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      const radius = 6.4 + Math.random() * 1.2

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xdfefff,
      size: 0.06,
      transparent: true,
      opacity: 0.35,
    })
    const particleCloud = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleCloud)

    const resize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    let isPointerDown = false
    const pointerStart = { x: 0, y: 0 }
    const currentRotation = { x: 0, y: 0 }

    const onPointerDown = (event) => {
      isPointerDown = true
      pointerStart.x = event.clientX
      pointerStart.y = event.clientY
      canvas.style.cursor = 'grabbing'
    }

    const onPointerMove = (event) => {
      if (!isPointerDown) return
      const deltaX = (event.clientX - pointerStart.x) * 0.005
      const deltaY = (event.clientY - pointerStart.y) * 0.005
      logoGroup.rotation.y = currentRotation.y + deltaX
      logoGroup.rotation.x = Math.max(-0.9, Math.min(0.9, currentRotation.x + deltaY))
    }

    const onPointerUp = () => {
      if (!isPointerDown) return
      isPointerDown = false
      currentRotation.x = logoGroup.rotation.x
      currentRotation.y = logoGroup.rotation.y
      canvas.style.cursor = 'grab'
    }

    window.addEventListener('resize', resize)
    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    canvas.style.cursor = 'grab'

    resize()

    const scrollProxy = { value: 0 }
    gsap.to(scrollProxy, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      onUpdate: () => {
        const progress = scrollProxy.value
        camera.position.z = 13 - progress * 2.8
        if (typeof knotMesh !== 'undefined' && knotMesh) {
          knotMesh.rotation.x = progress * 0.8
          knotMesh.rotation.y = progress * 2.2
        }
      },
    })

    let frameId = null
    const render = () => {
      frameId = requestAnimationFrame(render)
      if (!isPointerDown) {
        globe.rotation.y += 0.0017
        logoGroup.rotation.y += 0.0012
      }
      if (typeof knotMesh !== 'undefined' && knotMesh) {
        knotMesh.rotation.y += 0.0032
      }
      particleCloud.rotation.y -= 0.0019
      renderer.render(scene, camera)
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      cancelAnimationFrame(frameId)
      if (renderer) renderer.dispose()
      if (scene) scene.clear()
    }
  }, [])

  return (
    <div className="three-wrapper">
      <canvas className="three-canvas" ref={canvasRef} />
    </div>
  )
}
