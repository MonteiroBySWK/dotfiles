--[[
  hypr/monitors.lua — configuração de monitores
  https://wiki.hypr.land/Configuring/Basics/Monitors/

  Uma regra nomeada para o painel do notebook e uma catch-all. A catch-all
  (output = "") é o que faz projetor e monitor emprestado funcionarem sem
  editar este arquivo: qualquer saída que não caia em regra nomeada herda
  ela. Não existe chave "fallback" em hl.monitor — o fallback é output vazio.
]]

-- Painel do notebook. mode "preferred" deixa o Hyprland escolher, em vez de
-- fixar 1920x1080@60 — o painel só tem esse modo, e a sobrevive a outro laptop.
hl.monitor({
  output   = "eDP-1",
  mode     = "preferred",
  position = "auto",
  scale    = 1,
})

-- Catch-all. mode "preferred" = maior modo suportado pelo painel do
-- projetor. position "auto-right" coloca saídas desconhecidas à direita da
-- primeira; "auto" empilharia tudo no centro. Uma linha para trocar.
hl.monitor({
  output   = "",
  mode     = "preferred",
  position = "auto-right",
  scale    = 1,
})