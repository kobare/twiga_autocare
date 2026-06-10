#!/bin/bash

cd "$(dirname "$0")"

read -p "How many new gallery directories are you adding? " n

TOTAL=12

# Validate input
if ! [[ "$n" =~ ^[0-9]+$ ]]; then
  echo "Error: invalid number"
  exit 1
fi

if [ "$n" -eq 0 ]; then
  echo "No shift needed"
  exit 0
fi

echo "Checking for existing -old folders..."

# ===============================
# SAFETY CHECK (BLOCK IF OLD EXISTS)
# ===============================
existing_old=$(find . -maxdepth 1 -type d -name "*-old" | wc -l)

if [ "$existing_old" -gt 0 ]; then
  echo ""
  echo "❌ ERROR: Existing backup folders detected."
  echo "You must first remove all *-old directories before running this script."
  echo ""
  echo "Run:"
  echo "  rm -rf *-old"
  echo ""
  echo "Aborting to prevent data corruption."
  exit 1
fi

echo "Safely shifting galleries by $n..."

# ===============================
# STEP 1: MOVE LAST N TO -old
# ===============================
for ((i=TOTAL; i>TOTAL-n; i--)); do
  src=$(printf "%02d" $i)

  if [ -d "$src" ]; then
    mv "$src" "${src}-old"
    echo "Renamed $src → ${src}-old"
  fi
done

# ===============================
# STEP 2: SHIFT REST SAFELY
# ===============================
for ((i=TOTAL-n; i>=1; i--)); do
  src=$(printf "%02d" $i)

  if [ -d "$src" ]; then
    mv "$src" "${src}-tmp"
  fi
done

for ((i=TOTAL-n; i>=1; i--)); do
  tmp=$(printf "%02d" $i)
  dest=$(printf "%02d" $((i+n)))

  if [ -d "${tmp}-tmp" ]; then
    mv "${tmp}-tmp" "$dest"
    echo "Moved $tmp → $dest"
  fi
done

echo "Done safely."
