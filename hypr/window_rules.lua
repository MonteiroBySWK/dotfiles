--[[
  hypr/window_rules.lua — regras de janela (adaptadas do example/hyprland.lua)
  https://wiki.hypr.land/Configuring/Basics/Window-Rules/
]]

-- Ignora pedidos de maximize falsos de apps (annoyance clássica em tiling)
hl.window_rule({
  name           = "suppress-maximize-events",
  match          = { class = ".*" },
  suppress_event = "maximize",
})

-- Conserta drags quebrados de janelas XWayland (ex: IDEs JetBrains)
hl.window_rule({
  name        = "fix-xwayland-drags",
  match       = { class = "^$", title = "^$", xwayland = true,
                  float = true, fullscreen = false, pin = false },
  no_focus    = true,
})
