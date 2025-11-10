bash -lc 'set -euo pipefail
mkdir -p scripts
cat > scripts/find-unused-components.sh <<\'BASH\'
#!/usr/bin/env bash
set -euo pipefail
repo_root="$(pwd)"
out="$repo_root/unused_components.txt"
: > "$out"

# Gather component files excluding ui folder and index barrels
find src/components -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "src/components/ui/*" | while read -r f; do
  # ignore index files in folders that act as barrels unless they export others
  rel_no_src="${f#src/}"
  noext="${rel_no_src%.*}" # components/...
  basename="$(basename "$noext")"

  # Prepare patterns to look for in imports
  patterns=(
    "@/${noext}"
    "@/${noext%/*}/$basename"
    "@/components/$basename"
  )

  used=1
  for p in "${patterns[@]}"; do
    if grep -R --exclude-dir=node_modules -n --include='*.ts' --include='*.tsx' -F "$p" src >/dev/null 2>&1; then
      used=0
      break
    fi
  done

  # check barrels: if any export refers to this file
  if [ $used -eq 1 ]; then
    # look for export ... from './basename' or from './<dir>/basename'
    if grep -R --exclude-dir=node_modules -nE "export .* from ['\"](\./|.*)${basename}['\"]" src/components >/dev/null 2>&1; then
      used=0
    fi
  fi

  # check generic references: sometimes imported via index barrel like '@/components/common'
  if [ $used -eq 1 ]; then
    # search for occurrences of the file's filename in imports across the repo
    if grep -R --exclude-dir=node_modules -n --include='*.ts' --include='*.tsx' -E "components/.*/${basename}|components/${basename}" src >/dev/null 2>&1; then
      used=0
    fi
  fi

  if [ $used -eq 1 ]; then
    echo "$f" >> "$out"
  fi

done

echo "Wrote unused list to $out"
BASH