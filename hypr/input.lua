--[[
  hypr/input.lua — teclado, touchpad, gestos e dispositivos
  https://wiki.hypr.land/Configuring/Basics/Variables/ (input)
  https://wiki.hypr.land/Configuring/Advanced-and-Cool/Gestures/
  https://wiki.hypr.land/Configuring/Advanced-and-Cool/Devices/
]]

hl.config({
  input = {
    kb_layout  = "br",
    kb_variant = "abnt2",
    kb_model   = "",
    kb_options = "",
    kb_rules   = "",
    follow_mouse = 1,
    sensitivity  = 0, -- -1.0 a 1.0, 0 = sem modificação
    touchpad = { natural_scroll = true },
  },
})

hl.gesture({
  fingers   = 3,
  direction = "horizontal",
  action    = "workspace",
})

-- Config por dispositivo (exemplo: nome de `hyprctl devices`)
hl.device({
  name        = "epic-mouse-v1",
  sensitivity = -0.5,
})
