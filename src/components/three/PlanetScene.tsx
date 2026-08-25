import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StarField } from './StarField';

interface PlanetProps {
  color: string;
  name: string;
  hasRings?: boolean;
}

/**
 * Creates procedural texture maps via canvas for realistic, lightweight rendering
 * without external downloads or heavy textures.
 */
function useProceduralTexture(type: string, baseColorHex: string) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (type === 'jupiter') {
      // Atmospheric Cloud Bands for Jupiter
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0.0, '#c7a361');
      grad.addColorStop(0.12, '#9e7943');
      grad.addColorStop(0.24, '#e6d3a8');
      grad.addColorStop(0.35, '#8c593b');
      grad.addColorStop(0.48, '#deb887');
      grad.addColorStop(0.58, '#ba7a4b');
      grad.addColorStop(0.68, '#e6d3a8');
      grad.addColorStop(0.82, '#9e6d48');
      grad.addColorStop(1.0, '#c7a361');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Add atmospheric streak turbulence
      for (let y = 10; y < 246; y += 4) {
        ctx.fillStyle = `rgba(${y % 2 === 0 ? '255,255,255' : '100,50,20'}, ${0.08 + Math.sin(y) * 0.05})`;
        ctx.fillRect(0, y, 512, 2);
      }

      // Great Red Spot
      ctx.beginPath();
      ctx.ellipse(320, 160, 36, 20, 0.05, 0, Math.PI * 2);
      const spotGrad = ctx.createRadialGradient(320, 160, 2, 320, 160, 36);
      spotGrad.addColorStop(0, '#c0392b');
      spotGrad.addColorStop(0.7, '#d35400');
      spotGrad.addColorStop(1, 'rgba(211, 84, 0, 0)');
      ctx.fillStyle = spotGrad;
      ctx.fill();

      // White storm storms
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.ellipse(100 + i * 60, 185, 8, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
      }
    } else if (type === 'saturn') {
      // Saturn subtle butter-cream cloud bands
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0.0, '#d1be8e');
      grad.addColorStop(0.2, '#ebdcb2');
      grad.addColorStop(0.4, '#c9b480');
      grad.addColorStop(0.6, '#f3e6c9');
      grad.addColorStop(0.8, '#d4be88');
      grad.addColorStop(1.0, '#baa26f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      for (let y = 0; y < 256; y += 6) {
        ctx.fillStyle = `rgba(255,255,255, 0.06)`;
        ctx.fillRect(0, y, 512, 3);
      }
    } else if (type === 'moon') {
      // Moon Cratered Surface
      ctx.fillStyle = '#b0b3b8';
      ctx.fillRect(0, 0, 512, 256);

      // Dark Lunar Maria (Plains)
      ctx.fillStyle = '#7a7f87';
      const mariaSpots = [
        [150, 90, 60, 45],
        [240, 100, 70, 50],
        [320, 130, 80, 60],
        [180, 160, 50, 40],
        [280, 180, 45, 35],
      ];
      mariaSpots.forEach(([x, y, rx, ry]) => {
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Impact Craters with bright rims & dark centers
      for (let i = 0; i < 40; i++) {
        const cx = (i * 73) % 500 + 6;
        const cy = (i * 47) % 240 + 8;
        const r = (i % 5) + 3;

        ctx.beginPath();
        ctx.arc(cx, cy, r + 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(235, 238, 245, 0.7)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(60, 64, 70, 0.8)';
        ctx.fill();
      }
    } else if (type === 'mars') {
      // Mars Rust / Iron oxide surface with darker highlands
      ctx.fillStyle = '#c1440e';
      ctx.fillRect(0, 0, 512, 256);

      // Dark surface features (Syrtis Major)
      ctx.fillStyle = '#7a2807';
      ctx.beginPath();
      ctx.ellipse(250, 130, 90, 45, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Polar Ice Caps
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 512, 24); // North cap
      ctx.fillRect(0, 238, 512, 18); // South cap
    } else if (type === 'venus') {
      // Venus shrouded golden atmosphere
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0.0, '#d97706');
      grad.addColorStop(0.25, '#f59e0b');
      grad.addColorStop(0.5, '#fef08a');
      grad.addColorStop(0.75, '#f59e0b');
      grad.addColorStop(1.0, '#b45309');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      for (let y = 0; y < 256; y += 8) {
        ctx.fillStyle = `rgba(255,255,255, 0.08)`;
        ctx.fillRect(0, y, 512, 4);
      }
    } else if (type === 'andromeda' || type === 'galaxy') {
      // Galaxy spiral disk procedural canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 256);

      const radGrad = ctx.createRadialGradient(256, 128, 5, 256, 128, 120);
      radGrad.addColorStop(0.0, '#ffffff');
      radGrad.addColorStop(0.2, '#e879f9');
      radGrad.addColorStop(0.5, '#818cf8');
      radGrad.addColorStop(0.8, '#312e81');
      radGrad.addColorStop(1.0, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.ellipse(256, 128, 220, 100, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spiral dust bands
      for (let i = 0; i < 80; i++) {
        const angle = (i / 80) * Math.PI * 4;
        const dist = 10 + i * 2.2;
        const x = 256 + Math.cos(angle) * dist * 1.8;
        const y = 128 + Math.sin(angle) * dist * 0.8;
        ctx.beginPath();
        ctx.arc(x, y, (i % 3) + 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fill();
      }
    } else if (type === 'nebula') {
      // Cosmic Nebula gas cloud
      const nebGrad = ctx.createRadialGradient(256, 128, 10, 256, 128, 140);
      nebGrad.addColorStop(0.0, '#ec4899');
      nebGrad.addColorStop(0.35, '#8b5cf6');
      nebGrad.addColorStop(0.7, '#06b6d4');
      nebGrad.addColorStop(1.0, '#0f172a');
      ctx.fillStyle = nebGrad;
      ctx.fillRect(0, 0, 512, 256);
    } else {
      // Generic celestial body
      ctx.fillStyle = baseColorHex;
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      for (let y = 0; y < 256; y += 12) {
        ctx.fillRect(0, y, 512, 4);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [type, baseColorHex]);
}

/**
 * Procedural Ring Texture for Saturn with Cassini Division gap
 */
function useSaturnRingTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Gradient representing Ring C, B, Cassini division, Ring A
    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0.0, 'rgba(180, 160, 120, 0.0)'); // Inner transparent
    grad.addColorStop(0.15, 'rgba(210, 190, 145, 0.6)'); // Ring C
    grad.addColorStop(0.35, 'rgba(240, 225, 185, 0.95)'); // Ring B (dense)
    grad.addColorStop(0.65, 'rgba(235, 220, 175, 0.9)');
    grad.addColorStop(0.68, 'rgba(30, 25, 20, 0.05)'); // Cassini Division gap
    grad.addColorStop(0.74, 'rgba(200, 185, 150, 0.85)'); // Ring A
    grad.addColorStop(0.95, 'rgba(185, 170, 135, 0.7)');
    grad.addColorStop(1.0, 'rgba(160, 145, 115, 0.0)'); // Outer edge

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 1);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);
}

function CelestialBody({ color, name, hasRings = false }: PlanetProps) {
  const planetRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const lowerName = name.toLowerCase();
  const objType = lowerName.includes('jupiter')
    ? 'jupiter'
    : lowerName.includes('saturn')
    ? 'saturn'
    : lowerName.includes('moon')
    ? 'moon'
    : lowerName.includes('mars')
    ? 'mars'
    : lowerName.includes('venus')
    ? 'venus'
    : lowerName.includes('andromeda') || lowerName.includes('galaxy')
    ? 'andromeda'
    : lowerName.includes('nebula')
    ? 'nebula'
    : 'generic';

  const planetTexture = useProceduralTexture(objType, color);
  const ringTexture = useSaturnRingTexture();

  const isSaturn = hasRings || objType === 'saturn';
  const isMoon = objType === 'moon';
  const isSirius = lowerName.includes('sirius');

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.12;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.02;
    }
    if (planetRef.current) {
      // Gentle floating bob
      planetRef.current.position.y = Math.sin(t * 0.4) * 0.04;
    }
  });

  return (
    <group ref={planetRef}>
      {/* ─── SATURN SETUP (With Axial Tilt) ─── */}
      {isSaturn ? (
        <group rotation={[0.42, 0, 0.15]}>
          {/* Saturn Globe */}
          <mesh ref={sphereRef}>
            <sphereGeometry args={[1.05, 36, 36]} />
            <meshStandardMaterial
              map={planetTexture || undefined}
              color={planetTexture ? '#ffffff' : color}
              roughness={0.7}
              metalness={0.08}
            />
          </mesh>

          {/* Dual Ring Layers (Inner + Outer with Cassini division) */}
          <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.35, 2.45, 64]} />
            <meshStandardMaterial
              map={ringTexture || undefined}
              color="#e8dcbf"
              side={THREE.DoubleSide}
              transparent
              opacity={0.88}
              roughness={0.65}
            />
          </mesh>
        </group>
      ) : isSirius ? (
        /* ─── SIRIUS (Brilliant Star) ─── */
        <group>
          <mesh ref={sphereRef}>
            <sphereGeometry args={[1.1, 32, 32]} />
            <meshStandardMaterial
              color="#e0f2fe"
              emissive="#38bdf8"
              emissiveIntensity={1.2}
              roughness={0.1}
            />
          </mesh>
          {/* Corona Glow Ring */}
          <mesh>
            <sphereGeometry args={[1.25, 24, 24]} />
            <meshBasicMaterial color="#7dd3fc" transparent opacity={0.25} wireframe />
          </mesh>
          <pointLight intensity={1.8} color="#38bdf8" distance={8} />
        </group>
      ) : (
        /* ─── JUPITER / MOON / MARS / OTHER ─── */
        <group>
          <mesh ref={sphereRef}>
            <sphereGeometry args={[1.2, 40, 40]} />
            <meshStandardMaterial
              map={planetTexture || undefined}
              color={planetTexture ? '#ffffff' : color}
              roughness={isMoon ? 0.95 : 0.65}
              metalness={isMoon ? 0.0 : 0.05}
            />
          </mesh>

          {/* Subtle Atmosphere Glow Sheen (Non-Moon) */}
          {!isMoon && (
            <mesh>
              <sphereGeometry args={[1.22, 32, 32]} />
              <meshStandardMaterial
                color={objType === 'mars' ? '#f97316' : '#38bdf8'}
                transparent
                opacity={0.12}
                roughness={1}
                side={THREE.BackSide}
              />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
}

export function PlanetScene({ color, name, hasRings = false }: PlanetProps) {
  return (
    <div className="w-full h-full min-h-[250px]" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.3, 3.6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        {/* Balanced Three-Point Lighting */}
        <ambientLight intensity={0.35} color="#e2e8f0" />
        <directionalLight position={[5, 3.5, 4.5]} intensity={1.25} color="#ffffff" />
        <directionalLight position={[-4, -2, -3]} intensity={0.25} color="#1e3a5f" />
        <pointLight position={[-3, 2, 2]} intensity={0.4} color="#06b6d4" />

        {/* Ambient StarField */}
        <StarField count={160} spread={18} size={0.03} speed={0.01} opacity={0.65} />

        {/* 3D Celestial Body */}
        <CelestialBody color={color} name={name} hasRings={hasRings} />
      </Canvas>
    </div>
  );
}
