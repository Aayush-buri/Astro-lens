import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StarField } from './StarField';

interface GuidanceSceneProps {
  deltaAzimuth: number;
  deltaAltitude: number;
  horizontalDirection: 'LEFT' | 'RIGHT';
  verticalDirection: 'UP' | 'DOWN';
}

/**
 * Circular Ground Horizon & Grid Reference with Cardinal Markers (N, E, S, W)
 */
function HorizonGrid() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.01;
    }
  });

  return (
    <group ref={gridRef} position={[0, -0.4, 0]}>
      {/* Outer Horizon Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.025, 12, 64]} />
        <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.4} />
      </mesh>

      {/* Inner Coordinate Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.015, 8, 48]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.3} />
      </mesh>

      {/* Horizon Grid Lines (Concentric + Radial) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 2.0, 32, 4]} />
        <meshBasicMaterial color="#1e3a5f" wireframe transparent opacity={0.2} />
      </mesh>

      {/* Cardinal Direction Markers */}
      {[
        { label: 'N', angle: 0, color: '#ef4444' },
        { label: 'E', angle: Math.PI / 2, color: '#06b6d4' },
        { label: 'S', angle: Math.PI, color: '#06b6d4' },
        { label: 'W', angle: (3 * Math.PI) / 2, color: '#06b6d4' },
      ].map(({ angle, color }, i) => (
        <group key={i} position={[Math.sin(angle) * 2.0, 0, Math.cos(angle) * 2.0]}>
          <mesh position={[0, 0.04, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Central Telescope Indicator (Miniature Scope Pointing)
 */
function TelescopePointer() {
  const scopeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (scopeRef.current) {
      scopeRef.current.position.y = -0.3 + Math.sin(state.clock.elapsedTime * 0.6) * 0.02;
    }
  });

  return (
    <group ref={scopeRef} position={[0, -0.3, 0]}>
      {/* Central Pivot Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#0e7490" emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>

      {/* Telescope Mini Tube */}
      <mesh position={[0, 0.18, 0.08]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.055, 0.35, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Laser Line / Reticle Line */}
      <mesh position={[0, 0.38, 0.16]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.25, 6]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Pulsing Target Celestial Point in the sky
 */
function TargetPoint({
  deltaAzimuth,
  deltaAltitude,
  horizontalDirection,
  verticalDirection,
}: GuidanceSceneProps) {
  const targetGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const hSign = horizontalDirection === 'RIGHT' ? 1 : -1;
  const vSign = verticalDirection === 'UP' ? 1 : -1;

  // Compute 3D target coordinates based on deltas
  const targetX = hSign * Math.min((deltaAzimuth / 45) * 1.5, 1.6);
  const targetY = 0.5 + vSign * Math.min((deltaAltitude / 30) * 0.9, 1.1);
  const targetZ = -0.8;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (targetGroupRef.current) {
      targetGroupRef.current.position.y = targetY + Math.sin(t * 1.8) * 0.03;
    }
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + (Math.sin(t * 3) + 1) * 0.25);
    }
  });

  return (
    <group ref={targetGroupRef} position={[targetX, targetY, targetZ]}>
      {/* Core Glowing Target Star */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#06b6d4"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Expanding Pulsing Guidance Ring */}
      <mesh ref={ringRef} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.16, 0.22, 32]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>

      {/* Target Light */}
      <pointLight intensity={1.0} distance={3} color="#06b6d4" />
    </group>
  );
}

/**
 * Dynamic Guidance Arrow showing movement vector
 */
function GuidanceVector({
  deltaAzimuth,
  deltaAltitude,
  horizontalDirection,
  verticalDirection,
}: GuidanceSceneProps) {
  const arrowRef = useRef<THREE.Group>(null);

  const hSign = horizontalDirection === 'RIGHT' ? 1 : -1;
  const vSign = verticalDirection === 'UP' ? 1 : -1;

  const targetX = hSign * Math.min((deltaAzimuth / 45) * 1.3, 1.4);
  const targetY = 0.3 + vSign * Math.min((deltaAltitude / 30) * 0.7, 0.9);

  const angle = Math.atan2(targetY, targetX);

  useFrame((state) => {
    if (arrowRef.current) {
      // Subtle pulse along direction vector
      const pulse = (Math.sin(state.clock.elapsedTime * 2.5) + 1) * 0.08;
      arrowRef.current.position.x = (targetX * 0.5) + Math.cos(angle) * pulse;
      arrowRef.current.position.y = (targetY * 0.5) + Math.sin(angle) * pulse;
    }
  });

  return (
    <group ref={arrowRef} position={[targetX * 0.5, targetY * 0.5, -0.4]}>
      {/* Direction Shaft */}
      <mesh rotation={[0, 0, angle - Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Arrow Head Pointing to Target */}
      <mesh
        position={[Math.cos(angle) * 0.28, Math.sin(angle) * 0.28, 0]}
        rotation={[0, 0, angle - Math.PI / 2]}
      >
        <coneGeometry args={[0.08, 0.18, 12]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

export function GuidanceScene(props: GuidanceSceneProps) {
  return (
    <div className="w-full h-full min-h-[280px]" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1.6, 3.2], fov: 48 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        {/* Atmosphere Lighting */}
        <ambientLight intensity={0.4} color="#e2e8f0" />
        <directionalLight position={[4, 6, 4]} intensity={0.9} color="#f8fafc" />
        <pointLight position={[0, 0, 1]} intensity={0.5} color="#06b6d4" />

        {/* Lightweight Stars */}
        <StarField count={120} spread={16} size={0.025} speed={0.008} opacity={0.5} />

        {/* Horizon Grid & Cardinals */}
        <HorizonGrid />

        {/* Center Telescope Indicator */}
        <TelescopePointer />

        {/* Target Glowing Celestial Point */}
        <TargetPoint {...props} />

        {/* Animated Guidance Vector */}
        <GuidanceVector {...props} />
      </Canvas>
    </div>
  );
}
