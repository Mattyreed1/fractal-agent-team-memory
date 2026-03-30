# MEMORY.md — Weekly Buffer (Example)

**Week of:** 2026-03-23

---

## Key Decisions
- Standardized retrieval order to 6-step cascade to reduce unnecessary web/doc lookups.
- Adopted `project slug` as canonical key across task routing and memory logs.
- Set consolidation schedule to Sunday 08:00 UTC with early trigger at `MEMORY.md > 8KB`.

## Context Learned
- `agent_ops` spends significant time triaging duplicate task reports; dedupe check should run before task creation.
- Engineering handoffs are clearer when every daily log includes explicit "Facts Worth Keeping".
- Most urgent blockers were operational dependencies, not missing technical context.

## Work Completed
- Added daily memory logging to all active agents (`agent_ops`, `agent_eng`, `agent_research`).
- Implemented Blackboard write hooks for `task status changes` and `decision approvals`.
- Backfilled 2 weeks of historical decision summaries into KG entities/relations.

## Open Questions
- Should `messages` older than 30 days be archived or summarized into decisions?
- Should relation `weight` be auto-derived from recurrence count?
- Do we need separate consolidation prompts for product vs. engineering projects?

---

*This file resets after weekly consolidation. Important facts are extracted to the knowledge graph.*
*Max size: 8KB. If exceeded, trigger early consolidation.*
