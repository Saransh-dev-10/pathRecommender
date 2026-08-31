import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Glowing Orbiting Ring ─── */
function OrbitRing({ radius = 1.8, color = '#6366f1' }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.02, 8, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

/* ─── Central Completion Orb ─── */
function CompletionOrb({ percentage = 0, targetRole = 'Learning Goal' }) {
  const meshRef = useRef();
  const glowRef = useRef();

  const color = useMemo(() => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 50) return '#06b6d4';
    if (percentage >= 25) return '#6366f1';
    return '#f59e0b';
  }, [percentage]);

  const emissive = useMemo(() => {
    if (percentage >= 80) return '#059669';
    if (percentage >= 50) return '#0891b2';
    if (percentage >= 25) return '#4f46e5';
    return '#d97706';
  }, [percentage]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(t * 0.6) * 0.1;
    }
    if (glowRef.current) {
      const pulse = 1.0 + Math.sin(t * 1.5) * 0.08;
      glowRef.current.scale.set(pulse, pulse, pulse);
      glowRef.current.material.opacity = 0.12 + Math.sin(t * 2) * 0.04;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
      <group>
        {/* Outer aura glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[1.5, 24, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={1.5}
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Main completion sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={0.7}
            roughness={0.25}
            metalness={0.7}
          />
        </mesh>

        {/* Percentage text */}
        <Text
          position={[0, 0, 1.1]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font={undefined}
          fontWeight="bold"
        >
          {percentage}%
        </Text>

        {/* Target role label */}
        <Text
          position={[0, -1.4, 0]}
          fontSize={0.16}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
          textAlign="center"
          font={undefined}
        >
          {targetRole}
        </Text>

        {/* Orbiting rings */}
        <OrbitRing radius={1.3} color={color} />
        <group rotation={[0.4, 0.3, 0]}>
          <OrbitRing radius={1.6} color="#8b5cf6" />
        </group>

        {/* Central point light */}
        <pointLight color={color} intensity={20} distance={6} />
      </group>
    </Float>
  );
}

/* ─── Floating Mini Skill Markers ─── */
function SkillMarkers({ count = 40 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 2.2 + Math.random() * 1.2;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, [count]);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.001;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#6366f1" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ─── Exported 3D Progress Orbit Canvas ─── */
const Roadmap3DProgressOrbit = ({ percentage = 0, targetRole = 'Learning Goal' }) => {
  return (
    <div className="w-full h-full min-h-[280px] rounded-2xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} color="#a5b4fc" />

        <CompletionOrb percentage={percentage} targetRole={targetRole} />
        <SkillMarkers count={50} />
      </Canvas>
    </div>
  );
};

export default Roadmap3DProgressOrbit;
