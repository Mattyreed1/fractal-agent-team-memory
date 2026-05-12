import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new task. Default status is 'open' — any agent can claim it.
export const create = mutation({
  args: {
    title: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, { title, createdBy }) => {
    return await ctx.db.insert("tasks", {
      title,
      status: "open",
      createdBy,
    });
  },
});

// Claim an open task. Errors if the task is already claimed or done.
export const claim = mutation({
  args: {
    taskId: v.id("tasks"),
    agentId: v.string(),
  },
  handler: async (ctx, { taskId, agentId }) => {
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");
    if (task.status !== "open") {
      throw new Error(`Task is '${task.status}', not 'open' — cannot claim`);
    }
    await ctx.db.patch(taskId, {
      status: "claimed",
      assignedTo: agentId,
      claimedAt: Date.now(),
    });
  },
});

// Mark a task done. Optionally attach a result (markdown).
export const complete = mutation({
  args: {
    taskId: v.id("tasks"),
    result: v.optional(v.string()),
  },
  handler: async (ctx, { taskId, result }) => {
    await ctx.db.patch(taskId, {
      status: "done",
      ...(result !== undefined ? { result } : {}),
    });
  },
});

// List tasks, optionally filtered by status. Most recent first.
export const list = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { status, limit }) => {
    const take = limit ?? 50;
    if (status) {
      return await ctx.db
        .query("tasks")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .take(take);
    }
    return await ctx.db.query("tasks").order("desc").take(take);
  },
});
