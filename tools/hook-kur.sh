#!/bin/bash
# Hexis git hook kurulumu.
#   bash tools/hook-kur.sh
#
# Git hook'lari repoya dahil edilmez; bu yuzden makine degistiginde
# veya repo yeniden klonlandiginda bu betik bir kez calistirilmalidir.

set -e
KOK="$(cd "$(dirname "$0")/.." && pwd)"
HOOK="$KOK/.git/hooks/pre-commit"

cat > "$HOOK" <<'EOF'
#!/bin/bash
# Hexis pre-commit — yapisal ve uslup kontrolu.
# Kurulum: bash tools/hook-kur.sh
# Atlamak icin (dikkatli olun): git commit --no-verify

KOK="$(git rev-parse --show-toplevel)"
cd "$KOK" || exit 1

if [ ! -f tools/kontrol.sh ]; then
  echo "uyari: tools/kontrol.sh bulunamadi, kontrol atlandi"
  exit 0
fi

bash tools/kontrol.sh
DURUM=$?

if [ $DURUM -ne 0 ]; then
  echo
  echo "Commit durduruldu. Yukaridaki sorunlari duzeltin."
  echo "Zorunlu hallerde: git commit --no-verify"
  exit 1
fi
exit 0
EOF

chmod +x "$HOOK"
echo "pre-commit hook kuruldu: $HOOK"
echo
echo "Test:"
bash "$KOK/tools/kontrol.sh" >/dev/null 2>&1 && echo "  kontrol.sh calisiyor ✓" || echo "  kontrol.sh su an basarisiz (beklenen olabilir)"
