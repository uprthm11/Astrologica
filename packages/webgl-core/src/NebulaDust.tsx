import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createCircleTexture } from './textureUtils';

export interface NebulaDustProps {
  count?: number;
  minRadius?: number;
  radiusSpread?: number;
  color?: string;
  size?: number;
  opacity?: number;
  rotationSpeedY?: number;
}

export const NebulaDust: React.FC<NebulaDustProps> = ({
  count = 3500,
  minRadius = 80,
  radiusSpread = 250,
  color = '#6366f1',
  size = 1.2,
  opacity = 0.35,
  rotationSpeedY = -0.004,
}) => {
  const ref = useRef<THREE.Points>(null);
  const circleTexture = useMemo(() => createCircleTexture(), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = minRadius + Math.random() * radiusSpread;
      const t = Math.random() * Math.PI * 2;
      const p = Math.random() * Math.PI;
      arr[i * 3]     = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.3;
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, [count, minRadius, radiusSpread]);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * rotationSpeedY;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        map={circleTexture || undefined}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

export default NebulaDust;
