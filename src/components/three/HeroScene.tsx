import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function Telescope() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} rotation={[0.2, -0.3, 0.1]}>
      {/* Telescope tube */}
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.15, 0.2, 2, 16]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Lens end */}
      <mesh position={[0.55, 0.95, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.22, 0.22, 0.1, 16]} />
        <meshStandardMaterial color="#06b6d4" metalness={0.9} roughness={0.1} emissive="#06b6d4" emissiveIntensity={0.3} />
      </mesh>
      {/* Eyepiece */}
      <mesh position={[-0.35, -0.15, 0]} rotation={[0, 0, Math.PI / 6 + Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 8]} />
        <meshStandardMaterial color="#0d1f3c" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Tripod legs */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(angle) * 0.3,
            -1.2,
            Math.cos(angle) * 0.3,
          ]}
          rotation={[Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2]}
        >
          <cylinderGeometry args={[0.03, 0.03, 1.4, 6]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* Mount */}
      <mesh position={[0, -0.4, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#06b6d4" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export function HeroScene() {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#e0f0ff" />
        <pointLight position={[-3, 2, 3]} intensity={0.5} color="#06b6d4" />
        <Stars radius={50} depth={30} count={800} factor={3} saturation={0} fade speed={0.5} />
        <Telescope />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
