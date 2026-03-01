import { draft, navigate, setPage } from "../state.ts";

export function Draft() {
  const { items, page, total } = draft.value;
  const totalPages = Math.ceil(total / 10);
  const showPagination = total > 10;

  return (
    <section>
      <h2>Draft</h2>
      {items.length === 0 ? (
        <p class="empty">No draft goals</p>
      ) : (
        <>
          <ul class="goal-list">
            {items.map((g) => (
              <li key={g.id} class="goal-item">
                <a class="goal-id" href={`#/goals/${g.id}`} onClick={(e) => { e.preventDefault(); navigate(g.id); }}>#{g.id}</a>
                <span class="goal-repo">{g.org}/{g.repo}</span>
                <span class="goal-title">{g.title}</span>
              </li>
            ))}
          </ul>
          {showPagination && (
            <div class="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage("draft", page - 1)}
                style={{ visibility: page === 1 ? "hidden" : "visible" }}
              >
                Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage("draft", page + 1)}
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
