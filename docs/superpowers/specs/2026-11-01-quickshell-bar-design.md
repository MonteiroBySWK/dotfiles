# Barra Quickshell estilo macOS — desenho

Data: 2026-11-01
Status: implementado (barra em uso; waybar desativada)

## Intenção

Substituir a waybar por uma barra em Quickshell, no topo, estilo macOS.
A waybar fica no repositório como fallback/rollback, mas não sobe no login.

## Objetivos

- Uma `PanelWindow` por monitor via `Variants` + `Quickshell.screens`.
- 24px de altura, fundo `#4D000000` (30% preto), texto Noto Sans 14px,
  ícones JetBrainsMono NF 15px e tray 16px.
- Esquerda: workspaces do Hyprland filtrados por monitor (pílula no ativo).
- Centro: ícone do app + título da janela, 14px, elipse em 600px.
- Direita: tray, rede, volume, brilho, bateria, bluetooth, notificações,
  sysinfo, nightlight, TLP e relógio.
- Cliques preservam o comportamento antigo: abrem os popups via
  `quickshell/popup/open.sh`; rede abre `kitty -e nmtui`; volume com botão
  direito abre `pavucontrol`.
- Barra, popups e notificações no **mesmo processo** (`PopupShell.qml`).

## Não-objetivos

- Google Calendar (fica para uma próxima etapa).
- Reescrever os scripts dos módulos: os da waybar são reutilizados
  (`bt.sh`, `tlp.sh`, `nightlight.sh`, `list-resources.sh`).
- Apagar a waybar ou o `wifi-menu.sh`; ficam como fallback.

## Arquitetura

- Config: `~/.config/quickshell/bar`, rodando como `qs -c bar`.
- `PopupShell.qml` (um `Scope`) embute os painéis e o servidor de
  notificações no processo da barra.
- `open.sh` detecta qual config tem o alvo IPC `control`.
- Autostart: `env QT_QUICK_BACKEND=software qs -c bar`; a linha da waybar
  está comentada.
- `Super+R` mata/levanta o quickshell (`bar/toggle.sh`).
- Backend software evita os buffers do driver GPU no processo: CPU idle
  ~0%, popups/toasts seguem corretos.

## Medidas finais

- Altura 24px; margens laterais 12px.
- Cada módulo tem 12px de folga interna + 8px entre módulos (~20px de
  respiro visual, igual à waybar).
- Título 14px; demais textos 14px; ícones 15px; tray 16px.
- Fundo `#4D000000`, sem separador.
- Relógio `HH:mm - dd/mm/aaaa`.

## Estado

- Fases 1–4 concluídas: esqueleto, módulos, interações e autostart.
- Tray com menu nativo; workspaces por monitor.
- Título com ícone do app: o `appId` do Hyprland vem vazio nesta versão,
  então a classe é resolvida via `hyprctl -j activewindow` a cada foco.
- Toasts: padding de 12px, expiração repetitiva e filtro de notificação
  morta (evita card vazio).
- Botão "limpar": área de clique maior, hover e bloqueador de clique
  dentro do painel.
- Memória medida no processo único com backend software: **116 MB RSS /
  97 MB PSS** (o stack antigo waybar + popup era ~198 MB RSS).
- Pendente: tooltips, scroll nos workspaces e pulso do TLP.
