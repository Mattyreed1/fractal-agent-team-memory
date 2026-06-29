import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    text: v.string(),
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notes", {
      text: args.text,
      tags: args.tags ?? [],
      source: args.source,
      createdBy: args.createdBy,
      createdAt: Date.now(),
    });
  },
});

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_createdAt")
      .order("desc")
      .take(args.limit ?? 20);
  },
});

export const search = query({
  args: { query: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withSearchIndex("search_text", (q) => q.search("text", args.query))
      .take(args.limit ?? 10);
  },
});
