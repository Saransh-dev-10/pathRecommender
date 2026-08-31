import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Floating Tech Icosahedron Core ─── */
function TechCore() {
  const meshRef = useRef();
  const wireRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.004;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = Math.cos(t * 0.2) * 0.15;
      wireRef.current.rotation.y -= 0.003;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <group>
        {/* Inner solid icosahedron */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.6, 1]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#4f46e5"
            emissiveIntensity={0.6}
            transparent
            opacity={0.35}
            wireframe={false}
          />
        </mesh>

        {/* Outer wireframe icosahedron */}
        <mesh ref={wireRef}>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.5}
            transparent
            opacity={0.25}
            wireframe
          />
        </mesh>

        {/* Glowing point light inside the core */}
        <pointLight color="#818cf8" intensity={30} distance={8} />
      </group>
    </Float>
  );
}

/* ─── Orbiting Skill Particles Ring ─── */
function SkillParticles({ count = 120 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 3.0 + Math.random() * 1.5;
      const height = (Math.random() - 0.5) * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [count]);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const palette = [
      [0.39, 0.4, 0.95],   // brand indigo
      [0.02, 0.71, 0.83],   // cyan
      [0.55, 0.36, 0.96],   // violet
      [0.06, 0.73, 0.5],    // emerald
    ];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = c[0];
      cols[i * 3 + 1] = c[1];
      cols[i * 3 + 2] = c[2];
    }
    return cols;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Main Hero 3D Canvas Export ─── */
const Hero3DMesh = () => {
  return (
    <div className="absolute inset-0 -z-10 opacity-80">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#a5b4fc" />

        <Stars
          radius={50}
          depth={60}
          count={1500}
          factor={3}
          saturation={0.2}
          fade
          speed={0.8}
        />

        <TechCore />
        <SkillParticles count={140} />
      </Canvas>
    </div>
  );
};

export default Hero3DMesh;
