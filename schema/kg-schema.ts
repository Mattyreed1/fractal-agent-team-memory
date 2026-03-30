import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Knowledge Graph schema: durable entities + relations.
export default defineSchema({
  // Knowledge Graph — entities (nodes)
  kg_entities: defineTable({
    name: v.string(),
    entityType: v.string(), // "person" | "company" | "project" | "tool" | "concept"
    summary: v.string(), // living description, updated as we learn more
    properties: v.optional(v.any()),
    confidence: v.optional(v.string()), // "high" | "medium" | "low"
    tags: v.optional(v.array(v.string())),
    createdBy: v.string(),
    updatedBy: v.string(),
    validFrom: v.number(),
    validUntil: v.optional(v.number()), // null = still valid
    source: v.string(),
  })
    .index("by_type", ["entityType"])
    .index("by_name", ["name"])
    .searchIndex("search_name_summary", {
      searchField: "name",
      filterFields: ["entityType"],
    }),

  // Knowledge Graph — relations (edges)
  kg_relations: defineTable({
    fromEntity: v.id("kg_entities"),
    toEntity: v.id("kg_entities"),
    relationType: v.string(), // "works_at" | "owns" | "uses" | "leads" | etc.
    fact: v.string(), // human-readable: "Alice leads the Memory project"
    weight: v.number(), // importance 1-10
    confidence: v.optional(v.string()),
    createdBy: v.string(),
    updatedBy: v.optional(v.string()),
    validFrom: v.number(),
    validUntil: v.optional(v.number()),
    source: v.string(),
  })
    .index("by_fromEntity", ["fromEntity"])
    .index("by_toEntity", ["toEntity"])
    .index("by_relationType", ["relationType"]),
});
