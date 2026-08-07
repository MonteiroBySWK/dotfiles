--[[
  hypr/env.lua — variáveis de ambiente (convertido de env.conf)
  Carregado via require("env") em hyprland.lua
]]

--------------------------------
-- ENVIRONMENT VARIABLES
--------------------------------

hl.env("XCURSOR_THEME", "breeze_cursors")
hl.env("XCURSOR_SIZE", "24")
hl.env("HYPRCURSOR_SIZE", "24")
hl.env("GDK_DPI_SCALE", "1")

-- XDG SPECIFICATIONS
hl.env("XDG_CURRENT_DESKTOP", "Hyprland")
hl.env("XDG_SESSION_TYPE", "wayland")
hl.env("XDG_SESSION_DESKTOP", "Hyprland")

hl.env("PANGOCAIRO_BACKEND", "fontconfig")

-- QT SPECIFICATIONS
hl.env("QT_QPA_PLATFORMTHEME", "qt6ct")
hl.env("QT_WAYLAND_DISABLE_WINDOWDECORATION", "1")
hl.env("QT_AUTO_SCREEN_SCALE_FACTOR", "1")
