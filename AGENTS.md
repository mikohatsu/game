# Repository Guidelines

## Project Structure & Module Organization
- Root `index.html` is the game hub linking to sub-projects. Each subfolder (`chess_arena`, `spaceship_engineer`, `junk_beat`, `crafters_forge`, `neo_junk_market`) is a self-contained static game served directly from its `index.html`.
- `text_dungeon_react/` is the only React/Vite app. Source lives under `text_dungeon_react/src/` with components, hooks, and styles split by concern; static assets stay in `public/` and `src/assets/`.
- Keep new utilities/components colocated with their primary feature; share-only items go under `text_dungeon_react/src/components/` or `src/hooks/`. Avoid cross-project coupling; static games should not import from the React app.

## Build, Test, and Development Commands
- Install deps for the React app once: `cd text_dungeon_react && npm install`.
- Run locally with hot reload: `npm run dev`.
- Production bundle: `npm run build` (outputs to `text_dungeon_react/dist`).
- Lint JS/JSX: `npm run lint`.
- Preview built bundle: `npm run preview`.
- Static games: open their `index.html` directly via a simple file server (e.g., `python -m http.server`) or the hub page.

## Coding Style & Naming Conventions
- JS/JSX: modern ES modules, functional React components; follow ESLint recommended + React Hooks/Refresh configs. Unused vars are errors unless intentionally ALL_CAPS.
- Indentation: 2 spaces in JS/JSX; match existing spacing in HTML/CSS per file. Prefer descriptive camelCase for functions/vars and PascalCase for components.
- Styling: `text_dungeon_react` uses Vite defaults plus Tailwind v4; prefer utility classes and keep component-scoped styles in `App.css`/`index.css` only when utilities fall short.

## Testing Guidelines
- No automated test suite yet; run `npm run lint` before pushing React changes.
- Manually verify flows: start a new run, test combat/log updates, inventory changes, and modal interactions in `text_dungeon_react`; ensure static games load from the hub and assets resolve.
- Keep changes small and isolate regressions per project; add quick smoke steps to PR description.

## Commit & Pull Request Guidelines
- Commits: imperative mood, concise scope-first subjects (e.g., `Add crit calculation to combat log`); group related edits per project folder.
- PRs: include a short summary, affected sub-projects, and screenshots/GIFs for UI changes. Link issues when relevant and note any TODOs or follow-ups. Mention manual test steps and lint status.

## Security & Configuration Tips
- Do not introduce network calls in static games; keep assets local. If adding API usage to the React app, prefer `.env`-driven configs and avoid committing secrets.
- Large art/audio should go under the relevant project folder; update the hub if you add or rename a game so navigation stays intact.
