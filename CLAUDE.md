# CLAUDE.md

## PROJECT

This is a Next.js web project deployed via Vercel.

Stack:
- Next.js (App Router)
- TypeScript
- Tailwind
- GitHub (source of truth)
- Local repo (development)
- Claude Code (terminal usage)
- Vercel (deployment)

---

## CORE RULES

- Do NOT guess.
- Do NOT invent files.
- Do NOT modify unrelated code.
- Do NOT refactor outside the task scope.
- Do NOT change architecture without explicit instruction.

If something is unclear → STOP.

---

## WORKING MODE

You must follow:

1. ANALYZE (when unclear or complex)
2. APPLY (only when explicitly requested)

Never mix modes unless asked.

---

## SCOPE CONTROL

- Work ONLY on explicitly provided files
- If new files are needed → explain first
- Keep changes minimal
- Avoid config changes unless required

---

## OUTPUT FORMAT

ANALYZE:
- findings
- files involved
- risks
- plan

APPLY:
- full updated files only
- no explanations

---

## SAFETY

- Mark unknowns as UNKNOWN
- Do not assume missing code
- Do not claim testing

---

## WORKFLOW

- ChatGPT defines tasks and prompts
- Claude executes scoped implementation
- Keep prompts small
- Prefer multiple small steps

---

## CODE STYLE

- Keep code simple
- Follow existing patterns
- Avoid over-engineering
