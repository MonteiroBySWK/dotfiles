import * as THREE from "three";

export const asciiShaderMaterial = {
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
      
      vec3 col = texture2D(tDiffuse, floor(uv * resolution.xy / 8.0) * 8.0 / resolution.xy).rgb;
      
      float gray = 0.3 * col.r + 0.59 * col.g + 0.11 * col.b;
      
      vec2 mouseInfluence = uMouse - uv;
      float dist = length(mouseInfluence);
      gray += smoothstep(0.3, 0.0, dist) * 0.2;
      
      float n = 0.0;
      if (gray > 0.8) n = 65600.0;
      else if (gray > 0.7) n = 15255086.0;
      else if (gray > 0.6) n = 11512810.0;
      else if (gray > 0.5) n = 1310720.0;
      else if (gray > 0.4) n = 4456448.0;
      else if (gray > 0.3) n = 1118208.0;
      else if (gray > 0.2) n = 4357252.0;
      else if (gray > 0.1) n = 1048576.0;
      else if (gray > 0.05) n = 1310720.0;
      
      vec2 p = mod(pix / 4.0, 2.0) - vec2(1.0);
      col = col * character(n, p);
      
      vec3 primaryColor = vec3(0.537, 0.216, 0.902);
      vec3 secondaryColor = vec3(0.0, 0.412, 0.8);
      vec3 textColor = vec3(0.969, 0.969, 0.969);
      
      vec3 gradientColor = mix(secondaryColor, primaryColor, uv.y + sin(uTime * 0.5 + uv.x * 3.0) * 0.1);
      col = mix(col * textColor, col * gradientColor, gray * 0.3);
      
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};
