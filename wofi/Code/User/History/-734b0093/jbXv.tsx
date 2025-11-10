interface SonarLoaderProps {
  size: number,
  color: string,
  ringCount: number
  speed: number,
  children: React.ReactNode
}

export default function SonarLoader({
  size = 64,
  color = "blue-500",
  ringCount = 3,
  speed = 1.5,
  children,
}: SonarLoaderProps ) {
  const rings = Array.from({ length: Math.max(1, ringCount) });
  const centerBg = `bg-${color}`;
  const ringBorder = `ring-2 ring-${color}`;

  return (
    <div
      className="inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-live="polite"
      role="status"
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {rings.map((_, i) => {
          // stagger delays so pulses cascade
          const delay = (i * (speed / Math.max(1, ringCount))).toFixed(3) + "s";
          const ringSize = Math.round(size * (0.6 + (i / Math.max(1, ringCount)) * 0.8));

          return (
            <span
              key={i}
              aria-hidden
              className={`absolute rounded-full opacity-60 animate-ping`}
              style={{
                width: ringSize,
                height: ringSize,
                animationDuration: `${speed}s`,
                animationDelay: delay,
                transformOrigin: "center",
                border: "2px solid",
                borderColor: undefined,
              }}
            />
          );
        })}

        <div
          className={`relative rounded-full flex items-center justify-center ${centerBg} shadow-md`}
          style={{ width: Math.round(size * 0.22), height: Math.round(size * 0.22) }}
        >
          {children ?? (
            <span className="sr-only">Carregando...</span>
          )}
        </div>

        <style>{`
          /* target the immediate absolute children (the rings) and set their border/background color based on the provided color token */
          .relative > .animate-ping { background-color: transparent; }
        `}</style>
      </div>
    </div>
  );
}
