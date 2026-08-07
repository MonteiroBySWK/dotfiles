--[[
  hypr/hyprland.lua — entrada da configuração (manifesto)
  Config dividida em módulos: https://wiki.hypr.land/Configuring/Start/
  Cada require() roda em escopo separado — erro num arquivo não derruba os outros.
]]

require("env")          -- variáveis de ambiente
require("vars")         -- variáveis compartilhadas (terminal, mainMod, ...)
require("monitors")     -- monitores
require("autostart")    -- programas iniciados junto com o compositor
require("theme")        -- aparência (general, decoration, dwindle, master, misc)
require("animations")   -- curvas bezier e animações
require("input")        -- teclado, touchpad, gestos e dispositivos
require("workspaces")   -- regras de workspace
require("binds")        -- atalhos de teclado e mouse
