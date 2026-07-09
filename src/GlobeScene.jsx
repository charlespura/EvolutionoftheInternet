import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

export default function GlobeScene() {
  const canvasRef = useRef(null)

const skillsData = [
    { name: 'React', desc: 'Hooks, state flow, and component architecture for building interactive UIs.', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'GSAP', desc: 'Smooth animations, scroll triggers, and timeline-based motion for engaging experiences.', img: 'https://cdn.worldvectorlogo.com/logos/framer-motion.svg' },
  
    { name: 'Three.js', desc: 'Interactive 3D scenes, cameras, and WebGL rendering for immersive visuals.', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg' },
    { name: 'Vite', desc: 'Fast local builds, hot module replacement, and lightweight bundling.', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg' },
    { name: 'Framer Motion', desc: 'React animation library for fluid interactions and page transitions.', img: 'https://cdn.worldvectorlogo.com/logos/framer-motion.svg' },
    { name: 'ESLint', desc: 'Code linting and style enforcement for maintaining clean JavaScript/TypeScript code.', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg' },
    { name: 'Babel', desc: 'JavaScript transpiler for modern browser compatibility and JSX transformation.', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/babel/babel-original.svg' },
    { name: 'Webpack', desc: 'Module bundling and asset optimization for production builds.', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg' },
    { name: 'npm', desc: 'Package management for JavaScript dependencies and project scripts.', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg' },
    { name: 'Chrome DevTools', desc: 'Browser debugging, performance monitoring, and DOM inspection.', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg' }
]

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 16)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
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

    // Convert skillsData to logo labels with positions
    const logoLabels = skillsData.map((skill, index) => {
      // Distribute positions evenly across the globe
      const total = skillsData.length
      const goldenRatio = (1 + Math.sqrt(5)) / 2
      const i = index
      const y = 1 - (i / (total - 1)) * 2
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = 2 * Math.PI * i / goldenRatio
      
      const lat = y * 90
      const lon = (theta / Math.PI) * 180 - 90
      
      return {
        kind: skill.name.toLowerCase().replace(/\s+/g, ''),
        name: skill.name,
        img: skill.img,
        lat: lat,
        lon: lon,
        scale: 1
      }
    })

    const makeLogoSprite = (label) => {
      const material = new THREE.SpriteMaterial({ transparent: true, depthWrite: false, alphaTest: 0.01 })
      const sprite = new THREE.Sprite(material)
      sprite.scale.set(label.scale * 1.4, label.scale * 1.4, 1)

      const badgeCanvas = document.createElement('canvas')
      badgeCanvas.width = 256
      badgeCanvas.height = 256
      const badgeCtx = badgeCanvas.getContext('2d')
      if (badgeCtx) {
        badgeCtx.clearRect(0, 0, 256, 256)

        // Draw the logo image
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = label.img
        
        // Use a promise to handle image loading
        return new Promise((resolve) => {
          img.onload = () => {
            // Draw circular background
            const bg = badgeCtx.createRadialGradient(128, 128, 20, 128, 128, 110)
            bg.addColorStop(0, 'rgba(255,255,255,0.95)')
            bg.addColorStop(0.3, 'rgba(255,255,255,0.2)')
            bg.addColorStop(0.7, 'rgba(255,255,255,0.05)')
            bg.addColorStop(1, 'rgba(255,255,255,0)')
            badgeCtx.fillStyle = bg
            badgeCtx.beginPath()
            badgeCtx.arc(128, 128, 110, 0, Math.PI * 2)
            badgeCtx.fill()

            // Draw shadow
            badgeCtx.fillStyle = 'rgba(0,0,0,0.15)'
            badgeCtx.beginPath()
            badgeCtx.ellipse(128, 210, 50, 10, 0, 0, Math.PI * 2)
            badgeCtx.fill()

            // Draw white circle background for logo
            badgeCtx.fillStyle = 'rgba(255,255,255,0.85)'
            badgeCtx.beginPath()
            badgeCtx.arc(128, 128, 65, 0, Math.PI * 2)
            badgeCtx.fill()

            // Draw the logo
            const size = 80
            const x = 128 - size/2
            const y = 128 - size/2
            badgeCtx.drawImage(img, x, y, size, size)

            // Add subtle border
            badgeCtx.strokeStyle = 'rgba(255,255,255,0.3)'
            badgeCtx.lineWidth = 2
            badgeCtx.beginPath()
            badgeCtx.arc(128, 128, 65, 0, Math.PI * 2)
            badgeCtx.stroke()

            const badgeTexture = new THREE.CanvasTexture(badgeCanvas)
            badgeTexture.colorSpace = THREE.SRGBColorSpace
            badgeTexture.generateMipmaps = false
            badgeTexture.needsUpdate = true
            sprite.material.map = badgeTexture
            sprite.material.needsUpdate = true

            // Add glow
            const glowCanvas = document.createElement('canvas')
            glowCanvas.width = 256
            glowCanvas.height = 256
            const glowCtx = glowCanvas.getContext('2d')
            if (glowCtx) {
              const gradient = glowCtx.createRadialGradient(128, 128, 30, 128, 128, 90)
              gradient.addColorStop(0, 'rgba(255,255,255,0.25)')
              gradient.addColorStop(0.5, 'rgba(255,255,255,0.08)')
              gradient.addColorStop(1, 'rgba(255,255,255,0)')
              glowCtx.fillStyle = gradient
              glowCtx.fillRect(0, 0, 256, 256)
            }
            const glowTexture = new THREE.CanvasTexture(glowCanvas)
            glowTexture.colorSpace = THREE.SRGBColorSpace
            glowTexture.generateMipmaps = false
            glowTexture.needsUpdate = true
            const glowMaterial = new THREE.SpriteMaterial({ 
              map: glowTexture, 
              transparent: true, 
              opacity: 0.3, 
              blending: THREE.AdditiveBlending, 
              depthWrite: false 
            })
            const glowSprite = new THREE.Sprite(glowMaterial)
            glowSprite.scale.set(label.scale * 1.6, label.scale * 1.6, 1)
            glowSprite.renderOrder = 5
            sprite.add(glowSprite)

            resolve(sprite)
          }
          img.onerror = () => {
            // If image fails to load, draw a fallback
            const bg = badgeCtx.createRadialGradient(128, 128, 20, 128, 128, 110)
            bg.addColorStop(0, 'rgba(255,255,255,0.9)')
            bg.addColorStop(1, 'rgba(200,200,255,0.1)')
            badgeCtx.fillStyle = bg
            badgeCtx.beginPath()
            badgeCtx.arc(128, 128, 110, 0, Math.PI * 2)
            badgeCtx.fill()

            badgeCtx.fillStyle = '#4a6cf7'
            badgeCtx.font = 'bold 40px Arial'
            badgeCtx.textAlign = 'center'
            badgeCtx.textBaseline = 'middle'
            badgeCtx.fillText(label.name.charAt(0).toUpperCase(), 128, 128)

            const badgeTexture = new THREE.CanvasTexture(badgeCanvas)
            badgeTexture.colorSpace = THREE.SRGBColorSpace
            badgeTexture.generateMipmaps = false
            badgeTexture.needsUpdate = true
            sprite.material.map = badgeTexture
            sprite.material.needsUpdate = true
            resolve(sprite)
          }
        })
      }
      return Promise.resolve(sprite)
    }

    const logoGroup = new THREE.Group()
    const spritePromises = logoLabels.map((label) => makeLogoSprite(label))
    
    Promise.all(spritePromises).then((sprites) => {
      sprites.forEach((sprite, index) => {
        const label = logoLabels[index]
        const phi = (90 - label.lat) * (Math.PI / 180)
        const theta = (label.lon + 180) * (Math.PI / 180)
        const radius = 4.8
        sprite.position.set(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta),
        )
        sprite.material.depthTest = false
        logoGroup.add(sprite)
      })
    })
    
    scene.add(logoGroup)

    // Generate random cloud pattern
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
    let didDrag = false
    const pointerStart = { x: 0, y: 0 }
    const currentRotation = { x: 0, y: 0 }
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    const focusLabel = (sprite) => {
      if (!sprite || !sprite.userData) return
      const { lat = 0, lon = 0 } = sprite.userData
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lon + 180) * (Math.PI / 180)
      const radius = 4.8
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi)
      const z = radius * Math.sin(phi) * Math.sin(theta)
      const targetY = Math.atan2(x, z)
      const targetX = Math.max(-0.9, Math.min(0.9, Math.atan2(y, Math.sqrt((x * x) + (z * z))) * -1))

      gsap.to(logoGroup.rotation, {
        x: targetX,
        y: targetY,
        duration: 1.05,
        ease: 'power3.out',
      })
      gsap.to(globe.rotation, {
        y: targetY,
        duration: 1.05,
        ease: 'power3.out',
      })
      currentRotation.x = targetX
      currentRotation.y = targetY
    }

    const onPointerDown = (event) => {
      isPointerDown = true
      didDrag = false
      pointerStart.x = event.clientX
      pointerStart.y = event.clientY
      canvas.style.cursor = 'grabbing'
    }

    const onPointerMove = (event) => {
      if (!isPointerDown) return
      didDrag = true
      const deltaX = (event.clientX - pointerStart.x) * 0.005
      const deltaY = (event.clientY - pointerStart.y) * 0.005
      logoGroup.rotation.y = currentRotation.y + deltaX
      logoGroup.rotation.x = Math.max(-0.9, Math.min(0.9, currentRotation.x + deltaY))
      globe.rotation.y = logoGroup.rotation.y
    }

    const onPointerUp = (event) => {
      if (!isPointerDown) return
      isPointerDown = false
      currentRotation.x = logoGroup.rotation.x
      currentRotation.y = logoGroup.rotation.y
      canvas.style.cursor = 'grab'

      if (!didDrag) {
        const rect = canvas.getBoundingClientRect()
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
        raycaster.setFromCamera(pointer, camera)
        const hits = raycaster.intersectObjects(logoGroup.children, true)
        const selected = hits.find((hit) => hit.object?.parent?.userData)
        if (selected?.object?.parent) focusLabel(selected.object.parent)
      }
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
        camera.position.z = 16 - progress * 2.8
      },
    })

    let frameId = null
    const render = () => {
      frameId = requestAnimationFrame(render)
      if (!isPointerDown) {
        globe.rotation.y += 0.0017
        logoGroup.rotation.y += 0.0012
        currentRotation.x = logoGroup.rotation.x
        currentRotation.y = logoGroup.rotation.y
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
