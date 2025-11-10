"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Definir o tipo de referência para o elemento HTML div
type DivRef = HTMLDivElement | null;

// Shader para renderização ASCII
const fragmentShader = `
uniform sampler2D tDiffuse;
uniform float amount;
uniform float size;
uniform float charWidth;
uniform float charHeight;
uniform vec3 color;

varying vec2 vUv;

// Caracteres ASCII em ordem de densidade de "luz"
const char characters = " .:-=+*#%@";

// Função para obter um caractere ASCII com base na intensidade de luz
float getCharacterIndex(float brightness) {
  // Inverte e escalona para obter índices adequados
  return floor(brightness * 9.0);
}

void main() {
  // Definindo a grade ASCII
  float dx = charWidth * (1.0 / size);
  float dy = charHeight * (1.0 / size);

  // Encontre a célula de grade mais próxima
  vec2 cell = vec2(
    floor(vUv.x / dx),
    floor(vUv.y / dy)
  );

  // Centraliza a amostragem na célula
  vec2 cellUv = vec2(
    (cell.x * dx) + (dx * 0.5),
    (cell.y * dy) + (dy * 0.5)
  );

  // Amostre a textura na posição da célula
  vec3 texel = texture2D(tDiffuse, cellUv).rgb;

  // Calcule a intensidade (brilho) da amostra
  float intensity = (texel.r + texel.g + texel.b) / 3.0;
  
  // Obtenha o índice do caractere correspondente
  float charIndex = getCharacterIndex(intensity);

  // Mapeie o índice do caractere para uma cor proporcional à intensidade
  vec3 outputColor = color * (charIndex / 9.0 + 0.2);

  // Força um "padrão" baseado na posição da grade para simular caracteres
  float pattern = mod(charIndex + cell.x - cell.y, 10.0) / 10.0;
  pattern = smoothstep(0.1, 0.9, pattern);
  
  // Aplique o padrão à cor de saída
  gl_FragColor = vec4(mix(
    vec3(0.0), 
    outputColor, 
    pattern * amount
  ), 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export default function ThreeJsAsciiBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Importar THREE dinamicamente para evitar problemas de SSR
    if (!containerRef.current) return;

    // Configurar cena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight,
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Configurar renderizador com alpha transparente
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    
    // Criar RenderTarget para pós-processamento
    const renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: false
      }
    );
    
    // Configurar pós-processamento ASCII
    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: renderTarget.texture },
          amount: { value: 1.0 }, // Intensidade do efeito
          size: { value: 4.0 }, // Tamanho das células ASCII
          charWidth: { value: 1.0 }, // Proporção de largura dos caracteres
          charHeight: { value: 1.5 }, // Proporção de altura dos caracteres
          color: { value: new THREE.Color(0x00FFBB) } // Cor principal
        },
        vertexShader,
        fragmentShader,
        depthTest: false,
        depthWrite: false
      })
    );
    const finalScene = new THREE.Scene();
    const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    finalScene.add(quad);
    
    // Geometrias e materiais para a cena principal
    const torusGeometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);
    const torusMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8937E6,
      roughness: 0.5,
      metalness: 0.8 
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);
    
    // Adicionar luzes
    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x00FFBB, 1, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);
    
    // Lidar com redimensionamento
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderTarget.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Loop de animação
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Animar torus
      torus.rotation.x += 0.003;
      torus.rotation.y += 0.005;
      
      // Mover a luz em círculos
      const time = Date.now() * 0.001;
      pointLight.position.x = Math.sin(time) * 2;
      pointLight.position.y = Math.cos(time) * 2;
      
      // Renderizar para o target de pós-processamento
      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);
      
      // Renderizar para a tela com o shader ASCII
      renderer.setRenderTarget(null);
      renderer.render(finalScene, orthoCamera);
    };
    
    animate();
    
    // Limpeza
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      window.removeEventListener('resize', handleResize);
      
      // Limpar recursos da GPU
      renderer.dispose();
      renderTarget.dispose();
      torusGeometry.dispose();
      torusMaterial.dispose();
      
      // Verificar se o elemento DOM existe e remove o canvas
      if (containerRef.current && renderer.domElement) {
        const canvas = renderer.domElement;
        if (canvas.parentNode === containerRef.current) {
          containerRef.current.removeChild(canvas);
        }
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 -z-10 overflow-hidden"
      style={{ opacity: 0.5 }}
    />
  );
}