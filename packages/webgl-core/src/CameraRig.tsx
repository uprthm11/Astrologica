import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DEFAULT_LERP_FACTOR } from './cameraMath';

export interface CameraRigProps {
  targetZ: number;
  lerpFactor?: number;
  threshold?: number;
  lookAtTarget?: [number, number, number];
  onArrive?: () => void;
}

/**
 * Prop-driven 3D Camera Rig with smooth lerping and arrival notifications.
 * Pure presentation component: zero external store dependencies.
 */
export const CameraRig: React.FC<CameraRigProps> = ({
  targetZ,
  lerpFactor = DEFAULT_LERP_FACTOR,
  threshold = 0.05,
  lookAtTarget = [0, 0, 0],
  onArrive,
}) => {
  const arrivedRef = useRef(false);

  useFrame((state) => {
    const diff = targetZ - state.camera.position.z;
    state.camera.position.z += diff * lerpFactor;
    state.camera.lookAt(lookAtTarget[0], lookAtTarget[1], lookAtTarget[2]);

    if (Math.abs(diff) <= threshold) {
      if (!arrivedRef.current) {
        arrivedRef.current = true;
        if (onArrive) {
          onArrive();
        }
      }
    } else {
      arrivedRef.current = false;
    }
  });

  return null;
};

export default CameraRig;
