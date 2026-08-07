--[[
  hypr/monitors.lua — configuração de monitores
  https://wiki.hypr.land/Configuring/Basics/Monitors/
]]

hl.monitor({
  output   = "eDP-1",
  mode     = "1920x1080@60",
  position = "auto",
  scale    = 1,
})
hl.monitor({
  output   = "HDMI-A-1",
  mode     = "1920x1080@120",
  position = "1920x0",
  scale    = 1,
})
