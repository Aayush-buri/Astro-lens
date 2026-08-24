import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlanetProps {
  color: string;
  name: string;
  hasRings?: boolean;
}

function Planet({ color, hasRings = false }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05 + 0.4;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      {/* Surface bands */}
      <mesh>
        <sphereGeometry args={[1.21, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          metalness={0}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      {hasRings && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0.4]}>
          <ringGeometry args={[1.5, 2.2, 64]} />
          <meshStandardMaterial
            color="#e8d5a3"
            side={THREE.DoubleSide}
            transparent
            opacity={0.6}
            roughness={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

function SmallStars() {
  const starsRef = useRef<THREE.Points>(null);
  const positions = new Float32Array(200 * 3);
  for (let i = 0; i < 200; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffffff" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export function PlanetScene({ color, name, hasRings = false }: PlanetProps) {
  return (
    <div className="w-full h-full min-h-[250px]" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.5, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={0.9} />
        <pointLight position={[-3, 2, -3]} intensity={0.3} color="#06b6d4" />
        <SmallStars />
        <Planet color={color} name={name} hasRings={hasRings} />
      </Canvas>
    </div>
  );
}
