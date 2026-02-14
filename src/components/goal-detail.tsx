import { useEffect } from "preact/hooks";
import { signal } from "@preact/signals";
import { fetchGoal, fetchComments, type GoalDetail as GoalDetailType, type Comment } from "../api.ts";
import { navigateHome } from "../state.ts";

const goal = signal<GoalDetailType | null>(null);
const comments = signal<Comment[]>([]);
const loading = signal(true);

export function GoalDetail({ id }: { id: number }) {
  useEffect(() => {
    loading.value = true;
    goal.value = null;
    comments.value = [];
    Promise.all([fetchGoal(id), fetchComments(id)]).then(([g, c]) => {
      goal.value = g;
      comments.value = c;
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
      </div>
      <div class="detail-timestamps">
        <span>created {g.created_at}</span>
        <span>updated {g.updated_at}</span>
      </div>
      <pre class="detail-body">{g.body}</pre>
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
