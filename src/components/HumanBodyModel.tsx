import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Text, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface BodyPartProps {
  position: [number, number, number];
  name: string;
  onSelect: (name: string) => void;
  selected: boolean;
  scale?: [number, number, number];
}

function BodyPart({ position, name, onSelect, selected, scale = [1, 1, 1] }: BodyPartProps) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <mesh 
      position={position} 
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(name);
      }}
    >
      <capsuleGeometry args={[0.3, 1, 4, 16]} />
      <meshStandardMaterial 
        color={selected ? '#ef4444' : hovered ? '#10b981' : '#ffffff'} 
        transparent 
        opacity={selected ? 0.8 : 0.2}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export function HumanBody({ onSelect, selectedPart }: { onSelect: (name: string) => void; selectedPart: string | null }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {/* Head */}
      <mesh position={[0, 4.2, 0]} onClick={() => onSelect('Head')}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color={selectedPart === 'Head' ? '#ef4444' : '#ffffff'} 
          transparent 
          opacity={0.3} 
        />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 3, 0]} onClick={() => onSelect('Torso')}>
        <capsuleGeometry args={[0.5, 1.2, 8, 16]} />
        <meshStandardMaterial 
          color={selectedPart === 'Torso' ? '#ef4444' : '#ffffff'} 
          transparent 
          opacity={0.2} 
        />
      </mesh>

      {/* Arms */}
      <BodyPart position={[-0.9, 3, 0]} name="Left Arm" onSelect={onSelect} selected={selectedPart === 'Left Arm'} scale={[0.6, 1, 0.6]} />
      <BodyPart position={[0.9, 3, 0]} name="Right Arm" onSelect={onSelect} selected={selectedPart === 'Right Arm'} scale={[0.6, 1, 0.6]} />

      {/* Legs */}
      <BodyPart position={[-0.4, 1.2, 0]} name="Left Leg" onSelect={onSelect} selected={selectedPart === 'Left Leg'} scale={[0.7, 1.2, 0.7]} />
      <BodyPart position={[0.4, 1.2, 0]} name="Right Leg" onSelect={onSelect} selected={selectedPart === 'Right Leg'} scale={[0.7, 1.2, 0.7]} />

      {/* Hands/Feet Indicators */}
      <mesh position={[-0.9, 1.8, 0]} onClick={() => onSelect('Left Hand')}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={selectedPart === 'Left Hand' ? '#ef4444' : '#10b981'} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.9, 1.8, 0]} onClick={() => onSelect('Right Hand')}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={selectedPart === 'Right Hand' ? '#ef4444' : '#10b981'} transparent opacity={0.5} />
      </mesh>
      
      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4} 
      />
    </group>
  );
}
