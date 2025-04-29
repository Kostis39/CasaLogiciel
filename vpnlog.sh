#!/bin/zsh

# === Config ===
OVPN_FILE="profile-userlocked.ovpn"
AUTH_FILE="vpn-auth.txt"

# === Check files ===
if [ ! -f "$OVPN_FILE" ]; then
  echo "OVPN file not found: $OVPN_FILE"
fi

if [ ! -f "$AUTH_FILE" ]; then
  echo "Auth file not found: $AUTH_FILE"
fi

# === Start VPN ===
echo "Connecting to VPN using $OVPN_FILE..."
sudo openvpn --config "$OVPN_FILE" --auth-user-pass "$AUTH_FILE"
