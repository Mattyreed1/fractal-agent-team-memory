import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Agent Memory Starter Kit — 2 tables, the minimum useful shared memory layer
// for an OpenClaw agent team. Discord handles messaging. Files (MEMORY.md, etc.)
// handle per-agent journals. This is the durable, shared, queryable layer.

export default defineSchema({
  // tasks — durable work coordination across agents
  // Lifecycle: open → claimed → done (or back to open if released)
  tasks: defineTable({
    title: v.string(),
    status: v.string(), // 'open' | 'claimed' | 'done'
    createdBy: v.string(), // agent id or 'human'
    assignedTo: v.optional(v.string()), // agent id when claimed
    claimedAt: v.optional(v.number()), // ms timestamp
    result: v.optional(v.string()), // markdown output when done
  })
    .index("by_status", ["status"])
    .index("by_assignee", ["assignedTo"]),

  // notes — shared searchable memory: facts, references, decisions
  // Anything an agent learns that the rest of the team might need later
  notes: defineTable({
    content: v.string(), // markdown
    tags: v.array(v.string()), // e.g. ['acme', 'contacts'] or ['decision', 'pricing']
    createdBy: v.string(), // agent id or 'human'
  }).searchIndex("search_content", {
    searchField: "content",
  }),
});
