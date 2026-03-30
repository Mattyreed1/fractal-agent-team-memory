# HEARTBEAT.md — Agent Check-in Protocol

## On Every Heartbeat
1. Check for new tasks assigned to you
2. Check for unread messages
3. Check for notifications

## Memory Size Check
Check `MEMORY.md` file size. If >8KB, trigger early consolidation.

## Consolidation Trigger (3-Layer Model)
Run weekly (for example Sunday morning):
1. Read all memory artifacts from the past week (`MEMORY.md` + daily logs)
2. Preserve/index memory logs for semantic retrieval
3. Extract durable facts → write to Knowledge Graph
4. Write structured operational updates → database tables
5. Reset `MEMORY.md` with new week header
