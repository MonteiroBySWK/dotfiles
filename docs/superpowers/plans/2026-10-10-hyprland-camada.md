# Trilha A — Camada Hyprland Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remover a amarra entre workspaces e nomes de monitor no Hyprland, o que resolve de uma vez o layout rígido de saídas e o clique inerte no workspace da barra; e trocar a camada de identificação de janela e de rede por alternativas que funcionam na Waybar 0.15.

**Architecture:** Duas mudanças independentes no compositor, mais uma na barra. No Hyprland, `monitors.lua` passa a ter uma regra nomeada (`eDP-1`) mais um catch-all `output = ""`, e `workspaces.lua` deixa de amarrar workspace a saída. Na Waybar, `hyprland/window` deixa de formatar por `{class}` (a origem do `ai.opencode.desktop`) e passa a usar `icon: true`, e o clique do módulo `network` deixa de abrir `nmtui` e passa a chamar um script sob demanda.

**Tech Stack:** Hyprland 0.56.2 (config em Lua), Waybar v0.15.0, `nmcli` (NetworkManager 1.58.1), `wofi`, Lua 5.4 para os testes, Node 24 para validar o JSONC.

**Spec:** `docs/superpowers/specs/2026-10-10-hyprland-camada-design.md` — o plano argumenta a partir do spec; leia os dois.

## Global Constraints

- Hyprland 0.56.2. A config é **Lua**, não hyprlang. Não introduzir sintaxe hyprlang.
- Cada `require()` roda em escopo separado; **erro em um arquivo não derruba os outros**. Falha silenciosa é o risco nº 1 do spec.
- Não chamar `io.popen`, rede, nem qualquer I/O bloqueante dentro de handler de bind ou evento do Hyprland.
- I/O bloqueante vive em script `.sh` separado. Precedente: `hypr/scripts/brightness-ddc.sh` usa `flock` por isso.
- Não introduzir chave de Waybar que não esteja no man page da **versão 0.15.0 instalada** (`waybar-hyprland-workspaces.5.gz`, `waybar-hyprland-window.5.gz`).
- `hl.monitor` não tem chave `fallback`; o catch-all é `output = ""`.
- Não alterar `hypr/window_rules.lua` nem `waybar/style.css` neste plano.
- Identidade git: `G. Monteiro <129693679+MonteiroBySWK@users.noreply.github.com>`. Commits em português, sem acento, Conventional Commits com scope. **Nunca `git add .` ou `-A`.**

## Review Focus

Cinco condições que o spec implica mas que nenhum teste do compositor exercita, e que a pessoa
usando a config mais provavelmente vai encontrar:

1. **Plugou um monitor nunca visto antes.** O catch-all `output = ""` tem que aplicar modo e
   escala nele, sem editar arquivo.
2. **Desligou o monitor externo e religou.** As regras não podem ficar presas ao estado
   anterior de uma saída ausente.
3. **Título de janela com acento e emoji.** O `{title}` cru aparece sem mojibake; nada de
   regex por byte.
4. **Rede caída, sem SSID visível.** O `wifi-menu.sh` não pode abrir um wofi vazio nem travar
   esperando entrada.
5. **Recarregou a config com um arquivo quebrado.** O `require()` isolado esconde o erro.

Cada linha ganha o teste correspondente na task dona do código: 4 → Task 5 (fake nmcli e
wofi), 5 → Task 1 (o teste de carga de módulos), 3 → Task 5 (o `{title}` cru é o que resta
depois do `rewrite`), 1 e 2 → Task 2 (o catch-all é a única regra com `position`, e é testada
por igualdade de valor) e Task 6 (verificação manual).

---

## Ambiente de teste

Nada de testes com o compositor ao vivo nos testes automatizados: `hyprctl reload` num arquivo
com erro derruba a sessão, e `waybar` sem `$WAYLAND_DISPLAY` não sobe. Os testes aqui são
**estáticos** — carregam os arquivos Lua com um stub de `hl` e parseiam o JSONC. A verificação
com o compositor de verdade é a Task 6, que é manual e exige o usuário presente.

Três detalhes do harness que já quebraram durante a preparation deste plano, e que valem
para quem for mexer nele:

- O stub de `hl` precisa ser **recursivo**: `binds.lua` faz `hl.dsp.window.kill()`, três
  níveis de indexação.
- O spy precisa ser **seletivo**. Um spy em toda chave engole `hl.dsp` e `binds.lua` deixa de
  carregar.
- O spy de `hl.on` precisa **invocar o callback**. Sem isso, um `hl.exec_cmd` dentro de
  `hyprland.start` nunca é registrado e o teste da Task 4 passa errado.

## Mapa de arquivos

| Arquivo | Responsabilidade | Ação |
|---|---|---|
| `hypr/monitors.lua` | Regras de monitor: uma nomeada + catch-all | Modificar |
| `hypr/workspaces.lua` | Regras de workspace (hoje só amarra a monitor) | Modificar |
| `hypr/autostart.lua` | Comandos de boot, incluindo ligar o WiFi | Modificar |
| `waybar/config.jsonc` | Módulos e opções da barra | Modificar |
| `waybar/scripts/wifi-menu.sh` | Menu de redes via nmcli + wofi, sob demanda | Criar |
| `tests/jsonc.mjs` | Stripper de JSONC (comentários + trailing comma) | Criar |
| `tests/test_config.lua` | Carrega os módulos Lua com stub de `hl` e afirma as regras | Criar |
| `tests/test_waybar.mjs` | Afirma as opções da barra que a Task 5 muda | Criar |
| `tests/run.sh` | Roda os três testes | Criar |

---

### Task 1: Baseline — fixar o estado ruim antes de mexer

Sem esta task, um teste que falha na Task 2 é indistinguível de um bug novo. Ela grava o
comportamento atual para que as tasks seguintes sejam um delta visível, e de quebra cria o
`require()` de carga que cobre o Review Focus #5.

**Files:**
- Create: `tests/test_config.lua`
- Create: `tests/run.sh`

**Interfaces:**
- Consumes: os módulos em `hypr/`, via `package.path`.
- Produces: `bash tests/run.sh` — exit 0 se tudo passar, exit 1 com contagem de falhas caso
  contrário. Todo commit posterior roda esse comando.

- [ ] **Step 1: Escreva o teste de baseline que reproduz o bug**

`tests/test_config.lua`:

```lua
-- tests/test_config.lua
-- Carrega os modulos de hypr/ com um stub de hl e afirma as regras.
-- Rodar: bash tests/run.sh
package.path = "./hypr/?.lua;" .. package.path

-- Stub recursivo: qualquer chave devolve outra tabela stubbavel, e a
-- tabela e chamavel. Sem isso binds.lua nao carrega, porque
-- hl.dsp.window.kill() indexa tres niveis.
local function stub()
  local t = {}
  return setmetatable(t, {
    __index = function(self, k)
      local v = stub()
      rawset(self, k, v)
      return v
    end,
    __call = function()
      return stub()
    end,
  })
end

local captured = { monitor = {}, workspace_rule = {}, on = {}, exec_cmd = {}, bind = {} }

-- Spy so nas chaves observadas: engole hl.dsp e binds.lua nao carrega.
local WATCHED = {
  monitor = true, workspace_rule = true, on = true, exec_cmd = true, bind = true,
}

-- hl.on precisa INVOCAR o callback, senao um hl.exec_cmd dentro de
-- hyprland.start nunca e registrado.
local function spy(name)
  return function(...)
    local args = { ... }
    for _, a in ipairs(args) do
      if type(a) ~= "function" then
        table.insert(captured[name], a)
      end
    end
    if name == "on" and type(args[2]) == "function" then
      pcall(args[2])
    end
    return stub()
  end
end

_G.hl = setmetatable({}, {
  __index = function(self, k)
    local v
    if WATCHED[k] then
      v = spy(k)
    else
      v = stub()
    end
    rawset(self, k, v)
    return v
  end,
  __call = function()
    return stub()
  end,
})

local failures = {}
local function check(name, ok, detail)
  if ok then
    print("ok   - " .. name)
  else
    print("FAIL - " .. name .. (detail and ("  [" .. detail .. "]") or ""))
    table.insert(failures, name)
  end
end

local function any_captured(list, needle)
  for _, c in ipairs(captured[list]) do
    if type(c) == "string" and c:find(needle, 1, true) then return true end
  end
  return false
end

local function find_monitor(output)
  for _, m in ipairs(captured.monitor) do
    if m.output == output then return m end
  end
  return nil
end

-- Carrega na mesma ordem do manifesto hypr/hyprland.lua.
local MODULES = {
  "env", "vars", "monitors", "autostart", "theme", "animations",
  "input", "workspaces", "window_rules", "binds", "nightlight",
}

for _, m in ipairs(MODULES) do
  local ok, err = pcall(require, m)
  check("modulo carrega: " .. m, ok, ok and nil or tostring(err))
end

-- ---- Baseline: estado atual, antes das correcoes ----
check("baseline: regra nomeada para eDP-1", find_monitor("eDP-1") ~= nil)
check("baseline: regra nomeada para HDMI-A-1", find_monitor("HDMI-A-1") ~= nil)

local pinned = {}
for _, w in ipairs(captured.workspace_rule) do
  if w.monitor then table.insert(pinned, tostring(w.workspace) .. "->" .. w.monitor) end
end
check("baseline: workspaces presos a monitor", #pinned > 0,
  "pinned=" .. table.concat(pinned, ","))

check("baseline: boot nao liga wifi",
  not any_captured("exec_cmd", "nmcli radio wifi on"))

-- ---- Alvos das Tasks 2-4: todos devem FALHAR agora ----
local eDP = find_monitor("eDP-1")
if eDP then
  check("eDP-1 usa mode=preferred", eDP.mode == "preferred",
    "mode=" .. tostring(eDP.mode))
end
check("regra nomeada para HDMI-A-1 removida", find_monitor("HDMI-A-1") == nil)
check("existe catch-all (output vazio)", find_monitor("") ~= nil)
check("nenhum workspace preso a monitor", #pinned == 0,
  "pinned=" .. table.concat(pinned, ","))
check("boot liga o wifi com nmcli",
  any_captured("exec_cmd", "nmcli radio wifi on"))
check("boot nao sobe nm-aplet",
  not any_captured("exec_cmd", "nm-applet"))

if #failures > 0 then
  print("\n" .. #failures .. " falha(s)")
  os.exit(1)
end
print("\ntudo passou")
os.exit(0)
```

- [ ] **Step 2: Rode e confirme que o baseline passa e os alvos falham**

Run: `lua5.4 tests/test_config.lua; echo "exit=$?"`

Expected: os 11 `modulo carrega` em `ok`, os 4 `baseline:` em `ok`, e exatamente 5 `FAIL` —
`sendo eDP-1 usa mode=preferred` (detail `mode=1920x1080@60`), `regra nomeada para
HDMI-A-1 removida`, `existe catch-all (output vazio)`, `nenhum workspace preso a monitor`
(detail `pinned=1->HDMI-A-1,2->HDMI-A-1,3->eDP-1,4->eDP-1`) e `boot liga o wifi com nmcli`.
`exit=1`.

Um `modulo carrega` em `FAIL` significa que o harness está errado, não a config. Pare e
conserte o harness antes de seguir.

- [ ] **Step 3: Escreva o runner**

`tests/run.sh`:

```bash
#!/usr/bin/env bash
# Verificacao estatica da config. Nao toca no compositor.
# Uso: bash tests/run.sh
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

fail=0

echo "== modulos lua =="
if ! lua5.4 tests/test_config.lua; then
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  echo
  echo "FALHOU"
  exit 1
fi
echo "OK"
```

- [ ] **Step 4: Rode o runner**

Run: `bash tests/run.sh; echo "exit=$?"`

Expected: imprime `modulos lua`, as 5 falhas do alvo, `FALHOU`, e `exit=1`. Ainda não há
`tests/jsonc.mjs`, então o runner só cobre Lua — é o esperado neste ponto.

- [ ] **Step 5: Commit**

```bash
git add tests/test_config.lua tests/run.sh
git commit -m "test(hypr): baseline de regras de monitor e workspace"
```

---

### Task 2: Catch-all de monitor

**Files:**
- Modify: `hypr/monitors.lua`
- Create: `tests/jsonc.mjs`
- Modify: `tests/run.sh`

**Interfaces:**
- Consumes: nada da Task 1 (o `test_config.lua` já tem os alvos desta task).
- Produces: `tests/jsonc.mjs` exportando `stripComments(src) -> string`,
  `stripTrailingCommas(src) -> string` e `parseJsonc(src) -> object`, executável como
  `node tests/jsonc.mjs <arquivo>` (imprime `OK` e exit 0, ou `PARSE ERROR: <msg>` e exit 1).
  A Task 5 importa `parseJsonc` deste arquivo.

- [ ] **Step 1: Escreva o validador JSONC**

`tests/jsonc.mjs`:

```js
// tests/jsonc.mjs
// Valida que um arquivo JSONC e JSON valido apos remover comentarios e
// trailing comma. JSONC permite ambos; JSON.parse nao.
//
// Uso: node tests/jsonc.mjs <arquivo>
import fs from "node:fs";

// Remove // e /* */ fora de literais string.
export function stripComments(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const two = src.slice(i, i + 2);
    if (c === '"') {
      out += c;
      i++;
      while (i < n) {
        if (src[i] === "\\") {
          out += src.slice(i, i + 2);
          i += 2;
        } else if (src[i] === '"') {
          out += '"';
          i++;
          break;
        } else {
          out += src[i];
          i++;
        }
      }
    } else if (two === "//") {
      while (i < n && src[i] !== "\n") i++;
    } else if (two === "/*") {
      i += 2;
      while (i < n && src.slice(i, i + 2) !== "*/") i++;
      i += 2;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

// JSONC permite virgula antes de } ou ]; JSON.parse nao.
export function stripTrailingCommas(src) {
  return src.replace(/,(?=\s*[}\]])/g, "");
}

export function parseJsonc(src) {
  return JSON.parse(stripTrailingCommas(stripComments(src)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const raw = fs.readFileSync(process.argv[2], "utf8");
  try {
    parseJsonc(raw);
    process.stdout.write("OK\n");
  } catch (e) {
    process.stderr.write(`PARSE ERROR: ${e.message}\n`);
    process.exit(1);
  }
}
```

- [ ] **Step 2: Prove que o validador aceita e rejeita**

Um validador que só passa não serve — ele precisa falhar no input quebrado, e precisa não
manglar string.

Run:
```bash
node tests/jsonc.mjs waybar/config.jsonc            # esperado: OK
printf '{ "a": "x, }] // nao e comentario"\n}\n' > /tmp/ok.jsonc
node tests/jsonc.mjs /tmp/ok.jsonc                  # esperado: OK
printf '{\n "a": 1\n' > /tmp/bad.jsonc
node tests/jsonc.mjs /tmp/bad.jsonc; echo "exit=$?" # esperado: PARSE ERROR, exit=1
```

Expected: `OK`, `OK`, e `PARSE ERROR: ...` com `exit=1`. O segundo caso é o que prova que
uma string contendo `,`, `}]` e `//` não é corrompida.

- [ ] **Step 3: Rode o teste Lua e confirme que o alvo desta task falha**

Run: `bash tests/run.sh`

Expected: `FAIL - eDP-1 usa mode=preferred`, `FAIL - regra nomeada para HDMI-A-1 removida`,
`FAIL - existe catch-all (output vazio)`. Mais 2 falhas das Tasks 3 e 4, que ainda não
foram implementadas — normal.

- [ ] **Step 4: Reescreva `hypr/monitors.lua`**

```lua
--[[
  hypr/monitors.lua — configuracao de monitores
  https://wiki.hypr.land/Configuring/Basics/Monitors/

  Uma regra nomeada para o painel do notebook e uma catch-all. A catch-all
  (output = "") e o que faz projetor e monitor emprestado funcionarem sem
  editar este arquivo: qualquer saida que nao caia em regra nomeada herda
  ela. Nao existe chave "fallback" em hl.monitor -- o fallback e output vazio.
]]

-- Painel do notebook. mode "preferred" deixa o Hyprland escolher, em vez de
-- fixar 1920x1080@60 -- o painel so tem esse modo, e a sobrevive a outro laptop.
hl.monitor({
  output   = "eDP-1",
  mode     = "preferred",
  position = "auto",
  scale    = 1,
})

-- Catch-all. mode "preferred" = maior modo suportado pelo painel do
-- projetor. position "auto-right" coloca saidas desconhecidas a direita da
-- primeira; "auto" empilharia tudo no centro. Uma linha para trocar.
hl.monitor({
  output   = "",
  mode     = "preferred",
  position = "auto-right",
  scale    = 1,
})
```

- [ ] **Step 5: Rode e confirme que os três alvos desta task passam**

Run: `bash tests/run.sh`

Expected: `ok - eDP-1 usa mode=preferred`, `ok - regra nomeada para HDMI-A-1 removida`,
`ok - existe catch-all (output vazio)`. Restam 2 falhas, das Tasks 3 e 4.

- [ ] **Step 6: Acrescente a validação do JSONC ao runner**

Em `tests/run.sh`, substitua o bloco `echo "== modulos lua ==" ... done` por:

```bash
echo "== modulos lua =="
if ! lua5.4 tests/test_config.lua; then
  fail=1
fi

echo
echo "== waybar config.jsonc =="
if ! node tests/jsonc.mjs waybar/config.jsonc; then
  fail=1
fi
```

Run: `bash tests/run.sh`

Expected: a seção `waybar config.jsonc` imprime `OK`. O `FALHOU` no fim continua correto,
por causa das Tasks 3 e 4.

- [ ] **Step 7: Commit**

```bash
git add hypr/monitors.lua tests/jsonc.mjs tests/run.sh
git commit -m "fix(hypr): monitor catch-all e mode preferred no painel"
```

---

### Task 3: Workspaces livres de monitor

Esta é a correção que resolve o clique inerte. Não mexe em Waybar.

**Files:**
- Modify: `hypr/workspaces.lua`

**Interfaces:**
- Consumes: o harness da Task 1.
- Produces: nada.

- [ ] **Step 1: Rode e confirme que o alvo desta task falha**

Run: `bash tests/run.sh`

Expected: `FAIL - nenhum workspace preso a monitor` com
`pinned=1->HDMI-A-1,2->HDMI-A-1,3->eDP-1,4->eDP-1`.

- [ ] **Step 2: Esvazie `hypr/workspaces.lua`**

O arquivo é mantido porque `hypr/hyprland.lua:14` faz `require("workspaces")`, e porque é
o lugar natural para regras futuras (`default_name`, `on_created_empty`, gaps por workspace).

```lua
--[[
  hypr/workspaces.lua — regras de workspace

  Nao ha hl.workspace_rule aqui de proposito. Preso a nome de saida, o
  workspace nasce no monitor fixo, e o Waybar (que nao tem on-click em
  hyprland/workspaces) reabre o workspace no monitor onde ele foi atribuido
  por ultimo. Sem aquela saida conectada, clicar no workspace nao faz nada.

  Deixando livre, o workspace nasce no monitor com foco e viaja por
  SUPER + SHIFT + n. Regras futuras (default_name, on_created_empty, gaps
  por workspace) entram aqui.
]]
```

- [ ] **Step 3: Rode e confirme que passa**

Run: `bash tests/run.sh`

Expected: `ok - nenhum workspace preso a monitor`. Resta 1 falha, da Task 4.

- [ ] **Step 4: Confirme que o manifesto ainda carrega**

`require("workspaces")` continua existindo e um arquivo só de comentário carrega sem erro.
Este passo existe para não assumir.

Run: `lua5.4 -e 'package.path="./hypr/?.lua;"..package.path; print(pcall(require,"workspaces"))'`

Expected: `true`.

- [ ] **Step 5: Commit**

```bash
git add hypr/workspaces.lua
git commit -m "fix(hypr): soltar workspaces da amarra de monitor"
```

---

### Task 4: WiFi ligado no boot

**Files:**
- Modify: `hypr/autostart.lua`

**Interfaces:**
- Consumes: harness da Task 1.
- Produces: nada.

- [ ] **Step 1: Rode e confirme que o alvo desta task falha**

Run: `bash tests/run.sh`

Expected: `FAIL - boot liga o wifi com nmcli`, e **nenhum** outro. Esta é a última falha
pendente do lado do Lua.

- [ ] **Step 2: Acrescente a linha em `hypr/autostart.lua`**

Dentro do `hl.on("hyprland.start", ...)`, antes do `dbus-update-activation-environment`:

```lua
  -- WiFi: o radio desligava sozinho e obrigava nm-aplet manual, que ainda
  -- duplicava o icone de rede da barra. A permissao enable-disable-wifi
  -- ja esta liberada (nmcli general permissions).
  hl.exec_cmd("nmcli radio wifi on")
```

- [ ] **Step 3: Rode e confirme que tudo passa**

Run: `bash tests/run.sh`

Expected: `OK`, exit 0. Todos os testes Lua verdes.

- [ ] **Step 4: Confirme que o nmcli aceita o comando de verdade**

O `hl.exec_cmd` roda `sh -c`, então o comando é real. Um `radio wifi on` falhado é o risco
registrado no spec §5.3, e o teste estático não pega isso.

Run:
```bash
nmcli radio wifi on; echo "exit=$?"
nmcli radio wifi | head -2
```

Expected: exit 0 e a saída mostra `enabled`. Se der erro de permissão, o teste está verde
mas o boot vai falhar — nesse caso, troque o Step 2 por:

```lua
  -- Espera o NetworkManager responder antes de tentar; nmcli em boot frio
  -- falha se o NM ainda nao subiu.
  hl.exec_cmd("sh -c 'until nmcli general status >/dev/null 2>&1; do sleep 1; done; nmcli radio wifi on'")
```

- [ ] **Step 5: Commit**

```bash
git add hypr/autostart.lua
git commit -m "feat(hypr): ligar wifi no boot"
```

---

### Task 5: Barra — título, ícone e menu de rede

A maior das tasks. Faz as três mudanças de uma vez porque tocam o mesmo arquivo e o mesmo
reload; revisar a barra duas vezes seguidas seria desperdício.

**Files:**
- Modify: `waybar/config.jsonc` — `modules-left`, `network`, `hyprland/window`, e a nova
  chave raiz `output`
- Create: `waybar/scripts/wifi-menu.sh`
- Create: `tests/test_waybar.mjs`
- Modify: `tests/run.sh`

**Interfaces:**
- Consumes: `parseJsonc` de `tests/jsonc.mjs` (Task 2).
- Produces: `waybar/scripts/wifi-menu.sh`, executável, sem argumento, exit 0 sempre.

- [ ] **Step 1: Escreva o teste que falha**

`tests/test_waybar.mjs`:

```js
// tests/test_waybar.mjs
// Afirma as opcoes da barra que a Task 5 muda. Nao sobe o waybar: ele
// precisa de $WAYLAND_DISPLAY e abriria uma segunda barra na tela.
import fs from "node:fs";
import { parseJsonc } from "./jsonc.mjs";

const cfg = parseJsonc(fs.readFileSync("waybar/config.jsonc", "utf8"));

let failures = 0;
function check(name, ok, detail) {
  if (ok) {
    console.log("ok   - " + name);
  } else {
    console.log("FAIL - " + name + (detail ? "  [" + detail + "]" : ""));
    failures++;
  }
}

// Um modulo em modules-left e string nua ou bloco; normaliza em objeto.
function blockOf(modules, name) {
  for (const m of modules) {
    if (typeof m === "string" && m === name) return {};
    if (m && typeof m === "object" && !Array.isArray(m)) return m;
  }
  return undefined;
}

const ws = blockOf(cfg["modules-left"], "hyprland/workspaces");
check("workspaces e um bloco, nao string nua", ws !== undefined);
if (ws) {
  check("workspaces ordena por numero", ws["sort-by"] === "number",
    "sort-by=" + ws["sort-by"]);
  check("workspaces tem scroll para cima",
    typeof ws["on-scroll-up"] === "string" &&
    ws["on-scroll-up"].includes("workspace e-1"),
    "on-scroll-up=" + ws["on-scroll-up"]);
  check("workspaces tem scroll para baixo",
    typeof ws["on-scroll-down"] === "string" &&
    ws["on-scroll-down"].includes("workspace e+1"),
    "on-scroll-down=" + ws["on-scroll-down"]);
}

const win = cfg["hyprland/window"];
check("window format e {title}", win.format === "{title}",
  "format=" + win.format);
check("window nao usa mais {class}", !String(win.format).includes("{class}"));
check("window mostra icone real do app", win.icon === true,
  "icon=" + win.icon);
check("window icon-size e 16", win["icon-size"] === 16,
  "icon-size=" + win["icon-size"]);
// O rewrite por class era o que escondia apps nao mapeados; some junto.
check("window nao tem rewrite por class", win.rewrite === undefined);

const net = cfg.network;
check("network on-click chama wifi-menu.sh",
  typeof net["on-click"] === "string" && net["on-click"].includes("wifi-menu.sh"),
  "on-click=" + net["on-click"]);
check("network nao abre mais nmtui",
  !String(net["on-click"]).includes("nmtui"));
check("network on-click-right abre pavucontrol",
  typeof net["on-click-right"] === "string" &&
  net["on-click-right"].includes("pavucontrol"));

check("output esta explicito", typeof cfg.output === "string",
  "output=" + cfg.output);

if (failures > 0) {
  console.log("\n" + failures + " falha(s)");
  process.exit(1);
}
console.log("\ntudo passou");
```

- [ ] **Step 2: Rode e confirme que falha**

Run: `node tests/test_waybar.mjs; echo "exit=$?"`

Expected: falha em `workspaces e um bloco, nao string nua`, `window format e {title}`,
`window nao usa mais {class}`, `window mostra icone real do app`, `window nao tem rewrite por
class`, `network on-click chama wifi-menu.sh`, `network nao abre mais nmtui`, `network
on-click-right abre pavucontrol` e `output esta explicito`. `exit=1`.

- [ ] **Step 3: Escreva o script de WiFi**

`waybar/scripts/wifi-menu.sh`:

```bash
#!/usr/bin/env bash
# Menu de redes WiFi para o modulo network da waybar.
#
# Substitui o nmtui, que era aberto no clique do icone de rede.
# Roda sob demanda (e alvo de on-click, nao modulo custom), entao nao usa
# cache em /tmp, nem saida JSON, nem sinal RTMIN para recarregar a barra.
set -uo pipefail

# nmcli device menu nao existe no NetworkManager 1.58, que tem nm-aplet e
# nmtui como as unicas interfaces. A lista e montada aqui e a conexao e
# feita direto com nmcli device wifi connect.
#
# WAYBAR_WIFI_NO_RESCAN=1 pula o --rescan, que e a parte lenta (~3s).
rescan="--rescan yes"
[ "${WAYBAR_WIFI_NO_RESCAN:-0}" = "1" ] && rescan=""

list=$(nmcli -t -f SSID,SIGNAL,SECURITY device wifi list $rescan 2>/dev/null) || exit 0
[ -z "$list" ] && exit 0

active=$(nmcli -t -f ACTIVE,SSID device wifi 2>/dev/null \
  | awk -F: '$1 == "yes" { print $2; exit }')

# Mantem a ordem do nmcli (por sinal) e marca a ativa com ">".
# Redes ocultas tem SSID vazio e ficam de fora.
menu=$(printf '%s\n' "$list" | awk -F: -v active="$active" '
  NF >= 2 && $1 != "" {
    mark = ($1 == active) ? "> " : "  "
    printf "%s%s (%s%%)\n", mark, $1, $2
  }')

# Nenhuma rede visivel (desligadas, sem permissao, ou em outro plano):
# sai sem abrir wofi, em vez de deixar um menu vazio na tela.
[ -z "$menu" ] && exit 0

choice=$(printf '%s\n' "$menu" | wofi --show dmenu --prompt "WiFi" --hide-input)
[ -z "${choice:-}" ] && exit 0

# Desfaz a marcacao e o "(NN%)" do final para recuperar o SSID exato.
ssid=$(printf '%s' "$choice" | sed -E 's/^>[[:space:]]?//; s/^[[:space:]]+//; s/[[:space:]]+\([0-9]+%\)$//')
[ -z "$ssid" ] && exit 0

iface=$(nmcli -t -f DEVICE,TYPE device status 2>/dev/null \
  | awk -F: '$2 == "wifi" { print $1; exit }')

if [ "$ssid" = "$active" ]; then
  [ -n "$iface" ] && nmcli device disconnect "$iface" >/dev/null 2>&1
else
  [ -n "$iface" ] && nmcli device wifi connect "$ssid" ifname "$iface" >/dev/null 2>&1
fi
```

Os redirecionamentos `>/dev/null 2>&1` são deliberados: o `nmcli` não deve poluir a sessão
do wofi. Note a ordem — `>/dev/null 2>&1` manda os dois para o null, enquanto `2>&1 >/dev/null`
mandaria stderr para a tela.

- [ ] **Step 4: Torne o script executável e valide a sintaxe**

Run:
```bash
chmod +x waybar/scripts/wifi-menu.sh
bash -n waybar/scripts/wifi-menu.sh && echo "sintaxe ok"
```

Expected: `sintaxe ok`.

- [ ] **Step 5: Monte os dublês de nmcli e wofi**

Os fakes vão num diretório fora do repo, e o log de ações num arquivo — o script descarta o
stderr do nmcli, então um assert no stdout não veria nada.

Run:
```bash
mkdir -p /tmp/opencode/fakebin
cat > /tmp/opencode/fakebin/nmcli <<'EOF'
#!/usr/bin/env bash
args="$*"
case "$args" in
  *"device wifi list"*) printf 'familia C 2G:100:WPA1 WPA2\n:100:WPA2\nXfce1:90:WPA2\nRede Com Espaco:70:WPA2\n' ;;
  *"ACTIVE,SSID"*) if [ -n "$FAKE_ACTIVE" ]; then echo "yes:$FAKE_ACTIVE"; else echo "no:"; fi ;;
  *"DEVICE,TYPE"*) echo "wlan0:wifi" ;;
  *"device wifi connect"*|*"device disconnect"*) echo "ACTION|$args" >> "$FAKE_LOG" ;;
  *) : ;;
esac
EOF
cat > /tmp/opencode/fakebin/wofi <<'EOF'
#!/usr/bin/env bash
if [ -n "${FAKE_PICK:-}" ]; then line=$(grep -F -- "$FAKE_PICK" | head -1); else line=$(head -1); fi
echo "WS-> [$line]" >&2
printf '%s\n' "$line"
EOF
chmod +x /tmp/opencode/fakebin/nmcli /tmp/opencode/fakebin/wofi
```

O `ACTIVE,SSID` precisa devolver `yes:SSID`, não o SSID cru — é o formato real do nmcli, e é
o que decide abranch disconnect.

- [ ] **Step 6: Teste o caminho de conectar**

Run:
```bash
cd /home/monteiro/.config
export PATH="/tmp/opencode/fakebin:$PATH" WAYBAR_WIFI_NO_RESCAN=1
export FAKE_LOG=/tmp/opencode/nmcli.log
: > "$FAKE_LOG"
FAKE_ACTIVE="" FAKE_PICK="Rede Com Espaco" bash waybar/scripts/wifi-menu.sh
cat "$FAKE_LOG"
```

Expected:
```
WS-> [  Rede Com Espaco (70%)]
ACTION|device wifi connect Rede Com Espaco ifname wlan0
```

O SSID contém espaços e sobrevive inteiro — um `awk -F:` ingênuo quebraria aqui.

- [ ] **Step 7: Teste o caminho de desconectar**

Run:
```bash
: > "$FAKE_LOG"
FAKE_ACTIVE="familia C 2G" FAKE_PICK="familia C 2G" bash waybar/scripts/wifi-menu.sh
cat "$FAKE_LOG"
```

Expected:
```
WS-> [> familia C 2G (100%)]
ACTION|device disconnect wlan0
```

O `>` na linha do wofi confirma que a rede ativa foi marcada, e o comando é `disconnect`, não
`connect`.

- [ ] **Step 8: Teste o Review Focus #4 — lista vazia e cancelamento**

Run:
```bash
cat > /tmp/opencode/fakebin/nmcli <<'EOF'
#!/usr/bin/env bash
exit 0
EOF
chmod +x /tmp/opencode/fakebin/nmcli
timeout 5 bash waybar/scripts/wifi-menu.sh; echo "lista vazia exit=$?"

cat > /tmp/opencode/fakebin/wofi <<'EOF'
#!/usr/bin/env bash
cat >/dev/null; exit 1
EOF
chmod +x /tmp/opencode/fakebin/wofi
: > "$FAKE_LOG"
timeout 5 bash waybar/scripts/wifi-menu.sh; echo "Esc exit=$?"; grep -c ACTION "$FAKE_LOG" || echo "0 acoes"
```

Expected: `lista vazia exit=0` e `Esc exit=0` com `0 acoes`. O `timeout 5` existe para que um
menu vazio esperando entrada vire falha visível em vez de travar o Step 9.

- [ ] **Step 9: Edite `waybar/config.jsonc` — `modules-left`**

Substitua:

```jsonc
  "modules-left": [
    "hyprland/workspaces"
  ],
```

por:

```jsonc
  "modules-left": [
    {
      "hyprland/workspaces": {
        "sort-by": "number",
        "show-special": true,
        "on-scroll-up": "hyprctl dispatch workspace e-1",
        "on-scroll-down": "hyprctl dispatch workspace e+1"
      }
    }
  ],
```

O objeto precisa estar embrulhado em `[{ ... }]`. `"chave": {}` solto dentro do array é JSON
inválido e o Waybar não sobe.

- [ ] **Step 10: Edite `waybar/config.jsonc` — `hyprland/window`**

Substitua o bloco inteiro:

```jsonc
  "hyprland/window": {
    "format": "{class}",
    "max-length": 50,
    "separate-outputs": true,
    "rewrite": {
      "kitty": "  Terminal",
      "firefox": "󰈹   Firefox",
      "dolphin": "  Arquivos",
      "jetbrains-idea": "  IntelliJ",
      "discord": "  Discord"
    }
  },
```

por:

```jsonc
  "hyprland/window": {
    "format": "{title}",
    "icon": true,
    "icon-size": 16
  },
```

`icon: true` renderiza o ícone real do app (a imagem do `.desktop`), não um glifo. É a única
forma de ter ícone e título juntos no Waybar 0.15: o `{icon}` não é um replacement deste
módulo, e o `rewrite` compara contra a string já formatada com `std::regex_match`, que precisa
casar a string inteira — ele não consegue prepender um ícone mantendo o título.

- [ ] **Step 11: Edite `waybar/config.jsonc` — `network`**

Substitua `"on-click": "kitty -e nmtui",` por:

```jsonc
    "on-click": "~/.config/waybar/scripts/wifi-menu.sh",
    "on-click-right": "pavucontrol",
```

- [ ] **Step 12: Edite `waybar/config.jsonc` — `output`**

Acrescente a chave no nível raiz, ao lado de `"layer"`, `"position"`, `"spacing"`, `"height"`:

```jsonc
  "output": "*",
```

O man page do Waybar 0.15 documenta a chave mas não declara o default, então o comportamento
atual é empírico. `"output": "*"` torna a intenção explícita. **Se preferir barra só no
notebook, é `"eDP-1"`** — e vale conferir visualmente se já há barra duplicada no HDMI-A-1.

- [ ] **Step 13: Rode e confirme que passa**

Run: `node tests/test_waybar.mjs && bash tests/run.sh`

Expected: `tudo passou` e `OK`, ambos exit 0.

- [ ] **Step 14: Acrescente a barra ao runner**

Em `tests/run.sh`, antes do bloco `if [ "$fail" -ne 0 ]`:

```bash
echo
echo "== waybar modulos =="
if ! node tests/test_waybar.mjs; then
  fail=1
fi
```

Run: `bash tests/run.sh`

Expected: `OK`, exit 0.

- [ ] **Step 15: Confirme que o script referenciado existe e é executável**

Run: `test -x waybar/scripts/wifi-menu.sh && echo "executavel ok" || echo "FALTA chmod +x"`

Expected: `executavel ok`. Um `on-click` apontando para script não executável falha em
silêncio no Waybar.

- [ ] **Step 16: Limpe os dublês**

Run: `rm -rf /tmp/opencode/fakebin /tmp/opencode/nmcli.log`

- [ ] **Step 17: Commit**

```bash
git add waybar/config.jsonc waybar/scripts/wifi-menu.sh tests/test_waybar.mjs tests/run.sh
git commit -m "feat(waybar): titulo e icone no centro, menu de wifi no lugar do nmtui"
```

---

### Task 6: Verificação com o compositor de verdade

Automatizável: não. Esta task precisa do usuário com o desktop na frente. Não commite nada
aqui — é a validação que aprova, ou não, as tasks anteriores.

**Files:** nenhum.

**Interfaces:**
- Consumes: tudo das Tasks 1–5.
- Produces: decisão de seguir, ajustar ou reverter.

- [ ] **Step 1: Recarregue e confirme que nenhum módulo quebrou**

O `require()` é isolado por arquivo: um erro não derruba o resto, ele **some**. É o risco nº 1
do spec. Confira os três sinais juntos:

Run:
```bash
hyprctl reload
sleep 1
pidof waybar >/dev/null && echo "waybar vivo" || echo "waybar MORTO"
hyprctl monitors all | head -20
```

Expected: `waybar vivo`, e a lista de monitores mostra `eDP-1` **e** `HDMI-A-1` (ambos estão
conectados na sua máquina).

- [ ] **Step 2: Teste a barra**

Na tela, um por um:

1. Clique em cada workspace da barra → deve trocar de workspace.
2. Scroll sobre a barra → deve navegar entre os workspaces.
3. Abra o Firefox e o OpenCode → o centro mostra ícone + título, **sem `ai.opencode.desktop`**.
4. Confira se há barra duplicada no `HDMI-A-1`. Se houver, troque `"output": "*"` por
   `"output": "eDP-1"`.

- [ ] **Step 3: Teste o clique em workspace com o HDMI desconectado**

É o teste que reproduz o bug original. Desconecte o cabo do `HDMI-A-1` (ou suspenda o
monitor) e **sem reconectar**, clique em cada workspace da barra.

Expected: todos os workspaces alcançáveis. Antes da Task 3 o clique era inerte, porque o
workspace apontava para uma saída ausente.

- [ ] **Step 4: Teste o menu de WiFi**

Clique no ícone de rede.

Expected: o wofi abre com a lista, a rede ativa marcada com `>`. Escolher a ativa desconecta;
escolher outra conecta. `Esc` fecha sem fazer nada.

- [ ] **Step 5: Teste o WiFi no boot**

`hyprctl exit` encerra a sessão. Faça login de novo.

Expected: WiFi já ligado, **sem** `nm-aplet` no terminal, e sem ícone duplicado no tray.

- [ ] **Step 6: Teste um monitor desconhecido (Review Focus #1)**

O caminho honesto aqui é um projetor, ou um monitor que você nunca conectou. Se não tiver um à
mão, este item fica para a próxima oportunidade — e isso precisa ser dito explicitamente, não
assumido como passou.

Expected: o monitor aparece com modo e escala sensatos, e os workspaces continuam alcançáveis.

- [ ] **Step 7: Registre o resultado do Firefox (§7 do spec)**

Ainda não corrigido, e é diagnóstico. Abra 3 janelas do Firefox e:

Run: `hyprctl clients | grep -c firefox` — antes.

Aperte `SUPER + C`. Depois:

Run: `hyprctl clients | grep -c firefox` — depois.

- Caiu para 2 → Hyprland está inocente. A correção é pref do Firefox (`user.js` versionado nos
  dotfiles, que hoje não existe).
- Caiu para 0 → aí sim `SUPER + C` ou o `suppress_event` de `window_rules.lua:7-11` está
  envolvido, e a correção é nesta config. **Isso reabre a trilha** com evidência.

- [ ] **Step 8: Commit do resultado, se algo tiver sido ajustado**

Se o Step 2 passo 4 trocou `output` para `"eDP-1"`, ou o Step 1 exigir tweak:

```bash
git add waybar/config.jsonc
git commit -m "fix(waybar): output da barra restrito ao painel do notebook"
```

Se nada mudou, **não faça commit**. Working tree limpa é o resultado correto.

---

## Fora de escopo

Não implementar neste plano, por decisão do spec §6:

- **Item C** (brilho em Lua, controle de volume e fone) — trilha própria. Depende desta, porque
  o `brightness-ddc.sh` precisa saber qual saída é externa, e isso só é determinável com o
  catch-all da Task 2 no lugar.
- **Item G** (Bluetooth) — trilha própria. O Waybar 0.15 tem `waybar-bluetooth.5.gz` instalado.
- **Item H** (manifesto de pacotes) — trilha própria.
- **Item A** (Firefox) — o Step 7 da Task 6 é diagnóstico. A correção depende do resultado.
- **`swaync-client`** — não está instalado; o bloco `custom/notifications` é código morto
  protegido por `exec-if`. Decidir entre instalar e remover é do item de notificações.
- **`waybar/style.css`** — intocado.

## Verificação final

```bash
bash tests/run.sh          # estatico: lua stub + jsonc + asserts da barra
git status --short         # so o que voce versionou de proposito
git log --oneline -6       # 6 commits, um por task
```