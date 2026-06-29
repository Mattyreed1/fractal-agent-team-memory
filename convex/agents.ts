import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const heartbeat = mutation({
  args: { agentId: v.string(), name: v.optional(v.string()), role: v.optional(v.string()), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("agents")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .unique();
    const patch = {
      name: args.name ?? args.agentId,
      role: args.role,
      status: args.status ?? "online",
      lastSeenAt: Date.now(),
    };
    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }
    return await ctx.db.insert("agents", { agentId: args.agentId, ...patch });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("agents").collect(),
});
