--[[
  hypr/theme.lua — aparência e comportamento das janelas
  https://wiki.hypr.land/Configuring/Basics/Variables/
]]

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
  dwindle = { preserve_split = true }, -- você provavelmente quer isso
  master  = { new_status = "master" },
  misc = {
    force_default_wallpaper = 0, -- 0/1 desliga os wallpapers mascote
    disable_hyprland_logo   = true, -- desliga o logo/garota anime aleatória
  },
})
