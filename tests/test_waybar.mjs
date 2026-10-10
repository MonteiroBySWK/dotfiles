// tests/test_waybar.mjs
// Afirma as opcoes da barra que a Task 5 muda. Nao sobe o waybar: ele
// precisa de $WAYLAND_DISPLAY e abriria uma segunda barra na tela.
import fs from "node:fs";
import { parseJsonc } from "./jsonc.mjs";

const cfg = parseJsonc(fs.readFileSync("waybar/config.jsonc", "utf8"));

let failures = 0;
function check(name, ok, detail) {
  if (ok) {
    console.log("ok   - " + name);
  } else {
    console.log("FAIL - " + name + (detail ? "  [" + detail + "]" : ""));
    failures++;
  }
}

// Um modulo em modules-left tem tres formas aceitas pela waybar:
// string nua ("hyprland/workspaces"), objeto achatado
// ({ "hyprland/workspaces": {...} }), ou o objeto embrulhado em array
// ([{ "hyprland/workspaces": {...} }]). Normaliza todas em um objeto.
function blockOf(modules, name) {
  for (const m of modules) {
    if (typeof m === "string" && m === name) return {};
    if (m && typeof m === "object" && !Array.isArray(m)) {
      if (Object.hasOwn(m, name)) return m[name];
      return m;
    }
  }
  return undefined;
}

const ws = blockOf(cfg["modules-left"], "hyprland/workspaces");
check("workspaces e um bloco, nao string nua", ws !== undefined);
if (ws) {
  check("workspaces ordena por numero", ws["sort-by"] === "number",
    "sort-by=" + ws["sort-by"]);
  check("workspaces tem scroll para cima",
    typeof ws["on-scroll-up"] === "string" &&
    ws["on-scroll-up"].includes("workspace e-1"),
    "on-scroll-up=" + ws["on-scroll-up"]);
  check("workspaces tem scroll para baixo",
    typeof ws["on-scroll-down"] === "string" &&
    ws["on-scroll-down"].includes("workspace e+1"),
    "on-scroll-down=" + ws["on-scroll-down"]);
}

const win = cfg["hyprland/window"];
check("window format e {title}", win.format === "{title}",
  "format=" + win.format);
check("window nao usa mais {class}", !String(win.format).includes("{class}"));
check("window mostra icone real do app", win.icon === true,
  "icon=" + win.icon);
check("window icon-size e 16", win["icon-size"] === 16,
  "icon-size=" + win["icon-size"]);
// O rewrite por class era o que escondia apps nao mapeados; some junto.
check("window nao tem rewrite por class", win.rewrite === undefined);

const net = cfg.network;
check("network on-click chama wifi-menu.sh",
  typeof net["on-click"] === "string" && net["on-click"].includes("wifi-menu.sh"),
  "on-click=" + net["on-click"]);
check("network nao abre mais nmtui",
  !String(net["on-click"]).includes("nmtui"));
check("network on-click-right abre pavucontrol",
  typeof net["on-click-right"] === "string" &&
  net["on-click-right"].includes("pavucontrol"));

check("output esta explicito", typeof cfg.output === "string",
  "output=" + cfg.output);

if (failures > 0) {
  console.log("\n" + failures + " falha(s)");
  process.exit(1);
}
console.log("\ntudo passou");