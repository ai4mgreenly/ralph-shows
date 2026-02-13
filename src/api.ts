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

export async function fetchGoals(status: string): Promise<Goal[]> {
  const res = await fetch(`${BASE}/goals?status=${status}`);
  const data = await res.json();
  if (!data.ok) return [];
  return data.items ?? [];
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
