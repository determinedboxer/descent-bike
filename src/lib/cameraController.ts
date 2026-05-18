import { gsap } from 'gsap'

export const CAMERA_KEYFRAMES = {
  hero:     { position: [0,    0.5, 3.2] as [number, number, number], target: [0, 0.3, 0] as [number, number, number], fov: 50 },
  specs:    { position: [1.8,  0.4, 2.2] as [number, number, number], target: [0, 0.2, 0] as [number, number, number], fov: 42 },
  features: { position: [-1.5, 1.2, 2.8] as [number, number, number], target: [0, 0.5, 0] as [number, number, number], fov: 48 },
  cta:      { position: [0,    0.8, 4.0] as [number, number, number], target: [0, 0.3, 0] as [number, number, number], fov: 45 },
} as const

export type SectionKey = keyof typeof CAMERA_KEYFRAMES

export const camState = {
  px: 0, py: 0.5, pz: 3.2,
  tx: 0, ty: 0.3, tz: 0,
  fov: 50,
}

export const scrollState = { progress: 0 }

export function animateCameraTo(section: SectionKey): void {
  const kf = CAMERA_KEYFRAMES[section]
  gsap.killTweensOf(camState)
  gsap.to(camState, {
    px: kf.position[0], py: kf.position[1], pz: kf.position[2],
    tx: kf.target[0],   ty: kf.target[1],   tz: kf.target[2],
    fov: kf.fov,
    duration: 1.4,
    ease: 'power2.inOut',
  })
}
