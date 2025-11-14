#!/usr/bin/env bash
# install.sh - Declarative installer for this dotfiles repo
# Purpose: install and configure applications listed in packages.yaml and apply core configs
# Scope: ONLY installs/configures apps and copies core configs. It will NOT modify unrelated
# files or perform system maintenance beyond installing packages and basic app config.
#
# Usage examples:
#   ./install.sh                 # interactive, asks before actions
#   ./install.sh -y              # non-interactive, assume yes
#   ./install.sh -y --group initial  # install only the 'initial' group from packages.yaml
#   ./install.sh --no-oh-my-zsh  # skip Oh My Zsh installation

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG_FILE="$ROOT_DIR/packages.yaml"

# Defaults
YES=0
GROUP="initial"
INSTALL_OH_MY_ZSH=1

print_help() {
  cat <<EOF
Usage: $0 [options]

Options:
  -y, --yes            Run non-interactive (assume yes for prompts)
  --no-oh-my-zsh       Skip installing Oh My Zsh
  --group NAME         Install only the named group from packages.yaml (default: initial)
  --packages-file FILE Use an alternate packages YAML file
  -h, --help           Show this help

This script reads a declarative packages.yaml, installs official packages via pacman and
AUR packages via paru (bootstrapped if necessary), and applies core config files from
the repository to ~/.config. It focuses ONLY on installing and configuring apps.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -y|--yes) YES=1; shift ;;
    --no-oh-my-zsh) INSTALL_OH_MY_ZSH=0; shift ;;
    --group) GROUP="$2"; shift 2 ;;
    --group=*) GROUP="${1#*=}"; shift ;;
    --packages-file) PKG_FILE="$2"; shift 2 ;;
    --packages-file=*) PKG_FILE="${1#*=}"; shift ;;
    -h|--help) print_help; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; print_help; exit 1 ;;
  esac
done

confirm() {
  if [[ $YES -eq 1 ]]; then
    return 0
  fi
  read -r -p "$1 [y/N]: " resp
  case "$resp" in
    [yY][eE][sS]|[yY]) return 0 ;;
    *) return 1 ;;
  esac
}

require_pacman() {
  if ! command -v pacman >/dev/null 2>&1; then
    echo "This script requires an Arch-based system with pacman." >&2
    exit 3
  fi
}

parse_yaml_section() {
  # usage: parse_yaml_section <file> <section>
  awk -v section="$2" '
    BEGIN{in=0}
    $0 ~ "^"section":"{in=1; next}
    in && $0 ~ "^[[:space:]]*-[[:space:]]*"{gsub(/^[[:space:]]*-[[:space:]]*/,"",$0); print $0; next}
    in && $0 ~ "^[^[:space:]]"{exit}
  ' "$1" | sed "s/[[:space:]]*$//"
}

read_package_lists() {
  if [[ ! -f "$PKG_FILE" ]]; then
    echo "Packages file not found: $PKG_FILE" >&2
    exit 4
  fi

  mapfile -t ALL_PACKAGES < <(parse_yaml_section "$PKG_FILE" packages)
  mapfile -t AUR_PACKS < <(parse_yaml_section "$PKG_FILE" aur_packages)

  # group selection
  mapfile -t GROUP_PACKS < <(parse_yaml_section "$PKG_FILE" "groups:\\n  $GROUP" ) || true
  # fallback: if group parsing produced nothing, try simpler extraction
  if [[ ${#GROUP_PACKS[@]} -eq 0 ]]; then
    # awk: find line 'groups:' then find group name line and collect its list
    GROUP_PACKS=($(awk -v g="${GROUP}" '
      $0 ~ "^groups:"{in_groups=1}
      in_groups && $0 ~ "^[[:space:]]*"g":"{in_group=1; next}
      in_group && $0 ~ "^[[:space:]]*-[[:space:]]*"{gsub(/^[[:space:]]*-[[:space:]]*/,"",$0); print $0; next}
      in_group && $0 ~ "^[^[:space:]]"{exit}
    ' "$PKG_FILE" )]
  fi

  # final package list: if group provided and non-empty, use group, else use top-level packages
  if [[ ${#GROUP_PACKS[@]} -gt 0 ]]; then
    PACKAGES=("${GROUP_PACKS[@]}")
  else
    PACKAGES=("${ALL_PACKAGES[@]}")
  fi
}

classify_packages() {
  # classify PACKAGES into OFFICIAL_PACKS and AUR_ONLY_PACKS
  OFFICIAL_PACKS=()
  AUR_ONLY_PACKS=()
  for p in "${PACKAGES[@]}"; do
    if pacman -Si "$p" >/dev/null 2>&1; then
      OFFICIAL_PACKS+=("$p")
    else
      AUR_ONLY_PACKS+=("$p")
    fi
  done
  # append any explicit aur_packages from file
  for p in "${AUR_PACKS[@]}"; do
    # avoid duplicates
    if [[ ! " ${AUR_ONLY_PACKS[*]} " =~ " $p " ]]; then
      AUR_ONLY_PACKS+=("$p")
    fi
  done
}

bootstrap_paru_if_needed() {
  if command -v paru >/dev/null 2>&1; then
    echo "paru already installed"
    return 0
  fi

  echo "Bootstrapping paru (AUR helper)"
  # follow the sequence you confirmed
  if [[ $YES -eq 1 ]]; then
    sudo pacman -S --needed --noconfirm base-devel git
  else
    sudo pacman -S --needed base-devel git
  fi

  TMPDIR="${TMPDIR:-/tmp/paru-bootstrap-$$}"
  mkdir -p "$TMPDIR"
  pushd "$TMPDIR" >/dev/null
  if [[ ! -d paru ]]; then
    git clone https://aur.archlinux.org/paru.git
  fi
  cd paru
  # user specified sequence: makepkg -si
  if [[ $YES -eq 1 ]]; then
    makepkg -si --noconfirm
  else
    makepkg -si
  fi
  popd >/dev/null
  rm -rf "$TMPDIR"
}

install_official() {
  if [[ ${#OFFICIAL_PACKS[@]} -eq 0 ]]; then
    echo "No official packages to install"
    return
  fi
  echo "Official packages to install: ${OFFICIAL_PACKS[*]}"
  if [[ $YES -eq 1 ]]; then
    sudo pacman -S --needed --noconfirm "${OFFICIAL_PACKS[@]}"
  else
    if confirm "Install official packages via pacman?"; then
      sudo pacman -S --needed "${OFFICIAL_PACKS[@]}"
    else
      echo "Skipping official packages"
    fi
  fi
}

install_aur() {
  if [[ ${#AUR_ONLY_PACKS[@]} -eq 0 ]]; then
    echo "No AUR packages to install"
    return
  fi
  bootstrap_paru_if_needed
  if ! command -v paru >/dev/null 2>&1; then
    echo "paru not available; cannot install AUR packages" >&2
    return
  fi
  echo "AUR packages to install: ${AUR_ONLY_PACKS[*]}"
  if [[ $YES -eq 1 ]]; then
    paru -S --noconfirm --needed "${AUR_ONLY_PACKS[@]}"
  else
    if confirm "Install AUR packages via paru?"; then
      paru -S --needed "${AUR_ONLY_PACKS[@]}"
    else
      echo "Skipping AUR packages"
    fi
  fi
}

# Minimal config sync: only copy core folders (do not touch optional ones)
sync_core_configs() {
  CORE=(kitty nvim waybar mako wofi hypr xdg-desktop-portal pulse qt5ct qt6ct gtk-3.0 swaylock)
  TS=$(date +%Y%m%d%H%M%S)
  for d in "${CORE[@]}"; do
    SRC="$ROOT_DIR/$d"
    if [[ -e "$SRC" ]]; then
      DEST="$HOME/.config/$d"
      if [[ -e "$DEST" ]]; then
        echo "Backing up existing $DEST -> ${DEST}.backup.$TS"
        mv "$DEST" "${DEST}.backup.$TS"
      fi
      echo "Copying $SRC -> $DEST"
      mkdir -p "$(dirname "$DEST")"
      rsync -aH --no-perms --omit-dir-times "$SRC/" "$DEST/" || cp -a "$SRC" "$DEST"
    fi
  done
}

# zsh / oh-my-zsh configuration (still considered app config)
configure_zsh() {
  if [[ $INSTALL_OH_MY_ZSH -ne 1 ]]; then
    echo "Skipping Oh My Zsh as requested"
    return
  fi
  if [[ -d "$HOME/.oh-my-zsh" ]]; then
    echo "Oh My Zsh already installed"
  else
    if confirm "Install Oh My Zsh?"; then
      env ZSH="$HOME/.oh-my-zsh" sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" || true
    else
      echo "Skipping Oh My Zsh"
    fi
  fi
  # merge minimal settings into ~/.zshrc
  ZSHRC="$HOME/.zshrc"
  BACKUP="${ZSHRC}.backup.$(date +%Y%m%d%H%M%S)"
  if [[ -f "$ZSHRC" ]]; then
    cp -a "$ZSHRC" "$BACKUP"
  fi
  grep -q "^export ZSH=\"\$HOME/.oh-my-zsh\"" "$ZSHRC" 2>/dev/null || printf '%s\n' 'export ZSH="$HOME/.oh-my-zsh"' >> "$ZSHRC"
  grep -q "^source \$ZSH/oh-my-zsh.sh" "$ZSHRC" 2>/dev/null || printf '%s\n' "# Load Oh My Zsh" "source \$ZSH/oh-my-zsh.sh" >> "$ZSHRC"
  mkdir -p "$HOME/.oh-my-zsh/custom/plugins"
  [[ -d "$HOME/.oh-my-zsh/custom/plugins/zsh-autosuggestions" ]] || git clone https://github.com/zsh-users/zsh-autosuggestions "$HOME/.oh-my-zsh/custom/plugins/zsh-autosuggestions" || true
  [[ -d "$HOME/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting" ]] || git clone https://github.com/zsh-users/zsh-syntax-highlighting.git "$HOME/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting" || true
}

### Main flow
require_pacman
read_package_lists
classify_packages

echo "Official: ${OFFICIAL_PACKS[*]:-none}"
echo "AUR-only: ${AUR_ONLY_PACKS[*]:-none}"

install_official
install_aur

echo "Applying core config files"
sync_core_configs

echo "Configuring zsh"
configure_zsh

echo "Done. To apply Zsh changes run: exec zsh or open a new terminal."

exit 0
