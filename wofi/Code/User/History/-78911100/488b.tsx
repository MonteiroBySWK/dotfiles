"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeJsAsciiBackgroundProps {
  className?: string;
}

export default function ThreeJsAsciiBackground({ className }: ThreeJsAsciiBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const asciiOutputRef = useRef<HTMLPreElement>(null);
  
  // ASCII density characters from dark to light
  const ASCII_CHARS = ' .:-+*=%@#';

  useEffect(() => {
    if (!containerRef.current || !asciiOutputRef.current) return;
    
    const container = containerRef.current;
    const outputElement = asciiOutputRef.current;
    
    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030014);
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Setup ASCII renderer variables
    const asciiWidth = 160;
    const asciiHeight = 80;
    
    // Hidden canvas for ASCII conversion
    const hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = asciiWidth;
    hiddenCanvas.height = asciiHeight;
    const ctx = hiddenCanvas.getContext('2d');
    
    if (!ctx) return;
    
    // Create Thera 'T' particles system
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // T shape coordinates
    const createTShape = () => {
      const tShape = [];
      // Horizontal part of T (top)
      for (let x = -1; x <= 1; x += 0.1) {
        tShape.push([x, 1, 0]);
      }
      // Vertical part of T (stem)
      for (let y = 1; y >= -1; y -= 0.1) {
        tShape.push([0, y, 0]);
      }
      return tShape;
    };
    
    const tShape = createTShape();
    
    // Fill most particles in T shape, rest randomly
    for (let i = 0; i < particleCount; i++) {
      let x, y, z;
      
      if (i < tShape.length * 3) {
        // Use T shape
        const idx = i % tShape.length;
        x = tShape[idx][0] * 3;
        y = tShape[idx][1] * 3;
        z = (Math.random() - 0.5) * 2; // Random depth
      } else {
        // Random particles for atmosphere
        x = (Math.random() - 0.5) * 10;
        y = (Math.random() - 0.5) * 10;
        z = (Math.random() - 0.5) * 10;
      }
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Color gradient: purple to blue
      const purple = new THREE.Color(0x8937E6);
      const blue = new THREE.Color(0x0069CC);
      const mixRatio = (x + 5) / 10; // Normalize to 0-1 range
      const color = new THREE.Color().lerpColors(purple, blue, mixRatio);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create points material
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    
    // Create points system
    const pointsSystem = new THREE.Points(particles, pointsMaterial);
    scene.add(pointsSystem);
    
    // Add some floating 3D objects
    const geometries = [
      new THREE.TorusKnotGeometry(1, 0.3, 100, 16),
      new THREE.IcosahedronGeometry(1, 1),
      new THREE.OctahedronGeometry(1)
    ];
    
    const objects: THREE.Mesh[] = [];
    
    // Create multiple floating objects
    for (let i = 0; i < 3; i++) {
      const geometry = geometries[i % geometries.length];
      const material = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0x8937E6 : i === 1 ? 0x0069CC : 0x00FFBB,
        wireframe: true
      });
      
      const object = new THREE.Mesh(geometry, material);
      object.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5
      );
      
      object.scale.multiplyScalar(0.5);
      objects.push(object);
      scene.add(object);
    }
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Function to convert to ASCII
    const renderAscii = () => {
      ctx.clearRect(0, 0, asciiWidth, asciiHeight);
      
      // Draw current WebGL frame to hidden canvas
      ctx.drawImage(renderer.domElement, 0, 0, asciiWidth, asciiHeight);
      
      // Get pixel data
      const imageData = ctx.getImageData(0, 0, asciiWidth, asciiHeight).data;
      
      // Convert to ASCII art
      let asciiArt = '';
      
      for (let y = 0; y < asciiHeight; y++) {
        for (let x = 0; x < asciiWidth; x++) {
          const idx = (y * asciiWidth + x) * 4;
          const r = imageData[idx];
          const g = imageData[idx + 1];
          const b = imageData[idx + 2];
          
          // Calculate brightness (weighted for human perception)
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          
          // Get corresponding ASCII char
          const charIdx = Math.floor(brightness * (ASCII_CHARS.length - 1));
          const char = ASCII_CHARS[charIdx];
          
          asciiArt += char;
        }
        asciiArt += '\n';
      }
      
      // Update ASCII output
      outputElement.textContent = asciiArt;
    };
    
    // Animation loop
    const animate = () => {
      const frame = requestAnimationFrame(animate);
      
      // Rotate particles
      pointsSystem.rotation.y += 0.002;
      pointsSystem.rotation.x += 0.001;
      
      // Animate objects
      objects.forEach((obj, i) => {
        obj.rotation.x += 0.01 * (i + 1);
        obj.rotation.y += 0.02 / (i + 1);
        
        // Make objects float
        obj.position.y += Math.sin(Date.now() * 0.001 * (i + 1)) * 0.01;
      });
      
      // Render scene
      renderer.render(scene, camera);
      
      // Convert to ASCII and update
      renderAscii();
      
      return frame;
    };
    
    // Start animation
    const animationFrame = animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return (
    <div className={`fixed inset-0 overflow-hidden ${className || ''}`}>
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0 opacity-0"
      />
      <pre 
        ref={asciiOutputRef} 
        className="absolute inset-0 z-10 overflow-hidden text-[#00FFBB] text-[5px] md:text-[8px] lg:text-[10px] font-mono leading-none pointer-events-none"
      />
      
      {/* Gradient overlay to enhance effect */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#030014]/0 via-[#030014]/0 to-[#030014] pointer-events-none" />
      <div className="absolute inset-0 z-30 bg-gradient-to-r from-[#030014] via-[#030014]/0 to-[#030014] pointer-events-none" />
    </div>
  );
}