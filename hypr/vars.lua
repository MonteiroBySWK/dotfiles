--[[
  hypr/vars.lua — variáveis compartilhadas entre os módulos
  Uso: local v = require("vars")  →  v.terminal, v.mainMod, ...
]]

return {
  terminal    = "kitty",
  fileManager = "dolphin",
  menu        = "wofi --show drun",
  mainMod     = "SUPER",
}
