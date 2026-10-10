--[[
  hypr/workspaces.lua — regras de workspace

  Não há hl.workspace_rule aqui de propósito. Preso a nome de saída, o
  workspace nasce no monitor fixo, e o Waybar (que não tem on-click em
  hyprland/workspaces) reabre o workspace no monitor onde ele foi atribuído
  por último. Sem aquela saída conectada, clicar no workspace não faz nada.

  Deixando livre, o workspace nasce no monitor com foco e viaja por
  SUPER + SHIFT + n. Regras futuras (default_name, on_created_empty, gaps
  por workspace) entram aqui.
]]