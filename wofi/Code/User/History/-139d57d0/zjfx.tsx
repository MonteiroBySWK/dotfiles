export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center overflow-hidden"
      style={{
        background: `linear-gradient(180deg, hsla(268,78%,56%,1) 0%, hsla(209,100%,40%,1) 48%)`,
      }}
    >
      <h1 className="text-white" style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 'clamp(1.75rem, 6vw, 4.25rem)', textShadow: '0 8px 28px rgba(0,0,0,0.38)' }}>
        em breve voltaremos
      </h1>
    </div>
  );
}
