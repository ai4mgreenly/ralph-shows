import { queued, queuedBlocked, navigate, setPage } from "../state.ts";

export function Queued() {
  const { items, page, total } = queued.value;
  const blocked = queuedBlocked.value;
  const totalPages = Math.ceil(total / 10);
  const showPagination = total > 10;

  const sorted = [...items].sort((a, b) => {
    const aB = blocked.has(a.id) ? 1 : 0;
    const bB = blocked.has(b.id) ? 1 : 0;
    return aB - bB;
  });

  return (
    <section>
      <h2>Queued</h2>
      {items.length === 0 ? (
        <p class="empty">No goals queued</p>
      ) : (
        <>
          <ul class="goal-list">
            {sorted.map((g) => {
              const isBlocked = blocked.has(g.id);
              return (
              <li key={g.id} class="goal-item" style={isBlocked ? { opacity: "0.45" } : undefined}>
                <span class="goal-id">#{g.id}</span>
                <span class="goal-repo">{g.org}/{g.repo}</span>
                <a class="goal-title" href={`#/goals/${g.id}`} onClick={(e) => { e.preventDefault(); navigate(g.id); }}>{g.title}</a>
                {isBlocked && <span style={{ color: "#888", fontSize: "0.8em", marginLeft: "0.5em" }}>[blocked]</span>}
              </li>
              );
            })}
          </ul>
          {showPagination && (
            <div class="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage("queued", page - 1)}
                style={{ visibility: page === 1 ? "hidden" : "visible" }}
              >
                Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage("queued", page + 1)}
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
