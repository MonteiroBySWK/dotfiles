--[[
  hypr/autostart.lua — programas executados no start
  https://wiki.hypr.land/Configuring/Basics/Autostart/
]]

hl.on("hyprland.start", function()
  -- WiFi: o rádio desligava sozinho e obrigava nm-aplet manual, que ainda
  -- duplicava o ícone de rede da barra. A permissão enable-disable-wifi
  -- já está liberada (nmcli general permissions).
  hl.exec_cmd("nmcli radio wifi on")
  -- swayosd-server e o popup de volume: sem ele rodando, swayosd-client
  -- nao tem para quem falar e as teclas de volume nao mostram nada.
  -- A guarda evita erro se o pacote for removido depois.
  hl.exec_cmd("command -v swayosd-server >/dev/null && swayosd-server")
  -- quickshell com o popup arrastavel de volume e brilho, acionado pelo
  -- clique nos icones da barra. Duas configs separadas sao configs
  -- diferentes; aqui so a nossa.
  hl.exec_cmd("command -v qs >/dev/null && setsid -f qs -c popup")
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
