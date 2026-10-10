#!/usr/bin/env bash
# Verificacao estatica da config. Nao toca no compositor.
# Uso: bash tests/run.sh
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

fail=0

echo "== modulos lua =="
if ! lua5.4 tests/test_config.lua; then
  fail=1
fi

echo
echo "== waybar config.jsonc =="
if ! node tests/jsonc.mjs waybar/config.jsonc; then
  fail=1
fi

echo
echo "== waybar modulos =="
if ! node tests/test_waybar.mjs; then
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  echo
  echo "FALHOU"
  exit 1
fi
echo "OK"