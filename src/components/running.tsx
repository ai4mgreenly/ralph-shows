import { running, navigate, setPage } from "../state.ts";

export function Running() {
  const { items, page, total } = running.value;
  const totalPages = Math.ceil(total / 10);
  const showPagination = total > 10;

  return (
    <section>
      <h2>Running</h2>
      {items.length === 0 ? (
        <p class="empty">No goals running</p>
      ) : (
        <>
          <ul class="goal-list">
            {items.map((g) => (
              <li key={g.id} class="goal-item">
                <span class="goal-id">#{g.id}</span>
                <span class="goal-repo">{g.org}/{g.repo}</span>
                <a class="goal-title" href={`#/goals/${g.id}`} onClick={(e) => { e.preventDefault(); navigate(g.id); }}>{g.title}</a>
                <a class="goal-log" href={`http://localhost:5003/?file=/home/ai4mgreenly/.local/state/ralph/goals/${g.id}/ralph.log`} target="_blank" rel="noreferrer" style={{ marginLeft: "0.5em", fontSize: "0.85em", color: "#4fc3f7" }}>log</a>
              </li>
            ))}
          </ul>
          {showPagination && (
            <div class="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage("running", page - 1)}
                style={{ visibility: page === 1 ? "hidden" : "visible" }}
              >
                Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage("running", page + 1)}
                style={{ visibility: page === totalPages ? "hidden" : "visible" }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
