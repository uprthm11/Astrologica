import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore, DEFAULT_CAMERA_Z } from '@stores';

// Generate circular alpha map texture to guarantee round particle spheres
function createCircleTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.3, 'rgba(210, 225, 255, 0.8)');
  grad.addColorStop(0.7, 'rgba(150, 180, 255, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ─── Star particle field ──────────────────────────────────────────────────────
export function StarField() {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 16000;

  const circleTexture = useMemo(() => createCircleTexture(), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 700;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 700;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 700;
    }
    return arr;
  }, [COUNT]);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.006;
      ref.current.rotation.x += dt * 0.002;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.65}
        color="#b8d0ff"
        map={circleTexture || undefined}
        transparent
        opacity={0.88}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Indigo nebula dust ring ──────────────────────────────────────────────────
export function NebulaDust() {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 3500;

  const circleTexture = useMemo(() => createCircleTexture(), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 80 + Math.random() * 250;
      const t = Math.random() * Math.PI * 2;
      const p = Math.random() * Math.PI;
      arr[i * 3]     = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.3;
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, [COUNT]);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y -= dt * 0.004;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.2}
        color="#6366f1"
        map={circleTexture || undefined}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Camera rig: reads cameraTargetZ and smoothly lerps ────────────────────────
export function CameraRig() {
  const targetZ = useAppStore((s) => s.cameraTargetZ ?? DEFAULT_CAMERA_Z);

  useFrame((state) => {
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.028;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Universe Canvas Singleton ────────────────────────────────────────────────
export const UniverseCanvas: React.FC = () => {
  return (
    <div
      data-testid="universe-canvas-container"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 38%, #080b22 0%, #010208 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, DEFAULT_CAMERA_Z], fov: 60, near: 0.1, far: 2500 }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <StarField />
        <NebulaDust />
        <CameraRig />
      </Canvas>
    </div>
  );
};

export default UniverseCanvas;
