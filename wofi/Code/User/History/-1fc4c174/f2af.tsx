"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SimpleAsciiBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    // Configurar cena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight,
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Configurar renderizador
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    
    // Adicionar geometria - TorusKnot
    const torusGeometry = new THREE.TorusKnotGeometry(1, 0.3, 64, 16);
    const torusMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8937E6,
      wireframe: true,
      emissive: 0x220033,
      shininess: 100
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);
    
    // Adicionar partículas para criar efeito ASCII
    const particleGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    // Criar posições aleatórias para partículas
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      // Posição
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      // Cores
      colors[i * 3] = Math.random() * 0.5 + 0.5; // R
      colors[i * 3 + 1] = Math.random() * 0.5; // G
      colors[i * 3 + 2] = Math.random() * 0.5 + 0.5; // B
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Adicionar luzes
    const ambientLight = new THREE.AmbientLight(0x444444);
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
    };
    
    window.addEventListener('resize', handleResize);
    
    // Loop de animação
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Animar torus
      torus.rotation.x += 0.003;
      torus.rotation.y += 0.005;
      
      // Animar partículas
      particles.rotation.x += 0.0005;
      particles.rotation.y += 0.001;
      
      // Mover a luz em círculos
      const time = Date.now() * 0.001;
      pointLight.position.x = Math.sin(time) * 2;
      pointLight.position.y = Math.cos(time) * 2;
      
      // Renderizar cena
      renderer.render(scene, camera);
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
      torusGeometry.dispose();
      torusMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      
      // Remover canvas
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
      style={{ opacity: 0.7 }}
    />
  );
}