'use client';

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';
import { AsciiRenderer } from '@react-three/drei';
import React, { useRef, useEffect, useState, useMemo, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';
import { AsciiRenderer, AdaptiveDpr, AdaptiveEvents, usePerformanceMonitor } from '@react-three/drei';

// Componente para o objeto 3D abstrato que será renderizado - memoizado para evitar renderizações desnecessárias
const AbstractObject = memo(function AbstractObject({ position = [0, 0, 0], color = '#8937E6', complexity = 128 }) {
  const mesh = useRef(null);
  
  // Limitando taxa de atualização para melhorar desempenho
  useFrame((state, delta) => {
    if (mesh.current) {
      // Rotação suave com menor taxa de atualização
      mesh.current.rotation.x += delta * 0.05;
      mesh.current.rotation.y += delta * 0.075;
      
      // Efeito de "respiração" - leve mudança de escala
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      mesh.current.scale.x = MathUtils.lerp(mesh.current.scale.x, 1 + pulse, 0.05);
      mesh.current.scale.y = MathUtils.lerp(mesh.current.scale.y, 1 + pulse, 0.05);
      mesh.current.scale.z = MathUtils.lerp(mesh.current.scale.z, 1 + pulse, 0.05);
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <torusKnotGeometry args={[1, 0.3, complexity, 16, 2, 3]} />
      <meshStandardMaterial color={color} wireframe roughness={0.5} metalness={0.8} />
    </mesh>
  );
});

// Componente para responder ao movimento do mouse - otimizado
function MouseParallax({ children }) {
  const { size } = useThree();
  const group = useRef(null);
  
  // Usando debounce para melhorar desempenho do evento de mousemove
  useEffect(() => {
    let timeoutId = null;
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    const handleMouseMove = (event) => {
      if (!group.current) return;
      
      // Armazenando a posição atual do mouse
      lastMouseX = (event.clientX / size.width) * 2 - 1;
      lastMouseY = -(event.clientY / size.height) * 2 + 1;
      
      // Debounce para limitar a taxa de atualizações
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          // Aplicando um leve efeito de paralaxe
          group.current.rotation.x = lastMouseY * 0.1;
          group.current.rotation.y = lastMouseX * 0.1;
          timeoutId = null;
        }, 10); // 10ms debounce
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [size]);
  
  return <group ref={group}>{children}</group>;
}

// Monitor de desempenho para ajustar dinamicamente a qualidade
function PerformanceMonitor() {
  const [dpr, setDpr] = useState(1);
  const [complexity, setComplexity] = useState(128);
  
  usePerformanceMonitor({
    onIncline: () => {
      setDpr(Math.min(dpr + 0.25, 2)); // Aumenta DPR até 2
      setComplexity(Math.min(complexity + 16, 128)); // Aumenta complexidade até 128
    },
    onDecline: () => {
      setDpr(Math.max(dpr - 0.25, 0.75)); // Reduz DPR até 0.75
      setComplexity(Math.max(complexity - 16, 64)); // Reduz complexidade até 64
    }
  });
  
  return { dpr, complexity };
}

// Componente principal do background 3D com efeito ASCII - otimizado
export default function AsciiBackground() {
  const [mounted, setMounted] = useState(false);
  
  // Usar useEffect para garantir que o componente só é renderizado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Objetos são memoizados para evitar recriações desnecessárias
  const objects = useMemo(() => [
    { position: [-2, -1, -1], color: "#8937E6" },
    { position: [2, 1, -2], color: "#0069CC" },
    { position: [0, 0, -3], color: "#8937E6" },
    { position: [-1, 2, -2], color: "#8937E6" },
    { position: [1, -2, -1], color: "#0069CC" }
  ], []);

  if (!mounted) return null;
  
  return (
    <div className="ascii-background">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }} 
        dpr={[0.75, 2]} // Faixa adaptativa de DPR
        frameloop="demand" // Renderiza apenas quando necessário
        performance={{ min: 0.5 }} // Configuração de desempenho
        gl={{ 
          powerPreference: "high-performance",
          antialias: false, // Desativa antialiasing para melhor desempenho
          depth: false, // Desativa depth buffer para melhor desempenho
        }}
      >
        <color attach="background" args={["#212121"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <MouseParallax>
          {objects.map((obj, index) => (
            <AbstractObject 
              key={index} 
              position={obj.position} 
              color={obj.color} 
              complexity={96} // Valor médio para desempenho
            />
          ))}
        </MouseParallax>
        
        {/* Renderer ASCII para o efeito de matriz de caracteres */}
        <AsciiRenderer 
          fgColor="#F7F7F7"
          bgColor="#212121"
          resolution={0.15} // Menor resolução para melhor desempenho
          characters=" .:-+*=%@#"
          invert={false}
        />
        
        {/* Componentes de otimização */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}

AbstractObject.displayName = 'AbstractObject';

// Componente para responder ao movimento do mouse com debounce para melhorar o desempenho
function MouseParallax({ children }) {
  const { size } = useThree();
  const group = useRef(null);
  const lastMoveTime = useRef(0);
  
  const handleMouseMove = useCallback((event) => {
    // Implementação de throttle para limitar a taxa de atualizações
    const now = Date.now();
    if (now - lastMoveTime.current < 50) return;
    lastMoveTime.current = now;
    
    if (!group.current) return;
    
    // Calculando a posição relativa do mouse
    const mouseX = (event.clientX / size.width) * 2 - 1;
    const mouseY = -(event.clientY / size.height) * 2 + 1;
    
    // Aplicando um leve efeito de paralaxe com transição suave
    group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, mouseY * 0.1, 0.1);
    group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, mouseX * 0.1, 0.1);
  }, [size]);
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);
  
  return <group ref={group}>{children}</group>;
}

// Componente principal do background 3D com efeito ASCII
export default function AsciiBackground() {
  const [mounted, setMounted] = useState(false);

  // Usar useEffect para garantir que o componente só é renderizado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Criar objetos memorizados para evitar re-renderizações desnecessárias
  const abstractObjects = useMemo(() => [
    { position: [-2, -1, -1], color: "#8937E6", key: 'obj1' },
    { position: [2, 1, -2], color: "#0069CC", key: 'obj2' },
    { position: [0, 0, -3], color: "#8937E6", key: 'obj3' },
    { position: [-1, 2, -2], color: "#8937E6", key: 'obj4' },
    { position: [1, -2, -1], color: "#0069CC", key: 'obj5' }
  ], []);

  // Configuração memorizada para o AsciiRenderer
  const asciiRendererProps = useMemo(() => ({
    fgColor: "#F7F7F7",
    bgColor: "#212121",
    // Aumentar resolução para melhorar desempenho (valores maiores = menos caracteres = mais rápido)
    resolution: 0.2,
    characters: " .:-+*=%@#",
    invert: false,
  }), []);

  if (!mounted) return null;

  return (
    <div className="ascii-background">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }} 
        dpr={[1, 2]} // Limita o DPR para melhor desempenho
        performance={{ min: 0.5 }} // Configuração de desempenho
      >
        <color attach="background" args={["#212121"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <MouseParallax>
          {abstractObjects.map((obj) => (
            <AbstractObject 
              key={obj.key}
              position={obj.position}
              color={obj.color}
            />
          ))}
        </MouseParallax>
        
        {/* Renderer ASCII para o efeito de matriz de caracteres */}
        <AsciiRenderer {...asciiRendererProps} />
      </Canvas>
    </div>
  );
}