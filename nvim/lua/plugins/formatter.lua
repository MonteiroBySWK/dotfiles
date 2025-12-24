return {
  -- Formatter universal
  {
    "stevearc/conform.nvim",
    opts = {
      formatters_by_ft = {
        lua = { "stylua" },
        javascript = { "prettier" },
        typescript = { "prettier" },
        javascriptreact = { "prettier" },
        typescriptreact = { "prettier" },
        java = { "google-java-format" },
        kotlin = { "ktlint" },
        rust = { "rustfmt" },
        dart = { "dart_format" },
        c = { "clang-format" },
        cpp = { "clang-format" },
        markdown = { "prettier" },
      },
      format_on_save = {
        timeout_ms = 500,
        lsp_fallback = true,
      },
    },
  },
}