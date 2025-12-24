return {
  -- Ferramentas avançadas para TypeScript
  {
    "pmizio/typescript-tools.nvim",
    dependencies = { "nvim-lua/plenary.nvim", "neovim/nvim-lspconfig" },
    opts = {},
  },

  -- Suporte para debugging Node.js
  {
    "mfussenegger/nvim-dap",
    -- Já incluído no LazyVim, mas podemos configurar para Node
    config = function()
      local dap = require("dap")
      -- Configuração para Node.js
      dap.adapters.node2 = {
        type = "executable",
        command = "node",
        args = { os.getenv("HOME") .. "/.local/share/nvim/mason/packages/node-debug2-adapter/out/src/nodeDebug.js" },
      }
      dap.configurations.javascript = {
        {
          name = "Launch",
          type = "node2",
          request = "launch",
          program = "${file}",
          cwd = vim.fn.getcwd(),
          sourceMaps = true,
          protocol = "inspector",
          console = "integratedTerminal",
        },
        {
          name = "Attach to process",
          type = "node2",
          request = "attach",
          processId = require("dap.utils").pick_process,
        },
      }
      dap.configurations.typescript = dap.configurations.javascript
    end,
  },

  -- Suporte para React/JSX
  {
    "windwp/nvim-ts-autotag",
    config = function()
      require("nvim-ts-autotag").setup()
    end,
  },

  {
    "JoosepAlviste/nvim-ts-context-commentstring",
    config = function()
      require("ts_context_commentstring").setup({
        enable_autocmd = false,
      })
    end,
  },

  -- Para Bun, usar o mesmo LSP do TypeScript, mas podemos adicionar suporte se necessário
  -- Bun usa TypeScript, então o LSP padrão funciona
}