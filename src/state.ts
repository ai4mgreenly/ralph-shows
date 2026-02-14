import { signal } from "@preact/signals";
import { fetchGoals, type Goal, type PaginatedGoals } from "./api.ts";

export const route = signal<{ view: "dashboard" } | { view: "goal"; id: number }>(
  { view: "dashboard" },
);

export const draft = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
export const running = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
export const queued = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
export const done = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
export const cancelled = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });

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
    fetchGoals("draft", draft.value.page, 10),
    fetchGoals("running", running.value.page, 10),
    fetchGoals("queued", queued.value.page, 10),
    fetchGoals("done", done.value.page, 10),
    fetchGoals("cancelled", cancelled.value.page, 10),
  ]);
  draft.value = d;
  running.value = r;
  queued.value = q;
  done.value = { ...dn, items: dn.items.sort((a, b) => b.id - a.id) };
  cancelled.value = { ...c, items: c.items.sort((a, b) => b.id - a.id) };
}

export function setPage(section: "draft" | "running" | "queued" | "done" | "cancelled", page: number) {
  const signal = section === "draft" ? draft :
                 section === "running" ? running :
                 section === "queued" ? queued :
                 section === "done" ? done :
                 cancelled;

  signal.value = { ...signal.value, page };

  // Immediately fetch the new page
  fetchGoals(section, page, 10).then((data) => {
    if (section === "done" || section === "cancelled") {
      signal.value = { ...data, items: data.items.sort((a, b) => b.id - a.id) };
    } else {
      signal.value = data;
    }
  });
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
