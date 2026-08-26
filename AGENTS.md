<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Standing Rules & Guidelines

- **Documentation First**: Before building any feature, read the relevant file(s) in `docs/` — especially `STRUCTURE.md` for file locations, `API.md` for endpoint contracts, and `CONTRIBUTING.md` for the component and API route templates, which must be followed exactly.
- **Strict Folder Structure**: Every file goes exactly where `docs/STRUCTURE.md` says. Never invent new folder structures.
- **Browser Verification & Commit**: After completing each feature: verify it works in the browser, then commit with the commit format from `docs/CONTRIBUTING.md`.
- **Environment Security**: Never modify, log, or display values from `.env.local`. Never commit it.
- **Task Scope**: Fix only what the current task asks. Do not refactor unrelated code.
- **API Deviations**: If an instruction in `docs/` conflicts with a current library API, use the current API and note the deviation.
