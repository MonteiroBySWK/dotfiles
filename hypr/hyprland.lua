--[[
  hypr/hyprland.lua — configuração em Lua (convertido de hyprland.conf)
  Referências: https://wiki.hypr.land/Configuring/Start/
  hyprland.conf antigo fica como backup (ignorado enquanto este arquivo existir)
]]

require("env")

-----------------------
-- PROGRAMS
-----------------------

local terminal    = "kitty"
local fileManager = "dolphin"
local menu        = "wofi --show drun"
local mainMod     = "SUPER"

-----------------------
-- MONITORS
-----------------------
-- https://wiki.hypr.land/Configuring/Basics/Monitors/

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

-----------------------
-- AUTOSTART
-----------------------
-- https://wiki.hypr.land/Configuring/Basics/Autostart/

hl.on("hyprland.start", function()
  hl.exec_cmd("waybar")
  hl.exec_cmd("hyprpaper")
  hl.exec_cmd("mako")
  hl.exec_cmd("xdg-desktop-portal-hyprland")
  hl.exec_cmd("dbus-update-activation-environment --systemd WAYLAND_DISPLAY XDG_CURRENT_DESKTOP")
  hl.exec_cmd([[gsettings set org.gnome.desktop.interface color-scheme "prefer-dark"]])
  hl.exec_cmd([[gsettings set org.gnome.desktop.interface gtk-theme "Adwaita-dark"]])
  hl.exec_cmd("hyprctl setcursor breeze_cursors 24")
  hl.exec_cmd([[gsettings set org.gnome.desktop.interface cursor-theme 'breeze_cursors']])
  hl.exec_cmd([[gsettings set org.gnome.desktop.interface cursor-size 24]])
end)

-----------------------
-- LOOK AND FEEL
-----------------------
-- https://wiki.hypr.land/Configuring/Basics/Variables/

hl.config({
  xwayland = {
    force_zero_scaling = true,
  },
  general = {
    gaps_in  = 2,
    gaps_out = 0,
    border_size = 1,
    col = {
      active_border   = { colors = { "rgba(33ccffee)", "rgba(00ff99ee)" }, angle = 45 },
      inactive_border = "rgba(595959aa)",
    },
    resize_on_border = false, -- arrastar janelas pelas bordas/gaps
    allow_tearing    = false, -- veja https://wiki.hypr.land/Configuring/Tearing/
    layout = "dwindle",
  },
  decoration = {
    rounding       = 0,
    rounding_power = 2,
    active_opacity   = 1,
    inactive_opacity = 1,
    shadow = {
      enabled      = true,
      range        = 4,
      render_power = 3,
      color        = "rgba(1a1a1aee)",
    },
    blur = {
      enabled            = true,
      size               = 6,
      passes             = 2,
      new_optimizations  = true,
      ignore_opacity     = true,
      vibrancy           = 0.1696,
      xray               = true,
    },
  },
  animations = { enabled = true },
  dwindle = { preserve_split = true }, -- você provavelmente quer isso
  master  = { new_status = "master" },
  misc = {
    force_default_wallpaper = 0, -- 0/1 desliga os wallpapers mascote
    disable_hyprland_logo   = true, -- desliga o logo/garota anime aleatória
  },
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

-----------------------
-- GESTURES
-----------------------
-- https://wiki.hypr.land/Configuring/Advanced-and-Cool/Gestures/

hl.gesture({
  fingers   = 3,
  direction = "horizontal",
  action    = "workspace",
})

-- Config por dispositivo
-- https://wiki.hypr.land/Configuring/Advanced-and-Cool/Devices/
hl.device({
  name        = "epic-mouse-v1",
  sensitivity = -0.5,
})

-----------------------
-- ANIMATIONS
-----------------------
-- https://wiki.hypr.land/Configuring/Advanced-and-Cool/Animations/

hl.curve("easeOutQuint",  { type = "bezier", points = { { 0.23, 1 }, { 0.32, 1 } } })
hl.curve("easeInOutCubic", { type = "bezier", points = { { 0.65, 0.05 }, { 0.36, 1 } } })
hl.curve("linear",         { type = "bezier", points = { { 0, 0 }, { 1, 1 } } })
hl.curve("almostLinear",   { type = "bezier", points = { { 0.5, 0.5 }, { 0.75, 1.0 } } })
hl.curve("quick",          { type = "bezier", points = { { 0.15, 0 }, { 0.1, 1 } } })

hl.animation({ leaf = "global",          enabled = true, speed = 10,    bezier = "default" })
hl.animation({ leaf = "border",          enabled = true, speed = 5.39,  bezier = "easeOutQuint" })
hl.animation({ leaf = "windows",         enabled = true, speed = 4.79,  bezier = "easeOutQuint" })
hl.animation({ leaf = "windowsIn",       enabled = true, speed = 4.1,   bezier = "easeOutQuint", style = "popin 87%" })
hl.animation({ leaf = "windowsOut",      enabled = true, speed = 1.49,  bezier = "linear",      style = "popin 87%" })
hl.animation({ leaf = "fadeIn",          enabled = true, speed = 1.73,  bezier = "almostLinear" })
hl.animation({ leaf = "fadeOut",         enabled = true, speed = 1.46,  bezier = "almostLinear" })
hl.animation({ leaf = "fade",            enabled = true, speed = 3.03,  bezier = "quick" })
hl.animation({ leaf = "layers",          enabled = true, speed = 3.81,  bezier = "easeOutQuint" })
hl.animation({ leaf = "layersIn",        enabled = true, speed = 4,     bezier = "easeOutQuint", style = "fade" })
hl.animation({ leaf = "layersOut",       enabled = true, speed = 1.5,   bezier = "linear",      style = "fade" })
hl.animation({ leaf = "fadeLayersIn",    enabled = true, speed = 1.79,  bezier = "almostLinear" })
hl.animation({ leaf = "fadeLayersOut",   enabled = true, speed = 1.39,  bezier = "almostLinear" })
hl.animation({ leaf = "workspaces",      enabled = true, speed = 1.94,  bezier = "almostLinear", style = "fade" })
hl.animation({ leaf = "workspacesIn",    enabled = true, speed = 1.21,  bezier = "almostLinear", style = "fade" })
hl.animation({ leaf = "workspacesOut",   enabled = true, speed = 1.94,  bezier = "almostLinear", style = "fade" })

-----------------------
-- WORKSPACE RULES
-----------------------
-- https://wiki.hypr.land/Configuring/Basics/Workspace-Rules/

hl.workspace_rule({ workspace = "1", monitor = "HDMI-A-1" })
hl.workspace_rule({ workspace = "2", monitor = "HDMI-A-1" })
hl.workspace_rule({ workspace = "3", monitor = "eDP-1" })
hl.workspace_rule({ workspace = "4", monitor = "eDP-1" })

-----------------------
-- KEYBINDINGS
-----------------------
-- https://wiki.hypr.land/Configuring/Basics/Binds/
-- https://wiki.hypr.land/Configuring/Basics/Dispatchers/

-- Apps
hl.bind(mainMod .. " + Q", hl.dsp.exec_cmd(terminal))
hl.bind(mainMod .. " + C", hl.dsp.window.kill())
hl.bind(mainMod .. " + M", hl.dsp.exit())
hl.bind(mainMod .. " + E", hl.dsp.exec_cmd(fileManager))
hl.bind(mainMod .. " + V", hl.dsp.window.float({ action = "toggle" }))
hl.bind(mainMod .. " + SPACE", hl.dsp.exec_cmd(menu))
hl.bind(mainMod .. " + P", hl.dsp.window.pseudo({ action = "toggle" })) -- dwindle
hl.bind(mainMod .. " + F", hl.dsp.window.fullscreen({ action = "toggle" }))
hl.bind(mainMod .. " + A", hl.dsp.exec_cmd([[grim -g "$(slurp)" - | swappy -f -]])) -- screenshot
hl.bind(mainMod .. " + R", hl.dsp.exec_cmd("killall waybar || waybar"))
hl.bind(mainMod .. " + T", hl.dsp.exec_cmd("swaylock"))

-- Mover foco com mainMod + setas
hl.bind(mainMod .. " + left",  hl.dsp.focus({ direction = "left" }))
hl.bind(mainMod .. " + right", hl.dsp.focus({ direction = "right" }))
hl.bind(mainMod .. " + up",    hl.dsp.focus({ direction = "up" }))
hl.bind(mainMod .. " + down",  hl.dsp.focus({ direction = "down" }))

-- Trocar workspace com mainMod + [0-9]
-- Mover janela com mainMod + SHIFT + [0-9]
for i = 1, 10 do
  local key = tostring(i % 10)
  hl.bind(mainMod .. " + " .. key, hl.dsp.focus({ workspace = tostring(i) }))
  hl.bind(mainMod .. " + SHIFT + " .. key, hl.dsp.window.move({ workspace = tostring(i) }))
end

-- Workspace especial (scratchpad)
hl.bind(mainMod .. " + S", hl.dsp.workspace.toggle_special("magic"))
hl.bind(mainMod .. " + SHIFT + S", hl.dsp.window.move({ workspace = "special:magic" }))

-- Navegar workspaces com mainMod + scroll
hl.bind(mainMod .. " + mouse_down", hl.dsp.focus({ workspace = "e+1" }))
hl.bind(mainMod .. " + mouse_up",   hl.dsp.focus({ workspace = "e-1" }))

-- Mover/redimensionar janelas com mainMod + LMB/RMB arrastando
-- (bindm foi removido na 0.55 — substituído por bind com flag mouse)
hl.bind(mainMod .. " + mouse:272", hl.dsp.window.drag(),   { mouse = true })
hl.bind(mainMod .. " + mouse:273", hl.dsp.window.resize(), { mouse = true })

-- Teclas multimídia do notebook (volume e brilho)
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd([[wpctl set-volume -l 1 @DEFAULT_AUDIO_SINK@ 5%+ && notify-send -h string:x-canonical-private-synchronous:audio -h int:value:$(wpctl get-volume @DEFAULT_AUDIO_SINK@ | awk '{print $2*100}') "Volume" -t 1500]]), { locked = true, repeating = true })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd([[wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%- && notify-send -h string:x-canonical-private-synchronous:audio -h int:value:$(wpctl get-volume @DEFAULT_AUDIO_SINK@ | awk '{print $2*100}') "Volume" -t 1500]]), { locked = true, repeating = true })
hl.bind("XF86AudioMute", hl.dsp.exec_cmd([[wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle && notify-send -h string:x-canonical-private-synchronous:audio "Áudio" "Mudo alterado" -t 1000]]), { locked = true, repeating = true })
hl.bind("XF86MonBrightnessUp", hl.dsp.exec_cmd([[brightnessctl -e4 -n2 set 5%+ && notify-send -h string:x-canonical-private-synchronous:brightness -h int:value:$(brightnessctl i | grep -oP '\(\K\d+(?=%)') "Brilho" -t 1500]]), { locked = true, repeating = true })
hl.bind("XF86MonBrightnessDown", hl.dsp.exec_cmd([[brightnessctl -e4 -n2 set 5%- && notify-send -h string:x-canonical-private-synchronous:brightness -h int:value:$(brightnessctl i | grep -oP '\(\K\d+(?=%)') "Brilho" -t 1500]]), { locked = true, repeating = true })

-- Mídia (requer playerctl)
hl.bind("XF86AudioNext",  hl.dsp.exec_cmd("playerctl next"),       { locked = true })
hl.bind("XF86AudioPause", hl.dsp.exec_cmd("playerctl play-pause"), { locked = true })
hl.bind("XF86AudioPlay",  hl.dsp.exec_cmd("playerctl play-pause"), { locked = true })
hl.bind("XF86AudioPrev",  hl.dsp.exec_cmd("playerctl previous"),   { locked = true })

--[[
  Exemplos comentados da config antiga:

  -- windowrule = float,class:^(kitty)$,title:^(kitty)$
  -- windowrule = suppressevent maximize, class:.*
  -- windowrule = nofocus,class:^$,title:^$,xwayland:1,floating:1,fullscreen:0,pinned:0
  -- windowrule = noinitialfocus,class:jetbrains-idea,title:^win(.*)

  -- "Smart gaps" / sem gaps quando só uma janela:
  -- hl.workspace_rule({ workspace = "w[tv1]", gapsout = 0, gapsin = 0 })
  -- hl.workspace_rule({ workspace = "f[1]",   gapsout = 0, gapsin = 0 })
--]]
