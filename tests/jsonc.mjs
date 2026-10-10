// tests/jsonc.mjs
// Valida que um arquivo JSONC e JSON valido apos remover comentarios e
// trailing comma. JSONC permite ambos; JSON.parse nao.
//
// Uso: node tests/jsonc.mjs <arquivo>
import fs from "node:fs";

// Remove // e /* */ fora de literais string.
export function stripComments(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const two = src.slice(i, i + 2);
    if (c === '"') {
      out += c;
      i++;
      while (i < n) {
        if (src[i] === "\\") {
          out += src.slice(i, i + 2);
          i += 2;
        } else if (src[i] === '"') {
          out += '"';
          i++;
          break;
        } else {
          out += src[i];
          i++;
        }
      }
    } else if (two === "//") {
      while (i < n && src[i] !== "\n") i++;
    } else if (two === "/*") {
      i += 2;
      while (i < n && src.slice(i, i + 2) !== "*/") i++;
      i += 2;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

// JSONC permite virgula antes de } ou ]; JSON.parse nao.
export function stripTrailingCommas(src) {
  return src.replace(/,(?=\s*[}\]])/g, "");
}

export function parseJsonc(src) {
  return JSON.parse(stripTrailingCommas(stripComments(src)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const raw = fs.readFileSync(process.argv[2], "utf8");
  try {
    parseJsonc(raw);
    process.stdout.write("OK\n");
  } catch (e) {
    process.stderr.write(`PARSE ERROR: ${e.message}\n`);
    process.exit(1);
  }
}