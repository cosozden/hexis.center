#!/bin/bash
# Hexis Git Hooks Installer
# Usage: bash scripts/install-hooks.sh

HOOK_DIR="$(git rev-parse --git-dir)/hooks"
HOOK_FILE="$HOOK_DIR/pre-commit"

cat > "$HOOK_FILE" << 'EOF'
#!/bin/bash
# Hexis pre-commit hook — validates schema, API contracts, and routes
echo "Running Hexis pre-commit validation..."
npx tsx scripts/precommit.ts --quick
EOF

chmod +x "$HOOK_FILE"
echo "✅ Pre-commit hook installed at $HOOK_FILE"
echo "   Runs: schema drift + API contracts + route validation"
echo "   To skip (emergency only): git commit --no-verify"
