#!/bin/sh

# Configuration
DATE=$(date +"%Y-%m-%d_%H-%M")
BACKUP_DIR="/backups"
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASS=$DB_PASS
RETENTION_DAYS=14

# Configuration Telegram
TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID=$TELEGRAM_CHAT_ID

# Nom du fichier de sauvegarde
BACKUP_FILE="${DB_NAME}_${DATE}.sql.gz"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

# Fonction pour envoyer un message Telegram
send_telegram() {
    MESSAGE=$1
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d chat_id="${TELEGRAM_CHAT_ID}" \
      -d text="${MESSAGE}" \
      -d parse_mode="Markdown" > /dev/null
}

# Fonction de nettoyage en cas d'erreur
cleanup_on_error() {
    ERROR_MSG=$1

    # Suppression du fichier partiel si existant
    [ -f "$BACKUP_PATH" ] && rm -f "$BACKUP_PATH"

    # Message d'erreur Telegram
    ERROR_MESSAGE="🚨 *ERREUR - Sauvegarde échouée*

📁 Base de données: \`$DB_NAME\`
📅 Date: \`$DATE\`
⚠️ Erreur: $ERROR_MSG
🖥️ Serveur: \`$DB_HOST:$DB_PORT\`

❌ Le dump n'a pas pu être créé."

    send_telegram "$ERROR_MESSAGE"
    exit 1
}

# Tentative de sauvegarde
echo "Début de la sauvegarde de $DB_NAME..."

if ! mariadb-dump \
  -h "$DB_HOST" \
  -P "$DB_PORT" \
  -u "$DB_USER" \
  -p"$DB_PASS" \
  --single-transaction \
  --quick \
  --routines \
  --events \
  --triggers \
  --databases "$DB_NAME" \
  2>/tmp/backup_error.log \
  | gzip > "$BACKUP_PATH"; then

    # Récupération du message d'erreur
    ERROR_DETAIL=$(cat /tmp/backup_error.log 2>/dev/null || echo "Erreur inconnue")
    cleanup_on_error "$ERROR_DETAIL"
fi

# Vérification que le fichier n'est pas vide
if [ ! -s "$BACKUP_PATH" ]; then
    cleanup_on_error "Le fichier de sauvegarde est vide"
fi

# Vérification de l'intégrité du gzip
if ! gzip -t "$BACKUP_PATH" 2>/dev/null; then
    cleanup_on_error "Le fichier compressé est corrompu"
fi

echo "Sauvegarde réussie !"

# Récupération des informations de la sauvegarde
BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
BACKUP_COUNT=$(find "$BACKUP_DIR" -type f -name "*.sql.gz" | wc -l)

# Nettoyage des anciennes sauvegardes
DELETED_COUNT=$(find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +"$RETENTION_DAYS" 2>/dev/null | wc -l)
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +"$RETENTION_DAYS" -delete 2>/dev/null

# Message de succès Telegram
SUCCESS_MESSAGE="✅ *Dump base réussie*

📁 Base de données: \`$DB_NAME\`
📅 Date: \`$DATE\`
💾 Taille: \`$BACKUP_SIZE\`
📊 Sauvegardes totales: $BACKUP_COUNT
🗑️ Anciennes supprimées: $DELETED_COUNT
⏱️ Rétention: $RETENTION_DAYS jours"

send_telegram "$SUCCESS_MESSAGE"

# Nettoyage du fichier d'erreur temporaire
rm -f /tmp/backup_error.log

echo "Notification envoyée avec succès !"