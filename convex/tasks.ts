import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    owner: v.optional(v.string()),
    priority: v.optional(v.number()),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: "open",
      owner: args.owner,
      priority: args.priority ?? 3,
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const list = query({
  args: { status: v.optional(v.string()), owner: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.owner) {
      return await ctx.db.query("tasks").withIndex("by_owner", (q) => q.eq("owner", args.owner)).collect();
    }
    if (args.status) {
      return await ctx.db.query("tasks").withIndex("by_status", (q) => q.eq("status", args.status)).collect();
    }
    return await ctx.db.query("tasks").collect();
  },
});

export const updateStatus = mutation({
  args: { id: v.id("tasks"), status: v.string(), result: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status, result: args.result, updatedAt: Date.now() });
  },
});
