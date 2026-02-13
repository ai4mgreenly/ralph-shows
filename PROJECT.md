# PROJECT.md — ralph-shows

## Purpose

ralph-shows is a lightweight dashboard for the Ralph pipeline. It displays the current state of goals managed by ralph-plans — what's running and what's queued up behind it.

## Tech stack

- **Deno** + **TypeScript**
- **Preact** with Signals for reactivity
- Static SPA served on port 4444

## Backend

ralph-plans API at `http://localhost:5001`. No auth — both services are localhost-only.

## Default view

The dashboard shows a single-page view with two sections:

1. **Running** — goals currently being executed by Ralph (`status: running`)
2. **Queued** — goals waiting to be picked up (`status: queued`)

Each goal displays: id, org/repo, title, and status.

## Future

Additional views and actions (review/approve, cancel, create goals, status history) will be added as needed.
