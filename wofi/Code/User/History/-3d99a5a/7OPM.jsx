'use client';

import React, { useEffect, useRef } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { AsciiEffect } from 'three-stdlib';
import * as THREE from 'three';

// Extensão do efeito ASCII para o react-three-fiber
extend({ AsciiEffect });

// Componente para renderização do efeito ASCII
function AsciiRenderer({ invert = true, characters = ' .:-+*=%@#', resolution = 0.15 }) {
  const { gl, scene, camera, size } = useThree();
  
  useEffect(() => {
    // Criando o efeito ASCII
    const effect = new AsciiEffect(gl, characters, {
      invert: invert,
      resolution: resolution,
    });
    
    // Configurando o tamanho do efeito
    effect.setSize(size.width, size.height);
    effect.domElement.style.position = 'absolute';
    effect.domElement.style.top = '0px';
    effect.domElement.style.left = '0px';
    effect.domElement.style.color = 'var(--foreground)';
    effect.domElement.style.backgroundColor = 'var(--background)';
    effect.domElement.style.pointerEvents = 'none';
    
    // Adicionando o elemento ao DOM
    gl.domElement.parentNode.appendChild(effect.domElement);
    
    // Armazenando o renderizador original
    const originalRenderer = gl.domElement;
    originalRenderer.style.display = 'none';
    
    return () => {
      // Limpeza ao desmontar o componente
      gl.domElement.parentNode.removeChild(effect.domElement);
      originalRenderer.style.display = 'block';
    };
  }, [gl, scene, camera, size, characters, invert, resolution]);

  // Renderizando a cena a cada quadro
  useFrame(() => {
    gl.render(scene, camera);
  }, 1);

  return null;
}

// Componente principal que aplica o efeito ASCII ao background 3D
export default function AsciiFilter() {
  return (
    <EffectComposer>
      <AsciiRenderer characters=' .:-+=*^%#@' resolution={0.2} invert={false} />
    </EffectComposer>
  );
}