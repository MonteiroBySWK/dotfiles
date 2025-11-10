import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import NESController, { type ButtonRefs } from "./control";
import { WasmNes } from "./pkg/nes_rust_wasm.js";
import init from "./pkg/nes_rust_wasm.js";

// Componente reutilizável para os botões do D-Pad
interface ButtonDPadProps {
  children: React.ReactNode;
  button: string;
  activeTouches: Set<string>;
  buttonRef: React.LegacyRef<HTMLButtonElement>;
}

export const ButtonDPad: React.FC<ButtonDPadProps> = memo(
  ({ children, button, activeTouches, buttonRef }) => {
    const isActive = activeTouches.has(button);

    return (
      <button
        ref={buttonRef}
        className={`bg-gray-600 w-18 h-18 p-6 rounded flex items-center justify-center transition-transform duration-200 ${
          isActive ? "scale-90 bg-purple-300" : ""
        }`}
      >
        {children}
      </button>
    );
  }
);

// Componente para botões de ação (A, B, Start, Select)
interface ActionButtonProps {
  button: string;
  activeTouches: Set<string>;
  buttonRef: React.LegacyRef<HTMLButtonElement>;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = memo(
  ({ button, activeTouches, buttonRef, className = "" }) => {
    const isActive = activeTouches.has(button);

    return (
      <button
        ref={buttonRef}
        className={`${className} flex items-center justify-center text-xl font-bold shadow transition-transform duration-200 ${
          isActive ? "scale-90 bg-purple-300" : ""
        }`}
      >
        {button}
      </button>
    );
  }
);

// Configuração de áudio para o emulador
// Hook personalizado para configurar o emulador NES
export const useNESEmulator = () => {
  const [nes, setNES] = useState<WasmNes | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFPS] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Função para configurar o emulador com dados da ROM
  const setupEmulator = useCallback(async (romData: Uint8Array) => {
    if (!canvasRef.current) return;

    try {
      // @ts-ignore
      const wasm = await init();
      const width = 256;
      const height = 240;

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Otimizar canvas para renderização
      canvas.style.imageRendering = "pixelated"; // Melhor renderização para pixel art

      const ctx = canvas.getContext("2d", {
        alpha: false, // Sem transparência = mais rápido
        desynchronized: true, // Reduzir latência
        willReadFrequently: false, // Otimização para padrão de uso
      });
      if (!ctx) return;

      const imageData = ctx.createImageData(width, height);
      const pixels = new Uint8Array(imageData.data.buffer);

      const nesInstance = WasmNes.new();
      nesInstance.set_rom(romData);

      // Configuração de áudio
      //setupAudio(nesInstance);

      nesInstance.bootup();
      setNES(nesInstance);

      // Contador de FPS
      let totalElapsedTime = 0.0;
      let previousTime = performance.now();
      let frameCount = 0;

      const stepFrame = () => {
        if (!canvasRef.current) return;

        animationFrameRef.current = requestAnimationFrame(stepFrame);

        // Calcula FPS
        frameCount++;
        const currentTime = performance.now();
        const elapsedTime = currentTime - previousTime;
        totalElapsedTime += elapsedTime;
        previousTime = currentTime;

        if (frameCount % 60 === 0) {
          setFPS(parseFloat((1000.0 / (totalElapsedTime / 60)).toFixed(2)));
          totalElapsedTime = 0.0;
          frameCount = 0;
        }

        // Executa frame e atualiza pixels
        nesInstance.step_frame();
        nesInstance.update_pixels(pixels);
        ctx.putImageData(imageData, 0, 0)
      };
      stepFrame();
    } catch (error) {
      console.error("Erro ao inicializar o emulador:", error);
    }
  }, []);

  // Função para carregar ROM de uma URL
  const loadROM = useCallback(async () => {
    try {
      const response = await fetch("/roms/Mario.nes");
      const arrayBuffer = await response.arrayBuffer();
      setupEmulator(new Uint8Array(arrayBuffer));
    } catch (error) {
      console.error("Erro ao carregar ROM:", error);
    }
  }, [setupEmulator]);

  // Função para manipular upload de ROM
  const handleROMUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && e.target.result instanceof ArrayBuffer) {
          setupEmulator(new Uint8Array(e.target.result));
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [setupEmulator]
  );

  // Limpeza ao desmontar o componente
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    nes,
    canvasRef,
    fps,
    loadROM,
    handleROMUpload,
  };
};

// Componente NESRenderer para exibição do emulador e controles
export const NESRenderer: React.FC = () => {
  // @ts-expect-error
  const { nes, canvasRef, fps, loadROM, handleROMUpload } = useNESEmulator();
  const [activeTouches, setActiveTouches] = useState<Set<string>>(new Set());
  const nesController = useRef<NESController>(new NESController());
  const buttonRefs = useRef<ButtonRefs>({
    Up: null,
    Down: null,
    Left: null,
    Right: null,
    A: null,
    B: null,
    Start: null,
    Select: null,
  });

  useEffect(() => {
    if (nes) {
      nesController.current.setNES(nes);
    }
  }, [nes]);

  useEffect(() => {
    loadROM(); // <- Aqui é onde deve ser feito o carregamento automático da ROM
  }, [loadROM]);

  useEffect(() => {
    nesController.current.setButtonRefs(buttonRefs.current);
  }, [buttonRefs]);

  // Função de atualização de estado para os botões ativos
  const updateActiveTouches = () => {
    setActiveTouches(new Set(nesController.current.getActiveButtons()));
  };

  // Manipuladores de eventos de toque e mouse
  const handleTouch = useCallback((e: React.TouchEvent) => {
    nesController.current.handleTouch(e.nativeEvent);
    updateActiveTouches();
  }, []);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    nesController.current.handleMouse(e.nativeEvent);
    updateActiveTouches();
  }, []);

  const clearTouches = useCallback(() => {
    nesController.current.clearActiveButtons();
    updateActiveTouches();
  }, []);

  const controlsClassNames =
    "text-white relative mt-4 w-full h-full select-none cursor-default";

  return (
    <div className="flex items-center justify-center w-full h-screen p-4">
      {/* Display do emulador w-256 h240 */}
      <div className="h-screen absolute top-0 z-0">
        <canvas ref={canvasRef} width={256} height={240} className="h-full" />
      </div>

      {/* Controles */}
      <div
        className={controlsClassNames}
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        onTouchEnd={clearTouches}
        onMouseDown={handleMouse}
        onMouseMove={handleMouse}
        onMouseUp={clearTouches}
        onMouseLeave={clearTouches}
      >
        {/* D-Pad */}
        <div className="grid grid-rows-3 grid-cols-3 gap-2 w-44 h-44 absolute bottom-5 left-0">
          <div></div>
          <ButtonDPad
            button="Up"
            activeTouches={activeTouches}
            buttonRef={(el) => {
              buttonRefs.current.Up = el;
            }}
          >
            ↑
          </ButtonDPad>
          <div></div>

          <ButtonDPad
            button="Left"
            activeTouches={activeTouches}
            buttonRef={(el) => {
              buttonRefs.current.Left = el;
            }}
          >
            ←
          </ButtonDPad>
          <div></div>
          <ButtonDPad
            button="Right"
            activeTouches={activeTouches}
            buttonRef={(el) => {
              buttonRefs.current.Right = el;
            }}
          >
            →
          </ButtonDPad>

          <div></div>
          <ButtonDPad
            button="Down"
            activeTouches={activeTouches}
            buttonRef={(el) => {
              buttonRefs.current.Down = el;
            }}
          >
            ↓
          </ButtonDPad>
          <div></div>
        </div>

        {/* Botões A e B */}
        <ActionButton
          button="B"
          activeTouches={activeTouches}
          buttonRef={(el) => {
            buttonRefs.current.B = el;
          }}
          className="absolute bottom-24 right-0 bg-red-500 h-16 w-16 rounded-full"
        />

        <ActionButton
          button="A"
          activeTouches={activeTouches}
          buttonRef={(el) => {
            buttonRefs.current.A = el;
          }}
          className="absolute bottom-5 right-20 bg-red-500 h-16 w-16 rounded-full"
        />

        {/* Botões Start e Select */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4">
          <ActionButton
            button="Select"
            activeTouches={activeTouches}
            buttonRef={(el) => {
              buttonRefs.current.Select = el;
            }}
            className="bg-gray-500 px-4 py-2 rounded-md"
          />

          <ActionButton
            button="Start"
            activeTouches={activeTouches}
            buttonRef={(el) => {
              buttonRefs.current.Start = el;
            }}
            className="bg-gray-500 px-4 py-2 rounded-md"
          />
        </div>

        {/* Indicador de botões ativos (para debug) */}
        <div className="absolute top-12 left-0 text-xs">
          <p>Botões ativos: {Array.from(activeTouches).join(", ")}</p>
          <p className="text-white mt-2">FPS: {fps}</p>
        </div>
      </div>
    </div>
  );
};

export default NESRenderer;
