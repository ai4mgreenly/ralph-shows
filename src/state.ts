import { signal } from "@preact/signals";
import { fetchGoals, type Goal } from "./api.ts";

export const route = signal<{ view: "dashboard" } | { view: "goal"; id: number }>(
  { view: "dashboard" },
);

export const draft = signal<Goal[]>([]);
export const running = signal<Goal[]>([]);
export const queued = signal<Goal[]>([]);
export const done = signal<Goal[]>([]);
export const cancelled = signal<Goal[]>([]);

export function navigate(goalId: number) {
  location.hash = `#/goals/${goalId}`;
}

export function navigateHome() {
  location.hash = "";
}

function syncRoute() {
  const hash = location.hash;
  const match = hash.match(/^#\/goals\/(\d+)$/);
  if (match) {
    route.value = { view: "goal", id: parseInt(match[1]) };
  } else {
    route.value = { view: "dashboard" };
  }
}

export function initRouter() {
  syncRoute();
  addEventListener("hashchange", syncRoute);
}

export async function poll() {
  const [d, r, q, dn, c] = await Promise.all([
    fetchGoals("draft"),
    fetchGoals("running"),
    fetchGoals("queued"),
    fetchGoals("done"),
    fetchGoals("cancelled"),
  ]);
  draft.value = d;
  running.value = r;
  queued.value = q;
  done.value = dn;
  cancelled.value = c;
}

let timer: number | undefined;

export function startPolling() {
  poll();
  timer = setInterval(poll, 5000);
}

export function stopPolling() {
  if (timer !== undefined) {
    clearInterval(timer);
    timer = undefined;
  }
}
