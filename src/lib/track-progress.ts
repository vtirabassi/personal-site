export interface TrackProgress {
  completedResources: string[];
  lastUpdated: number;
}

export function getCompletedResources(slug: string): string[] {
  try {
    const raw = localStorage.getItem(`track-progress-${slug}`);
    if (!raw) return [];
    const data = JSON.parse(raw) as TrackProgress;
    return Array.isArray(data.completedResources) ? data.completedResources : [];
  } catch {
    return [];
  }
}

export function toggleResourceComplete(slug: string, resourceId: string): void {
  const completed = getCompletedResources(slug);
  const idx = completed.indexOf(resourceId);
  const next = idx === -1 ? [...completed, resourceId] : completed.filter(id => id !== resourceId);
  const data: TrackProgress = { completedResources: next, lastUpdated: Date.now() };
  localStorage.setItem(`track-progress-${slug}`, JSON.stringify(data));
}

export function calcProgressPercent(completedCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((completedCount / totalCount) * 100);
}
