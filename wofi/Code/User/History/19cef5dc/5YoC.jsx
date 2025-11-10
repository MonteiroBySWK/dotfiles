'use client';

import React, { useRef, useEffect, useState, useMemo, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { SafeAsciiEffect } from './SafeAsciiEffect';

// Componente para o objeto 3D abstrato que será renderizado
const AbstractObject = memo(function AbstractObject({ position = [0, 0, 0], color = '#8937E6', complexity = 64, speed = 1 }) {
  const mesh = useRef(null);
  
  // Animação contínua e mais dinâmica
  useFrame((state, delta) => {
    if (mesh.current) {
      // Rotação suave constante com velocidades diferentes
      mesh.current.rotation.x += delta * 0.5 * speed;
      mesh.current.rotation.y += delta * 0.7 * speed;
      mesh.current.rotation.z += delta * 0.3 * speed;
      
      // Efeito de "respiração" - mudança de escala mais pronunciada
      const pulse = Math.sin(state.clock.elapsedTime * 1.2 * speed) * 0.15;
      const scale = 1 + pulse;
      mesh.current.scale.set(scale, scale, scale);
      
      // Movimento flutuante sutil
      const float = Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.2;
      mesh.current.position.y = position[1] + float;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <torusKnotGeometry args={[1, 0.3, complexity, 16]} />
      <meshStandardMaterial 
        color={color} 
        wireframe 
        roughness={0.5} 
        metalness={0.8} 
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
});

// Componente para responder ao movimento do mouse - otimizado
function MouseParallax({ children }) {
  const { size } = useThree();
  const group = useRef(null);
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!group.current) return;
      
      // Calculando a posição relativa do mouse
      const mouseX = (event.clientX / size.width) * 2 - 1;
      const mouseY = -(event.clientY / size.height) * 2 + 1;
      
      // Aplicando um leve efeito de paralaxe com transição suave
      group.current.rotation.x = mouseY * 0.2;
      group.current.rotation.y = mouseX * 0.2;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);
  
  return <group ref={group}>{children}</group>;
}

// Componente principal do background 3D com efeito ASCII - otimizado
const AsciiBackground = function() {
  const [mounted, setMounted] = useState(false);
  
  // Usar useEffect para garantir que o componente só é renderizado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Objetos são memoizados para evitar recriações desnecessárias
  const objects = useMemo(() => [
    { position: [-2, -1, -1], color: "#8937E6", key: "obj1", speed: 1 },
    { position: [2, 1, -2], color: "#0069CC", key: "obj2", speed: 0.8 },
    { position: [0, 0, -3], color: "#8937E6", key: "obj3", speed: 1.2 },
    { position: [-1.5, 1.5, -2], color: "#0069CC", key: "obj4", speed: 0.9 },
    { position: [1.5, -1.5, -1.5], color: "#8937E6", key: "obj5", speed: 1.1 },
  ], []);

  if (!mounted) {
    return (
      <div 
        className="ascii-background" 
        style={{ 
          backgroundColor: '#212121',
          width: '100%',
          height: '100%',
          position: 'fixed',
          top: 0,
          left: 0
        }}
      />
    );
  }
  
  return (
    <div className="ascii-background" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }} 
        dpr={[1, 2]}
        style={{ background: '#212121' }}
      >
        <color attach="background" args={["#212121"]} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#8937E6" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#0069CC" />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#F7F7F7" />
        
        <MouseParallax>
          {objects.map((obj) => (
            <AbstractObject 
              key={obj.key} 
              position={obj.position} 
              color={obj.color}
              speed={obj.speed}
            />
          ))}
        </MouseParallax>
        
        {/* Renderer ASCII seguro para o efeito de matriz de caracteres */}
        <SafeAsciiEffect 
          resolution={0.15}
          characters=" .:-+*=%@#"
          fgColor="#F7F7F7"
          bgColor="#212121"
          invert={false}
        />
      </Canvas>
    </div>
  );
};

AbstractObject.displayName = 'AbstractObject';
AsciiBackground.displayName = 'AsciiBackground';

export default AsciiBackground;