export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-center">
      {/* palette gradient overlays */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_600px_at_0%_0%,_rgba(137,55,230,0.22)_0%,_transparent_60%),radial-gradient(900px_600px_at_100%_100%,_rgba(0,105,204,0.22)_0%,_transparent_60%)]"
      />
      <div>
        <h1 className="font-mono text-5xl font-medium tracking-tight text-[#F7F7F7] md:text-7xl">
          em breve voltaremos
        </h1>
        <div
          aria-hidden
          className="mx-auto mt-6 h-[2px] w-24 bg-gradient-to-r from-[#8937E6] to-[#0069CC]"
        />
      </div>
    </div>
  );
}
