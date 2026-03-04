#!/bin/bash
# Starts a Cloudflare tunnel and updates the manifest with the tunnel URL.
# Usage: ./scripts/start-tunnel.sh
# Prerequisites: dev server must be running (npm run dev-server)
#                cloudflared must be installed (brew install cloudflared)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
MANIFEST="$PROJECT_DIR/manifest.xml"

echo "Starting Cloudflare tunnel on port 3000..."

# Start tunnel and capture URL
TUNNEL_OUTPUT=$(mktemp)
cloudflared tunnel --url https://localhost:3000 --no-tls-verify > "$TUNNEL_OUTPUT" 2>&1 &
TUNNEL_PID=$!

# Wait for the tunnel URL to appear (can take up to 30s)
for i in $(seq 1 30); do
  TUNNEL_URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$TUNNEL_OUTPUT" | head -1)
  if [ -n "$TUNNEL_URL" ]; then
    break
  fi
  sleep 1
done

if [ -z "$TUNNEL_URL" ]; then
  echo "ERROR: Failed to get tunnel URL after 30 seconds"
  cat "$TUNNEL_OUTPUT"
  kill $TUNNEL_PID 2>/dev/null
  rm "$TUNNEL_OUTPUT"
  exit 1
fi

echo "Tunnel URL: $TUNNEL_URL"
echo ""

# Update manifest - replace any previous tunnel URL, loca.lt URL, or localhost:3000
if [ -f "$MANIFEST" ]; then
  sed -i '' -E "s|https://[a-z0-9-]+\.trycloudflare\.com|$TUNNEL_URL|g" "$MANIFEST"
  sed -i '' -E "s|https://[a-z0-9-]+\.loca\.lt|$TUNNEL_URL|g" "$MANIFEST"
  sed -i '' "s|https://localhost:3000|$TUNNEL_URL|g" "$MANIFEST"
  echo "Updated $MANIFEST with tunnel URL"
else
  echo "WARNING: $MANIFEST not found"
fi

echo ""
echo "Next steps:"
echo "  1. Upload the updated manifest.xml in OneNote (Insert > Office Add-ins > Upload)"
echo "  2. Click the Daily Notes button"
echo ""
echo "Press Ctrl+C to stop the tunnel"

# Wait for tunnel process
wait $TUNNEL_PID
rm "$TUNNEL_OUTPUT"
