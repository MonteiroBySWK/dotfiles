#!/usr/bin/env bash
set -euo pipefail

# sync-config.sh
# Copia pastas selecionadas de ~/.config para este repositório dotfiles.
# Uso:
#   ./sync-config.sh            # faz a cópia (modo ativo)
#   ./sync-config.sh -n         # dry-run (mostra o que seria copiado)
#   ./sync-config.sh -l         # lista o que será copiado (sem executar)
#   ./sync-config.sh -h         # ajuda

DRY_RUN=0
LIST_ONLY=0

# Pastas a sincronizar (ajuste conforme desejar)
ITEMS=(hypr kitty mako nvim cava waybar wofi xdg-desktop-portal xfce4)

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$HOME/.config"

print_usage(){
  cat <<EOF
sync-config.sh - copia pastas selecionadas de ~/.config para o repo

Usage:
  $0 [-n] [-l] [-h]

Options:
  -n    Dry-run (passa as opções para rsync --dry-run)
  -l    Lista apenas os itens que seriam copiados
  -h    Ajuda

Itens configurados: ${ITEMS[*]}
Repo root: $REPO_ROOT
Source: $SOURCE_DIR
EOF
}

while getopts ":nlh" opt; do
  case ${opt} in
    n) DRY_RUN=1 ;;
    l) LIST_ONLY=1 ;;
    h) print_usage; exit 0 ;;
    *) print_usage; exit 1 ;;
  esac
done

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Erro: source directory $SOURCE_DIR não existe." >&2
  exit 1
fi

for item in "${ITEMS[@]}"; do
  src="$SOURCE_DIR/$item"
  dest="$REPO_ROOT/$item"

  if [ -e "$src" ]; then
    echo "\n=> Preparando: $item"
    echo "  origem: $src"
    echo "  destino: $dest"

    if [ "$LIST_ONLY" -eq 1 ]; then
      continue
    fi

    mkdir -p "$dest"

    rsync_cmd=(rsync -a --delete --exclude 'Cache' --exclude 'Cache/*')
    if [ "$DRY_RUN" -eq 1 ]; then
      rsync_cmd+=(--dry-run)
    fi

    rsync_cmd+=("$src/" "$dest/")

    echo "  executando: ${rsync_cmd[*]}"
    "${rsync_cmd[@]}"
  else
    echo "\n=> Pulando $item — não existe em $SOURCE_DIR"
  fi
done

echo "\nConcluído. Verifique os arquivos no repositório e commit quando apropriado."
