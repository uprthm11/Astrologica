import React from 'react';
import { Canvas } from '@react-three/fiber';
import { StarField, NebulaDust, CameraRig } from '@webgl-core';
import { useWebGLStore, DEFAULT_CAMERA_Z } from '@stores';

/**
 * Persistent WebGL Universe Canvas Singleton.
 * Consumes prop-driven presentation primitives from @webgl-core
 * and connects CameraRig to webglStore for dynamic camera movement.
 */
export const UniverseCanvas: React.FC = () => {
  const cameraTargetZ = useWebGLStore((s) => s.cameraTargetZ ?? DEFAULT_CAMERA_Z);

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
        <StarField count={16000} spread={700} color="#b8d0ff" size={0.65} />
        <NebulaDust count={3500} color="#6366f1" size={1.2} />
        <CameraRig targetZ={cameraTargetZ} lerpFactor={0.028} />
      </Canvas>
    </div>
  );
};

export default UniverseCanvas;
