# PLAN.md — ralph-shows

## Project structure

```
ralph-shows/
├── deno.json          # tasks, imports, compiler options
├── index.html         # entry point, loads bundled JS
├── src/
│   ├── main.tsx       # mount Preact app
│   ├── app.tsx        # top-level App component
│   ├── api.ts         # fetch wrapper for ralph-plans
│   ├── state.ts       # signals for goals + polling
│   └── components/
│       ├── running.tsx # Running section
│       └── queued.tsx  # Queued section
├── PROJECT.md
└── PLAN.md
```

## Dependencies

In `deno.json` imports:

- `preact` — rendering
- `@preact/signals` — reactive state

## API client (`src/api.ts`)

Base URL: `http://localhost:5001`

Two calls needed for the default view:

```ts
fetchGoals(status: "running"): Promise<Goal[]>
fetchGoals(status: "queued"): Promise<Goal[]>
```

Both hit `GET /goals?status=<status>` and return `items` from the response.

### Goal type

```ts
interface Goal {
  id: number;
  org: string;
  repo: string;
  title: string;
  status: string;
}
```

## State (`src/state.ts`)

Two signals:

- `running` — `Signal<Goal[]>`
- `queued` — `Signal<Goal[]>`

A `poll()` function fetches both lists and updates the signals. Called on mount and then on an interval (every 5 seconds).

## Components

### `app.tsx`

Starts polling on mount. Renders two sections: Running, then Queued.

### `running.tsx`

Displays the running goals list. Shows a message when empty.

### `queued.tsx`

Displays the queued goals list. Shows a message when empty.

### Goal display

Each goal renders as a row/card showing: `id`, `org/repo`, `title`.

## Entry point

### `index.html`

Minimal HTML shell. Loads the bundled JS. Basic CSS inline or in a `<style>` tag — no CSS framework.

### `src/main.tsx`

Imports `App`, calls `render()` to mount into `#app`.

## Dev workflow

`deno.json` tasks:

- `dev` — bundle + serve with watch (using `deno serve` or a static file server)
- `build` — production bundle via `deno bundle` or esbuild

## Styling

Minimal inline CSS. Dark theme, monospace font. No CSS framework.
