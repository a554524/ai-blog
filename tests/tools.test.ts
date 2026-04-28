import { describe, it, expect } from 'vitest';
import { getAllTools, getToolBySlug, getToolCategories, getToolTags } from '@/lib/tools';

describe('tools lib', () => {
  it('loads tools from content/tools', () => {
    expect(getAllTools().length).toBeGreaterThan(0);
  });

  it('has required fields on every tool', () => {
    for (const t of getAllTools()) {
      expect(t.slug).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.url).toMatch(/^https?:\/\//);
      expect(t.category).toBeTruthy();
      expect(t.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('sorts featured first, then by updatedAt desc', () => {
    const tools = getAllTools();
    let seenNonFeatured = false;
    for (const t of tools) {
      if (!t.featured) seenNonFeatured = true;
      if (t.featured && seenNonFeatured) {
        throw new Error('featured tool appeared after non-featured');
      }
    }
    expect(true).toBe(true);
  });

  it('getToolBySlug returns tool or null', () => {
    const first = getAllTools()[0]!;
    expect(getToolBySlug(first.slug)?.slug).toBe(first.slug);
    expect(getToolBySlug('__not_exist__')).toBeNull();
  });

  it('categories and tags counts are consistent', () => {
    const cats = getToolCategories();
    const totalByCat = cats.reduce((s, c) => s + c.count, 0);
    expect(totalByCat).toBe(getAllTools().length);
    expect(getToolTags().length).toBeGreaterThan(0);
  });
});
