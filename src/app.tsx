import { useEffect } from "preact/hooks";
import { startPolling, stopPolling, initRouter, route, navigateHome, running, queued, draft, done, stuck, cancelled } from "./state.ts";
import { Draft } from "./components/draft.tsx";
import { Running } from "./components/running.tsx";
import { Stuck } from "./components/stuck.tsx";
import { Queued } from "./components/queued.tsx";
import { Done } from "./components/done.tsx";
import { Cancelled } from "./components/cancelled.tsx";
import { GoalDetail } from "./components/goal-detail.tsx";
import { AttachmentView } from "./components/attachment.tsx";

function SummaryBar() {
  return (
    <div style="font-family: monospace; font-size: 0.9em; color: #aaa; margin-bottom: 1em;">
      ({running.value.total}) running, ({stuck.value.total}) stuck, ({queued.value.total}) queued, ({draft.value.total}) draft, ({done.value.total}) done, ({cancelled.value.total}) cancelled
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

  if (r.view === "attachment") {
    return (
      <div class="dashboard">
        <div class="banner" onClick={navigateHome}>
          <img src="/theRALPHS.jpeg" alt="theRALPHS" />
          <span class="banner-text">theRALPHS</span>
        </div>
        <AttachmentView goalId={r.goalId} attachmentId={r.attachmentId} />
      </div>
    );
  }

  if (r.view === "goal") {
    return (
      <div class="dashboard">
        <div class="banner" onClick={navigateHome}>
          <img src="/theRALPHS.jpeg" alt="theRALPHS" />
          <span class="banner-text">theRALPHS</span>
        </div>
        <GoalDetail id={r.id} />
      </div>
    );
  }

  return (
    <div class="dashboard">
      <div class="banner" onClick={navigateHome}>
        <img src="/theRALPHS.jpeg" alt="theRALPHS" />
        <span class="banner-text">theRALPHS</span>
      </div>
      <SummaryBar />
      <Running />
      <Queued />
      <Stuck />
      <Draft />
      <Done />
      <Cancelled />
    </div>
  );
}
