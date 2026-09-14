# Agent instructions

## Start here

Before changing the project:

1. Read every Markdown file in `docs/`.
2. Inspect the code and configuration related to the task.
3. Follow the existing structure. Create folders only when the code needs them.

Treat `docs/` as the project context. If documents disagree, stop and tell the user before choosing one.

## Work

- Keep changes focused on the request.
- Preserve existing code and user changes.
- Use the scripts in `package.json` as the source of truth for commands.
- Run the relevant checks before reporting completion.
- State exactly which checks ran and which did not.

## Shared notes

Read `docs/agent-notes.md` before debugging or making a choice that may have surprised an earlier agent.

Add a note only when all are true:

1. The problem or behavior was surprising.
2. You verified the cause or a reliable workaround.
3. Another agent is likely to hit it again.

Update an existing note instead of adding a duplicate. Keep notes short. Do not record routine progress, temporary failures, guesses, or facts already documented elsewhere.
