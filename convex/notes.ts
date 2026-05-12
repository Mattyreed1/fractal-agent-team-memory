import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Append a note to shared memory. Tags help retrieval later.
export const add = mutation({
  args: {
    content: v.string(),
    tags: v.array(v.string()),
    createdBy: v.string(),
  },
  handler: async (ctx, { content, tags, createdBy }) => {
    return await ctx.db.insert("notes", { content, tags, createdBy });
  },
});

// Full-text search over note content. Returns top 20 matches.
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, { query: q }) => {
    return await ctx.db
      .query("notes")
      .withSearchIndex("search_content", (b) => b.search("content", q))
      .take(20);
  },
});

// Get notes by tag (simple linear scan over recent notes).
// Fine for <1000 notes; if you grow past that, add a separate index.
export const byTag = query({
  args: { tag: v.string() },
  handler: async (ctx, { tag }) => {
    const recent = await ctx.db.query("notes").order("desc").take(500);
    return recent.filter((n) => n.tags.includes(tag));
  },
});

// Most recent N notes regardless of content.
export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db.query("notes").order("desc").take(limit ?? 20);
  },
});
