#!/usr/bin/env bash

# SessionStart Hook - Analisi Progetto Ricorsiva
# Usa bash puro per massima compatibilità

PROJECT_ROOT="."
MEMORY_DIR="${HOME}/.claude/projects/C--Users-matth-Desktop-work/memory"

# Raccogli i contenuti
MD_FILES=""
for file in $(find "$PROJECT_ROOT" -maxdepth 2 -name "*.md" -type f 2>/dev/null | sort); do
  if [ -f "$file" ]; then
    MD_FILES+="FILE: $file
$(cat "$file" 2>/dev/null)

"
  fi
done

MEMORY_FILES=""
if [ -d "$MEMORY_DIR" ]; then
  for file in $(find "$MEMORY_DIR" -name "*.md" -type f 2>/dev/null | sort); do
    if [ -f "$file" ]; then
      MEMORY_FILES+="MEMORIA: $(basename "$file")
$(cat "$file" 2>/dev/null)

"
    fi
  done
fi

STRUCTURE=$(find "$PROJECT_ROOT" -maxdepth 3 -type f \( -name "*.json" -o -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" \) 2>/dev/null | head -30)

# Funzione per escapare JSON
json_escape() {
  local string="$1"
  string="${string//\\/\\\\}"
  string="${string//\"/\\\"}"
  string="${string//$'\n'/\\n}"
  string="${string//$'\r'/\\r}"
  string="${string//$'\t'/\\t}"
  echo "$string"
}

# Crea il prompt di analisi
ANALYSIS="📊 ANALISI COMPLETA DEL PROGETTO AL STARTUP

=== FILE .MD TROVATI ===
${MD_FILES:-Nessun file .md trovato}

=== MEMORIA (AUTO-MEMORY) ===
${MEMORY_FILES:-Nessuna memoria salvata yet}

=== STRUTTURA PROGETTO ===
${STRUCTURE:-Nessun file di codice trovato}

=== TASK ===
Basandoti su TUTTA questa analisi fornisci una ricapitolazione che includa:

1. **Nome e Obiettivo Progetto** - Qual è il nome? Che cosa costruiamo?
2. **Stato Attuale** - A che punto siamo adesso?
3. **Architettura Tecnica** - Come è strutturato il progetto?
4. **Memoria Precedente** - Cosa ricordi dal contesto passato?
5. **Prossimi Step** - Cosa fare subito dopo?

IMPORTANTE: Sii COMPLETO, CONCISO e NON PERDERE NESSUN DETTAGLIO dalle informazioni che ho passato."

# Escapa il testo per JSON
ESCAPED_ANALYSIS=$(json_escape "$ANALYSIS")

# Output JSON valido
cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "$ESCAPED_ANALYSIS"
  }
}
EOF

exit 0
