import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Tube, MeshDistortMaterial, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useScroll, useTransform } from 'motion/react';

export function ThreeSnake() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to 3D movement
  // Lunging towards screen (Z axis)
  const zPos = useTransform(scrollYProgress, [0, 0.4, 0.8], [-20, 8, 2]);
  const rotationX = useTransform(scrollYProgress, [0, 0.5], [0, Math.PI * 0.5]);
  const rotationY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.1, 1, 1, 0]);

  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i < 30; i++) {
      points.push(
        new THREE.Vector3(
          Math.sin(i * 0.3) * (1 + i * 0.05),
          i * 0.4 - 6,
          Math.cos(i * 0.3) * (0.5 + i * 0.02)
        )
      );
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Subtle breathing animation
    meshRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.02);
    
    // Apply motion transforms manually to the mesh for smoothness in Three.js
    meshRef.current.position.z = zPos.get();
    meshRef.current.rotation.x = rotationX.get();
    meshRef.current.rotation.y = rotationY.get() + Math.sin(time * 0.5) * 0.2;
    
    // Lunging mouth/head focus towards center
    const mouseX = (state.mouse.x * state.viewport.width) / 2;
    const mouseY = (state.mouse.y * state.viewport.height) / 2;
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -mouseX * 0.05, 0.1);
  });

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Tube args={[curve, 128, 0.4, 32, false]} ref={meshRef}>
        <MeshDistortMaterial
          color="#10b981"
          speed={4}
          distort={0.3}
          radius={1}
          metalness={0.9}
          roughness={0.1}
          emissive="#064e3b"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </Tube>
      
      {/* Dynamic lighting that follows the lunge */}
      <spotLight
        position={[0, 10, 10]}
        intensity={2}
        color="#10b981"
        angle={0.15}
        penumbra={1}
      />
    </>
  );
}
