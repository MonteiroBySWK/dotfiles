"use client";

interface TaglineProps {
  mounted: boolean;
}

export function Tagline({ mounted }: TaglineProps) {
  return (
    <div
      className={`mt-8 transition-all duration-1000 delay-300 ${
        mounted ? 'opacity-50 translate-y-3' : 'opacity-0 translate-y-6'
      }`}
    >
      <p
        className="font-mono text-sm sm:text-base tracking-widest"
        style={{
          color: 'var(--color-text)',
          letterSpacing: '0.1em',
        }}
      >
        {'<'}Tornando Ideias em Realidade {'/>'}
      </p>
    </div>
  );
}
