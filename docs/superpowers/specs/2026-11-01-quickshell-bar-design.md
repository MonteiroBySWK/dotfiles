# Barra Quickshell estilo macOS — desenho

Data: 2026-11-01
Status: aprovado em conversa ("pode fazer")

## Intenção

Substituir a waybar por uma barra em Quickshell, no topo, estilo macOS.
A waybar continua intacta e ativa até a troca final no autostart.

## Objetivos

- Barra no topo em cada monitor, 28px, fundo preto translúcido (`#4D000000`),
  texto Noto Sans e ícones JetBrainsMono Nerd Font.
- Esquerda: workspaces do Hyprland filtrados por monitor (pílula no ativo).
- Centro: título da janela ativa (equivalente ao menu do app no macOS).
- Direita: tray, rede, volume, brilho, bateria, TLP, bluetooth,
  notificações, sysinfo, nightlight e relógio (por último).
- Cliques preservam o comportamento atual: abrem os popups existentes via
  `~/.config/quickshell/popup/open.sh`; rede abre `kitty -e nmtui`;
  volume direito abre `pavucontrol`.
- Uma `PanelWindow` por tela via `Variants` + `Quickshell.screens`.

## Não-objetivos

- Não reescrever os popups nesta fase (continuam no config `popup`).
- Não apagar a waybar nem o `wifi-menu.sh`.
- Não implementar Google Calendar agora.

## Arquitetura

- Novo config: `~/.config/quickshell/bar/shell.qml`, rodando como
  `qs -c bar`.
- Processos dos módulos dinâmicos usam os scripts que a waybar já usa
  (`bt.sh`, `tlp.sh`, `nightlight.sh`, `list-resources.sh`) ou APIs nativas
  (`Quickshell.Hyprland`, `SystemTray`, `UPower`, `Pipewire`, `Networking`).
- Enquanto a barra nova não for aprovada, o autostart continua chamando
  apenas `qs -c popup`; a barra é iniciada manualmente.

## Fases

1. Esqueleto: `Variants`/`PanelWindow`, workspaces, título, relógio, tray,
   bateria, volume, rede.
2. Módulos restantes: brilho, TLP, bluetooth, notificações, sysinfo,
   nightlight.
3. Interações: clique/scroll em todos, testes em ambas as telas.
4. Troca do autostart (waybar → barra), mantendo os arquivos antigos.

## Decisões (revisadas com a HIG)

- Referência Apple HIG: menu bar de 24pt (Big Sur+), ícones de 16×16pt,
  texto 13pt, sem padding extra além do necessário para centralizar.
- Altura final de 24px (medida da HIG), texto 13px, ícones 16px,
  margens laterais 10px e 4px entre módulos. Cada módulo tem área mínima
  de 26px com 8px de folga interna (`BarModule.qml`), então o respiro
  visual entre conteúdos fica em ~12px.
- Fundo 100% transparente (sem preenchimento nem separador), com sombra
  de 1px no texto (`Text.Raised`) para contraste sobre wallpaper claro.
- Título da janela no centro, com elipse em 600px.
- Workspaces com id > 0; nome quando existir.
- Relógio no formato `HH:mm - dd/mm/aaaa`, igual à waybar.

## Progresso

- Fase 1 e 2 concluídas: workspaces por monitor, título, relógio, tray
  (com menu nativo), rede (`nmtui`), volume (PipeWire nativo), brilho,
  bateria (UPower), TLP, bluetooth, notificações, sysinfo e nightlight.
- `BarModule.qml` separado: componente inline era rejeitado pelo
  quickshell nesta config ("not a type").
- Título com ícone do app (appId + `Quickshell.iconPath`), texto seco
  (sem sombra) e 16px de ícone.
- Fusão feita: `bar/PopupShell.qml` (Scope) roda popups + notificações no
  mesmo processo da barra. `open.sh` detecta o config que tem o alvo
  `control`; o config `popup` fica como fallback.
- Memória medida: barra sozinha 220 MB RSS / 171 MB PSS; popup separado
  130 / 90; stack separado ~350 / 261.
- Fusão: 245 MB RSS / 208 MB PSS (~105 MB RSS a menos).
- Backend software (`QT_QUICK_BACKEND=software`): **116 MB RSS / 97 MB
  PSS**, 7 threads, CPU idle ~0%. Sem os buffers do driver GPU no
  processo. Popups/toasts continuam corretos; animações são rasterizadas.
- Stack antigo (waybar + popup) era ~198 MB RSS / 134 MB PSS; o novo
  stack fundido em software usa ~82 MB RSS a menos que o antigo.
- Pendente: tooltips, scroll nos workspaces, pulso do TLP, troca do
  autostart e commit dos dotfiles.
