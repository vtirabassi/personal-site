export type ResourceType = 'article' | 'video' | 'link';

export interface LibraryItem {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  theme: string;
  description: string;
  title_en?: string;
  description_en?: string;
  personalNote?: string;
  addedAt: string; // ISO 8601 date, e.g. "2026-05-27"
}

export interface LibraryData {
  items: LibraryItem[];
}
