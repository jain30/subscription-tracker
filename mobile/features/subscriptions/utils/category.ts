import { getCategoryDefinition } from '../catalog/categories';
import type { Category } from '../types';

export function categoryLabel(key: Category | string): string {
  return getCategoryDefinition(key).name;
}

/**
 * Map category → theme / catalog accent key (identity for V1).
 */
export function categoryColorKey(category: Category): Category {
  return category;
}
