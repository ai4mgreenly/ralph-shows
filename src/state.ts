import { signal } from "@preact/signals";
import { fetchGoals, fetchDependencies, fetchGoal, type Goal, type PaginatedGoals } from "./api.ts";

export const route = signal<
  { view: "dashboard" } | { view: "goal"; id: number } | { view: "attachment"; goalId: number; attachmentId: number }
>(
  { view: "dashboard" },
);

export const draft = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
export const running = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
export const queued = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
export const queuedBlocked = signal<Set<number>>(new Set<number>());
export const stuck = signal<PaginatedGoals>({ items: [], page: 1, total: 0 });
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
  const goalMatch = hash.match(/^#\/goals\/(\d+)$/);
  const attachmentMatch = hash.match(/^#\/attachments\/(\d+)\/(\d+)$/);
  if (attachmentMatch) {
    route.value = { view: "attachment", goalId: parseInt(attachmentMatch[1]), attachmentId: parseInt(attachmentMatch[2]) };
  } else if (goalMatch) {
    route.value = { view: "goal", id: parseInt(goalMatch[1]) };
  } else {
    route.value = { view: "dashboard" };
  }
}

export function initRouter() {
  syncRoute();
  addEventListener("hashchange", syncRoute);
}

export async function poll() {
  const [d, r, q, st, dn, c] = await Promise.all([
    fetchGoals("draft", draft.value.page, 10),
    fetchGoals("running", running.value.page, 10),
    fetchGoals("queued", queued.value.page, 10),
    fetchGoals("stuck", stuck.value.page, 10),
    fetchGoals("done", done.value.page, 10),
    fetchGoals("cancelled", cancelled.value.page, 10),
  ]);
  draft.value = d;
  running.value = r;
  queued.value = q;
  // Check which queued goals are blocked by unmet dependencies (fire-and-forget, non-blocking)
  Promise.all(
    q.items.map(async (g) => {
      const deps = await fetchDependencies(g.id);
      if (deps.length === 0) return { id: g.id, blocked: false };
      const depGoals = await Promise.all(deps.map((id) => fetchGoal(id)));
      const blocked = depGoals.some((dep) => dep === null || dep.status !== "done");
      return { id: g.id, blocked };
    })
  ).then((results) => {
    queuedBlocked.value = new Set(results.filter((x) => x.blocked).map((x) => x.id));
  });
  stuck.value = st;
  done.value = { ...dn, items: dn.items.sort((a, b) => b.id - a.id) };
  cancelled.value = { ...c, items: c.items.sort((a, b) => b.id - a.id) };
}

export function setPage(section: "draft" | "running" | "queued" | "stuck" | "done" | "cancelled", page: number) {
  const sig = section === "draft" ? draft :
               section === "running" ? running :
               section === "queued" ? queued :
               section === "stuck" ? stuck :
               section === "done" ? done :
               cancelled;

  sig.value = { ...sig.value, page };

  // Immediately fetch the new page
  fetchGoals(section, page, 10).then((data) => {
    if (section === "done" || section === "cancelled") {
      sig.value = { ...data, items: data.items.sort((a, b) => b.id - a.id) };
    } else {
      sig.value = data;
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
