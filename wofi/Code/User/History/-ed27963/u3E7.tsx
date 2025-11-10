"use client";"use client";



import { useEffect, useState } from "react";import { useEffect, useState } from "react";



export default function Home() {export default f  useEffect(() => {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });    const interval = setInterval(() => {

  const [currentFrame, setCurrentFrame] = useState(0);      setCurrentFrame((prev) => (prev + 1) % bootFrames.length);

    }, 3000);

  // Linux-style boot terminal frames    return () => clearInterval(interval);

  const bootFrames = [  }, [bootFrames.length]);n Home() {

    `[    0.000000] TheraOS 2.0.1 booting...  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

[    0.001243] Initializing kernel modules  const [currentFrame, setCurrentFrame] = useState(0);

[    0.002847] Loading CPU microcode

[    0.003921] Memory: 32GB available  // Linux-style boot terminal frames

[    0.004155] Detecting hardware...  const bootFrames = [

[    0.005234]     `[    0.000000] TheraOS 2.0.1 booting...

[    0.005234] Starting Thera Labs services:[    0.001243] Initializing kernel modules

[    0.006789] * Loading development environment... [  OK  ][    0.002847] Loading CPU microcode

[    0.007234] * Initializing code repositories... [  OK  ][    0.003921] Memory: 32GB available

[    0.008945] * Starting React compiler... [     ]`,[    0.004155] Detecting hardware...

    `[    0.000000] TheraOS 2.0.1 booting...[    0.005234] 

[    0.001243] Initializing kernel modules[    0.005234] Starting Thera Labs services:

[    0.002847] Loading CPU microcode[    0.006789] * Loading development environment... [  OK  ]

[    0.003921] Memory: 32GB available[    0.007234] * Initializing code repositories... [  OK  ]

[    0.004155] Detecting hardware...[    0.008945] * Starting React compiler... [     ]`,

[    0.005234]     `[    0.000000] TheraOS 2.0.1 booting...

[    0.005234] Starting Thera Labs services:[    0.001243] Initializing kernel modules

[    0.006789] * Loading development environment... [  OK  ][    0.002847] Loading CPU microcode

[    0.007234] * Initializing code repositories... [  OK  ][    0.003921] Memory: 32GB available

[    0.008945] * Starting React compiler... [  OK  ][    0.004155] Detecting hardware...

[    0.009567] * Loading TypeScript engine... [     ][    0.005234] 

[    0.010234] * Connecting to cloud services... [     ]`,[    0.005234] Starting Thera Labs services:

    `[    0.000000] TheraOS 2.0.1 booting...[    0.006789] * Loading development environment... [  OK  ]

[    0.001243] Initializing kernel modules[    0.007234] * Initializing code repositories... [  OK  ]

[    0.002847] Loading CPU microcode[    0.008945] * Starting React compiler... [  OK  ]

[    0.003921] Memory: 32GB available[    0.009567] * Loading TypeScript engine... [     ]

[    0.004155] Detecting hardware...[    0.010234] * Connecting to cloud services... [     ]`,

[    0.005234]     `[    0.000000] TheraOS 2.0.1 booting...

[    0.005234] Starting Thera Labs services:[    0.001243] Initializing kernel modules

[    0.006789] * Loading development environment... [  OK  ][    0.002847] Loading CPU microcode

[    0.007234] * Initializing code repositories... [  OK  ][    0.003921] Memory: 32GB available

[    0.008945] * Starting React compiler... [  OK  ][    0.004155] Detecting hardware...

[    0.009567] * Loading TypeScript engine... [  OK  ][    0.005234] 

[    0.010234] * Connecting to cloud services... [  OK  ][    0.005234] Starting Thera Labs services:

[    0.011789] * Optimizing build pipeline... [  OK  ][    0.006789] * Loading development environment... [  OK  ]

[    0.012456] * Testing deployment scripts... [     ]`,[    0.007234] * Initializing code repositories... [  OK  ]

    `[    0.000000] TheraOS 2.0.1 booting...[    0.008945] * Starting React compiler... [  OK  ]

[    0.001243] Initializing kernel modules[    0.009567] * Loading TypeScript engine... [  OK  ]

[    0.002847] Loading CPU microcode[    0.010234] * Connecting to cloud services... [  OK  ]

[    0.003921] Memory: 32GB available[    0.011789] * Optimizing build pipeline... [  OK  ]

[    0.004155] Detecting hardware...[    0.012456] * Testing deployment scripts... [     ]`,

[    0.005234]     `[    0.000000] TheraOS 2.0.1 booting...

[    0.005234] Starting Thera Labs services:[    0.001243] Initializing kernel modules

[    0.006789] * Loading development environment... [  OK  ][    0.002847] Loading CPU microcode

[    0.007234] * Initializing code repositories... [  OK  ][    0.003921] Memory: 32GB available

[    0.008945] * Starting React compiler... [  OK  ][    0.004155] Detecting hardware...

[    0.009567] * Loading TypeScript engine... [  OK  ][    0.005234] 

[    0.010234] * Connecting to cloud services... [  OK  ][    0.005234] Starting Thera Labs services:

[    0.011789] * Optimizing build pipeline... [  OK  ][    0.006789] * Loading development environment... [  OK  ]

[    0.012456] * Testing deployment scripts... [  OK  ][    0.007234] * Initializing code repositories... [  OK  ]

[    0.013234] [    0.008945] * Starting React compiler... [  OK  ]

[    0.013234] TheraOS ready. Welcome to the future.[    0.009567] * Loading TypeScript engine... [  OK  ]

[    0.013234] thera@lab:~$ █`[    0.010234] * Connecting to cloud services... [  OK  ]

  ];[    0.011789] * Optimizing build pipeline... [  OK  ]

[    0.012456] * Testing deployment scripts... [  OK  ]

  useEffect(() => {[    0.013234] 

    const handleMouseMove = (e: MouseEvent) => {[    0.013234] TheraOS ready. Welcome to the future.

      setMousePosition({[    0.013234] thera@lab:~$ █`

        x: (e.clientX / window.innerWidth) * 100,  ];

        y: (e.clientY / window.innerHeight) * 100,

      });  useEffect(() => {

    };    const handleMouseMove = (e: MouseEvent) => {

      setMousePosition({

    window.addEventListener("mousemove", handleMouseMove);        x: (e.clientX / window.innerWidth) * 100,

    return () => window.removeEventListener("mousemove", handleMouseMove);        y: (e.clientY / window.innerHeight) * 100,

  }, []);      });

    };

  useEffect(() => {

    const interval = setInterval(() => {    window.addEventListener("mousemove", handleMouseMove);

      setCurrentFrame((prev) => (prev + 1) % bootFrames.length);    return () => window.removeEventListener("mousemove", handleMouseMove);

    }, 3000);  }, []);

    return () => clearInterval(interval);

  }, [bootFrames.length]);  useEffect(() => {

    const interval = setInterval(() => {

  return (      setCurrentFrame((prev) => (prev + 1) % pcFrames.length);

    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-center font-mono">    }, 1200);

      {/* Strong base gradient background */}    return () => clearInterval(interval);

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8937E6]/30 via-black to-[#0069CC]/30" />  }, [pcFrames.length]);



      {/* Enhanced mouse interaction */}  return (

      <div    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-center font-mono">

        className="pointer-events-none absolute inset-0 opacity-40 transition-all duration-500 ease-out"      {/* Strong base gradient background */}

        style={{      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8937E6]/30 via-black to-[#0069CC]/30" />

          background: `radial-gradient(700px 500px at ${mousePosition.x}% ${mousePosition.y}%, rgba(137,55,230,0.3) 0%, rgba(0,105,204,0.25) 35%, transparent 65%)`,

        }}      {/* Enhanced mouse interaction */}

      />      <div

        className="pointer-events-none absolute inset-0 opacity-40 transition-all duration-500 ease-out"

      {/* Ambient pulse overlay */}        style={{

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(137,55,230,0.1)_0%,_transparent_50%)] animate-pulse" />          background: `radial-gradient(700px 500px at ${mousePosition.x}% ${mousePosition.y}%, rgba(137,55,230,0.3) 0%, rgba(0,105,204,0.25) 35%, transparent 65%)`,

        }}

      <div className="relative z-10 space-y-8">      />

        {/* Terminal Window */}

        <div className="mx-auto max-w-4xl transform transition-all duration-300 hover:scale-[1.02]">      {/* Ambient pulse overlay */}

          {/* Terminal Header */}      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(137,55,230,0.1)_0%,_transparent_50%)] animate-pulse" />

          <div className="flex items-center gap-2 rounded-t-lg bg-[#212121] px-4 py-3 shadow-xl">

            <div className="flex gap-2">      <div className="relative z-10 space-y-8">

              <div className="h-3 w-3 rounded-full bg-[#FF5F57]"></div>        {/* Loading ASCII Animation */}

              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>        <div className="mx-auto transform transition-all duration-300 hover:scale-[1.02]">

              <div className="h-3 w-3 rounded-full bg-[#28CA42]"></div>          <pre className="text-sm leading-tight text-[#8937E6] drop-shadow-[0_0_10px_rgba(137,55,230,0.6)] transition-all duration-300 hover:brightness-110 md:text-base lg:text-lg selection:bg-[#8937E6]/10 whitespace-pre">

            </div>            {pcFrames[currentFrame]}

            <div className="ml-4 text-sm text-[#F7F7F7]/70">thera@lab: ~</div>          </pre>

          </div>        </div>

          

          {/* Terminal Content */}        {/* Main title */}

          <div className="rounded-b-lg bg-[#212121] p-6 shadow-xl">        <div className="space-y-4">

            <pre className="text-left text-sm leading-relaxed text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all duration-300 hover:brightness-110 md:text-base selection:bg-[#00FF41]/10 whitespace-pre">          <h1 className="animate-fade-in bg-gradient-to-r from-[#F7F7F7] via-[#8937E6] to-[#0069CC] bg-clip-text text-4xl font-medium tracking-tight text-transparent transition-all duration-300 hover:tracking-normal md:text-6xl">

              {bootFrames[currentFrame]}            thera | Software House

            </pre>          </h1>

          </div>

        </div>          {/* Animated underline */}

          <div className="mx-auto h-[2px] w-0 animate-expand-width bg-gradient-to-r from-[#8937E6] to-[#0069CC] transition-all duration-1000" />

        {/* Main title */}        </div>

        <div className="space-y-4">      </div>

          <h1 className="animate-fade-in bg-gradient-to-r from-[#F7F7F7] via-[#8937E6] to-[#0069CC] bg-clip-text text-4xl font-medium tracking-tight text-transparent transition-all duration-300 hover:tracking-normal md:text-6xl">    </div>

            thera | Software House  );

          </h1>}

          {/* Animated underline */}
          <div className="mx-auto h-[2px] w-0 animate-expand-width bg-gradient-to-r from-[#8937E6] to-[#0069CC] transition-all duration-1000" />
        </div>
      </div>
    </div>
  );
}