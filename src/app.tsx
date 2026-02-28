import { useEffect } from "preact/hooks";
import { startPolling, stopPolling, initRouter, route, navigateHome, running, queued, draft, done, stuck, cancelled } from "./state.ts";
import { Draft } from "./components/draft.tsx";
import { Running } from "./components/running.tsx";
import { Stuck } from "./components/stuck.tsx";
import { Queued } from "./components/queued.tsx";
import { Done } from "./components/done.tsx";
import { Cancelled } from "./components/cancelled.tsx";
import { GoalDetail } from "./components/goal-detail.tsx";

function SummaryBar() {
  return (
    <div style="font-family: monospace; font-size: 0.9em; color: #aaa; margin-bottom: 1em;">
      ({running.value.total}) running, ({queued.value.total}) queued, ({draft.value.total}) draft, ({done.value.total}) done, ({stuck.value.total}) stuck, ({cancelled.value.total}) cancelled
    </div>
  );
}

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
      <SummaryBar />
      <Running />
      <Queued />
      <Draft />
      <Done />
      <Stuck />
      <Cancelled />
    </div>
  );
}
