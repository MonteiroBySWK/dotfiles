// graphify OpenCode plugin (v2 API)
// Injects a knowledge graph reminder before bash tool calls when the graph exists.
//
// IMPORTANT: keep the reminder string free of backticks and $(...) constructs.
// The hook prepends `echo "<reminder>" && <cmd>` to the user's bash command;
// backticks inside the double-quoted echo trigger bash command substitution,
// which both corrupts tool output and silently executes the very graphify
// command we are only suggesting. Plain words render fine in opencode's TUI.
import { Plugin } from "@opencode/plugin";
import { existsSync } from "node:fs";
import { join } from "node:path";

export default Plugin.define({
  id: "graphify",
  async setup(ctx) {
    let reminded = false;

    await ctx.tool.hook("execute.before", (event) => {
      if (reminded) return;

      const directory = ctx.location.directory;
      if (!directory) return;
      if (!existsSync(join(directory, "graphify-out", "graph.json"))) return;

      if (event.tool === "bash") {
        const input = event.input ?? event.args;
        if (!input || typeof input !== "object") return;
        if (typeof input.command !== "string") return;
        // ';' not '&&' — Windows PowerShell 5.1 rejects '&&' as a statement
        // separator, breaking the first bash command of the session (#1646).
        input.command =
          'echo "[graphify] knowledge graph at graphify-out/. For focused questions, run graphify query with your question (scoped subgraph, usually much smaller than GRAPH_REPORT.md) instead of grepping raw files. Read GRAPH_REPORT.md only for broad architecture context." ; ' +
          input.command;
        reminded = true;
      }
    });
  },
});
