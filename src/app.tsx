import { useEffect } from "preact/hooks";
import { startPolling, stopPolling, initRouter, route, navigateHome } from "./state.ts";
import { Draft } from "./components/draft.tsx";
import { Running } from "./components/running.tsx";
import { Queued } from "./components/queued.tsx";
import { Submitted } from "./components/submitted.tsx";
import { Merged } from "./components/merged.tsx";
import { Rejected } from "./components/rejected.tsx";
import { Cancelled } from "./components/cancelled.tsx";
import { GoalDetail } from "./components/goal-detail.tsx";

export function App() {
  useEffect(() => {
    initRouter();
    startPolling();
    return () => stopPolling();
  }, []);

  const r = route.value;

  if (r.view === "goal") {
    return (
      <div class="dashboard">
        <h1 onClick={navigateHome}>ralphs</h1>
        <GoalDetail id={r.id} />
      </div>
    );
  }

  return (
    <div class="dashboard">
      <h1 onClick={navigateHome}>ralphs</h1>
      <Running />
      <Queued />
      <Draft />
      <Submitted />
      <Merged />
      <Rejected />
      <Cancelled />
    </div>
  );
}
