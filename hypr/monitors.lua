--[[
  hypr/monitors.lua — configuração de monitores
  https://wiki.hypr.land/Configuring/Basics/Monitors/

  Uma regra nomeada para o painel do notebook e uma catch-all. A catch-all
  (output = "") é o que faz projetor e monitor emprestado funcionarem sem
  editar este arquivo: qualquer saída que não caia em regra nomeada herda
  ela. Não existe chave "fallback" em hl.monitor — o fallback é output vazio.
]]

-- Painel do notebook. mode "preferred" deixa o Hyprland escolher, em vez de
-- fixar 1920x1080@60 — o painel só tem esse modo, e a escolha sobrevive a um
-- notebook diferente.
hl.monitor({
  output   = "eDP-1",
  mode     = "preferred",
  position = "auto",
  scale    = 1,
})

-- Catch-all. mode "highrr" = maior refresh rate que a saida suporta.
-- "preferred" seguia o modo marcado como preferido no EDID, que neste
-- monitor e 1920x1080@60 -- ou seja, perdia os 120Hz que a configuracao
-- antiga fixava. "highrr" mantem o maior refresh em qualquer saida nova.
-- position "auto-left" coloca a saida desconhecida a esquerda da primeira,
-- que e como o monitor de casa fica na mesa. Uma linha para trocar.
hl.monitor({
  output   = "",
  mode     = "highrr",
  position = "auto-left",
  scale    = 1,
})