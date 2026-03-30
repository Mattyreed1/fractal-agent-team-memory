import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Operational blackboard schema: execution state and coordination.
export default defineSchema({
  projects: defineTable({
    slug: v.string(),
    name: v.string(),
    summary: v.optional(v.string()),
    status: v.string(), // "active" | "paused" | "completed" | "archived"
    priority: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.string(),
    updatedBy: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  agents: defineTable({
    agentId: v.string(),
    displayName: v.string(),
    role: v.string(),
    status: v.string(), // "online" | "idle" | "busy" | "offline"
    capabilities: v.optional(v.array(v.string())),
    lastHeartbeatAt: v.optional(v.number()),
    currentProject: v.optional(v.id("projects")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_agentId", ["agentId"])
    .index("by_status", ["status"])
    .index("by_currentProject", ["currentProject"]),

  tasks: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "todo" | "in_progress" | "blocked" | "done" | "canceled"
    priority: v.number(), // 1 (low) - 5 (urgent)
    assigneeAgentId: v.optional(v.id("agents")),
    reporter: v.optional(v.string()),
    dueAt: v.optional(v.number()),
    dependsOn: v.optional(v.array(v.id("tasks"))),
    decisionIds: v.optional(v.array(v.id("decisions"))),
    messageIds: v.optional(v.array(v.id("messages"))),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.string(),
    updatedBy: v.optional(v.string()),
  })
    .index("by_project", ["projectId"])
    .index("by_status", ["status"])
    .index("by_assignee", ["assigneeAgentId"])
    .index("by_priority", ["priority"]),

  messages: defineTable({
    projectId: v.id("projects"),
    fromAgentId: v.optional(v.id("agents")),
    toAgentId: v.optional(v.id("agents")),
    threadKey: v.optional(v.string()),
    content: v.string(),
    messageType: v.string(), // "update" | "question" | "handoff" | "alert"
    relatedTaskId: v.optional(v.id("tasks")),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
    createdBy: v.string(),
  })
    .index("by_project", ["projectId"])
    .index("by_toAgent", ["toAgentId"])
    .index("by_relatedTask", ["relatedTaskId"])
    .index("by_thread", ["threadKey"]),

  decisions: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    summary: v.string(),
    rationale: v.optional(v.string()),
    status: v.string(), // "proposed" | "approved" | "rejected" | "superseded"
    decidedBy: v.array(v.string()),
    impacts: v.optional(v.array(v.string())),
    relatedTaskIds: v.optional(v.array(v.id("tasks"))),
    supersedesDecisionId: v.optional(v.id("decisions")),
    validFrom: v.number(),
    validUntil: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    source: v.string(),
  })
    .index("by_project", ["projectId"])
    .index("by_status", ["status"])
    .index("by_validFrom", ["validFrom"]),
});
