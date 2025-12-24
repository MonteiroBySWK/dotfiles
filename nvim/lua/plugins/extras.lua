return {
  -- Adiciona suporte a emojis no nvim-cmp
  {
    "hrsh7th/nvim-cmp",
    dependencies = { "hrsh7th/cmp-emoji" },
    ---@param opts cmp.ConfigSchema
    opts = function(_, opts)
      table.insert(opts.sources, { name = "emoji" })
    end,
  },

  -- Configura o Trouble para usar sinais de diagnóstico
  {
    "folke/trouble.nvim",
    opts = { use_diagnostic_signs = true },
  },

  -- Adiciona keymap para navegar arquivos de plugins no Telescope
  {
    "nvim-telescope/telescope.nvim",
    keys = {
      {
        "<leader>fp",
        function()
          require("telescope.builtin").find_files({ cwd = require("lazy.core.config").options.root })
        end,
        desc = "Find Plugin File",
      },
    },
  },
}