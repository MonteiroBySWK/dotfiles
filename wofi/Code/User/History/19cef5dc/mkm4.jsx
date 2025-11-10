'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';

// Componente para o objeto 3D abstrato que será renderizado
function AbstractObject({ position = [0, 0, 0], color = '#8937E6' }) {
  const mesh = useRef(null);
  
  useFrame((state, delta) => {
    if (mesh.current) {
      // Rotação suave
      mesh.current.rotation.x += delta * 0.1;
      mesh.current.rotation.y += delta * 0.15;
      
      // Efeito de "respiração" - leve mudança de escala
      const pulse = Math.sin(state.clock.elapsedTime) * 0.05;
      mesh.current.scale.x = MathUtils.lerp(mesh.current.scale.x, 1 + pulse, 0.1);
      mesh.current.scale.y = MathUtils.lerp(mesh.current.scale.y, 1 + pulse, 0.1);
      mesh.current.scale.z = MathUtils.lerp(mesh.current.scale.z, 1 + pulse, 0.1);
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 3]} />
      <meshStandardMaterial color={color} wireframe roughness={0.5} metalness={0.8} />
    </mesh>
  );
}

// Componente para responder ao movimento do mouse
function MouseParallax({ children }) {
  const { size } = useThree();
  const group = useRef(null);
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!group.current) return;
      
      // Calculando a posição relativa do mouse
      const mouseX = (event.clientX / size.width) * 2 - 1;
      const mouseY = -(event.clientY / size.height) * 2 + 1;
      
      // Aplicando um leve efeito de paralaxe
      group.current.rotation.x = mouseY * 0.1;
      group.current.rotation.y = mouseX * 0.1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);
  
  return <group ref={group}>{children}</group>;
}

// Componente principal do background 3D
export default function AsciiBackground() {
  return (
    <div className="ascii-background">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <MouseParallax>
          <AbstractObject position={[-2, -1, -1]} color="#8937E6" />
          <AbstractObject position={[2, 1, -2]} color="#0069CC" />
          <AbstractObject position={[0, 0, -3]} color="#8937E6" />
        </MouseParallax>
      </Canvas>
    </div>
  );
}