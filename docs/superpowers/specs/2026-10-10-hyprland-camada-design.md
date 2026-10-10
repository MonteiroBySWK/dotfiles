# Trilha A — Camada Hyprland (design)

- **Data:** 2026-10-10
- **Classificação:** ARCHITECTURAL
- **Escopo:** `hypr/` + `waybar/`
- **Status:** aprovado em conversa, aguardando revisão do spec escrito

## 1. Contexto e problema

A config do Hyprland foi migrada de hyprlang (conf) para Lua modular (`require()` por arquivo) na
Hyprland 0.56.2. A migração funcionou, mas quatro sintomas reclamados pelo usuário traced até
`hypr/monitors.lua` e `hypr/workspaces.lua`:

1. **Monitor rígido.** As duas saídas conhecidas (`eDP-1`, `HDMI-A-1`) estão fixas com modo, escala e
   posição literais. Qualquer saída nova — projetor, monitor emprestado, outra porta — não casa com
   nenhuma regra e o layout quebra.
2. **Clique no workspace não troca de workspace.** Causa raiz número 1 abaixo.
3. **Firefox fecha todas as janelas.** Não diagnosticado — ver §7.
4. **WiFi desligado no boot**, obriga `nm-applet` manual no terminal, que duplica o ícone de rede
   que já existe na barra.

E um quinto item de camada:

5. **Nome de janela mostra id de pacote** (`ai.opencode.desktop`) em vez do nome do app.

## 2. Causa raiz: workspaces presos a nome de monitor

`hypr/workspaces.lua:6-9` amarra workspaces a nomes de saída:

```lua
hl.workspace_rule({ workspace = "1", monitor = "HDMI-A-1" })
hl.workspace_rule({ workspace = "2", monitor = "HDMI-A-1" })
hl.workspace_rule({ workspace = "3", monitor = "eDP-1" })
hl.workspace_rule({ workspace = "4", monitor = "eDP-1" })
```

Isso produz **dois** sintomas de uma vez só.

**Sintoma A — monitor rígido.** As regras de monitor do Hyprland são resolvidas por nome exato de
saída. `monitors.lua` só declara `eDP-1` e `HDMI-A-1`. Um projetor não bate com nenhuma, e os
workspaces 1–4 continuam apontados para saídas que não existem naquele momento.

**Sintoma B — clique no workspace inerte.** `hypr/config.jsonc:6-8` registra o módulo
`hyprland/workspaces` só como string nua, sem bloco de opções. O Waybar **0.15.0 não tem chave
`on-click` nesse módulo** — confirmado no man page local `waybar-hyprland-workspaces.5.gz`
(2026-08-31). O clique é interno ao módulo e dispara `workspace <id>`. A opção `move-to-monitor`
(default `false`) está documentada assim:

> If set to true, open the workspace on the current monitor when clicking on a workspace button.
> Otherwise, the workspace will open on the monitor where it was previously assigned.

Ou seja: clicar no workspace 1 manda o Hyprland abrir o ws 1 **no monitor onde ele foi atribuído por
última vez** — que é `HDMI-A-1`. Quando o `HDMI-A-1` não está conectado (projetor), o clique não
produz mudança visível. **Não é bug do Waybar nem do clique: é a mesma amarra do sintoma A.**

Portanto: **remover as regras de workspace resolve A e B simultaneamente.**

## 3. Correções de premissa (verificadas antes de desenhar)

Três suposições iniciais estavam erradas e mudaram o design:

### 3.1 `hyprland/workspaces` não aceita `on-click`

Não tem a chave. Clique é interno ao módulo. Não há `{}` placeholder para nome de workspace nesse
módulo (o único placeholder documentado é `{address}` / `{button}`, em
`workspace-taskbar.on-click-window`).

### 3.2 `hyprland/window` no Waybar 0.15 perdeu `max-length` e `format-icons`

Conjunto real de opções (man page local `waybar-hyprland-window.5.gz`): `format`, `rewrite`,
`separate-outputs`, `icon`, `icon-size`, `expand`. Não existe `max-length`, nem `format-icons`, nem
`rewrite-title`.

Consequência de design: **não há como renderizar ícone dependente de classe junto do título num único
`format`.** O `rewrite` compara contra a string já formatada com `std::regex_match` (precisa casar a
string inteira) e substitui a string inteira. A saída oficial é `icon: true`, que renderiza o ícone
real do app (imagem do `.desktop`, não glifo) ao lado do rótulo.

### 3.3 `nmcli device menu` não existe no NetworkManager 1.58.1

Verificado localmente: `nmcli device menu --help` → `Erro: argumento "menu" não compreendido`.
Substituído por script `nmcli` + `wofi`.

### 3.4 Regra catch-all de monitor é `output = ""`

Não existe chave `fallback` no `hl.monitor`. O fallback é a regra com `output` vazio, documentado em
https://wiki.hypr.land/Configuring/Basics/Monitors/.

## 4. Decisões

| # | Decisão | Escolha |
|---|---|---|
| 1 | Política de monitor desconhecido | Catch-all automático |
| 2 | Workspaces × monitores | Livres (padrão Hyprland) |
| 3 | Barra central | Ícone + título |
| 4 | Controle de rede | `nmcli radio wifi on` no boot + menu wofi |
| 5 | Linguagem do menu de WiFi | Script `.sh`, não Lua |

### 4.1 Por que o menu de WiFi não vai em Lua

Princípio adotado: **config e evento → Lua; I/O bloqueante → processo externo.**

1. O `on-click` do Waybar execa um comando de shell. Não existe caminho de volta para o runtime Lua
   do Hyprland — não há IPC de "execute esta função Lua". Os sockets `.socket2.sock` entregam
   eventos ao compositor, o inverso.
2. A doc do Hyprland é explícita: handlers de bind **não podem bloquear** — *"Avoid `io.popen`,
   network I/O… A hung or slow call freezes input and the entire desktop"*. Um
   `nmcli device wifi list --rescan yes` leva 1–3s e o wofi bloqueia esperando clique.
3. Lua aqui seria um processo `lua` separado apenas para chamar `nmcli` e `wofi` por fora: mais
   código, mais um runtime, ganho zero.

O princípio já está valendo no repo: `hypr/scripts/brightness-ddc.sh` faz I²C com `flock`
justamente porque não pode viver dentro do compositor.

## 5. Mudanças por arquivo

### 5.1 `hypr/monitors.lua`

Antes: duas regras por nome, com modo/escala/posição literais.
Depois: uma regra para o painel do notebook + catch-all.

```lua
--[[
  hypr/monitors.lua — configuração de monitores
  https://wiki.hypr.land/Configuring/Basics/Monitors/

  Regra nomeada para o painel do notebook; qualquer saída que não caia
  em nenhuma regra herda a regra catch-all (output = ""). É ela que faz
  projetor e monitor de outro lugar funcionarem sem editar este arquivo.
]]

-- Painel do notebook.
hl.monitor({
  output   = "eDP-1",
  mode     = "preferred",
  position = "auto",
  scale    = 1,
})

-- Catch-all: projetor, HDMI sem regra, monitor emprestado.
-- mode "preferred" = Hyprland escolhe o maior modo suportado pelo painel.
hl.monitor({
  output   = "",
  mode     = "preferred",
  position = "auto-right",
  scale    = 1,
})
```

Notas:
- `mode = "preferred"` no `eDP-1` substitui o `1920x1080@60` literal — o painel só tem esse modo
  mesmo, e a sobrevive a um notebook diferente.
- `position = "auto-right"` coloca saídas desconhecidas à direita da primeira. `"auto"` empilharia
  tudo no centro. É uma linha se preferir `"auto"`.
- A regra nomeada de `HDMI-A-1` some; o catch-all a cobre. Se algum dia precisar de 120Hz fixo em casa,
  é uma regra nomeada de volta, por cima do catch-all.

### 5.2 `hypr/workspaces.lua`

Fica só o cabeçalho comentado. Sem `workspace_rule({ monitor = ... })` todo workspace nasce no monitor
com foco e viaja via `SUPER + SHIFT + n`.

O arquivo é mantido (e não deletado) porque `hypr/hyprland.lua:14` faz `require("workspaces")` e
porque é o lugar natural para regras futuras.

### 5.3 `hypr/autostart.lua`

Uma linha dentro do `hl.on("hyprland.start", ...)`:

```lua
  hl.exec_cmd("nmcli radio wifi on")
```

Risco registrado: se o NetworkManager não estiver pronto no boot frio, o comando falha em silêncio.
A forma simples é a correta por padrão; se a verificação ao vivo mostrar falha, escala para
`until nmcli general status; do sleep 1; done` — não se complica sem evidência.

### 5.4 `waybar/config.jsonc`

**a) `hyprland/workspaces`** — hoje é string nua em `modules-left:6-8`. Vira bloco explícito:

```jsonc
  "hyprland/workspaces": {
    "sort-by": "number",
    "show-special": true,
    "on-scroll-up": "hyprctl dispatch workspace e-1",
    "on-scroll-down": "hyprctl dispatch workspace e+1"
  },
```

- `sort-by: "number"` ordena por número em vez da ordem de criação.
- `show-special: true` faz o scratchpad do `SUPER + S` aparecer na barra. É uma linha pra remover.
- Scroll na barra hoje não faz nada; `on-scroll-up`/`on-scroll-down` ligam (substituem o
  comportamento default, que é vazio).

**b) `hyprland/window`** (`config.jsonc:113-124`) — sai o mapa de `rewrite`, entra ícone real:

```jsonc
  "hyprland/window": {
    "format": "{title}",
    "icon": true,
    "icon-size": 16
  },
```

Isso resolve o `ai.opencode.desktop` na raiz: o `{class}` sai do `format`, e a classe de Electron
deixa de aparecer.

Trade-off aceito: `max-length` não existe no 0.15, então `{title}` não é truncado. Título longo
(Firefox com página de título comprido) cresce o centro da barra nos dois lados, porque o módulo é
centralizado. Mitigação possível via `rewrite` com captura (`"(.{40}).*": "$1"`), rejeitada por
operar em bytes e brigar com acento. Se incomodar ao vivo, a segunda opção é voltar a prefixar a
classe no `format`.

**c) `network`** (`config.jsonc:105-112`) — só o `on-click` muda; `on-click-right` passa a abrir
`pavucontrol`:

```jsonc
    "on-click": "~/.config/waybar/scripts/wifi-menu.sh",
    "on-click-right": "pavucontrol",
```

Sai o `nmtui`. `on-click-right` antes não existia nesse módulo.

**d) `"output": "*"`** — o config não declara `output`. O man page do Waybar 0.15 documenta a chave
(`"HDMI-A-1"` ou array, com `*` no fim para aceitar todas as saídas e `!` como exclusão) mas não
declara o default, então o comportamento atual é empírico e não está verificado. `"output": "*"`
torna a intenção explícita e garante barra no projetor. **Se preferir barra só no notebook, é
`"output": "eDP-1"`** — e vale conferir visualmente se hoje já há barra duplicada no `HDMI-A-1`.

**e) Novo `waybar/scripts/wifi-menu.sh`** — `nmcli -t -f SSID,SIGNAL,SECURITY device wifi list
--rescan yes` alimenta um `wofi --show dmenu`; a escolha conecta (`nmcli device wifi connect`) ou
desconecta (`nmcli device disconnect`).

Diferente de `waybar/scripts/nightlight.sh` e `tlp.sh`, este **não** é um módulo `custom`: é alvo de
`on-click`, roda sob demanda e não faz polling. Então não precisa de cache em `/tmp`, nem de saída
JSON, nem de `signal` RTMIN.

### 5.5 `hypr/window_rules.lua`

Nenhuma mudança. O item Firefox (A) está fora do escopo de edição até o diagnóstico de §7.

## 6. Fora de escopo

- **Item A (Firefox fecha todas as janelas)** — diagnóstico antes de qualquer edição. Ver §7.
- **Item C (brilho via Lua, controle de volume/fone)** — trilha própria. Depende desta trilha porque o
  `brightness-ddc.sh` precisa saber qual saída é externa.
- **Item G (Bluetooth)** — trilha própria. Waybar 0.15 tem módulo `bluetooth` nativo instalado
  (`waybar-bluetooth.5.gz` presente).
- **Item H (manifesto de pacotes)** — trilha própria.
- **`swaync-client`** — não está instalado; o bloco `custom/notifications` (`config.jsonc:78-92`) é
  código morto protegido por `exec-if: which swaync-client`. Decidir entre instalar ou remover fica
  com o item de notificações.
- **Camada visual** — `waybar/style.css` não é tocado.

## 7. Item A: diagnóstico antes de corrigir

Não há evidência suficiente para escolher a correção, e `SUPER + C` já está correto:
`hypr/binds.lua:11` → `hl.dsp.window.kill()` (`killactive`), que por contrato mata só a janela focada.

Verificado: o perfil Firefox está em **defaults** — nenhuma pref `browser.tabs.warnOn*` setada em
`~/.mozilla/firefox/grlqwl6q.default-release/prefs.js` (405 linhas, zero matches), e não existe
`~/.config/firefox/` nos dotfiles.

Protocolo de reprodução:

1. Abrir 3 janelas do Firefox.
2. `hyprctl clients | grep -c firefox` → esperar `3`.
3. Apertar `SUPER + C`.
4. `hyprctl clients | grep -c firefox` de novo.

- Caiu para 2 → Hyprland está inocente. Correção é pref do Firefox; criar `user.js` versionado nos
  dotfiles (hoje inexistente).
- Caiu para 0 → aí sim o `SUPER+C` ou o `suppress_event` de `window_rules.lua:7-11` está envolvido, e a
  correção é nesta config.

## 8. Verificação

Comandos de leitura, não destrutivos:

```bash
hyprctl monitors all            # deve listar eDP-1; com projetor, listar o projetor sem erro
hyprctl workspaces              # nenhum workspace deve ficar preso a uma saída ausente
```

Reload sem sair da sessão: `hyprctl reload` (recarrega os `require()`), `SUPER + R`
(`killall waybar || waybar`) para a barra.

Testes manuais, na ordem:

1. Recarregar e confirmar que o Hyprland não reclamou de nenhum módulo (o `require()` é isolado —
   erro num arquivo não derruba os outros, então **falha silenciosa é o risco real**).
2. Clicar em cada workspace da barra e confirmar que troca de workspace.
3. Scroll sobre a barra e confirmar que navega entre workspaces.
4. Abrir o Firefox e o OpenCode e confirmar que o centro da barra mostra ícone + título, sem
   `ai.opencode.desktop`.
5. Conectar um monitor externo e confirmar que ele aparece com modo e posição sensatos, e que os
   workspaces 1–10 continuam alcançáveis.
6. Clicar no ícone de rede e confirmar que o wofi lista os SSIDs e conecta.
7. Rebootar e confirmar que o WiFi já está ligado sem `nm-applet`.
8. Se aprovado o item 5.4d, confirmar que o projetor recebe a barra.

## 9. Riscos

| Risco | Mitigação |
|---|---|
| Falha silenciosa num `require()` | Hyprland isola cada arquivo; verificar a barra e os binds após o reload |
| `nmcli radio wifi on` falha no boot frio | Verificar ao vivo; escalar para loop `until nmcli general status` |
| Barra central cresce com título longo | Aceito por ora; `rewrite` com captura é a saída se incomodar |
| `show-special` entrar na barra sem querer | Uma linha pra remover |
| Barra em toda saída duplicar visual | `"output": "*"` explícito; trocar para `"eDP-1"` reverte. Default não documentado no man page — verificar ao vivo |