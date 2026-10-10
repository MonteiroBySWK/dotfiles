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

-- hl.dsp.exec_cmd("...") esconde a string dentro de uma tabela stub: sem
-- este proxy o comando de um bind nunca chega em captured.exec_cmd.
local dsp_proxy = setmetatable({}, {
  __index = function(_, k)
    if k == "exec_cmd" or k == "exec_raw" then
      return function(cmd)
        if type(cmd) == "string" then
          table.insert(captured.exec_cmd, cmd)
        end
        return stub()
      end
    end
    return stub()
  end,
})

_G.hl = setmetatable({}, {
  __index = function(self, k)
    local v
    if WATCHED[k] then
      v = spy(k)
    elseif k == "dsp" then
      v = dsp_proxy
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
-- Cada assert de baseline e aposentado pela task que muda o que ele
-- descreve. Assert de baseline que vira falso trava o suite inteiro em
-- vermelho e convida a deletar o arquivo sob pressao.
check("baseline: regra nomeada para eDP-1", find_monitor("eDP-1") ~= nil)

local pinned = {}
for _, w in ipairs(captured.workspace_rule) do
  if w.monitor then table.insert(pinned, tostring(w.workspace) .. "->" .. w.monitor) end
end

-- ---- Estado final: todos devem passar depois da Trilha A ----
-- Quando uma task nova alterar hypr/, acrescente o assert dela aqui.
local eDP = find_monitor("eDP-1")
if eDP then
  check("eDP-1 usa mode=preferred", eDP.mode == "preferred",
    "mode=" .. tostring(eDP.mode))
end
check("regra nomeada para HDMI-A-1 removida", find_monitor("HDMI-A-1") == nil)
local fallback = find_monitor("")
check("existe catch-all (output vazio)", fallback ~= nil)
-- O monitor de casa fica a ESQUERDA do notebook. "auto-right" colocava do
-- lado oposto; este assert existe para o erro nao voltar sem que a
-- mudanca de lado passe despercebida.
if fallback then
  check("catch-all posiciona a esquerda", fallback.position == "auto-left",
    "position=" .. tostring(fallback.position))
  -- "preferred" segue o modo preferido do EDID, que neste monitor e
  -- 1920x1080@60: perdia os 120Hz que a config antiga fixava.
  check("catch-all usa mode=highrr", fallback.mode == "highrr",
    "mode=" .. tostring(fallback.mode))
  check("catch-all tem escala 1", fallback.scale == 1,
    "scale=" .. tostring(fallback.scale))
end
check("nenhum workspace preso a monitor", #pinned == 0,
  "pinned=" .. table.concat(pinned, ","))
check("boot liga o wifi com nmcli",
  any_captured("exec_cmd", "nmcli radio wifi on"))
check("boot nao sobe nm-aplet",
  not any_captured("exec_cmd", "nm-aplet"))

-- ---- SUPER + C: fechar janela ----
-- O bind virou funcao, entao o spy so ve a string da tecla e nao alcanca
-- o dispatcher de dentro. O assert e de fonte.
local binds_f = io.open("hypr/binds.lua")
local binds_src = (binds_f and binds_f:read("*a")) or ""
if binds_f then binds_f:close() end
check("SUPER+C nao usa window.kill",
  not binds_src:find("window%.kill%(%s*%)"),
  "encontrado window.kill no bind de fechar janela")
check("SUPER+C usa window.close com address",
  binds_src:find("window%.close%(%s*{%s*address") ~= nil)
check("SUPER+C le a janela ativa antes de fechar",
  binds_src:find("get_active_window%(%)") ~= nil)

-- ---- SUPER + R: reinicio do waybar ----
-- Dois bugs ja aconteceram nesta linha:
--   "killall waybar || waybar" -- quando o waybar ESTAVA rodando, o killall
--   tinha sucesso, o || nao rodava, e a barra ficava morta.
--   sem setsid, o dispatcher mata o grupo de processos e a barra morre
--   poucos segundos depois de subir.
local restart_ok, restart_why = false, "nenhum comando de waybar encontrado"
for _, c in ipairs(captured.exec_cmd) do
  if type(c) == "string" and c:find("waybar", 1, true) then
    local sem_setsid = not c:find("setsid", 1, true)
    local usa_pipe = c:find("||", 1, true) ~= nil
    if sem_setsid or usa_pipe then
      restart_why = (sem_setsid and "sem setsid" or "") ..
        (usa_pipe and "usa ||" or "")
      restart_why = restart_why .. " => " .. c
    else
      restart_ok = true
    end
  end
end
check("reinicio do waybar usa ; e setsid", restart_ok, restart_why)

if #failures > 0 then
  print("\n" .. #failures .. " falha(s)")
  os.exit(1)
end
print("\ntudo passou")
os.exit(0)