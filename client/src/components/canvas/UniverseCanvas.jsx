import React, { useRef, Suspense, lazy } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useAppStore } from '../../store/useAppStore'

// Camera target Z for each cinematic step
const STEP_CAMERA_Z = [120, 80, 50, 30, 20, 10]

// --- Star Particles (custom, no external asset dependency) ---
function StarField() {
  const ref = useRef()
  const count = 20000

  // Build star positions once
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 600  // x
      arr[i * 3 + 1] = (Math.random() - 0.5) * 600  // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 600  // z
    }
    return arr
  }, [])

  // Slow rotation for ambient motion
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.008
      ref.current.rotation.x += delta * 0.003
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.35}
        color="#a8c4ff"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// Nebula accent dust (fewer, larger, coloured)
function NebulaDust() {
  const ref = useRef()
  const count = 3000

  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 100 + Math.random() * 200
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.004
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.1}
        color="#3858f6"
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// Camera rig that lerps toward the step-based target Z
function CameraRig() {
  const cinematicStep = useAppStore((s) => s.cinematicStep)
  const targetZ = STEP_CAMERA_Z[Math.min(cinematicStep, STEP_CAMERA_Z.length - 1)]

  useFrame((state) => {
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.035
    state.camera.lookAt(0, 0, 0)
  })

  return null
}

export default function UniverseCanvas() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: 'radial-gradient(ellipse at 50% 40%, #0a0d2e 0%, #020308 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 120], fov: 60, near: 0.1, far: 2000 }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.15} />
        <StarField />
        <NebulaDust />
        <CameraRig />
      </Canvas>
    </div>
  )
}
