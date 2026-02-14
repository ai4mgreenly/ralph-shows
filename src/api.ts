declare const __RALPH_PLANS_URL__: string;
const BASE = __RALPH_PLANS_URL__;

export interface Goal {
  id: number;
  org: string;
  repo: string;
  title: string;
  status: string;
}

export interface GoalDetail extends Goal {
  body: string;
  review: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedGoals {
  items: Goal[];
  page: number;
  total: number;
}

export async function fetchGoals(
  status: string,
  page?: number,
  per_page?: number
): Promise<PaginatedGoals> {
  let url = `${BASE}/goals?status=${status}`;
  if (page !== undefined) {
    url += `&page=${page}`;
  }
  if (per_page !== undefined) {
    url += `&per_page=${per_page}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  if (!data.ok) {
    return { items: [], page: 1, total: 0 };
  }

  // If pagination params were provided, API returns pagination metadata
  if (page !== undefined) {
    return {
      items: data.items ?? [],
      page: data.page ?? 1,
      total: data.total ?? 0,
    };
  }

  // Legacy behavior: no pagination
  return {
    items: data.items ?? [],
    page: 1,
    total: (data.items ?? []).length,
  };
}

export interface Comment {
  id: number;
  goal_id: number;
  body: string;
  created_at: string;
}

export async function fetchGoal(id: number): Promise<GoalDetail | null> {
  const res = await fetch(`${BASE}/goals/${id}`);
  const data = await res.json();
  if (!data.ok) return null;
  return data as GoalDetail;
}

export async function fetchComments(goalId: number): Promise<Comment[]> {
  const res = await fetch(`${BASE}/goals/${goalId}/comments`);
  const data = await res.json();
  if (!data.ok) return [];
  return data.items ?? [];
}
