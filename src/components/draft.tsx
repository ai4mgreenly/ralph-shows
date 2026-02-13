import { draft, navigate } from "../state.ts";

export function Draft() {
  const goals = draft.value;

  return (
    <section>
      <h2>Draft</h2>
      {goals.length === 0 ? (
        <p class="empty">No draft goals</p>
      ) : (
        <ul class="goal-list">
          {goals.map((g) => (
            <li key={g.id} class="goal-item">
              <span class="goal-id">#{g.id}</span>
              <span class="goal-repo">{g.org}/{g.repo}</span>
              <a class="goal-title" href={`#/goals/${g.id}`} onClick={(e) => { e.preventDefault(); navigate(g.id); }}>{g.title}</a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
