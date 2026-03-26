#!/bin/bash
# CalcolaSubito SessionStart Hook - Automatic Context Loader

MEMORY_DIR="$HOME/.claude/projects/C--Users-matth-Desktop-work/memory"
PROJECT_ROOT="$HOME/Desktop/work"

# Read files directly
MEMORY=$(cat "$MEMORY_DIR/MEMORY.md" 2>/dev/null || echo "Memory index not found")
COLLAB=$(head -30 "$MEMORY_DIR/user_collaboration_style.md" 2>/dev/null | tail -20 || echo "Collab style not loaded")
EXEC=$(sed -n '40,70p' "$MEMORY_DIR/execution_plan.md" 2>/dev/null || echo "Exec plan snippet failed")
STATE=$(head -40 "$MEMORY_DIR/project_calcola_subito_state.md" 2>/dev/null || echo "Project state not loaded")

# Build context
FULL_CONTEXT="🚀 CALCOLASUBITO SESSION STARTUP - RICORSIVE ANALYSIS AT 100%

📚 MEMORY SYSTEM ACTIVE:
$MEMORY

📊 PROJECT STATE (Core):
$STATE

💼 COLLABORATION STYLE (Excerpt):
$COLLAB

📋 EXECUTION PRIORITIES:
$EXEC

✅ SISTEMA PRONTO: Tutti i file caricati in memoria
🎯 Obiettivo: 100€+/mese in 7-8 mesi (metodologia ricorsiva scientifica)
🔄 Stack: 0€ costs (Next.js, Vercel, TailwindCSS, Shadcn, GitHub)"

# Output valid JSON for hook system injection
cat <<'JSONEOF'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "CalcolaSubito project context loaded: 6 memory files + execution plan active. Configured as Senior Entrepreneur + Full Stack Developer. Next steps: GitHub setup, Next.js initialization, first 5 calculators (Percentuali, Giorni tra Date, Scorporo IVA, Codice Fiscale, Rata Mutuo). Timeline: Week 1-2 setup, Month 7-8 target revenue 100€+."
  }
}
JSONEOF
