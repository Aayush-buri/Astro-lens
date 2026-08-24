import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StarField } from './StarField';

/**
 * Detailed, lightweight procedural telescope model with optical tube,
 * finder scope, focuser, and tripod mount.
 */
function TelescopeAssembly() {
  const mountRef = useRef<THREE.Group>(null);
  const tubeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Slow, elegant idle movement (elevation nod & azimuth pan)
    if (mountRef.current) {
      mountRef.current.rotation.y = -0.35 + Math.sin(t * 0.15) * 0.06;
    }
    if (tubeRef.current) {
      tubeRef.current.rotation.x = Math.sin(t * 0.2) * 0.03;
    }
  });

  return (
    <group position={[0.2, -0.65, 0]}>
      {/* ─── TRIPOD BASE ─── */}
      <group position={[0, 0, 0]}>
        {/* Central Hub / Spreader */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* 3 Tripod Legs */}
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => {
          const legRadius = 0.22;
          const x = Math.sin(angle) * legRadius;
          const z = Math.cos(angle) * legRadius;
          const tiltX = Math.cos(angle) * 0.26;
          const tiltZ = -Math.sin(angle) * 0.26;

          return (
            <group key={i} position={[x, -0.22, z]} rotation={[tiltX, 0, tiltZ]}>
              {/* Upper Leg Section */}
              <mesh position={[0, -0.5, 0]}>
                <cylinderGeometry args={[0.035, 0.03, 1.0, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.35} />
              </mesh>
              {/* Extension Clamp */}
              <mesh position={[0, -1.02, 0]}>
                <cylinderGeometry args={[0.042, 0.042, 0.08, 8]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Lower Leg Section */}
              <mesh position={[0, -1.4, 0]}>
                <cylinderGeometry args={[0.025, 0.02, 0.8, 8]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
              </mesh>
              {/* Rubber Foot */}
              <mesh position={[0, -1.82, 0]}>
                <coneGeometry args={[0.03, 0.06, 8]} />
                <meshStandardMaterial color="#090d16" roughness={0.9} />
              </mesh>
            </group>
          );
        })}

        {/* Leg Spreader Tray */}
        <mesh position={[0, -0.7, 0]} rotation={[0, Math.PI / 6, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.02, 3]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* ─── ALT-AZ MOUNT HEAD ─── */}
      <group ref={mountRef} position={[0, 0, 0]}>
        {/* Azimuth Axis Base */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.14, 0.16, 0.18, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Setting Circle Trim */}
        <mesh position={[0, -0.02, 0]}>
          <torusGeometry args={[0.15, 0.012, 8, 24]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.4} metalness={0.8} />
        </mesh>

        {/* Single-Arm Fork Mount */}
        <group position={[0.12, 0.25, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.45, 0.14]} />
            <meshStandardMaterial color="#1e293b" metalness={0.75} roughness={0.3} />
          </mesh>
          {/* Altitude Pivot Knob */}
          <mesh position={[0.05, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
            <meshStandardMaterial color="#06b6d4" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* ─── OPTICAL TUBE ASSEMBLY (OTA) ─── */}
        <group ref={tubeRef} position={[0, 0.4, 0]} rotation={[0.38, 0.25, 0.3]}>
          {/* Main Optical Tube */}
          <mesh position={[0.2, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.16, 0.17, 1.8, 24]} />
            <meshStandardMaterial color="#0a192f" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* Tube Rings / Decal Accents */}
          {[-0.2, 0.2, 0.6].map((offset, i) => (
            <mesh
              key={i}
              position={[0.2 + offset * 0.707, 0.4 + offset * 0.707, 0]}
              rotation={[0, 0, Math.PI / 4]}
            >
              <cylinderGeometry args={[0.175, 0.175, 0.05, 24]} />
              <meshStandardMaterial color={i === 1 ? '#06b6d4' : '#1e3a5f'} metalness={0.9} roughness={0.2} />
            </mesh>
          ))}

          {/* Dew Shield (Front Hood) */}
          <mesh position={[0.88, 1.08, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.19, 0.19, 0.35, 24]} />
            <meshStandardMaterial color="#0d213a" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Objective Lens (Front Glass Element) */}
          <mesh position={[0.98, 1.18, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.17, 0.17, 0.04, 24]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#0891b2"
              emissiveIntensity={0.6}
              metalness={0.95}
              roughness={0.05}
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* Lens Tip Cyan Point Light */}
          <pointLight position={[1.1, 1.3, 0.1]} intensity={0.8} distance={3} color="#06b6d4" />

          {/* ─── FINDER SCOPE ─── */}
          <group position={[0.1, 0.6, 0.16]} rotation={[0, 0, Math.PI / 4]}>
            {/* Finder Mounting Stalks */}
            <mesh position={[0, -0.15, -0.06]}>
              <boxGeometry args={[0.02, 0.08, 0.12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.15, -0.06]}>
              <boxGeometry args={[0.02, 0.08, 0.12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
            {/* Finder Tube */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.6, 12]} />
              <meshStandardMaterial color="#1e3a5f" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Finder Objective */}
            <mesh position={[0, 0.31, 0]}>
              <cylinderGeometry args={[0.052, 0.052, 0.04, 12]} />
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
            </mesh>
            {/* Finder Eyepiece */}
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.06, 12]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
          </group>

          {/* ─── FOCUSER & EYEPIECE (Rear) ─── */}
          <group position={[-0.45, -0.25, 0]}>
            {/* Focuser Drawtube */}
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.09, 0.1, 0.35, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Focuser Knobs */}
            <mesh position={[-0.05, -0.05, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.26, 12]} />
              <meshStandardMaterial color="#06b6d4" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* 90-degree Star Diagonal */}
            <mesh position={[-0.18, -0.18, 0]}>
              <boxGeometry args={[0.12, 0.12, 0.12]} />
              <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.3} />
            </mesh>
            {/* Eyepiece Tube */}
            <mesh position={[-0.22, -0.12, 0.08]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.045, 0.18, 12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
            {/* Rubber Eyecup */}
            <mesh position={[-0.26, -0.08, 0.16]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.042, 0.04, 12]} />
              <meshStandardMaterial color="#05070a" roughness={0.9} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/**
 * Distant small celestial objects in the deep background for atmospheric depth.
 */
function DistantCelestialObjects() {
  const moonRef = useRef<THREE.Mesh>(null);
  const ringedWorldRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (moonRef.current) {
      moonRef.current.position.y = 1.4 + Math.sin(t * 0.1) * 0.08;
    }
    if (ringedWorldRef.current) {
      ringedWorldRef.current.rotation.y = t * 0.08;
      ringedWorldRef.current.position.y = -1.2 + Math.cos(t * 0.08) * 0.06;
    }
  });

  return (
    <group>
      {/* Distant Glowing Moon / Crescent */}
      <mesh ref={moonRef} position={[2.8, 1.4, -4]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial
          color="#dbeafe"
          emissive="#60a5fa"
          emissiveIntensity={0.4}
          roughness={0.7}
        />
      </mesh>
      <pointLight position={[2.8, 1.4, -3.8]} intensity={0.4} distance={6} color="#93c5fd" />

      {/* Tiny Distant Ringed Planet */}
      <group ref={ringedWorldRef} position={[-3.2, -1.2, -6]} rotation={[0.4, 0.3, 0.2]}>
        <mesh>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial color="#e2d4a8" roughness={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <ringGeometry args={[0.3, 0.48, 32]} />
          <meshStandardMaterial
            color="#d4c391"
            side={THREE.DoubleSide}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.2, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        {/* Professional Atmospheric Lighting */}
        <ambientLight intensity={0.45} color="#cbd5e1" />
        <directionalLight position={[6, 7, 5]} intensity={1.1} color="#f8fafc" />
        <directionalLight position={[-5, -2, -3]} intensity={0.35} color="#1e3a5f" />
        <pointLight position={[-2, 3, 2]} intensity={0.6} color="#38bdf8" />

        {/* Lightweight Procedural StarField */}
        <StarField count={220} spread={22} size={0.035} speed={0.015} opacity={0.75} depth={18} />

        {/* Distant Small Celestial Objects */}
        <DistantCelestialObjects />

        {/* Procedural 3D Telescope */}
        <TelescopeAssembly />
      </Canvas>
    </div>
  );
}
