return {
  -- LSP para Java (jdtls)
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        jdtls = {
          -- configurações para Java/Spring
          settings = {
            java = {
              configuration = {
                runtimes = {
                  {
                    name = "JavaSE-17",
                    path = "/usr/lib/jvm/java-17-openjdk-amd64", -- ajuste o path do JDK
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  -- Debugging para Java
  {
    "mfussenegger/nvim-dap",
    config = function()
      local dap = require("dap")
      dap.adapters.java = function(callback)
        callback({
          type = "server",
          host = "127.0.0.1",
          port = 5005,
        })
      end
      dap.configurations.java = {
        {
          type = "java",
          request = "attach",
          name = "Debug (Attach)",
          hostName = "127.0.0.1",
          port = 5005,
        },
      }
    end,
  },
}