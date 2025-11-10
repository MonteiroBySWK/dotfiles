"use client";

import dynamic from "next/dynamic";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, Suspense, useState } from "react";
import * as THREE from "three";

// ASCII characters for the effect (from darkest to lightest)
const ASCII_CHARS = " .:-=+*#%@";

// Custom ASCII Shader Material
const AsciiShaderMaterial = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2() },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;
    
    float character(float n, vec2 p) {
      p = floor(p * vec2(4.0, -4.0) + 2.5);
      if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y) {
        int a = int(round(p.x) + 5.0 * round(p.y));
        if (((int(n) >> a) & 1) == 1) return 1.0;
      }
      return 0.0;
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 pix = gl_FragCoord.xy;
      
      // Character size
      vec3 col = texture2D(tDiffuse, floor(uv * resolution.xy / 8.0) * 8.0 / resolution.xy).rgb;
      
      float gray = 0.3 * col.r + 0.59 * col.g + 0.11 * col.b;
      
      // Add mouse interaction distortion
      vec2 mouseInfluence = uMouse - uv;
      float dist = length(mouseInfluence);
      gray += smoothstep(0.3, 0.0, dist) * 0.2;
      
      float n = 0.0;
      if (gray > 0.8) n = 65600.0;      // @
      else if (gray > 0.7) n = 15255086.0; // %
      else if (gray > 0.6) n = 11512810.0; // #
      else if (gray > 0.5) n = 1310720.0;  // *
      else if (gray > 0.4) n = 4456448.0;  // +
      else if (gray > 0.3) n = 1118208.0;  // =
      else if (gray > 0.2) n = 4357252.0;  // -
      else if (gray > 0.1) n = 1048576.0;  // :
      else if (gray > 0.05) n = 1310720.0; // .
      
      vec2 p = mod(pix / 4.0, 2.0) - vec2(1.0);
      col = col * character(n, p);
      
      // Apply color palette with gradients
      vec3 primaryColor = vec3(0.537, 0.216, 0.902); // #8937E6
      vec3 secondaryColor = vec3(0.0, 0.412, 0.8);   // #0069CC
      vec3 textColor = vec3(0.969, 0.969, 0.969);     // #F7F7F7
      
      // Create gradient based on position and brightness
      vec3 gradientColor = mix(secondaryColor, primaryColor, uv.y + sin(uTime * 0.5 + uv.x * 3.0) * 0.1);
      col = mix(col * textColor, col * gradientColor, gray * 0.3);
      
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const mousePosition = useRef(new THREE.Vector2(0.5, 0.5));
  const targetMousePosition = useRef(new THREE.Vector2(0.5, 0.5));
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 640,
    []
  );

  // Animação de entrada com transição
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
      setIsTransitioning(true);
      
      // Aguarda a transição completar antes de mostrar conteúdo
      const transitionTimer = setTimeout(() => {
        setShowMainContent(true);
        
        // Remove a transição após mostrar o conteúdo
        const removeTransitionTimer = setTimeout(() => {
          setIsTransitioning(false);
        }, 800);
        
        return () => clearTimeout(removeTransitionTimer);
      }, 1200); // Tempo da expansão
      
      return () => clearTimeout(transitionTimer);
    }, 2000); // 2 segundos de loading
    
    return () => clearTimeout(loadTimer);
  }, []);

  // Handle mouse movement (disabled on mobile)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (event: MouseEvent) => {
      targetMousePosition.current.x = event.clientX / window.innerWidth;
      targetMousePosition.current.y = 1 - event.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Smooth mouse following (only on desktop)
    if (!isMobile) {
      mousePosition.current.lerp(targetMousePosition.current, 0.05);
    }

    // Animate rotation with mouse parallax (reduced on mobile)
    const mouseInfluence = isMobile ? 0 : 0.1;
    meshRef.current.rotation.x =
      Math.sin(time * 0.2) * 0.1 +
      (mousePosition.current.y - 0.5) * mouseInfluence;
    meshRef.current.rotation.y =
      Math.cos(time * 0.15) * 0.1 +
      (mousePosition.current.x - 0.5) * mouseInfluence;
    meshRef.current.rotation.z = time * 0.05;

    // Subtle scale animation (reduced on mobile)
    const scaleAmount = isMobile ? 0.02 : 0.05;
    const scale = 1 + Math.sin(time * 0.3) * scaleAmount;
    meshRef.current.scale.set(scale, scale, scale);

    // Animate wireframe (reduced speed on mobile)
    if (wireframeRef.current) {
      const speedMultiplier = isMobile ? 0.5 : 1;
      wireframeRef.current.rotation.x = -time * 0.1 * speedMultiplier;
      wireframeRef.current.rotation.y = time * 0.15 * speedMultiplier;
      wireframeRef.current.rotation.z = -time * 0.08 * speedMultiplier;
    }

    // Animate outer ring (reduced on mobile)
    if (outerRingRef.current) {
      const speedMultiplier = isMobile ? 0.5 : 1;
      outerRingRef.current.rotation.z = time * 0.3 * speedMultiplier;
      const pulseAmount = isMobile ? 0.1 : 0.2;
      const pulseScale = 3.5 + Math.sin(time * 0.4) * pulseAmount;
      outerRingRef.current.scale.set(pulseScale, pulseScale, 1);
    }

    // Animate inner ring (reduced on mobile)
    if (innerRingRef.current) {
      const speedMultiplier = isMobile ? 0.5 : 1;
      innerRingRef.current.rotation.z = -time * 0.5 * speedMultiplier;
      const pulseAmount = isMobile ? 0.08 : 0.15;
      const pulseScale = 2.5 + Math.cos(time * 0.6) * pulseAmount;
      innerRingRef.current.scale.set(pulseScale, pulseScale, 1);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8937E6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0069CC" />

      {/* Animação de Loading */}
      {!isLoaded && <LoadingAnimation isMobile={isMobile} />}

      {/* Transição de Expansão */}
      {isTransitioning && <TransitionAnimation isMobile={isMobile} />}

      {/* Conteúdo principal - aparece após loading */}
      {showMainContent && (
        <>
          {/* Círculo pontilhado externo */}
          <mesh ref={outerRingRef} position={[0, 0, -1]}>
            <ringGeometry args={[3.3, 3.5, 64]} />
            <meshBasicMaterial
              color="#8937E6"
              transparent
              opacity={isMobile ? 0.5 : 0.3}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Círculo pontilhado interno */}
          <mesh ref={innerRingRef} position={[0, 0, -0.5]}>
            <ringGeometry args={[2.3, 2.5, 48]} />
            <meshBasicMaterial
              color="#0069CC"
              transparent
              opacity={isMobile ? 0.6 : 0.4}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Wireframe sphere ao redor */}
          <lineSegments ref={wireframeRef}>
            <sphereGeometry args={[2.8, 32, 32]} />
            <lineBasicMaterial
              color="#8937E6"
              transparent
              opacity={isMobile ? 0.25 : 0.15}
            />
          </lineSegments>

          {/* Main geometric shape */}
          <mesh ref={meshRef}>
            <icosahedronGeometry args={[2, 4]} />
            <meshStandardMaterial
              color="#8937E6"
              wireframe={false}
              emissive="#0069CC"
              emissiveIntensity={isMobile ? 0.3 : 0.2}
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>

          {/* Additional floating particles (reduced on mobile) */}
          {Array.from({ length: isMobile ? 20 : 50 }).map((_, i) => (
            <FloatingParticle key={i} index={i} />
          ))}

          {/* Ondas expansivas periódicas (reduced on mobile) */}
          {<WaveRings />}

          {/* Partículas em espiral (reduced on mobile) */}
          {!isMobile && <SpiralParticles />}

          {/* Ondas de frequência (desktop only) */}
          {!isMobile && <FrequencyWaves />}

          {/* Anel rotativo com segmentos */}
          {!isMobile && <RotatingSegmentedRing />}

          {/* Animação central exclusiva para mobile */}
          {isMobile && <MobileCenterAnimation />}
        </>
      )}
    </>
  );
}

// Animação de Loading
function LoadingAnimation({ isMobile }: { isMobile: boolean }) {
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const centerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Animar anéis expansivos
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      
      const delay = i * 0.3;
      const progress = ((time + delay) % 2) / 2;
      
      // Expansão
      const scale = 0.3 + progress * 2;
      ring.scale.set(scale, scale, 1);
      
      // Fade out
      const material = ring.material as THREE.MeshBasicMaterial;
      if (material && 'opacity' in material) {
        material.opacity = Math.max(0, 1 - progress);
      }
      
      // Rotação
      ring.rotation.z = time * (0.5 + i * 0.2);
    });

    // Pulse do centro
    if (centerRef.current) {
      const pulse = 1 + Math.sin(time * 3) * 0.2;
      centerRef.current.scale.set(pulse, pulse, pulse);
      centerRef.current.rotation.z = time * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Centro pulsante */}
      <mesh ref={centerRef}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial
          color="#8937E6"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Anéis expansivos */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) ringRefs.current[i] = el;
          }}
          position={[0, 0, -0.1 * (i + 1)]}
        >
          <ringGeometry args={[0.8, 1, 32]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#8937E6" : "#0069CC"}
            transparent
            opacity={1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Pequenas partículas orbitais */}
      {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => {
        const angle = (i / (isMobile ? 4 : 8)) * Math.PI * 2;
        const radius = 1.5;
        return (
          <mesh
            key={`particle-${i}`}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              0
            ]}
          >
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#8937E6" : "#0069CC"}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Animação de Transição - Expansão do círculo
function TransitionAnimation({ isMobile }: { isMobile: boolean }) {
  const expandingCircleRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const startTime = useRef<number | null>(null);

  useFrame((state) => {
    if (!startTime.current) {
      startTime.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - startTime.current;
    const duration = 1.2; // 1.2 segundos de transição
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function para suavizar (easeOutCubic)
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    // Animar círculo principal
    if (expandingCircleRef.current) {
      // Expansão suave e acelerada
      const scale = 0.5 + easeProgress * 15;
      expandingCircleRef.current.scale.set(scale, scale, 1);

      // Fade out suave começando mais cedo
      const material = expandingCircleRef.current.material as THREE.MeshBasicMaterial;
      if (material && 'opacity' in material) {
        const fadeStart = 0.5;
        if (progress > fadeStart) {
          const fadeProgress = (progress - fadeStart) / (1 - fadeStart);
          material.opacity = 0.8 * (1 - fadeProgress);
        } else {
          material.opacity = 0.8;
        }
      }
    }

    // Animar anel externo
    if (ringRef.current) {
      const scale = 0.8 + easeProgress * 18;
      ringRef.current.scale.set(scale, scale, 1);
      
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      if (material && 'opacity' in material) {
        const fadeStart = 0.55;
        if (progress > fadeStart) {
          const fadeProgress = (progress - fadeStart) / (1 - fadeStart);
          material.opacity = 0.6 * (1 - fadeProgress);
        } else {
          material.opacity = 0.6;
        }
      }
      
      // Rotação suave
      ringRef.current.rotation.z = progress * Math.PI * 2;
    }

    // Animar anel interno
    if (innerRingRef.current) {
      const scale = 0.3 + easeProgress * 12;
      innerRingRef.current.scale.set(scale, scale, 1);
      
      const material = innerRingRef.current.material as THREE.MeshBasicMaterial;
      if (material && 'opacity' in material) {
        const fadeStart = 0.45;
        if (progress > fadeStart) {
          const fadeProgress = (progress - fadeStart) / (1 - fadeStart);
          material.opacity = 0.5 * (1 - fadeProgress);
        } else {
          material.opacity = 0.5;
        }
      }
      
      // Rotação oposta
      innerRingRef.current.rotation.z = -progress * Math.PI * 1.5;
    }
  });

  return (
    <group position={[0, 0, 2]}>
      {/* Círculo central expandindo */}
      <mesh ref={expandingCircleRef}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial
          color="#8937E6"
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Anel interno */}
      <mesh ref={innerRingRef} position={[0, 0, 0.1]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial
          color="#0069CC"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Anel externo de borda */}
      <mesh ref={ringRef} position={[0, 0, 0.2]}>
        <ringGeometry args={[1.2, 1.4, 32]} />
        <meshBasicMaterial
          color="#8937E6"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function FloatingParticle({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 640,
    []
  );
  const offset = useMemo(
    () => ({
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 10,
      speed: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    meshRef.current.position.x =
      offset.x + Math.sin(time * offset.speed + offset.phase) * 2;
    meshRef.current.position.y =
      offset.y + Math.cos(time * offset.speed * 0.7 + offset.phase) * 2;
    meshRef.current.position.z =
      offset.z + Math.sin(time * offset.speed * 0.5 + offset.phase) * 2;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[isMobile ? 0.025 : 0.02, 8, 8]} />
      <meshBasicMaterial 
        color={index % 2 === 0 ? "#8937E6" : "#0069CC"} 
        opacity={isMobile ? 0.8 : 1}
        transparent={isMobile}
      />
    </mesh>
  );
}

// Animação central exclusiva para mobile - Fluido Orgânico Simplificado
function MobileCenterAnimation() {
  const fluidRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animar o fluido principal com deformação orgânica
    if (fluidRef.current) {
      const geometry = fluidRef.current.geometry as THREE.SphereGeometry;
      const positions = geometry.attributes.position;
      
      // Deformar vertices para criar efeito fluido suave
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        
        // Ondulações suaves
        const wave = Math.sin(time * 1.5 + x * 2 + y * 2) * 0.12;
        const scale = 1 + wave;
        
        positions.setXYZ(
          i,
          x * scale,
          y * scale,
          z * scale
        );
      }
      
      positions.needsUpdate = true;
      
      // Rotação suave
      fluidRef.current.rotation.z = time * 0.15;
    }

    // Animar brilho externo
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.1;
      glowRef.current.scale.set(pulse, pulse, 1);
      glowRef.current.rotation.z = -time * 0.2;
      
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      if (material && 'opacity' in material) {
        material.opacity = 0.3 + Math.sin(time * 1.5) * 0.15;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Fluido principal - esfera deformável */}
      <mesh ref={fluidRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#8937E6"
          transparent
          opacity={0.7}
          roughness={0.2}
          metalness={0.8}
          emissive="#8937E6"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Anel de brilho externo */}
      <mesh ref={glowRef} position={[0, 0, -0.5]}>
        <ringGeometry args={[1.6, 1.8, 32]} />
        <meshBasicMaterial
          color="#0069CC"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Camada de brilho sutil */}
      <mesh position={[0, 0, -1]}>
        <ringGeometry args={[2.0, 2.2, 32]} />
        <meshBasicMaterial
          color="#8937E6"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Ondas expansivas que aparecem periodicamente
function WaveRings() {
  const rings = useRef<THREE.Group>(null);
  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 640,
    []
  );

  useFrame((state) => {
    if (!rings.current) return;

    const time = state.clock.getElapsedTime();

    rings.current.children.forEach((ring, i) => {
      const offset = i * 0.5;
      const waveTime = (time + offset) % 3;
      const progress = waveTime / 3;

      const scale = 1 + progress * 4;
      ring.scale.set(scale, scale, 1);

      // Fade out conforme expande
      const mesh = ring as THREE.Mesh;
      if (mesh.material && "opacity" in mesh.material) {
        const baseOpacity = isMobile ? 0.7 : 0.6;
        mesh.material.opacity = Math.max(0, baseOpacity - progress * baseOpacity);
      }
    });
  });

  return (
    <group ref={rings}>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -2]}>
          <ringGeometry args={[1.8, 2, 48]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#8937E6" : "#0069CC"}
            transparent
            opacity={isMobile ? 0.7 : 0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// Partículas em movimento espiral
function SpiralParticles() {
  const particles = useRef<THREE.Group>(null);
  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 640,
    []
  );

  useFrame((state) => {
    if (!particles.current) return;

    const time = state.clock.getElapsedTime();

    particles.current.children.forEach((particle, i) => {
      const angle = (time * 0.5 + i * 0.3) % (Math.PI * 2);
      const radius = 3 + Math.sin(time * 0.3 + i) * 0.5;
      const height = Math.sin(time * 0.4 + i * 0.5) * 2;

      particle.position.x = Math.cos(angle) * radius;
      particle.position.y = height;
      particle.position.z = Math.sin(angle) * radius;

      // Pulsar opacidade
      const baseOpacity = isMobile ? 0.4 : 0.3;
      const opacity = baseOpacity + Math.sin(time * 2 + i) * 0.2;
      const mesh = particle as THREE.Mesh;
      if (mesh.material && "opacity" in mesh.material) {
        mesh.material.opacity = opacity;
      }
    });
  });

  return (
    <group ref={particles}>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[isMobile ? 0.06 : 0.05, 8, 8]} />
          <meshBasicMaterial
            color={
              i % 3 === 0 ? "#8937E6" : i % 3 === 1 ? "#0069CC" : "#F7F7F7"
            }
            transparent
            opacity={isMobile ? 0.6 : 0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// Equalizador 3D estilo audio visualizer
function AudioEqualizer() {
  const bars = useRef<THREE.Group>(null);
  const barCount = 16;

  useFrame((state) => {
    if (!bars.current) return;

    const time = state.clock.getElapsedTime();

    bars.current.children.forEach((bar, i) => {
      const angle = (i / barCount) * Math.PI * 2;
      const radius = 4;

      // Simular frequências de áudio
      const frequency = Math.sin(time * 3 + i * 0.5) * 0.5 + 0.5;
      const height = 0.5 + frequency * 2;

      bar.position.x = Math.cos(angle) * radius;
      bar.position.z = Math.sin(angle) * radius;
      bar.scale.y = height;

      // Cor baseada na altura
      const mesh = bar as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material && material.color) {
        const colorIntensity = frequency;
        material.color.setHSL(0.7 - colorIntensity * 0.15, 0.8, 0.5);
      }
    });
  });

  return (
    <group ref={bars} position={[0, -2, 0]}>
      {Array.from({ length: barCount }).map((_, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.15, 1, 0.15]} />
          <meshStandardMaterial
            color="#8937E6"
            emissive="#8937E6"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// Ondas de frequência que se movem
function FrequencyWaves() {
  const waves = useRef<THREE.Group>(null);
  const waveCount = 5;

  useFrame((state) => {
    if (!waves.current) return;

    const time = state.clock.getElapsedTime();

    waves.current.children.forEach((wave, waveIndex) => {
      const mesh = wave as THREE.Mesh;
      const geometry = mesh.geometry as THREE.TorusGeometry;
      const positions = geometry.attributes.position;

      // Animar vértices criando ondulação
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        const distortion = Math.sin(time * 2 + i * 0.1 + waveIndex) * 0.1;
        positions.setY(i, y + distortion);
      }

      positions.needsUpdate = true;

      // Rotação
      mesh.rotation.x = time * 0.3 + waveIndex;
      mesh.rotation.y = time * 0.2;

      // Opacidade pulsante
      if (mesh.material && "opacity" in mesh.material) {
        mesh.material.opacity = 0.2 + Math.sin(time * 1.5 + waveIndex) * 0.1;
      }
    });
  });

  return (
    <group ref={waves} position={[0, 0, 0]}>
      {Array.from({ length: waveCount }).map((_, i) => (
        <mesh key={i}>
          <torusGeometry args={[2 + i * 0.5, 0.05, 16, 100]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#8937E6" : "#0069CC"}
            transparent
            opacity={0.2}
            wireframe={true}
          />
        </mesh>
      ))}
    </group>
  );
}

// Anel segmentado rotativo
function RotatingSegmentedRing() {
  const segments = useRef<THREE.Group>(null);
  const segmentCount = 24;
  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 640,
    []
  );

  useFrame((state) => {
    if (!segments.current) return;

    const time = state.clock.getElapsedTime();

    // Rotação do grupo inteiro
    segments.current.rotation.z = time * 0.4;

    segments.current.children.forEach((segment, i) => {
      const mesh = segment as THREE.Mesh;

      // Animação de escala individual
      const scalePhase = Math.sin(time * 2 + i * 0.3) * 0.5 + 0.5;
      mesh.scale.set(1, 1 + scalePhase * 0.5, 1);

      // Rotação individual
      mesh.rotation.y = time * 1.5 + i;

      // Cor pulsante
      if (mesh.material && "emissiveIntensity" in mesh.material) {
        const baseIntensity = isMobile ? 0.4 : 0.2;
        mesh.material.emissiveIntensity = baseIntensity + scalePhase * 0.3;
      }
    });
  });

  return (
    <group ref={segments} position={[0, 0, 0]}>
      {Array.from({ length: segmentCount }).map((_, i) => {
        const angle = (i / segmentCount) * Math.PI * 2;
        const radius = 3.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.3, 0.1, 0.08]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#8937E6" : "#0069CC"}
              emissive={i % 2 === 0 ? "#8937E6" : "#0069CC"}
              emissiveIntensity={isMobile ? 0.5 : 0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Sistema orbital complexo
function OrbitalSystem() {
  const orbits = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!orbits.current) return;

    const time = state.clock.getElapsedTime();

    orbits.current.children.forEach((orbit, orbitIndex) => {
      const group = orbit as THREE.Group;

      // Rotação da órbita
      group.rotation.x = Math.sin(time * 0.2 + orbitIndex) * 0.5;
      group.rotation.y = time * (0.3 + orbitIndex * 0.1);
      group.rotation.z = Math.cos(time * 0.15 + orbitIndex) * 0.3;

      // Animar objetos na órbita
      group.children.forEach((obj, objIndex) => {
        const mesh = obj as THREE.Mesh;
        const angle = (time + objIndex) * 0.5;
        const radius = 2 + orbitIndex * 0.8;

        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.z = Math.sin(angle) * radius;

        // Rotação própria
        mesh.rotation.x = time * 2;
        mesh.rotation.y = time * 1.5;

        // Escala pulsante
        const scale = 0.8 + Math.sin(time * 3 + objIndex) * 0.2;
        mesh.scale.set(scale, scale, scale);
      });
    });
  });

  return (
    <group ref={orbits}>
      {Array.from({ length: 3 }).map((_, orbitIndex) => (
        <group key={orbitIndex}>
          {Array.from({ length: 4 }).map((_, objIndex) => (
            <mesh key={objIndex}>
              <octahedronGeometry args={[0.08]} />
              <meshStandardMaterial
                color={orbitIndex % 2 === 0 ? "#8937E6" : "#0069CC"}
                emissive={orbitIndex % 2 === 0 ? "#8937E6" : "#0069CC"}
                emissiveIntensity={0.5}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ASCII Post-processing effect
function AsciiEffect() {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<any>(null);
  const mousePosition = useRef(new THREE.Vector2(0.5, 0.5));
  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 640,
    []
  );

  useEffect(() => {
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height);

    const asciiPass = new THREE.ShaderMaterial({
      uniforms: {
        ...AsciiShaderMaterial.uniforms,
        resolution: { value: new THREE.Vector2(size.width, size.height) },
      },
      vertexShader: AsciiShaderMaterial.vertexShader,
      fragmentShader: AsciiShaderMaterial.fragmentShader,
    });

    composer.current = { renderTarget, asciiPass };

    // Disable mouse movement effect on mobile
    if (isMobile) return;

    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = event.clientX / window.innerWidth;
      mousePosition.current.y = 1 - event.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size, isMobile]);

  useFrame((state) => {
    if (!composer.current) return;

    const { renderTarget, asciiPass } = composer.current;

    // Render scene to texture
    gl.setRenderTarget(renderTarget);
    gl.render(scene, camera);

    // Update uniforms
    asciiPass.uniforms.tDiffuse.value = renderTarget.texture;
    asciiPass.uniforms.uTime.value = state.clock.getElapsedTime();
    asciiPass.uniforms.uMouse.value = mousePosition.current;

    // Render ASCII effect
    gl.setRenderTarget(null);
    gl.clear();

    // Render fullscreen quad with ASCII shader
    const fullscreenQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      asciiPass
    );

    const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const orthoScene = new THREE.Scene();
    orthoScene.add(fullscreenQuad);

    gl.render(orthoScene, orthoCamera);
  }, 1);

  return null;
}

export default function AsciiBackground() {
  return (
    <div className="fixed inset-0 w-full h-full bg-[var(--color-background)]">
      <Suspense
        fallback={
          <div className="w-full h-full bg-[var(--color-background)]" />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{
            antialias: false, // Disabled for better performance with ASCII effect
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1.5]} // Limit pixel ratio for performance
        >
          <Scene />
          <AsciiEffect />
        </Canvas>
      </Suspense>
    </div>
  );
}
