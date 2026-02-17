import { signal } from "@preact/signals";
import { fetchGoals, type Goal, type PaginatedGoals } from "./api.ts";

export const route = signal<{ view: "dashboard" } | { view: "goal"; id: number }>(
  { view: "dashboard" },
);

export const draft = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
export const running = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
export const queued = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
export const submitted = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
export const merged = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
export const rejected = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
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
  const [d, r, q, s, m, rj, c] = await Promise.all([
    fetchGoals("draft", draft.value.page, 10),
    fetchGoals("running", running.value.page, 10),
    fetchGoals("queued", queued.value.page, 10),
    fetchGoals("submitted", submitted.value.page, 10),
    fetchGoals("merged", merged.value.page, 10),
    fetchGoals("rejected", rejected.value.page, 10),
    fetchGoals("cancelled", cancelled.value.page, 10),
  ]);
  draft.value = d;
  running.value = r;
  queued.value = q;
  submitted.value = { ...s, items: s.items.sort((a, b) => b.id - a.id) };
  merged.value = { ...m, items: m.items.sort((a, b) => b.id - a.id) };
  rejected.value = { ...rj, items: rj.items.sort((a, b) => b.id - a.id) };
  cancelled.value = { ...c, items: c.items.sort((a, b) => b.id - a.id) };
}

export function setPage(section: "draft" | "running" | "queued" | "submitted" | "merged" | "rejected" | "cancelled", page: number) {
  const signal = section === "draft" ? draft :
                 section === "running" ? running :
                 section === "queued" ? queued :
                 section === "submitted" ? submitted :
                 section === "merged" ? merged :
                 section === "rejected" ? rejected :
                 cancelled;

  signal.value = { ...signal.value, page };

  // Immediately fetch the new page
  fetchGoals(section, page, 10).then((data) => {
    if (section === "submitted" || section === "merged" || section === "rejected" || section === "cancelled") {
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
