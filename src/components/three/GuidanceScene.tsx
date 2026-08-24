import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GuidanceSceneProps {
  deltaAzimuth: number;
  deltaAltitude: number;
  horizontalDirection: 'LEFT' | 'RIGHT';
  verticalDirection: 'UP' | 'DOWN';
}

function CompassRing() {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={ringRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.03, 8, 64]} />
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 8, 64]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.3} />
      </mesh>
      {/* Cardinal markers */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 1.8, 0, Math.sin(angle) * 1.8]}
        >
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={i === 0 ? '#ef4444' : '#06b6d4'} emissive={i === 0 ? '#ef4444' : '#06b6d4'} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function DirectionArrow({ deltaAzimuth, deltaAltitude, horizontalDirection, verticalDirection }: GuidanceSceneProps) {
  const arrowRef = useRef<THREE.Group>(null);
  const azRad = (deltaAzimuth * Math.PI) / 180;
  const altRad = (deltaAltitude * Math.PI) / 180;
  const hSign = horizontalDirection === 'RIGHT' ? 1 : -1;
  const vSign = verticalDirection === 'UP' ? 1 : -1;

  useFrame((state) => {
    if (arrowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      arrowRef.current.position.x = hSign * Math.min(azRad * 2, 1.2) + pulse * hSign;
      arrowRef.current.position.y = vSign * Math.min(altRad * 2, 0.8) + pulse * vSign;
    }
  });

  const angle = Math.atan2(vSign * deltaAltitude, hSign * deltaAzimuth);

  return (
    <group ref={arrowRef}>
      {/* Arrow body */}
      <mesh rotation={[0, 0, angle]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>
      {/* Arrow head */}
      <mesh position={[Math.cos(angle) * 0.3, Math.sin(angle) * 0.3, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
        <coneGeometry args={[0.1, 0.2, 8]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function CurrentPos() {
  const dotRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (dotRef.current) {
      dotRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.15);
    }
  });

  return (
    <mesh ref={dotRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} />
    </mesh>
  );
}

function SmallStars() {
  const positions = new Float32Array(100 * 3);
  for (let i = 0; i < 100; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
  }
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export function GuidanceScene(props: GuidanceSceneProps) {
  return (
    <div className="w-full h-full min-h-[280px]" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 2.5, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 3]} intensity={0.7} />
        <pointLight position={[0, 0, 2]} intensity={0.3} color="#06b6d4" />
        <SmallStars />
        <CompassRing />
        <CurrentPos />
        <DirectionArrow {...props} />
      </Canvas>
    </div>
  );
}
