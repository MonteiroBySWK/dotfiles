import { WasmNes, Button } from '../pkg/nes_rust_wasm.js';

const BUTTON_DEBOUNCE_TIME = 10; // ms
let lastTouchTime = 0;

// Interface para gerenciar as referências dos botões
export interface ButtonRefs {
  Up: HTMLButtonElement | null;
  Down: HTMLButtonElement | null;
  Left: HTMLButtonElement | null;
  Right: HTMLButtonElement | null;
  A: HTMLButtonElement | null;
  B: HTMLButtonElement | null;
  Start: HTMLButtonElement | null;
  Select: HTMLButtonElement | null;
}

// Mapeamento dos botões do controle para os botões do NES
export const buttonMapping: Record<string, Button> = {
  Up: Button.Joypad1Up,
  Down: Button.Joypad1Down,
  Left: Button.Joypad1Left,
  Right: Button.Joypad1Right,
  A: Button.Joypad1A,
  B: Button.Joypad1B,
  Start: Button.Start,
  Select: Button.Select
};

export class NESController {
  private nes: WasmNes | null = null;
  private activeButtons: Set<string> = new Set();
  private buttonRefs: ButtonRefs = {
    Up: null,
    Down: null,
    Left: null,
    Right: null,
    A: null,
    B: null,
    Start: null,
    Select: null
  };

  constructor() {
    this.activeButtons = new Set();
  }

  // Método para configurar as referências dos botões
  setButtonRefs(refs: ButtonRefs): void {
    this.buttonRefs = refs;
  }

  // Configura a instância do emulador NES
  setNES(nes: WasmNes): void {
    this.nes = nes;
  }

  // Determina quais botões estão sendo tocados com base nas coordenadas
  getTouchedButtons(clientX: number, clientY: number): string[] {
    const touchedButtons: string[] = [];
    
    for (const [buttonName, ref] of Object.entries(this.buttonRefs)) {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          touchedButtons.push(buttonName);
        }
      }
    }
    
    return touchedButtons;
  }

  // Processa eventos de toque (mobile)
  handleTouch(e: TouchEvent): void {
    e.preventDefault();
    
    const now = performance.now();
    if (now - lastTouchTime < BUTTON_DEBOUNCE_TIME) return;
    lastTouchTime = now;
    
    const touches = Array.from(e.touches);
    const allTouched = touches.flatMap(touch =>
      this.getTouchedButtons(touch.clientX, touch.clientY)
    );
    
    this.updateActiveButtons(new Set(allTouched));
  }

  // Processa eventos de mouse (desktop)
  handleMouse(e: MouseEvent): void {
    const now = performance.now();
    if (now - lastTouchTime < BUTTON_DEBOUNCE_TIME) return;
    lastTouchTime = now;
    
    if (e.buttons === 1) { // Botão esquerdo do mouse
      const touched = this.getTouchedButtons(e.clientX, e.clientY);
      this.updateActiveButtons(new Set(touched));
    }
  }

  // Limpa todos os toques ativos
  clearActiveButtons(): void {
    const oldActive = this.activeButtons;
    this.activeButtons = new Set();
    
    // Libera os botões que estavam pressionados
    if (this.nes) {
      oldActive.forEach(button => {
        if (buttonMapping[button]) {
          this.nes?.release_button(buttonMapping[button]);
        }
      });
    }
  }

  // Atualiza o estado dos botões ativos e envia comandos para o emulador
  private updateActiveButtons(newActiveButtons: Set<string>): void {
    if (!this.nes) return;

    // Botões que não estão mais ativos (precisam ser liberados)
    for (const button of this.activeButtons) {
      if (!newActiveButtons.has(button) && buttonMapping[button]) {
        this.nes.release_button(buttonMapping[button]);
      }
    }

    // Botões que foram recém ativados (precisam ser pressionados)
    for (const button of newActiveButtons) {
      if (!this.activeButtons.has(button) && buttonMapping[button]) {
        this.nes.press_button(buttonMapping[button]);
      }
    }

    this.activeButtons = newActiveButtons;
  }

  // Retorna o estado atual dos botões ativos
  getActiveButtons(): Set<string> {
    return this.activeButtons;
  }
}

export default NESController;