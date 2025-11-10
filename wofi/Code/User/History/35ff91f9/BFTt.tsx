"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useMobile } from "@/hooks/useMobile";
import { asciiShaderMaterial } from "./asciiShader";

export function AsciiEffect() {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<any>(null);
  const mousePositionRef = useRef(new THREE.Vector2(0.5, 0.5));
  const isMobile = useMobile();

  useEffect(() => {
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height);

    const asciiPass = new THREE.ShaderMaterial({
      uniforms: {
        ...asciiShaderMaterial.uniforms,
        resolution: { value: new THREE.Vector2(size.width, size.height) },
      },
      vertexShader: asciiShaderMaterial.vertexShader,
      fragmentShader: asciiShaderMaterial.fragmentShader,
    });

    composerRef.current = { renderTarget, asciiPass };

    if (isMobile) return;

    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current.x = event.clientX / window.innerWidth;
      mousePositionRef.current.y = 1 - event.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size, isMobile]);

  useFrame((state) => {
    if (!composerRef.current) return;

    const { renderTarget, asciiPass } = composerRef.current;

    gl.setRenderTarget(renderTarget);
    gl.render(scene, camera);

    asciiPass.uniforms.tDiffuse.value = renderTarget.texture;
    asciiPass.uniforms.uTime.value = state.clock.getElapsedTime();
    asciiPass.uniforms.uMouse.value = mousePositionRef.current;

    gl.setRenderTarget(null);
    gl.clear();

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
