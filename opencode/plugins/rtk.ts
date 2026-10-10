import { Plugin } from "@opencode/plugin"
import { execFileSync } from "node:child_process"

// RTK OpenCode plugin — rewrites commands to use rtk for token savings.
// Requires: rtk >= 0.23.0 in PATH.
//
// This is a thin delegating plugin: all rewrite logic lives in `rtk rewrite`,
// which is the single source of truth (src/discover/registry.rs).
// To add or change rewrite rules, edit the Rust registry — not this file.

export default Plugin.define({
  id: "rtk",
  async setup(ctx) {
    try {
      execFileSync("which", ["rtk"], { stdio: "ignore" })
    } catch {
      console.warn("[rtk] rtk binary not found in PATH — plugin disabled")
      return
    }

    await ctx.tool.hook("execute.before", (event) => {
      const tool = String((event as unknown as { tool?: unknown }).tool ?? "").toLowerCase()
      if (tool !== "bash" && tool !== "shell") return

      const evt = event as unknown as { input?: unknown; args?: unknown }
      const args = (evt.input ?? evt.args) as Record<string, unknown> | null | undefined
      if (!args || typeof args !== "object") return

      const command = args.command
      if (typeof command !== "string" || !command) return

      try {
        const rewritten = execFileSync("rtk", ["rewrite", command], {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        })
          .toString()
          .trim()
        if (rewritten && rewritten !== command) {
          args.command = rewritten
        }
      } catch {
        // rtk rewrite failed — pass through unchanged
      }
    })
  },
})
