# Agent Memory Starter Kit

**Convex backend for OpenClaw agent teams. 10-minute setup. Two tables. No debugging.**

This is the *long-term, shared* layer of memory for a multi-agent team. It sits underneath your per-agent files (`SOUL.md`, `MEMORY.md`, etc.) and gives your agents two things they can't do with files alone:

- **`tasks`** — durable work coordination across agents (`open` → `claimed` → `done`).
- **`notes`** — full-text searchable shared memory (facts, references, decisions).

Built for [OpenClaw](https://github.com/openclawhq/openclaw) on a Hetzner VPS, but works with any agent runtime that can shell out or hit a URL.

---

## Why two tables?

Most agent-memory systems either ship one bloated schema (too much to learn) or skip durable shared state entirely (agents repeat work and miss each other's facts). This kit picks the two primitives a team actually needs on day 1:

| Without this | With this |
|---|---|
| Agent A finishes a task, Agent B starts the same task | `tasks` table — A claimed it, B sees `status: claimed` |
| Agent A learned a fact yesterday, Agent B re-discovers it tomorrow | `notes` table — A wrote it, B finds it via search |

Everything else (decisions, projects, documents, KG entities) is a *tag* or a *result* on top of these two — until you need a dedicated table for it.

---

## Quick Start (10 minutes)

You need: [Node 18+](https://nodejs.org), a free [Convex account](https://convex.dev) (sign in with Google), and a terminal.

```bash
# 1. Clone
gh repo clone Mattyreed1/agent-memory-starter-kit my-memory
cd my-memory

# 2. Install
npm install

# 3. Deploy (opens browser to sign in, creates your Convex project)
npx convex dev
```

That's it. After `npx convex dev` finishes, your terminal shows a URL like `https://elegant-cat-123.convex.cloud`. That's your deployment.

To deploy permanently to production (no dev watcher):
```bash
npx convex deploy
```

---

## How agents use it

Any process with the Convex URL + a deploy key can call functions. From inside an OpenClaw agent skill (or directly via shell):

```bash
# Post a fact to shared memory
npx convex run notes:add \
  '{"content":"Acme PM is Jen Hu (jen@acme.com)","tags":["acme","contacts"],"createdBy":"rfi-triager"}'

# Search past notes
npx convex run notes:search '{"query":"Acme"}'

# Create a task
npx convex run tasks:create \
  '{"title":"Review submittal for Project X","createdBy":"human"}'

# Claim it
npx convex run tasks:claim \
  '{"taskId":"<id>","agentId":"submittal-reviewer"}'

# Complete it
npx convex run tasks:complete \
  '{"taskId":"<id>","result":"## Review\n\nLooks good, flagged 2 items..."}'
```

Or call from Claude Code, Cursor, or any tool that supports the [Convex MCP server](https://docs.convex.dev/ai/using-mcp-tools).

---

## Where this fits

```
┌─────────────────────────────────────────────┐
│  WORKING MEMORY                             │
│  Context window at every agent wake         │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  SHORT-TERM (per-agent files on the VPS)    │
│  SOUL.md • AGENTS.md • MEMORY.md •          │
│  WORKING.md  ← private to each agent        │
│  DNA.md • TEAM.md  ← shared across agents   │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  LONG-TERM (this kit — shared via Convex)   │
│  tasks  ← who's doing what, with results    │
│  notes  ← searchable team knowledge         │
└─────────────────────────────────────────────┘
```

The per-agent file conventions (SOUL, MEMORY, etc.) ship with [`fractal-ai-workshop-ea-starter`](https://github.com/Mattyreed1/fractal-ai-workshop-ea-starter) → the `openclaw-vps-setup` skill. This kit only owns the Convex layer.

---

## Extending it (when you outgrow 2 tables)

Add tables as needs grow. Common next-steps:

- **`documents`** — markdown artifacts agents produce (when notes get long enough that you want versioning + a `type` field)
- **`projects`** — when 2-3 agents become 5+ and you need explicit project ownership + collaborators
- **`decisions`** — when you want a separate auditable trail (you can also just tag notes with `["decision"]`)
- **Knowledge Graph (entities + relations)** — when full-text search isn't enough and you want typed relationships. At that point, consider graduating to [OB1](https://github.com/NateBJones-Projects/OB1), which has a native OpenClaw plugin and vector-backed retrieval.

Production patterns to copy when you need them: the 9-table version running ~5 Molty agents in production.

---

## License

MIT. See [LICENSE](./LICENSE).

## Built by Fractal AI

- [fractalai.agency](https://fractalai.agency)
- [Book Matty](https://cal.com/mattyreed1/priority)
