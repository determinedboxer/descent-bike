import { useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { camState, animateCameraTo, type SectionKey } from '../lib/cameraController'

const scrollState = { progress: 0 }
let autoRotOffset = 0
let lastTime = 0

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrollState.progress = max > 0 ? window.scrollY / max : 0
  }, { passive: true })
}

function CameraDriver() {
  const { camera } = useThree()
  const activeSection = useRef<SectionKey>('hero')

  useFrame(() => {
    const scrollY = window.scrollY
    const vh      = window.innerHeight
    const section: SectionKey =
      scrollY < vh * 0.5  ? 'hero'     :
      scrollY < vh * 1.5  ? 'specs'    :
      scrollY < vh * 2.5  ? 'features' :
                            'cta'

    if (section !== activeSection.current) {
      activeSection.current = section
      animateCameraTo(section)
    }

    const cam = camera as THREE.PerspectiveCamera
    cam.position.set(camState.px, camState.py, camState.pz)
    cam.lookAt(camState.tx, camState.ty, camState.tz)
    if (Math.abs(cam.fov - camState.fov) > 0.01) {
      cam.fov = camState.fov
      cam.updateProjectionMatrix()
    }
  })

  return null
}


function BikeModel() {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('https://media.githubusercontent.com/media/determinedboxer/descent-bike/main/public/bike/bike.glb')

  const shadowTex = useMemo(() => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width  = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0,   'rgba(204,0,0,0.55)')
    g.addColorStop(0.4, 'rgba(204,0,0,0.22)')
    g.addColorStop(1,   'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  useEffect(() => {
    const box    = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    scene.position.sub(center)
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.isMesh) {
        mesh.castShadow    = true
        mesh.receiveShadow = true
      }
    })
  }, [scene])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    const dt = t - lastTime
    lastTime = t

    const onHero = window.scrollY < window.innerHeight * 0.5

    if (onHero) {
      autoRotOffset += (Math.PI * 2 / 15) * dt
      const idleRot = Math.sin(t * 0.3) * 0.04
      groupRef.current.rotation.y = autoRotOffset + idleRot
    } else {
      const idleRot = Math.sin(t * 0.3) * 0.02
      const scrollRot = scrollState.progress * Math.PI * 0.5
      groupRef.current.rotation.y = scrollRot + idleRot
    }

    groupRef.current.position.y = Math.sin(t * 0.5) * 0.022
  })

  return (
    <group ref={groupRef} position={[1.4, 0, 0]} scale={[1.4, 1.4, 1.4]}>
      <primitive object={scene} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
        <planeGeometry args={[3.2, 2.0]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

export default function BikeScene() {
  return (
    <Canvas
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}
      shadows
      dpr={[1, 1.5]}
      camera={{ fov: 50, position: [0, 0.5, 3.2] }}
      gl={{ antialias: true, alpha: false }}
    >
      <CameraDriver />

      <ambientLight intensity={0.08} />

      {/* Red underlighting — floor glow */}
      <pointLight position={[0, -1.2, 0]} color="#CC0000" intensity={3} distance={5} />

      {/* Main spotlight — aggressive key light from front-top */}
      <spotLight
        position={[2, 7, 5]}
        angle={0.3}
        penumbra={0.4}
        intensity={35}
        color="#ffffff"
        castShadow
      />

      {/* Second spotlight from opposite side — fills shadows */}
      <spotLight
        position={[-3, 4, 3]}
        angle={0.4}
        penumbra={0.6}
        intensity={15}
        color="#ffffff"
        castShadow={false}
      />

      {/* Rim light from behind — defines silhouette */}
      <pointLight position={[0, 2, -4]} color="#ffffff" intensity={6} />

      {/* Red accent from below-front */}
      <pointLight position={[2, -1, 3]} color="#CC0000" intensity={2} distance={4} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.8, -1.1, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color="#CC0000" transparent opacity={0.07} />
      </mesh>

      <Suspense fallback={null}>
        <BikeModel />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload('/bike/bike-optimized.glb')