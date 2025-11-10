Deployment and build

Local development

- Install dependencies:

```bash
npm install
```

- Run development server:

```bash
npm run dev
```

Production build

- Build:

```bash
npm run build
```

- Start production server:

```bash
npm start
```

Notes

- The project uses the App Router; static pages may be prerendered depending on usage.
- The build pipeline is standard Next.js build (Turbopack) and can be deployed to Vercel or similar platforms.
- Keep the WebGL renderer settings conservative when deploying to mobile-heavy audiences (limit dpr, disable antialias when possible).
