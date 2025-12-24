return {
  -- Sintaxe e suporte para Kotlin
  {
    "udalov/kotlin-vim",
  },

  -- LSP para Kotlin
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        kotlin_language_server = {},
      },
    },
  },

  -- Debugging para Kotlin
  {
    "mfussenegger/nvim-dap",
    config = function()
      local dap = require("dap")
      -- Configuração para Kotlin (usando Java DAP, pois Kotlin compila para JVM)
      dap.adapters.kotlin = {
        type = "executable",
        command = "java",
        args = {
          "-jar",
          vim.fn.expand("~/.local/share/nvim/mason/packages/kotlin-debug-adapter/adapter/build/libs/kotlin-debug-adapter.jar"),
        },
      }
      dap.configurations.kotlin = {
        {
          type = "kotlin",
          request = "launch",
          name = "Launch Kotlin",
          projectRoot = "${workspaceFolder}",
          mainClass = function()
            return vim.fn.input("Main class: ", "", "file")
          end,
        },
      }
    end,
  },
}