import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useAppStore } from '../../store/useAppStore'

// Camera Z targets per cinematic step (extended for 8 steps)
// Step: 0=Intro 1=Name 2=Crossroads 3=About 4=DOB 5=Location 6=Processing 7=Reveal
const STEP_Z = [120, 95, 68, 48, 58, 42, 30, 22]

// Reveal sub-slide camera targets (steps 0-4 within step 7)
const REVEAL_Z = [22, 18, 15, 12, 8]

function getCameraTarget(step, revealSlide) {
  if (step === 7) return REVEAL_Z[Math.min(revealSlide, REVEAL_Z.length - 1)]
  return STEP_Z[Math.min(step, STEP_Z.length - 1)]
}

// ─── Star particle field ──────────────────────────────────────────────────────
function StarField() {
  const ref = useRef()
  const COUNT = 22000

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 700
      arr[i * 3 + 1] = (Math.random() - 0.5) * 700
      arr[i * 3 + 2] = (Math.random() - 0.5) * 700
    }
    return arr
  }, [])

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.006
      ref.current.rotation.x += dt * 0.002
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.32} color="#b8d0ff" transparent opacity={0.88} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ─── Indigo nebula dust ring ──────────────────────────────────────────────────
function NebulaDust() {
  const ref = useRef()
  const COUNT = 4000

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const r = 80 + Math.random() * 250
      const t = Math.random() * Math.PI * 2
      const p = Math.random() * Math.PI
      arr[i * 3]     = r * Math.sin(p) * Math.cos(t)
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.3
      arr[i * 3 + 2] = r * Math.cos(p)
    }
    return arr
  }, [])

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.003
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={1.2} color="#4466ff" transparent opacity={0.18} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ─── Camera rig: reads step + revealSlide and lerps toward target ─────────────
function CameraRig() {
  const cinematicStep = useAppStore(s => s.cinematicStep)
  const revealSlide   = useAppStore(s => s.revealSlide)
  const targetZ = getCameraTarget(cinematicStep, revealSlide)

  useFrame(state => {
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.028
    state.camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Exported canvas ──────────────────────────────────────────────────────────
export default function UniverseCanvas() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      background: 'radial-gradient(ellipse at 50% 38%, #080b22 0%, #010208 100%)',
    }}>
      <Canvas
        camera={{ position: [0, 0, 120], fov: 60, near: 0.1, far: 2500 }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <StarField />
        <NebulaDust />
        <CameraRig />
      </Canvas>
    </div>
  )
}
