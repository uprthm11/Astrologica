import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createCircleTexture } from './textureUtils';

export interface StarFieldProps {
  count?: number;
  spread?: number;
  color?: string;
  size?: number;
  opacity?: number;
  rotationSpeedY?: number;
  rotationSpeedX?: number;
}

export const StarField: React.FC<StarFieldProps> = ({
  count = 16000,
  spread = 700,
  color = '#b8d0ff',
  size = 0.65,
  opacity = 0.88,
  rotationSpeedY = 0.006,
  rotationSpeedX = 0.002,
}) => {
  const ref = useRef<THREE.Points>(null);
  const circleTexture = useMemo(() => createCircleTexture(), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return arr;
  }, [count, spread]);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * rotationSpeedY;
      ref.current.rotation.x += dt * rotationSpeedX;
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

export default StarField;
