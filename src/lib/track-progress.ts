export interface TrackProgress {
  completedModules: number[];
  lastUpdated: number;
}

export function getCompletedModules(slug: string): number[] {
  try {
    const raw = localStorage.getItem(`track-progress-${slug}`);
    if (!raw) return [];
    const data = JSON.parse(raw) as TrackProgress;
    return Array.isArray(data.completedModules) ? data.completedModules : [];
  } catch {
    return [];
  }
}

export function markModuleComplete(slug: string, order: number): void {
  const completed = getCompletedModules(slug);
  if (completed.includes(order)) return;
  const data: TrackProgress = {
    completedModules: [...completed, order].sort((a, b) => a - b),
    lastUpdated: Date.now(),
  };
  localStorage.setItem(`track-progress-${slug}`, JSON.stringify(data));
}

export function calcProgressPercent(completedCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((completedCount / totalCount) * 100);
}
