# Design Decisions

A running log of meaningful architectural and engineering choices made in
this project, with the reasoning behind them. Newer entries at the top.

---

## 2026-05-27 — TypeScript with strict mode, gradual migration

**Context.** The project was a working JavaScript Express app with a layered
architecture (routes → controllers → services → models). The goal of
Milestone 1 is to harden it to production quality.

**Decision.** Migrate the entire backend to TypeScript with `strict: true`
from day one, converting bottom-up: models → services → controllers →
routes → entry point.

**Reasoning.**
- TypeScript catches whole classes of bugs at compile time (null access,
  type mismatches, typos in property names).
- `strict: true` enables all type checks at once. Easier to be rigorous
  from the start than to incrementally tighten settings later.
- Every other M1 step benefits from types: Zod infers types from schemas,
  error classes are type-safe, Mongoose's typed schemas catch
  model-vs-handler mismatches.
- Bottom-up conversion means each layer's types are already available
  when the layer above is converted — fewer cascading errors.

**Alternatives considered.**
- `allowJs: true` + gradual migration. Rejected: easier to defer rigor
  indefinitely; also creates a longer messy-middle phase.
- Skip TypeScript entirely. Rejected: TS is now standard in Node hiring;
  the project should reflect that.

---

## 2026-05-27 — Await MongoDB connection before listening

**Context.** The original `app.js` called `mongoose.connect()` and
`app.listen()` in immediate sequence without awaiting the connection.
Requests in the first ~200ms could hit a server with no database.

**Decision.** Wrap startup in an async function that awaits
`mongoose.connect()` before calling `app.listen()`. Exit with code 1
on connection failure or missing `MONGO_URI`.

**Reasoning.**
- Process supervisors (Docker, PM2, Kubernetes) inspect exit codes to
  decide whether to restart a container. Exiting non-zero on fatal
  startup errors is the correct contract.
- Failing fast on missing env vars surfaces config bugs at deploy time,
  not at first-request time.

---

## 2026-05-27 — Schema-level constraints in Mongoose, not just code-level

**Context.** Models had only `required` constraints. Validation was
done ad-hoc in controllers.

**Decision.** Add `trim`, `maxlength`, `min`, and `enum` to schemas at
the model layer. Will also validate at the API boundary with Zod (M1
step 2).

**Reasoning.**
- Defense in depth: code-level validation (Zod), schema-level validation
  (Mongoose), and database-level constraints all enforce the same
  business rules. A bug in one layer is caught by the next.
- Schema-level rules document the data model: anyone reading the schema
  knows the constraints without hunting through controllers.

---

## Template for new entries

```
## YYYY-MM-DD — Short title

**Context.** What was the situation that prompted the decision.

**Decision.** What we chose to do.

**Reasoning.** Why this choice over alternatives.

**Alternatives considered.** Optional — only if there were real options
on the table worth recording.
```