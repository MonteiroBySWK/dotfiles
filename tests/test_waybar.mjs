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

// modules-left e um array de NOMES de modulo (waybar.5.gz: "typeof: array").
// A configuracao do modulo vive numa chave na raiz, com o nome dele --
// como no exemplo "group/hardware" do proprio man page. A forma
// [{ "hyprland/workspaces": {...} }] e JSON valido mas a waybar nao le as
// opcoes de um objeto embrulhado em array dentro de modules-left: o modulo
// aparece, mas sem nenhuma opcao aplicada. Este teste existe para nao
// voltar a aquela forma.
check("modules-left so com nomes, sem objeto embutido",
  cfg["modules-left"].every((m) => typeof m === "string"),
  "modules-left=" + JSON.stringify(cfg["modules-left"]));

check("workspaces esta em modules-left",
  cfg["modules-left"].includes("hyprland/workspaces"));

// A configuracao do modulo tem que estar na raiz.
const ws = cfg["hyprland/workspaces"];
check("hyprland/workspaces tem bloco na raiz", typeof ws === "object" && ws !== null);
if (ws) {
  check("workspaces ordena por numero", ws["sort-by"] === "number",
    "sort-by=" + ws["sort-by"]);
  check("workspaces mostra o special", ws["show-special"] === true);
  // Hyprland 0.55+ trocou os dispatchers legados por expressoes Lua.
  // "hyprctl dispatch workspace e-1" falha com erro de sintaxe Lua.
  check("scroll para cima usa dispatcher lua",
    typeof ws["on-scroll-up"] === "string" &&
    ws["on-scroll-up"].includes("hl.dsp.focus") &&
    ws["on-scroll-up"].includes("e-1"),
    "on-scroll-up=" + ws["on-scroll-up"]);
  check("scroll para baixo usa dispatcher lua",
    typeof ws["on-scroll-down"] === "string" &&
    ws["on-scroll-down"].includes("hl.dsp.focus") &&
    ws["on-scroll-down"].includes("e+1"),
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