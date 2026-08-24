import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface StarFieldProps {
  count?: number;
  spread?: number;
  size?: number;
  speed?: number;
  color?: string;
  opacity?: number;
  depth?: number;
}

export function StarField({
  count = 200,
  spread = 20,
  size = 0.03,
  speed = 0.02,
  color = '#ffffff',
  opacity = 0.7,
  depth = 15,
}: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute stars evenly in a sphere/box
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * depth - depth * 0.2;
      // Slight variation in star sizes
      sz[i] = size * (0.6 + Math.random() * 0.8);
    }
    return [pos, sz];
  }, [count, spread, depth, size]);

  useFrame((state) => {
    if (pointsRef.current) {
      // Gentle, slow drift
      pointsRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.25) * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
