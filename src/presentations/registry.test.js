import { describe, it, expect } from 'vitest';
import { presentations, findPresentation, filterByTag, getAllTags } from './registry';

describe('Presentation Registry', () => {
  describe('presentations', () => {
    it('should contain at least one presentation', () => {
      expect(presentations.length).toBeGreaterThan(0);
    });

    it('should have required properties on each presentation', () => {
      presentations.forEach(presentation => {
        expect(presentation).toHaveProperty('id');
        expect(presentation).toHaveProperty('title');
        expect(presentation).toHaveProperty('loader');
        expect(typeof presentation.id).toBe('string');
        expect(typeof presentation.title).toBe('string');
        expect(typeof presentation.loader).toBe('function');
      });
    });

    it('should have unique IDs', () => {
      const ids = presentations.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('findPresentation', () => {
    it('should find existing presentation by ID', () => {
      const result = findPresentation('intro-to-gen-ai');
      expect(result).toBeDefined();
      expect(result.id).toBe('intro-to-gen-ai');
    });

    it('should return undefined for non-existent ID', () => {
      const result = findPresentation('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('filterByTag', () => {
    it('should return presentations matching tag', () => {
      const result = filterByTag('ai');
      expect(result.length).toBeGreaterThan(0);
      result.forEach(p => {
        expect(p.tags).toContain('ai');
      });
    });

    it('should return empty array for non-existent tag', () => {
      const result = filterByTag('non-existent-tag');
      expect(result).toEqual([]);
    });
  });

  describe('getAllTags', () => {
    it('should return array of tags', () => {
      const tags = getAllTags();
      expect(Array.isArray(tags)).toBe(true);
    });

    it('should return sorted unique tags', () => {
      const tags = getAllTags();
      const sortedTags = [...tags].sort();
      expect(tags).toEqual(sortedTags);
    });

    it('should include known tags', () => {
      const tags = getAllTags();
      expect(tags).toContain('ai');
    });
  });
});
