How it works

Render pipeline

1. The Next.js App mounts the page. `AsciiBackground` is a client component that mounts a R3F `Canvas`.
2. The `Scene` component constructs the scene graph and registers per-frame animation via `useFrame` for components that need it.
3. After the scene is rendered to a WebGLRenderTarget, `AsciiEffect` reads that texture and runs a full-screen quad pass with a shader that maps pixel blocks to ASCII-style output.

Mouse interactions

- Mouse coordinates are normalized and stored in refs. On desktop, these refs are lerped in `useFrame` to produce smoother motion.
- On mobile the mouse handler is disabled and mouse-dependent influence values are set to 0.

Category rotation

- `useCategoryRotation` exposes `currentIndex`, `nextIndex`, `isAnimating`, and two refs (`currentRef`, `nextRef`) used to measure text widths. The rotation sequence uses timeouts to coordinate fade out, width adjust and text swap.

Shaders

- The ASCII shader samples the rendered texture at a reduced resolution to create a blocky character effect, converts to grayscale and selects a bitmask representing the ASCII character.
- Shader uniforms: tDiffuse, resolution, uTime, uMouse

Billboarding

- Groups used for circular overlays copy the camera quaternion to keep elements facing the camera and avoid distortion.

Common pitfalls

- Avoid allocating new objects inside `useFrame` loops. Reuse `THREE.Vector3`/`Vector2` and geometry buffers where possible.
- Changing geometry attributes (positions) requires `needsUpdate = true` on the attribute.
