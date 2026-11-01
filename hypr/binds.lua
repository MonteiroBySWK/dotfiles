--[[
  hypr/binds.lua — atalhos de teclado e mouse
  https://wiki.hypr.land/Configuring/Basics/Binds/
  https://wiki.hypr.land/Configuring/Basics/Dispatchers/
]]

local v = require("vars")

-- Apps
hl.bind(v.mainMod .. " + Q", hl.dsp.exec_cmd(v.terminal))
-- kill() MATAVA O PROCESSO, nao a janela. Firefox e um processo unico com
-- varias janelas: fechar uma matava todas. Medido com 2 janelas do mesmo
-- processo -- 2 -> 0 e o processo inteiro morreu.
-- close({address=...}) fecha so a janela endereçada e o processo sobrevive,
-- medido 2 -> 1. Precisa do address: close() sem argumento responde "ok" e
-- nao fecha nada.
hl.bind(v.mainMod .. " + C", function()
  local w = hl.get_active_window()
  if w then
    hl.dispatch(hl.dsp.window.close({ address = w.address }))
  end
end)
hl.bind(v.mainMod .. " + M", hl.dsp.exit())
hl.bind(v.mainMod .. " + E", hl.dsp.exec_cmd(v.fileManager))
hl.bind(v.mainMod .. " + V", hl.dsp.window.float({ action = "toggle" }))
hl.bind(v.mainMod .. " + SPACE", hl.dsp.exec_cmd(v.menu))
hl.bind(v.mainMod .. " + P", hl.dsp.window.pseudo({ action = "toggle" })) -- dwindle
hl.bind(v.mainMod .. " + F", hl.dsp.window.fullscreen({ action = "toggle" }))
hl.bind(v.mainMod .. " + A", hl.dsp.exec_cmd([[grim -g "$(slurp)" - | swappy -f -]])) -- screenshot
-- Super+R liga/desliga a waybar para comparar com o quickshell.
-- O quickshell e o dono das notificacoes/popups e NAO e escondido aqui:
-- as duas barras ficam visiveis (empilhadas) enquanto a waybar estiver
-- ligada. Para esconder a do quickshell: qs -c bar ipc call bar hide.
hl.bind(v.mainMod .. " + R",
  hl.dsp.exec_cmd("~/.config/quickshell/bar/toggle.sh"))
hl.bind(v.mainMod .. " + T", hl.dsp.exec_cmd("swaylock"))

-- Mover foco com mainMod + setas
hl.bind(v.mainMod .. " + left",  hl.dsp.focus({ direction = "left" }))
hl.bind(v.mainMod .. " + right", hl.dsp.focus({ direction = "right" }))
hl.bind(v.mainMod .. " + up",    hl.dsp.focus({ direction = "up" }))
hl.bind(v.mainMod .. " + down",  hl.dsp.focus({ direction = "down" }))

-- Trocar workspace com mainMod + [0-9]
-- Mover janela com mainMod + SHIFT + [0-9]
for i = 1, 10 do
  local key = tostring(i % 10)
  hl.bind(v.mainMod .. " + " .. key, hl.dsp.focus({ workspace = tostring(i) }))
  hl.bind(v.mainMod .. " + SHIFT + " .. key, hl.dsp.window.move({ workspace = tostring(i) }))
end

-- Workspace especial (scratchpad)
hl.bind(v.mainMod .. " + S", hl.dsp.workspace.toggle_special("magic"))
hl.bind(v.mainMod .. " + SHIFT + S", hl.dsp.window.move({ workspace = "special:magic" }))

-- Navegar workspaces com mainMod + scroll
hl.bind(v.mainMod .. " + mouse_down", hl.dsp.focus({ workspace = "e+1" }))
hl.bind(v.mainMod .. " + mouse_up",   hl.dsp.focus({ workspace = "e-1" }))

-- Mover/redimensionar janelas com mainMod + LMB/RMB arrastando
-- (bindm foi removido na 0.55 — substituído por bind com flag mouse)
hl.bind(v.mainMod .. " + mouse:272", hl.dsp.window.drag(),   { mouse = true })
hl.bind(v.mainMod .. " + mouse:273", hl.dsp.window.resize(), { mouse = true })

-- Teclas multimídia do notebook (volume e brilho)
--
-- Volume vai pelo swayosd-client, que desenha o popup de camada. Antes era
-- wpctl + notify-send com hints de volume, e o mako renderizava aquilo num
-- painel de notificacao alto e vazio com a barra colada na esquerda --
-- o popup ficava ruins. O swayosd substitui o wpctl E o notify-send: ele
-- mesmo ajusta o volume e mostra o resultado.
--
-- --max-volume 120: o wpctl antigo rodava com "-l 1", ou seja, teto em
-- 100%. Com 120 dá para passar de 100% e ainda ter popupe de feedback.
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("swayosd-client --output-volume raise --max-volume 120"), { locked = true, repeating = true })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("swayosd-client --output-volume lower --max-volume 120"), { locked = true, repeating = true })
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("swayosd-client --output-volume mute-toggle"), { locked = true, repeating = true })
hl.bind("XF86AudioMicMute", hl.dsp.exec_cmd("swayosd-client --input-volume mute-toggle"), { locked = true, repeating = true })

-- Brilho NAO foi para o swayosd: o --brightness dele usa brightnessctl,
-- que so enxerga sysfs (o painel interno). O monitor de casa vai por DDC e
-- continua no brightness.sh.
hl.bind("XF86MonBrightnessUp",   hl.dsp.exec_cmd("/home/monteiro/.config/hypr/scripts/brightness.sh up"),   { locked = true, repeating = true })
hl.bind("XF86MonBrightnessDown", hl.dsp.exec_cmd("/home/monteiro/.config/hypr/scripts/brightness.sh down"), { locked = true, repeating = true })

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
