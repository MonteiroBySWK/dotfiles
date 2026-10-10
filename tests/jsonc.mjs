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

// JSONC permite virgula antes de } ou ]; JSON.parse nao. Precisa respeitar
// literais string: {"a": "x,}y"} tem uma virgula antes de } que e conteudo,
// nao separador. Um replace por regex global corromperia essa string em
// silencio, e o validador mentiria em vez de falhar.
export function stripTrailingCommas(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
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
    } else if (c === ",") {
      // olha adiante, pulando espaco, para ver se fecha um container
      let j = i + 1;
      while (j < n && /\s/.test(src[j])) j++;
      if (src[j] === "}" || src[j] === "]") {
        i++; // descarta a virgula
        continue;
      }
      out += c;
      i++;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

export function parseJsonc(src) {
  return JSON.parse(stripTrailingCommas(stripComments(src)));
}

if (import.meta.url === `file://${process.argv[1]}` && process.argv[2] && !process.argv[2].startsWith("--")) {
  const raw = fs.readFileSync(process.argv[2], "utf8");
  try {
    parseJsonc(raw);
    process.stdout.write("OK\n");
  } catch (e) {
    process.stderr.write(`PARSE ERROR: ${e.message}\n`);
    process.exit(1);
  }
}
// Prova que o stripper nao corrompe string. Rodar: node tests/jsonc.mjs --selftest
if (process.argv[2] === "--selftest") {
  const cases = [
    ['{"a": "x,}y"}',            { a: "x,}y" },  "virgula antes de } dentro de string"],
    ['{"a": "x,]y"}',            { a: "x,]y" },  "virgula antes de ] dentro de string"],
    ['{"a": 1,}',                { a: 1 },        "trailing comma real removida"],
    ['{ // c\n "a": 1, /* b */ }',{ a: 1 },        "comentarios removidos"],
    ['{"a": "http://x.com/"}',   { a: "http://x.com/" }, "// dentro de string intacto"],
    ['{"a": "/* nao e comentario */"}', { a: "/* nao e comentario */" }, "/* */ dentro de string intacto"],
  ];
  let bad = 0;
  for (const [src, want, label] of cases) {
    let got, err = null;
    try { got = parseJsonc(src); } catch (e) { err = e.message; }
    const ok = err === null && JSON.stringify(got) === JSON.stringify(want);
    if (!ok) {
      console.log(`FAIL - ${label}`);
      console.log(`   esperado ${JSON.stringify(want)}, obtido ${err ?? JSON.stringify(got)}`);
      bad++;
    } else {
      console.log("ok   - " + label);
    }
  }
  process.exit(bad ? 1 : 0);
}
