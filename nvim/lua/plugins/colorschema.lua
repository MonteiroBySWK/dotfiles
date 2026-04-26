return {
  {
    "folke/tokyonight.nvim",
    lazy = false,
    priority = 1000,
    opts = {
      style = "night", -- Aqui você define a variante (storm, moon, night, day)
      transparent = true, -- Opcional: se quiser o fundo transparente
      terminal_colors = true,
    },
    config = function(_, opts)
      require("tokyonight").setup(opts)
      vim.cmd([[colorscheme tokyonight-night]])
    end,
  },
}
