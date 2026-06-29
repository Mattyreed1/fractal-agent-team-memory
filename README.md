# Fractal Agent Team Memory

A simple Convex backend for agent teams.

Use it when your agents need shared memory, tasks, and status that survive across sessions.

## What you get

- `notes` — shared searchable memory
- `tasks` — simple cross-agent work queue
- `agents` — heartbeat/status records

That is it. Start small. Add complexity only when the system earns it.

## Quick start

You need Node.js and a free Convex account.

```bash
git clone https://github.com/Mattyreed1/fractal-agent-team-memory.git
cd fractal-agent-team-memory
npm install
npx convex dev
```

Convex will open a browser, ask you to log in, and create a backend.

For production:

```bash
npx convex deploy
```

## Test it

In another terminal from this repo:

```bash
npx convex run notes:add '{"text":"The team memory backend is live.","tags":["setup"],"createdBy":"matty"}'
npx convex run notes:recent '{"limit":5}'

npx convex run tasks:create '{"title":"Set up first agent","createdBy":"matty","owner":"agent-1"}'
npx convex run tasks:list '{"status":"open"}'

npx convex run agents:heartbeat '{"agentId":"agent-1","name":"Agent 1","role":"Assistant"}'
npx convex run agents:list '{}'
```

## How agents should use it

Use this retrieval order:

1. Current conversation/session context
2. Local project files (`CLAUDE.md`, `USER.md`, `MEMORY.md`, etc.)
3. `notes:search` for shared memory
4. `tasks:list` for open work
5. External tools/docs/web last

Use this write policy:

- Put durable facts in `notes`.
- Put work commitments in `tasks`.
- Send `agents:heartbeat` when an agent starts or finishes a work session.
- Never store secrets, passwords, API keys, or private tokens.

## Minimal schema

```text
agents(agentId, name, role, status, lastSeenAt)
notes(text, tags, source, createdBy, createdAt)
tasks(title, description, status, owner, priority, result, createdBy, createdAt, updatedAt)
```

## Where this fits

This repo is the standard memory companion for [`fractal-agent-team-starter`](https://github.com/Mattyreed1/fractal-agent-team-starter).

Use the starter first if you want guided setup. Use this repo directly if you only need the Convex backend.

## Advanced references

The `schema/`, `templates/`, `prompts/`, and `examples/` folders contain the older expanded architecture notes. They are useful once the simple backend is working.

## License

MIT.
