--[[
  hypr/autostart.lua — programas executados no start
  https://wiki.hypr.land/Configuring/Basics/Autostart/
]]

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
