import { useEffect } from "preact/hooks";
import { signal } from "@preact/signals";
import { fetchGoal, fetchComments, fetchDependencies, type GoalDetail as GoalDetailType, type Comment, type Dependency } from "../api.ts";
import { navigateHome, navigate } from "../state.ts";

const goal = signal<GoalDetailType | null>(null);
const comments = signal<Comment[]>([]);
const deps = signal<Array<Dependency & { goal: GoalDetailType | null }>>([]);
const loading = signal(true);

export function GoalDetail({ id }: { id: number }) {
  useEffect(() => {
    loading.value = true;
    goal.value = null;
    comments.value = [];
    deps.value = [];
    Promise.all([fetchGoal(id), fetchComments(id), fetchDependencies(id)]).then(async ([g, c, depList]) => {
      goal.value = g;
      comments.value = c;
      const depGoals = await Promise.all(depList.map(async (d) => ({
        ...d,
        goal: await fetchGoal(d.depends_on_id),
      })));
      deps.value = depGoals;
      loading.value = false;
    });
  }, [id]);

  if (loading.value) {
    return <p class="empty">Loading...</p>;
  }

  const g = goal.value;
  if (!g) {
    return <p class="empty">Goal not found</p>;
  }

  return (
    <div class="goal-detail">
      <a href="#" class="back-link" onClick={(e) => { e.preventDefault(); navigateHome(); }}>
        back
      </a>
      <h2 class="detail-title">#{g.id} {g.title}</h2>
      <div class="detail-meta">
        <span class="goal-repo">{g.org}/{g.repo}</span>
        <span class="detail-status" data-status={g.status}>{g.status}</span>
        <span>model: {g.model ?? "default"}</span>
        <span>reasoning: {g.reasoning ?? "default"}</span>
      </div>
      <div class="detail-timestamps">
        <span>created {g.created_at}</span>
        <span>updated {g.updated_at}</span>
      </div>
      <pre class="detail-body">{g.body}</pre>
      {deps.value.length > 0 && (
        <>
          <hr class="detail-separator" />
          <div class="detail-dependencies">
            <h2>Dependencies</h2>
            <ul class="dep-list">
              {deps.value.map((d) => (
                <li key={d.depends_on_id} class="dep-item">
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate(d.depends_on_id); }}>
                    #{d.depends_on_id}{d.goal ? ` "${d.goal.title}"` : ""}
                  </a>
                  {d.goal && (
                    <span class="dep-status" data-status={d.goal.status}>{d.goal.status}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <hr class="detail-separator" />
      <div class="detail-comments">
        <h2>Comments</h2>
        {comments.value.length === 0 ? (
          <p class="empty">No comments</p>
        ) : (
          <ul class="comment-list">
            {comments.value.map((c) => (
              <li key={c.id} class="comment-item">
                <span class="comment-time">{c.created_at}</span>
                <pre class="comment-body">{c.body}</pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
