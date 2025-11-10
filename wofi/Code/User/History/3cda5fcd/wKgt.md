Conventions

This file documents naming and layout conventions used across the project. Follow these rules when adding or changing code.

Naming

- Components and component folders: PascalCase
  - Example: `AsciiBackground/AsciiBackground.tsx`, `HeroTitle/HeroTitle.tsx`
- Hooks: camelCase, exported with `use` prefix, kept under `src/hooks`
  - Example: `useMobile`, `useMounted`, `useCategoryRotation`
- Variables and functions: camelCase
  - Example: `mousePositionRef`, `handleMouseMove`
- Constants: camelCase or UPPER_SNAKE_CASE for environment constants
  - Example: `particleConfig`, `ANIMATION_TIMINGS`

File layout

- Each component gets its own folder (context), containing the main component file and related subcomponents when applicable.
- Barrel export in `index.tsx` inside each component folder to keep imports simple.
  - Example: `import AsciiBackground from '@/components/AsciiBackground'`

Hooks

- Keep hooks in `src/hooks/` for reuse and testability. They should not depend on UI specifics.

Coding

- Prefer small, focused components. One responsibility per file.
- Use TypeScript types and interfaces to document shapes and props.
- Keep side effects in `useEffect` and cleanup listeners.

Performance

- Limit WebGL render target size and dpr for better performance on lower-end devices.
- Avoid expensive per-frame allocations inside `useFrame`; reuse objects where possible.

Testing

- Add unit tests for hooks and critical pure functions. Visual elements can be validated via snapshot tests or Storybook stories.
