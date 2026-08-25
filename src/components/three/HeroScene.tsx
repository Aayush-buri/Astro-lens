import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { StarField } from './StarField';

/* ═══════════════════════════════════════════════════════════════════════════════
 * PROCEDURAL TEXTURES (Saturn globe + ring)
 * Reuses the proven canvas-texture approach from PlanetScene.tsx
 * ═══════════════════════════════════════════════════════════════════════════════ */

function useSaturnTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, '#d1be8e');
    grad.addColorStop(0.15, '#e5d4a8');
    grad.addColorStop(0.3, '#c9b480');
    grad.addColorStop(0.45, '#f3e6c9');
    grad.addColorStop(0.6, '#d4be88');
    grad.addColorStop(0.75, '#ebdcb2');
    grad.addColorStop(0.9, '#baa26f');
    grad.addColorStop(1.0, '#d1be8e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Subtle atmospheric streaks
    for (let y = 0; y < 256; y += 5) {
      ctx.fillStyle = `rgba(255,255,255, ${0.04 + Math.sin(y * 0.3) * 0.02})`;
      ctx.fillRect(0, y, 512, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);
}

function useSaturnRingTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0.0, 'rgba(180, 160, 120, 0.0)');
    grad.addColorStop(0.12, 'rgba(210, 190, 145, 0.55)');
    grad.addColorStop(0.32, 'rgba(240, 225, 185, 0.9)');
    grad.addColorStop(0.62, 'rgba(235, 220, 175, 0.85)');
    grad.addColorStop(0.66, 'rgba(30, 25, 20, 0.05)'); // Cassini Division
    grad.addColorStop(0.72, 'rgba(200, 185, 150, 0.8)');
    grad.addColorStop(0.93, 'rgba(185, 170, 135, 0.65)');
    grad.addColorStop(1.0, 'rgba(160, 145, 115, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 1);

    return new THREE.CanvasTexture(canvas);
  }, []);
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * PRIMARY SATURN
 * ═══════════════════════════════════════════════════════════════════════════════ */

function Saturn() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const saturnTexture = useSaturnTexture();
  const ringTexture = useSaturnRingTexture();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (sphereRef.current) sphereRef.current.rotation.y = t * 0.06;
    if (ringRef.current) ringRef.current.rotation.z = t * 0.015;
    if (groupRef.current) groupRef.current.position.y = Math.sin(t * 0.25) * 0.04;
  });

  return (
    <group ref={groupRef} position={[1.2, 0.6, -1.5]} rotation={[0.42, -0.2, 0.12]}>
      {/* Saturn Globe */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.0, 36, 36]} />
        <meshStandardMaterial
          map={saturnTexture || undefined}
          color={saturnTexture ? '#ffffff' : '#d4be88'}
          roughness={0.7}
          metalness={0.08}
        />
      </mesh>

      {/* Atmospheric Rim Glow */}
      <mesh>
        <sphereGeometry args={[1.03, 32, 32]} />
        <meshStandardMaterial
          color="#c9a84c"
          transparent
          opacity={0.08}
          roughness={1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Ring System */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 2.3, 64]} />
        <meshStandardMaterial
          map={ringTexture || undefined}
          color="#e8dcbf"
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
          roughness={0.65}
        />
      </mesh>

      {/* Ring shadow hint on globe */}
      <pointLight position={[0.5, 1.5, 1]} intensity={0.3} distance={4} color="#f5e6c8" />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * ORBITING MOON
 * ═══════════════════════════════════════════════════════════════════════════════ */

function OrbitingMoon() {
  const moonRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (moonRef.current) {
      // Slow elliptical orbit around Saturn's position
      const orbitSpeed = 0.12;
      moonRef.current.position.x = 1.2 + Math.cos(t * orbitSpeed) * 2.8;
      moonRef.current.position.z = -1.5 + Math.sin(t * orbitSpeed) * 1.4;
      moonRef.current.position.y = 0.6 + Math.sin(t * orbitSpeed * 0.7) * 0.3;
    }
  });

  return (
    <mesh ref={moonRef} position={[4.0, 0.8, -1.5]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#c8cad0" roughness={0.85} metalness={0} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * ORBITAL RINGS & CELESTIAL MARKERS
 * ═══════════════════════════════════════════════════════════════════════════════ */

function OrbitalDetails() {
  const ringGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringGroup.current) {
      ringGroup.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <group ref={ringGroup} position={[1.2, 0.6, -1.5]}>
      {/* Faint orbital path ring */}
      <mesh rotation={[Math.PI / 2.1, 0, 0.05]}>
        <ringGeometry args={[2.75, 2.78, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Second wider orbit */}
      <mesh rotation={[Math.PI / 2.4, 0.1, -0.08]}>
        <ringGeometry args={[3.6, 3.62, 64]} />
        <meshBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.035}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Celestial markers — tiny glowing dots at fixed positions */}
      {[
        [2.9, 0.1, 0.5],
        [-1.8, -0.4, 2.2],
        [0.5, 1.6, -2.0],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * COORDINATE GRID ARC  (very subtle)
 * ═══════════════════════════════════════════════════════════════════════════════ */

function CoordinateArc() {
  const lineObj = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 5, 5, 0, Math.PI * 0.4, false, 0);
    const points = curve.getPoints(40);
    const geom = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, p.y * 0.3, -3))
    );
    const mat = new THREE.LineBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.04 });
    return new THREE.Line(geom, mat);
  }, []);

  return <primitive object={lineObj} />;
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * TELESCOPE ASSEMBLY (preserved from existing, repositioned)
 * ═══════════════════════════════════════════════════════════════════════════════ */

function TelescopeAssembly() {
  const mountRef = useRef<THREE.Group>(null);
  const tubeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (mountRef.current) {
      mountRef.current.rotation.y = -0.35 + Math.sin(t * 0.15) * 0.06;
    }
    if (tubeRef.current) {
      tubeRef.current.rotation.x = Math.sin(t * 0.2) * 0.03;
    }
  });

  return (
    <group position={[-1.1, -1.0, 0.6]}>
      {/* ─── TRIPOD BASE ─── */}
      <group>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>

        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => {
          const legRadius = 0.22;
          const x = Math.sin(angle) * legRadius;
          const z = Math.cos(angle) * legRadius;
          const tiltX = Math.cos(angle) * 0.26;
          const tiltZ = -Math.sin(angle) * 0.26;
          return (
            <group key={i} position={[x, -0.22, z]} rotation={[tiltX, 0, tiltZ]}>
              <mesh position={[0, -0.5, 0]}>
                <cylinderGeometry args={[0.035, 0.03, 1.0, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.35} />
              </mesh>
              <mesh position={[0, -1.02, 0]}>
                <cylinderGeometry args={[0.042, 0.042, 0.08, 8]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, -1.4, 0]}>
                <cylinderGeometry args={[0.025, 0.02, 0.8, 8]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
              </mesh>
              <mesh position={[0, -1.82, 0]}>
                <coneGeometry args={[0.03, 0.06, 8]} />
                <meshStandardMaterial color="#090d16" roughness={0.9} />
              </mesh>
            </group>
          );
        })}

        <mesh position={[0, -0.7, 0]} rotation={[0, Math.PI / 6, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.02, 3]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* ─── ALT-AZ MOUNT HEAD ─── */}
      <group ref={mountRef}>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.14, 0.16, 0.18, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
        </mesh>

        <mesh position={[0, -0.02, 0]}>
          <torusGeometry args={[0.15, 0.012, 8, 24]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.4} metalness={0.8} />
        </mesh>

        <group position={[0.12, 0.25, 0]}>
          <mesh>
            <boxGeometry args={[0.08, 0.45, 0.14]} />
            <meshStandardMaterial color="#1e293b" metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[0.05, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
            <meshStandardMaterial color="#06b6d4" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* ─── OPTICAL TUBE ASSEMBLY ─── */}
        <group ref={tubeRef} position={[0, 0.4, 0]} rotation={[0.3, 0.35, 0.3]}>
          <mesh position={[0.2, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.16, 0.17, 1.8, 24]} />
            <meshStandardMaterial color="#0a192f" metalness={0.85} roughness={0.25} />
          </mesh>

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

          <mesh position={[0.88, 1.08, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.19, 0.19, 0.35, 24]} />
            <meshStandardMaterial color="#0d213a" metalness={0.8} roughness={0.3} />
          </mesh>

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

          <pointLight position={[1.1, 1.3, 0.1]} intensity={0.8} distance={3} color="#06b6d4" />

          {/* Finder Scope */}
          <group position={[0.1, 0.6, 0.16]} rotation={[0, 0, Math.PI / 4]}>
            <mesh position={[0, -0.15, -0.06]}>
              <boxGeometry args={[0.02, 0.08, 0.12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.15, -0.06]}>
              <boxGeometry args={[0.02, 0.08, 0.12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.045, 0.045, 0.6, 12]} />
              <meshStandardMaterial color="#1e3a5f" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.31, 0]}>
              <cylinderGeometry args={[0.052, 0.052, 0.04, 12]} />
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.06, 12]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
          </group>

          {/* Focuser & Eyepiece */}
          <group position={[-0.45, -0.25, 0]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.09, 0.1, 0.35, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[-0.05, -0.05, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.26, 12]} />
              <meshStandardMaterial color="#06b6d4" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[-0.18, -0.18, 0]}>
              <boxGeometry args={[0.12, 0.12, 0.12]} />
              <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh position={[-0.22, -0.12, 0.08]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.045, 0.18, 12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
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

/* ═══════════════════════════════════════════════════════════════════════════════
 * DISTANT CELESTIAL OBJECTS (depth atmosphere)
 * ═══════════════════════════════════════════════════════════════════════════════ */

function DistantCelestialObjects() {
  const moonRef = useRef<THREE.Mesh>(null);
  const distantRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (moonRef.current) {
      moonRef.current.position.y = 1.6 + Math.sin(t * 0.1) * 0.08;
    }
    if (distantRef.current) {
      distantRef.current.rotation.y = t * 0.06;
      distantRef.current.position.y = -1.4 + Math.cos(t * 0.08) * 0.06;
    }
  });

  return (
    <group>
      {/* Distant Glowing Moon */}
      <mesh ref={moonRef} position={[-2.5, 1.6, -5]}>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial
          color="#dbeafe"
          emissive="#60a5fa"
          emissiveIntensity={0.35}
          roughness={0.7}
        />
      </mesh>
      <pointLight position={[-2.5, 1.6, -4.8]} intensity={0.3} distance={5} color="#93c5fd" />

      {/* Tiny distant nebula smudge */}
      <mesh ref={distantRef} position={[3.5, -1.4, -7]} rotation={[0.4, 0.3, 0.2]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={0.15}
          transparent
          opacity={0.25}
          roughness={1}
        />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * POINTER-RESPONSIVE CAMERA RIG
 * ═══════════════════════════════════════════════════════════════════════════════ */

function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const smoothed = useRef({ x: 0, y: 0 });
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.matchMedia('(max-width: 1024px)').matches;

    if (isMobile.current) return;

    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (isMobile.current) {
      // Gentle auto-drift on mobile
      camera.position.x = 0 + Math.sin(t * 0.08) * 0.08;
      camera.position.y = 0.2 + Math.cos(t * 0.06) * 0.04;
    } else {
      // Smooth pointer parallax on desktop
      smoothed.current.x += (mouse.current.x * 0.15 - smoothed.current.x) * 0.03;
      smoothed.current.y += (-mouse.current.y * 0.1 - smoothed.current.y) * 0.03;

      camera.position.x = smoothed.current.x;
      camera.position.y = 0.2 + smoothed.current.y;

      // Gentle auto-drift layered on top
      camera.position.x += Math.sin(t * 0.05) * 0.03;
      camera.position.y += Math.cos(t * 0.04) * 0.02;
    }

    camera.lookAt(0.3, 0.2, -1);
  });

  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * HERO SCENE (exported)
 * ═══════════════════════════════════════════════════════════════════════════════ */

export function HeroScene() {
  // Detect reduced motion preference
  const [reducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Detect mobile for lower particle count
  const isMobile = useMemo(
    () => (typeof window !== 'undefined' ? window.innerWidth < 768 : false),
    []
  );

  const starCount = isMobile ? 180 : 300;

  const handleCreated = useCallback(
    (state: { gl: THREE.WebGLRenderer }) => {
      // Ensure transparent background
      state.gl.setClearColor(0x000000, 0);
      if (reducedMotion) {
        // Render one frame then stop the loop
        state.gl.setAnimationLoop(null);
      }
    },
    [reducedMotion]
  );

  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.2, 4.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
        onCreated={handleCreated}
      >
        {/* Atmospheric Lighting */}
        <ambientLight intensity={0.4} color="#cbd5e1" />
        <directionalLight position={[6, 7, 5]} intensity={1.15} color="#f8fafc" />
        <directionalLight position={[-5, -2, -3]} intensity={0.3} color="#1e3a5f" />
        <pointLight position={[-2, 3, 2]} intensity={0.5} color="#38bdf8" />
        {/* Warm ground reflection fill */}
        <pointLight position={[1, -4, 3]} intensity={0.15} color="#fbbf24" distance={12} />

        {/* Star Field */}
        <StarField count={starCount} spread={24} size={0.035} speed={reducedMotion ? 0 : 0.012} opacity={0.7} depth={20} />

        {/* Primary Saturn */}
        <Saturn />

        {/* Orbiting Moon */}
        <OrbitingMoon />

        {/* Orbital Details & Markers */}
        <OrbitalDetails />

        {/* Coordinate Arc */}
        <CoordinateArc />

        {/* Distant Celestial Objects */}
        <DistantCelestialObjects />

        {/* Telescope */}
        <TelescopeAssembly />

        {/* Pointer-Responsive Camera */}
        {!reducedMotion && <CameraRig />}
      </Canvas>
    </div>
  );
}
