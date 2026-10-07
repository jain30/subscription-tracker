import type { Category } from '../types';

/**
 * Production category definition — single source of truth for form + accents.
 */
export type CategoryDefinition = {
  id: Category;
  name: string;
  /** Lucide icon component name (resolved in UI). */
  icon: string;
  /** Soft pastel accent hex for artwork washes. */
  color: string;
};

export const CATEGORIES: readonly CategoryDefinition[] = [
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'Clapperboard',
    color: '#E8D5F2',
  },
  {
    id: 'music',
    name: 'Music',
    icon: 'Music',
    color: '#F5D0E8',
  },
  {
    id: 'video_streaming',
    name: 'Video Streaming',
    icon: 'Tv',
    color: '#D9D4F7',
  },
  {
    id: 'cloud_storage',
    name: 'Cloud Storage',
    icon: 'Cloud',
    color: '#D5EAF7',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: 'Briefcase',
    color: '#D5E4F7',
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'GraduationCap',
    color: '#D7ECF5',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: 'Dumbbell',
    color: '#D9F2DE',
  },
  {
    id: 'health',
    name: 'Health',
    icon: 'HeartPulse',
    color: '#D7F0E4',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: 'Gamepad2',
    color: '#E0D7F5',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'ShoppingBag',
    color: '#F5D9D6',
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: 'Wallet',
    color: '#F5E6C8',
  },
  {
    id: 'news',
    name: 'News',
    icon: 'Newspaper',
    color: '#E4E8F0',
  },
  {
    id: 'developer_tools',
    name: 'Developer Tools',
    icon: 'Code2',
    color: '#D6E8E4',
  },
  {
    id: 'ai_tools',
    name: 'AI Tools',
    icon: 'Sparkles',
    color: '#E6D9F5',
  },
  {
    id: 'business',
    name: 'Business',
    icon: 'Building2',
    color: '#DCE4F0',
  },
  {
    id: 'food',
    name: 'Food',
    icon: 'Utensils',
    color: '#F5E0D0',
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: 'Plane',
    color: '#D5EEF5',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: 'Wrench',
    color: '#E8EEF2',
  },
  {
    id: 'security',
    name: 'Security',
    icon: 'Shield',
    color: '#D8E8F0',
  },
  {
    id: 'kids',
    name: 'Kids',
    icon: 'Baby',
    color: '#F5E8D5',
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'Shapes',
    color: '#E8EEF2',
  },
] as const;

export const CATEGORY_IDS: readonly Category[] = CATEGORIES.map(
  (item) => item.id,
);

const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORIES.map((item) => [item.id, item]),
) as Record<Category, CategoryDefinition>;

export function getCategoryDefinition(
  id: Category | string,
): CategoryDefinition {
  return CATEGORY_BY_ID[id as Category] ?? CATEGORY_BY_ID.other;
}

export function getCategoryColor(id: Category | string): string {
  return getCategoryDefinition(id).color;
}
