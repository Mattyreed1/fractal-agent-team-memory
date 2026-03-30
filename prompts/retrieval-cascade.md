# Retrieval Cascade (6-Step Lookup Order)

Use this retrieval order for every non-trivial agent request.

## Goal

Find the best answer with the lowest-latency, highest-signal source first.

## 1) Working Memory (Already in Context)

Check what is already available in the active session:
- Agent files loaded at startup
- Current conversation
- Blackboard state already injected
- Recent tool outputs

Why first: zero retrieval cost and usually the freshest context.

## 2) Short-Term Memory (`MEMORY.md`)

Read the entire `MEMORY.md` file for current-week context:
- Key decisions
- New learnings
- Open questions

Why second: small, curated, and designed for full-session preload.

## 3) Long-Term: Memory Log (Semantic Search)

Run semantic search over dated daily memory files.
Fallback to keyword/date filtering if embeddings are unavailable.

Why third: adds chronological detail with targeted recall.

## 4) Long-Term: Knowledge Graph (Graph Traversal)

Query entities and relationships through graph traversal.

Why fourth: durable dependency/fact retrieval after local context is exhausted.

## 5) Long-Term: Database (Structured Queries)

Query structured operational records:
- tasks
- messages
- decisions
- projects

Why fifth: high-precision operational retrieval for execution state.

## 6) External Sources (Last Resort)

Consult external docs, web, or other systems only if internal memory is insufficient.

Why last: highest latency and highest noise risk.

## Execution Rules

1. Stop as soon as confidence is sufficient.
2. Cite source layer in response metadata/logs.
3. If sources conflict, prefer recency for active operations and KG for durable facts.
4. Write newly learned durable facts back through normal memory pipelines.
