import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  agents: defineTable({
    agentId: v.string(),
    name: v.string(),
    role: v.optional(v.string()),
    status: v.string(),
    lastSeenAt: v.number(),
  }).index("by_agentId", ["agentId"]),

  notes: defineTable({
    text: v.string(),
    tags: v.array(v.string()),
    source: v.optional(v.string()),
    createdBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .searchIndex("search_text", { searchField: "text", filterFields: ["createdBy"] }),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    owner: v.optional(v.string()),
    priority: v.optional(v.number()),
    result: v.optional(v.string()),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_owner", ["owner"]),
});
